
import { LightningElement, api, track, wire } from "lwc";

// We can get our community Id for use in the callout
import communityId from "@salesforce/community/Id";

// Get our base path for navigating to non-named pages
import communityBasePath from "@salesforce/community/basePath";

// Our Apex method will allow us to retrieve the items
import getConnectNavigationItems from "@salesforce/apex/NavigationMenuController.getConnectNavigationItems";

// Lightning Navigation Service will allow us to navigate to our target
import { NavigationMixin } from "lightning/navigation";

export default class SocialNavigation extends NavigationMixin(LightningElement) {
  @api menuName = "Social_Links";
  @track menuItems = [];
  @api maxWidth = "200"; // Default to 400px
  communityId = communityId;
  communityBasePath = communityBasePath;
  error;

  @wire(getConnectNavigationItems, {
    menuName: "$menuName",
    communityId: "$communityId",
    includeImageUrl: true,
    addHomeMenuItem: true
  })
  wiredNavigationItems({ error, data }) {
    if (data) {
      this.menuItems = data.menuItems;
    } else if (error) {
      this.error = error;
    }
  }

  get contentContainer() {
    return "max-width:" + this.maxWidth + "px;";
  }

  navigateToItem(event) {
    // Get the menu item's label from the target
    let selectedLabel = event.currentTarget.dataset.label;

    // Loop through the menu items and get the row of the selected item
    let item = this.menuItems.filter(menuItem => menuItem.label === selectedLabel)[0];

    // Distribute the action to the relevant mechanism for navigation
    if (item.actionType === "ExternalLink") {
      this.navigateToExternalPage(item);
    } else if (item.actionType === "InternalLink") {
      this.navigateToInternalPage(item);
    }
  }

  // Open the external link
  navigateToExternalPage(item) {
    const url = item.actionValue;
    if (item.target === "CurrentWindow") {
      this[NavigationMixin.Navigate]({
        type: "standard__webPage",
        attributes: {
          url: url
        }
      });
    } else if (item.target === "NewWindow") {
      window.open(url, "_blank");
    }
  }

  // Open an internal link
  navigateToInternalPage(item) {
    this[NavigationMixin.Navigate]({
      type: "standard__webPage",
      attributes: {
        url: item.actionValue
      }
    });
  }
}
