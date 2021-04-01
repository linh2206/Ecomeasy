/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { connect } from "react-redux";
import { toAbsoluteUrl } from "../../../_metronic";
import HeaderDropdownToggle from "../content/CustomDropdowns/HeaderDropdownToggle";
import { Avatar, Icon } from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import _ from "lodash"

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {

    const { auth, showHi, showAvatar, showBadge } = this.props;
    const avatar = _.get(auth, 'user.avatar')
    const email = _.get(auth, 'user.email')

    return (
      <Dropdown className="kt-header__topbar-item kt-header__topbar-item--user" drop="down" alignRight>
        <Dropdown.Toggle
          as={HeaderDropdownToggle}
          id="dropdown-toggle-user-profile"
        >
          <span style={{
            color: '#FFF',
            fontSize: 14,
            marginRight: 15
          }}>
            Hi, {email}
          </span>
          <div className="kt-header__topbar-user">
            <img src={avatar} style={{
              marginRight: 5,
              width: 40,
              height: 40,
              maxHeight: 'unset',
              borderRadius: '50%'
            }} />
            <KeyboardArrowDownIcon />
          </div>
          <Dropdown.Menu className="dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround">
            <div className="kt-notification">
              <div className="kt-notification__custom">
                <Link
                  to="/profile"
                >
                  <SettingsIcon />
                Setting
              </Link>
                <Link
                  to="/logout"
                >
                  <ExitToAppIcon />
                Sign Out
              </Link>
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown.Toggle>

      </Dropdown>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth
});

export default connect(mapStateToProps)(UserProfile);
