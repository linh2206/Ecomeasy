import React, { useState } from "react";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextField, Tab, Tabs, AppBar, Box, Typography, FormControlLabel, Checkbox, Button, Grid, InputLabel, FormGroup, IconButton } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import { makeStyles } from "@material-ui/styles";
import { Visibility } from "@material-ui/icons";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import PersonIcon from '@material-ui/icons/Person';
import { isValidEmail } from '../../helpers/helper'
import { register, login } from "../../crud/auth.crud";
import { ROLES } from "../../constant/role"
import PhoneIcon from '@material-ui/icons/Phone';
import BusinessIcon from '@material-ui/icons/Business';
import _ from "lodash"

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{
          marginTop: '30px'
        }}>
          <Typography component={'div'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles({
  root: {
    padding: 0,
    '& .MuiAppBar-positionStatic': {
      transform: 'unset !important'
    },
    '& .react-swipeable-view-container': {
      willChange: 'unset !important'
    },
    '& .kt-spinner--right:before': {
      right: 15
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#014B68',
      height: '4px'
    }
  },
  tab: {
    '& .MuiButtonBase-root': {
      fontSize: '20px',
      color: '#6B6C6F',
      borderBottom: '1px solid #C4C4C4'
    },
    '& .Mui-selected': {
      color: '#014B68',
    }
  }
})

function Login(props) {
  const classes = useStyles()
  const [tab, setTab] = useState(1)


  const { intl } = props;
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [pwConfig, setPWConfig] = useState({
    loginPW: false,
    registerPW: false,
    registerCPW: false
  })

  const handleTabChange = (event, tab) => {
    setTab(tab);
    setPWConfig({
      loginPW: false,
      registerPW: false,
      registerCPW: false
    })
  };

  const handleTabChangeIndex = (index) => {
    setTab(index - 1);
  };

  const handleRegistrationSubmit = (values, { setStatus, setSubmitting }) => {
    setRegisterLoading(true)
    setTimeout(() => {
      register(
        values.email,
        values.password,
        ROLES.ADMIN
      )
        .then(res => {
          setRegisterLoading(false)
          setSubmitting(false);
          if (res.data.errMsg) {
            setStatus(res.data.errMsg)
          }
          else {
            const token = _.get(res, 'data.result.role.token')
            const user = {
              role: _.get(res, 'data.result.role.name'),
              email: _.get(res, 'data.result.email'),
              permissions: _.get(res, 'data.result.role.permissions')
            }
            props.login({ token, user });
          }
        })
        .catch(() => {
          setRegisterLoading(false)
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN"
            })
          );
        });
    }, 1000)
  }

  const handleLoginSubmit = (values, { setStatus, setSubmitting }) => {

    setLoginLoading(true)
    setTimeout(() => {
      login(
        values.email,
        values.password
      )
        .then(res => {
          setLoginLoading(false)
          setSubmitting(false);
          if (res.data.errMsg) {
            setStatus(res.data.errMsg)
          }
          else {
            const token = _.get(res, 'data.result.role.token')
            const user = {
              role: _.get(res, 'data.result.role.name'),
              email: _.get(res, 'data.result.email'),
              avatar: _.get(res, 'data.result.avatar.Location'),
              permissions: _.get(res, 'data.result.role.permissions')
            }
            props.login({ token, user });
          }

        })
        .catch(() => {
          setLoginLoading(false)
          setSubmitting(false);
          setStatus(
            intl.formatMessage({
              id: "AUTH.VALIDATION.INVALID_LOGIN"
            })
          );
        });
    }, 1000)

  }

  return (
    <div className={classes.root}>
      <Tabs
        variant="fullWidth"
        value={tab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        className={classes.tab}
      >
        <Tab label="Sign up" {...a11yProps(0)} />
        <Tab label="Sign in" {...a11yProps(1)} />
      </Tabs>
      <SwipeableViews
        index={tab}
        onChangeIndex={handleTabChangeIndex}
      >
        <TabPanel value={tab} index={0}>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirmPassword: '',
              fullName: '',
              phone: '',
              company: ''
            }}
            validate={values => {
              const errors = {};

              if (!values.confirmPassword) {
                errors.confirmPassword = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }
              else if (values.password !== values.confirmPassword) {
                errors.confirmPassword =
                  "Password and Confirm Password didn't match.";
              }

              if (!values.email) {
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }
              else if (
                !isValidEmail(values.email)
              ) {
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.INVALID_FIELD"
                });
              }

              if (!values.password) {
                errors.password = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }

              if (!values.fullName) {
                errors.fullName = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }

              return errors;
            }}
            onSubmit={handleRegistrationSubmit}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  {status && <div role="alert" className="alert alert-danger">
                    <div className="alert-text">{status}</div>
                  </div>}
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      placeholder="Your email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                      InputProps={{
                        startAdornment: <MailOutlineIcon />
                      }}
                    />
                  </FormGroup>
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      type={pwConfig.registerPW ? 'text' : 'password'}
                      placeholder="Your password"
                      name="password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      helperText={touched.password && errors.password}
                      error={Boolean(touched.password && errors.password)}
                      InputProps={{
                        startAdornment: <VpnKeyIcon />,
                        endAdornment: <IconButton
                          onClick={() => {
                            setPWConfig({
                              ...pwConfig,
                              registerPW: !pwConfig.registerPW
                            })
                          }}> {pwConfig.registerPW ? <VisibilityOff /> : <Visibility />}</IconButton>
                      }}
                    /></FormGroup>

                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      type={pwConfig.registerCPW ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.confirmPassword}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      InputProps={{
                        startAdornment: <VpnKeyIcon />,
                        endAdornment: <IconButton
                          onClick={() => {
                            setPWConfig({
                              ...pwConfig,
                              registerCPW: !pwConfig.registerCPW
                            })
                          }}> {pwConfig.registerCPW ? <VisibilityOff /> : <Visibility />}</IconButton>
                      }}
                    /></FormGroup>
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      placeholder="Your full name"
                      name="fullName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.fullName}
                      helperText={touched.fullName && errors.fullName}
                      error={Boolean(touched.fullName && errors.fullName)}
                      InputProps={{
                        startAdornment: <PersonIcon />
                      }}
                    />
                  </FormGroup>
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      placeholder="Your phone"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      helperText={touched.phone && errors.phone}
                      error={Boolean(touched.phone && errors.phone)}
                      InputProps={{
                        startAdornment: <PhoneIcon />
                      }}
                    />
                  </FormGroup>
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      placeholder="Your company"
                      name="company"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.company}
                      helperText={touched.company && errors.company}
                      error={Boolean(touched.company && errors.company)}
                      InputProps={{
                        startAdornment: <BusinessIcon />
                      }}
                    />
                  </FormGroup>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="btn-base btn-base--success btn-base--lg"
                    style={{
                      margin: '15px 0'
                    }}
                    disabled={isSubmitting}
                    className={`btn-base btn-base--success btn-base--lg ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": registerLoading
                      }
                    )}`}
                  >
                    Sign up
          </Button>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <Box textAlign="center">
                      <Link to="/auth/forgot-password" href="#" variant="body2" style={{
                        fontSize: '12px',
                        color: '#6b6c6f'
                      }}>
                        Forgot password?
              </Link>
                    </Box>
                  </Box>
                </form>
              )}
          </Formik>
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validate={values => {
              const errors = {};

              if (!values.email) {
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }
              else if (
                !isValidEmail(values.email)
              ) {
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.INVALID_FIELD"
                });
              }

              if (!values.password) {
                errors.password = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD"
                });
              }

              return errors;
            }}
            onSubmit={handleLoginSubmit}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
                <form onSubmit={handleSubmit} className={classes.form} noValidate>
                  {status && <div role="alert" className="alert alert-danger">
                    <div className="alert-text">{status}</div>
                  </div>}
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      name="email"
                      placeholder="Your email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      helperText={touched.email && errors.email}
                      error={Boolean(touched.email && errors.email)}
                      InputProps={{
                        startAdornment: <MailOutlineIcon />
                      }}
                    />
                  </FormGroup>
                  <FormGroup className="input-base input-base--hasIcon">
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      type={pwConfig.loginPW ? 'text' : 'password'}
                      name="password"
                      placeholder="Your password"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.password}
                      helperText={touched.password && errors.password}
                      error={Boolean(touched.password && errors.password)}
                      InputProps={{
                        startAdornment: <VpnKeyIcon />,
                        endAdornment: <IconButton
                          onClick={() => {
                            setPWConfig({
                              ...pwConfig,
                              loginPW: !pwConfig.loginPW
                            })
                          }}> {pwConfig.loginPW ? <VisibilityOff /> : <Visibility />}</IconButton>
                      }}
                    /></FormGroup>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{
                      margin: '15px 0'
                    }}
                    disabled={isSubmitting}
                    className={`btn-base btn-base--success btn-base--lg ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loginLoading
                      }
                    )}`}
                  >
                    Sign in
          </Button>
                  <Box display="flex" justifyContent="center" alignItems="center" style={{}}>
                    <Box textAlign="center">
                      <Link to="/auth/forgot-password" href="#" variant="body2" style={{
                        fontSize: '12px',
                        color: '#6b6c6f'
                      }}>
                        Forgot password?
              </Link>
                    </Box>
                  </Box>
                </form>
              )}
          </Formik>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}

export default injectIntl(
  connect(
    null,
    auth.actions,
  )(Login)
);
