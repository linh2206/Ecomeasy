import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { TextField, Button, FormGroup, Icon } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { useHistory } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import { isValidEmail } from '../../helpers/helper'
import { requestPassword } from '../../crud/auth.crud'
import clsx from "clsx";

ForgotPassword.propTypes = {

};

const useStyles = makeStyles({
  root: {
    color: '#6B6C6F',
    '& .MuiIcon-fontSizeLarge': {
      fontSize: '72px'
    },
    '& .kt-spinner--right:before': {
      right: 15
    },
  },
  route: {
    fontSize: 12,
    color: '#6B6C6F',
    textAlign: 'center',
    display: 'block'
  },
  formBanner: {
    textAlign: 'center',
  },
  formLegend: {
    color: '#014B68',
    fontSize: 20,
    marginBottom: 15
  }
})

function ForgotPassword(props) {

  const classes = useStyles()
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  let history = useHistory()


  const handleSubmit = (values, { setStatus, setSubmitting }) => {
    setSubmitting(true)
    setTimeout(() => {
      setLoading(true)
      requestPassword(values.email)
        .then(res => {
          setLoading(false)
          setSubmitting(false)
          if (res.data.errMsg) {
            setStatus(res.data.errMsg)
          }
          else {
            history.replace('/login')
          }
        })
        .catch(res => {
          setLoading(false)
          setSubmitting(false)
        })
    }, 500)
  }


  return (
    <div className={classes.root}>
      <div className={classes.formBanner}>
        <div className={classes.formLegend}>
          <Icon fontSize="large">lock</Icon>
          <p>Reset your password</p>
        </div>
        <div className={classes.formTitle}>
          <p>Enter your email address and we will send you
further instructions on how to reset the password</p>
        </div>
      </div>
      <Formik
        initialValues={{
          email: ''
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

          return errors;
        }}
        onSubmit={handleSubmit}
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
              <FormGroup className="input-base input-base--hasIcon" >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  placeholder="Your email"
                  name="email"
                  autoFocus
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
                    "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                  }
                )}`}
              >
                Submit
          </Button>
              <Link className={classes.route} to="auth/login">Return to Signin</Link>
            </form>
          )}
      </Formik>
    </div>
  );
}
export default injectIntl(ForgotPassword)