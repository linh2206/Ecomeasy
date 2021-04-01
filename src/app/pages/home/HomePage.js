import React, { Suspense, lazy, useState, useEffect } from 'react'
import { connect, useDispatch } from "react-redux";
import { Redirect, Route, Switch, useHistory, useLocation } from 'react-router-dom'
import { LayoutSplashScreen } from '../../../_metronic'
import { CircularProgress, Dialog, DialogContent, DialogActions, Button, Icon } from '@material-ui/core'
import { actionTypes } from "../../store/ducks/auth.duck"
import { HOME_ROUTER_CONFIG } from "../../router/RouterConfig"
import { isAuthenticated } from "../../helpers/helper"
import { getUser } from "../../crud/auth.crud"
import _ from "lodash"

function HomePage(props) {
  const [open, setOpen] = useState(false);
  let history = useHistory()
  let dispatch = useDispatch()
  const userPermissions = _.get(props, 'auth.user.permissions')
  const [isLoadedUserProfile, setIsLoadedUserProfile] = useState(false)

  //Redirect to login in case of token is expired
  document.addEventListener("tokenExpired", function (e) {
    setOpen(true)
  });

  const handleDialogClickOk = () => {
    dispatch({
      type: actionTypes.Logout,
    })
  }

  useEffect(() => {
    getUser()
      .then(res => {
        const user = {
          role: _.get(res, 'data.result.role.name'),
          email: _.get(res, 'data.result.email'),
          avatar: _.get(res, 'data.result.avatar.Location'),
          permissions: _.get(res, 'data.result.role.permissions')
        }
        dispatch({
          type: actionTypes.UpdateUser,
          payload: user
        })
        setIsLoadedUserProfile(true)
      })
      .catch(err => {

      })
  }, [])


  const path = useLocation().pathname

  if (props.auth.isFirstLoad || path === '/') {
    if (props.auth.defaultPage) {
      dispatch({
        type: actionTypes.SetFirstLoad,
        payload: false
      })
      history.push(props.auth.defaultPage)
    }
  }

  return (
    <div>
      {
        isLoadedUserProfile &&

        <Suspense fallback={<LayoutSplashScreen />}>
          <Switch>
            {HOME_ROUTER_CONFIG.map((route, index) => (

              <Route key={index} path={route.url} render={p => {
                return (
                  isAuthenticated(userPermissions, route.permissons) ?
                    <route.component />
                    : <Redirect to="/profile" />
                )
              }} />
            ))}
            <Redirect to="/dashboard/revenue" />
          </Switch>
        </Suspense>
      }
      <Dialog
        open={open}
        keepMounted
        maxWidth="sm"
      >
        <DialogContent>
          <div className="popup-message">
            <Icon>warning</Icon>
            <p>Sorry. Your session is timeout<br />
              Please login again</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleDialogClickOk}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

const mapStateToProps = store => ({
  auth: store.auth
});

export default connect(mapStateToProps)(HomePage);