import React, { Component } from "react";
import * as auth from "../../store/ducks/auth.duck";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { LayoutSplashScreen } from "../../../_metronic";
import { actionTypes as authAction } from "../../store/ducks/auth.duck"
import { actionTypes as brandAction } from "../../store/ducks/brand.duck"

class Logout extends Component {
  componentDidMount() {
    this.props.dispatch({
      type: authAction.Logout
    })
    this.props.dispatch({
      type: brandAction.Reset
    })
  }

  render() {
    return <Redirect to="/auth" />
  }
}

const mapStateToProps = store => ({
  brand: store.brand,
  auth: store.auth
});

export default connect(mapStateToProps)(Logout);
