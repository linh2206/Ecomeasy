import React from "react";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import { connect } from "react-redux";
import _ from "lodash"
import { PERMISSIONS } from "../../../app/constant/role"
import { isAuthenticated } from "../../../app/helpers/helper"

class MenuList extends React.Component {

  constructor(props) {
    super(props)
  }


  render() {
    const { currentUrl, menuConfig, layoutConfig } = this.props;

    return menuConfig.aside.items.map((child, index) => {
      const userRole = _.get(this.props, 'auth.user.permissions')
      if (isAuthenticated(userRole, _.get(child, 'permissions'))) {
        return (
          <React.Fragment key={`menuList${index}`}>
            {child.section && <MenuSection item={child} />}
            {child.separator && <MenuItemSeparator item={child} />}
            {child.title && (
              <MenuItem
                item={child}
                currentUrl={currentUrl}
                layoutConfig={layoutConfig}
              />
            )}
          </React.Fragment>
        );
      }
    });
  }
}

const mapStateToProps = store => ({
  auth: store.auth
});

export default connect(mapStateToProps)(MenuList) 
