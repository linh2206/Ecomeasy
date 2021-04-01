/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { ReactComponent as Layout4BlocksIcon } from "../assets/layout-svg-icons/Layout-4-blocks.svg";
import KTOffcanvas from "../../_assets/js/offcanvas";

export default class QuickPanelToggler extends React.Component {
  componentDidMount() {
    // eslint-disable-next-line
    const panel = document.getElementById("kt_quick_panel");

    // eslint-disable-next-line
    const offCanvas = new KTOffcanvas(panel, {
      overlay: true,
      baseClass: "kt-quick-panel",
      closeBy: "kt_quick_panel_close_btn",
      toggleBy: "kt_quick_panel_toggler_btn"
    });
  }

  render() {
    return (
      <>
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="quick-panel-tooltip">Quick panel</Tooltip>}
        >
          <div
            className="kt-header__topbar-item kt-header__topbar-item--quick-panel"
            data-toggle="kt-tooltip"
            title="Quick panel"
            data-placement="right"
          >
            <span
              className="kt-header__topbar-icon"
              id="kt_quick_panel_toggler_btn"
            >
              <Layout4BlocksIcon />
            </span>
          </div>
        </OverlayTrigger>
      </>
    );
  }
}
