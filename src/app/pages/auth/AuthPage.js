import React from "react";
import { Link, Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Registration from "./Registration";
import ForgotPassword from "./ForgotPassword";
import SetPassword from "./SetPassword";
import { makeStyles } from "@material-ui/styles";
import { Grid, Paper, Box, Avatar } from "@material-ui/core";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils"

const useStyles = makeStyles({
  root: {
    backgroundColor: '#FFF',
  },
  paper: {
    backgroundColor: '#FFF'
  },
  rightSideBanner: {
    minHeight: '100vh',
    backgroundImage: `url(${toAbsoluteUrl('/media/banners/auth-banner.png')})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    position: 'relative',
    '&:after': {
      content: '""',
      background: '#1B2733',
      opacity: 0.53,
      position: 'absolute',
      width: '100%',
      height: '100%',
      zIndex: 999,
      left: 0,
      top: 0,
      display: 'block'
    }
  },
  bannerTitle: {
    color: '#FFF',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    fontWeight: 800,
    zIndex: 1000
  },
  formContainer: {
    height: '100vh',
    overflowY: 'auto',
    position: 'relative',
  },
  formHeader: {
    zIndex: 999,
    width: '100%',
    backgroundColor: '#FFF'
  },
  formContent: {
    maxWidth: '100%',
    padding: '0 15px',
    width: '380px',
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    minHeight: 'calc(100% - 127px)'
  },
  formFooter: {
    backgroundColor: '#FFF',
    fontSize: '16px',
    color: '#6B6C6F',
    '& p': {
      margin: 0
    }
  },
  '@media screen and (max-width: 959px)': {
    rightSideBanner: {
      display: 'none'
    }
  }
})

export default function AuthPage() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <div className={classes.formContainer}>
            <div className={classes.formHeader}>
              <Box style={{
                padding: '15px 30px'
              }} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <img src={toAbsoluteUrl('/media/logos/ece-logo.svg')} />
                </Box>
                {/* <Box>
                  <Link href="#">Home</Link>
                </Box> */}
              </Box>
            </div>
            <div className={classes.formContent}>
              <Switch>
                <Route path="/auth/login" component={Login} />
                <Route path="/auth/registration" component={Registration} />
                <Route
                  path="/auth/forgot-password"
                  component={ForgotPassword}
                />
                <Route
                  path="/auth/set-password"
                  component={SetPassword}
                />
                <Redirect from="/auth" exact={true} to="/auth/login" />
                <Redirect to="/auth/login" />
              </Switch>
            </div>
            <div className={classes.formFooter}>
              <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Link to="/privacy-policies">Privacy policy</Link>
                </Box>
                <Box>
                  <Link to="/terms-conditions">Terms and conditions</Link>
                </Box>
              </Box>
            </div>
          </div>

        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.rightSideBanner}>
            <div className={classes.bannerTitle}>
              <p style={{
                fontSize: '20px'
              }}>WELCOME TO</p>
              <p style={{
                fontSize: '40px'
              }}>ECOMEASY</p>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
