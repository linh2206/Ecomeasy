import React from "react";
import { connect } from "react-redux";
import * as builder from "../../ducks/builder";
import Brand from "../brand/Brand";
import PerfectScrollbar from "react-perfect-scrollbar";
import Menu from "./Menu";
import KTOffcanvas from "../../_assets/js/offcanvas";
import { Select, FormControl, MenuItem, Button } from "@material-ui/core";
import { getBrandList } from "../../../app/crud/brand.crud"
import { actionTypes } from "../../../app/store/ducks/brand.duck"
import { actionTypes as authAction } from "../../../app/store/ducks/auth.duck"
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import _ from "lodash"
import { PERMISSIONS } from "../../../app/constant/role"
import { isAuthenticated } from "../../../app/helpers/helper"

const CREATE_BRAND_PERMISSONS = [PERMISSIONS.CREATE_BRAND]
const VIEW_BRAND_PERMISSONS = [PERMISSIONS.READ_ALL_BRAND, PERMISSIONS.READ_ADMIN_BRAND, PERMISSIONS.READ_OWNER_BRAND]

class AsideLeft extends React.Component {
  asideOffCanvasRef = React.createRef();

  constructor(props) {
    super(props)
  }
  componentDidMount() {
    // eslint-disable-next-line
    const ktoffConvas = new KTOffcanvas(
      this.asideOffCanvasRef.current,
      this.props.menuCanvasOptions
    );
  }

  render() {
    const brandList = _.get(this, 'props.brand.brandList')
    const userPermissions = _.get(this, 'props.auth.user.permissions')
    return (
      <>

        <button className="kt-aside-close" id="kt_aside_close_btn">
          <i className="la la-close" />
        </button>
        <div
          id="kt_aside"
          ref={this.asideOffCanvasRef}
          className={`kt-aside ${this.props.asideClassesFromConfig} kt-grid__item kt-grid kt-grid--desktop kt-grid--hor-desktop`}
        >
          <Brand />
          <div
            id="kt_aside_menu_wrapper"
            className="kt-aside-menu-wrapper kt-grid__item kt-grid__item--fluid"
          >
            {this.props.disableScroll && (
              <Menu htmlClassService={this.props.htmlClassService} />
            )}
            {!this.props.disableScroll && (
              <PerfectScrollbar
                options={{ wheelSpeed: 2, wheelPropagation: false }}
              >
                <Menu htmlClassService={this.props.htmlClassService} />
              </PerfectScrollbar>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = store => ({
  disableAsideSelfDisplay:
    builder.selectors.getConfig(store, "aside.self.display") === false,
  disableScroll:
    builder.selectors.getConfig(store, "aside.menu.dropdown") === "true" ||
    false,
  asideClassesFromConfig: builder.selectors.getClasses(store, {
    path: "aside",
    toString: true
  }),
  menuCanvasOptions: {
    baseClass: "kt-aside",
    overlay: true,
    closeBy: "kt_aside_close_btn",
    toggleBy: {
      target: "kt_aside_mobile_toggler",
      state: "kt-header-mobile__toolbar-toggler--active"
    }
  },
  brand: store.brand,
  auth: store.auth
});

export default withRouter(connect(mapStateToProps)(AsideLeft));
