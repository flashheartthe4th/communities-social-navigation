public with sharing class NavigationMenuController {
  /**
   * getNavigationMenuItems - queries for the navigation menu items by the name the menu
   * @param menuName - the name of the requested menu
   * @return A list of navigation menu items
   */
  @AuraEnabled(Cacheable=true)
  public static List<NavigationMenuItem> getNavigationMenuItems(String menuName) {
    List<NavigationMenuItem> navigationMenuItems = [
      SELECT
        AccessRestriction,
        Id,
        Label,
        NavigationLinkSetId,
        ParentId,
        Position,
        Status,
        Target,
        TargetPrefs,
        Type,
        NavigationLinkSet.DeveloperName
      FROM NavigationMenuItem
      WHERE NavigationLinkSet.DeveloperName = :menuName AND Status = 'Live'
      WITH SECURITY_ENFORCED
      ORDER BY Position
    ];

    return navigationMenuItems;
  }

  @AuraEnabled(Cacheable=true)
  public static ConnectApi.NavigationMenuItemCollection getConnectNavigationItems(String menuName, String communityId,boolean includeImageUrl,boolean addHomeMenuItem) {
    ConnectApi.NavigationMenuItemCollection navigationItems = new ConnectApi.NavigationMenuItemCollection();

    try {
        navigationItems = ConnectApi.NavigationMenu.getCommunityNavigationMenu(
            communityId,
            null, //you can specify the nav link set Id OR the menuName
            menuName, //menuName is more portable between environments (e.g. Scratch & Sandbox)
            ConnectApi.publishStatus.Draft, //permitted values are Live or Draft
            includeImageUrl,
            addHomeMenuItem,
            new List<ConnectApi.NavigationMenuItemType>()
        );
    } catch (System.Exception e) {
        System.debug('ERROR: ' + e);
      throw e;
    }

    return navigationItems;
  }
}