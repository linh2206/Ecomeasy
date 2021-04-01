import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Visibility } from "@material-ui/icons";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { makeStyles } from '@material-ui/styles';
import { IconButton, TextField, Button, FormGroup, Icon } from '@material-ui/core';
import { FormattedMessage, injectIntl } from "react-intl";
import { Link, useLocation } from "react-router-dom";
import { Formik } from "formik";
import clsx from "clsx";
import { setPassword } from "../../crud/auth.crud"
import { useHistory } from "react-router-dom";


SetPassword.propTypes = {

};

const useStyles = makeStyles({
    root: {
        width: '100%',
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
        display: 'block',
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

function SetPassword(props) {
    const classes = useStyles()
    const { intl } = props;
    const [loading, setLoading] = useState(false);
    const search = useLocation().search
    const queryString = search.split('token=')
    const token = queryString[1] || ''
    let history = useHistory()

    const [pwConfig, setPWConfig] = useState({
        password: false,
        confirmPassword: false,
    })

    const handleSubmit = (values, { setStatus, setSubmitting }) => {

        if (token) {
            setLoading(true)
            setSubmitting(true)
            setTimeout(() => {
                setPassword(values.password, token)
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
                    .catch(err => {
                        setLoading(false)
                        setSubmitting(false)
                    })
            }, 500)
        }
        else {
            setStatus('Token is required')
        }

    }

    return (
        <div className={classes.root}>
            <div className={classes.formBanner}>
                <div className={classes.formLegend}>
                    <Icon fontSize="large">lock</Icon>
                    <p>Reset your password</p>
                </div>
            </div>
            <Formik
                initialValues={{
                    password: '',
                    confirmPassword: ''
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

                    if (!values.password) {
                        errors.password = intl.formatMessage({
                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
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
                            <FormGroup className="input-base input-base--hasIcon">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type={pwConfig.password ? 'text' : 'password'}
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
                                                    password: !pwConfig.password
                                                })
                                            }}> {pwConfig.password ? <VisibilityOff /> : <Visibility />}</IconButton>
                                    }}
                                /></FormGroup>

                            <FormGroup className="input-base input-base--hasIcon">
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type={pwConfig.confirmPassword ? 'text' : 'password'}
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
                                                    confirmPassword: !pwConfig.confirmPassword
                                                })
                                            }}> {pwConfig.confirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                                    }}
                                /></FormGroup>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                    {
                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                                    }
                                )}`}
                                style={{
                                    margin: '15px 0'
                                }}
                            >
                                Submit
                            </Button>
                            <Link className={classes.route} to="auth/login">Cancel</Link>
                        </form>
                    )}
            </Formik>
        </div>
    );
}

export default injectIntl(SetPassword);