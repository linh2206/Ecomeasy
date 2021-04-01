import React from "react";
import MenuSection from "./MenuSection";
import MenuItemSeparator from "./MenuItemSeparator";
import MenuItem from "./MenuItem";
import { connect } from "react-redux";
import _ from "lodash"
import { ROLES, ROLE_DETAIL } from "../../../app/constant/role"
import { isAuthenticated } from "../../../app/helpers/helper"

class MenuSubmenu extends React.Component {
  render() {
    const { item, currentUrl, layoutConfig } = this.props;
    return (
      <ul className="kt-menu__subnav">
        {item.submenu.map((child, index) => {
          const isShow = isAuthenticated(_.get(this.props, 'auth.user.permissions'), _.get(child, 'permissions'))
          return (
            isShow &&
            <React.Fragment key={index}>
              {child.section && (
                <MenuSection
                  item={child}
                  parentItem={item}
                  currentUrl={currentUrl}
                />
              )}

              {child.separator && (
                <MenuItemSeparator
                  item={child}
                  parentItem={item}
                  currentUrl={currentUrl}
                />
              )}

              {child.title && (
                <MenuItem
                  item={child}
                  parentItem={item}
                  currentUrl={currentUrl}
                  layoutConfig={layoutConfig}
                />
              )}
            </React.Fragment>
          )
        })}
      </ul>
    );
  }
}

const mapStateToProps = store => ({
  auth: store.auth
});

export default connect(mapStateToProps)(MenuSubmenu) 
