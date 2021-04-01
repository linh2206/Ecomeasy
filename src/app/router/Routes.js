/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/pages/auth/AuthPage`, `src/pages/home/HomePage`).
 */

import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch, withRouter, useLocation } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { useLastLocation } from "react-router-last-location";
import HomePage from "../pages/home/HomePage";
import ErrorsPage from "../pages/errors/ErrorsPage";
import LogoutPage from "../pages/auth/Logout";
import { LayoutContextProvider } from "../../_metronic";
import { LayoutSplashScreen } from '../../_metronic'
import Layout from "../../_metronic/layout/Layout";
import * as routerHelpers from "../router/RouterHelpers";
import AuthPage from "../pages/auth/AuthPage";
import CreateBrand from '../pages/home/CreateBrand';
import ConfirmInvitation from "../pages/common/ConfirmInvitation";
import CrawlData from '../pages/crawl/CrawlData'
import Privacy from "../pages/common/Privacy"
import TermsAndConditions from "../pages/common/TermsAndConditions"
import { CircularProgress, Backdrop } from '@material-ui/core';
import BackdropLoading from '../partials/layout/BackdropLoading'


export const Routes = withRouter(({ history }) => {
  const lastLocation = useLastLocation();
  routerHelpers.saveLastLocation(lastLocation);
  const { isAuthorized, isShowBackdropLoading, menuConfig, userLastLocation, defaultPage } = useSelector(
    ({ auth, common, urls, builder: { menuConfig } }) => ({
      menuConfig,
      isAuthorized: auth.authToken,
      defaultPage: auth.defaultPage,
      userLastLocation: routerHelpers.getLastLocation(),
      isShowBackdropLoading: common.isShowBackdropLoading
    }),
    shallowEqual
  );

  const Privacy = lazy(() =>
    import('../pages/common/Privacy')
  )

  return (
    /* Create `LayoutContext` from current `history` and `menuConfig`. */
    <LayoutContextProvider history={history} menuConfig={menuConfig}>
      <Suspense fallback={<LayoutSplashScreen />}>
        <Switch>
          <Route path="/invite-manage-brand" component={ConfirmInvitation} />
          <Route path="/crawl-data" component={CrawlData} />
          <Route path="/privacy-policies" component={Privacy} />
          <Route path="/terms-conditions" component={TermsAndConditions} />
          {!isAuthorized ? (
            /* Render auth page when user at `/auth` and not authorized. */
            <AuthPage />
          ) : (
              /* Otherwise redirect to root page (`/`) */
              <Redirect from="/auth" to="/" />
            )}
          <Route path="/error" component={ErrorsPage} />
          <Route path="/logout" component={LogoutPage} />
          <Route path="/create-brand" component={CreateBrand} />
          {!isAuthorized ? (
            /* Redirect to `/auth` when user is not authorized */
            <Redirect to="/auth/login" />
          ) : (
              defaultPage === '/create-brand' ? <Redirect to="/create-brand" /> :
                <Layout>
                  <HomePage userLastLocation={userLastLocation} />
                </Layout>
            )}
        </Switch>
      </Suspense>
      {isShowBackdropLoading && <BackdropLoading></BackdropLoading>}
    </LayoutContextProvider>
  );
});
