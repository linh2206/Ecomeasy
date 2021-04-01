import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { viewInvitation, acceptInvitation, register } from '../../crud/auth.crud'
import { useLocation, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/styles';
import { Button, Avatar, Dialog, DialogContent, Icon, FormGroup, TextField, IconButton, Link, CircularProgress } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { toAbsoluteUrl } from '../../../_metronic/utils/utils'
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { Formik } from "formik";
import { connect, useDispatch } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash"
import clsx from "clsx";
import { ROLES } from "../../constant/role"

ConfirmInvitation.propTypes = {

};

const useStyles = makeStyles({
    root: {
        padding: 50,
        textAlign: 'center',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    invitationTitle: {
        fontSize: 32,
    },
    invitationAction: {
        marginTop: 30
    },
    resetPasswordForm: {
        padding: '30px',
        width: 600,
        textAlign: 'center',
        '& .kt-spinner--right:before': {
            right: 15
        }
    },
    resetPasswordFormContainer: {
        width: 350,
        margin: '0 auto'
    },
    formLegend: {
        color: '#014B68',
        fontSize: 20,
        marginBottom: 15,
        '& .material-icons': {
            fontSize: 68
        },
    },
})

function ConfirmInvitation(props) {
    const classes = useStyles()
    const { intl } = props;
    const search = useLocation().search
    const queryString = search.split('token=')
    const token = queryString[1] || ''
    const [brand, setBrand] = useState('')
    const [brandId, setBrandId] = useState('')
    const [email, setEmail] = useState('')
    const [recipient, setRecipient] = useState('')
    const [err, setErr] = useState('')
    const [registerDialog, setRegisterDialog] = useState(false)
    const [registerLoading, setRegisterLoading] = useState(false);
    const [loading, setLoading] = useState(token ? true : false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [role, setRole] = useState();
    const [pwConfig, setPWConfig] = useState({
        password: false,
        cPassowrd: false,
    })
    const history = useHistory()
    const dispatch = useDispatch()


    useEffect(() => {
        if (token) {
            viewInvitation(token)
                .then(res => {
                    const errMsg = _.get(res, 'data.result.errMsg')
                    setLoading(false)
                    if (errMsg) {
                        setErr('This invitation is no longer existed')
                    }
                    else {
                        setBrandId(_.get(res, 'data.result.brand._id'))
                        setBrand(_.get(res, 'data.result.brand.name'))
                        setEmail(_.get(res, 'data.result.brand.admins')[0].email)
                        setRecipient(_.get(res, 'data.result.email'))
                        setRole(_.get(res, 'data.result.role'))
                        setIsMember(_.isObject(_.get(res, 'data.result.user')))
                    }
                })
                .catch(err => {
                    setLoading(false)
                    setErr('err')
                })
        }
        else {
            setErr('Your token is wrong. Please check again')
        }

    }, [])

    const handleSubmit = (action) => {
        setSubmitLoading(true)
        setTimeout(() => {
            acceptInvitation(brandId, token, action)
                .then(res => {
                    setSubmitLoading(false)
                    history.push('/')
                })
                .catch(err => {
                    setSubmitLoading(false)
                })
        }, 500)

    }

    const handleRegistrationSubmit = (values, { setStatus, setSubmitting }) => {
        setRegisterLoading(true)
        setTimeout(() => {
            register(
                recipient,
                values.password,
                role
            )
                .then(res => {
                    setRegisterLoading(false)
                    setSubmitting(false);
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        handleSubmit('accept')
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


    return (
        <div className={classes.root}>
            <div className={classes.invitationContainer}>
                <img style={{
                    marginBottom: 15,
                    width: 100
                }} src={toAbsoluteUrl('/media/logos/ece-logo.svg')} />
                {
                    loading ? <CircularProgress style={{
                        display: 'block',
                        margin: '0 auto'
                    }} /> :

                        err ? <div className={classes.errorSection}>
                            <p className={classes.invitationTitle}>{err}</p>
                            <div className={classes.invitationAction}>
                                <Button className="btn-base btn-base--cancel"
                                    onClick={() => {
                                        window.open("about:blank", "_self");
                                        window.close();
                                    }}>Cancel</Button>
                            </div>
                        </div>
                            :
                            <div className={classes.invitation}>
                                <p className={classes.invitationTitle}>You have a invitation to manage brand <span style={{
                                    fontWeight: 700,
                                    textDecoration: 'underline'
                                }}>{brand}</span></p>
                                {!submitLoading ? <div className={classes.invitationAction}>
                                    <Button style={{
                                        marginRight: 5
                                    }}
                                        onClick={e => handleSubmit('reject')} className="btn-base btn-base--danger">Decline</Button>
                                    <Button style={{
                                        marginLeft: 5
                                    }}
                                        onClick={e => isMember ? handleSubmit('accept') : setRegisterDialog(true)} className="btn-base btn-base--success">Accept</Button>
                                </div>
                                    : <CircularProgress style={{
                                        display: 'block',
                                        margin: '0 auto'
                                    }} />
                                }
                            </div>

                }
            </div>
            <Dialog
                open={registerDialog}
                keepMounted
                maxWidth="md"
                onClose={e => setRegisterDialog(false)}
            >
                <DialogContent>
                    <div className={classes.resetPasswordForm}>
                        <div className={classes.formLegend}>
                            <Icon fontSize="large">lock</Icon>
                            <p>Create your password</p>
                        </div>
                        <Formik
                            initialValues={{
                                password: "",
                                confirmPassword: ""
                            }}
                            validate={values => {
                                const errors = {};

                                if (!values.password) {
                                    errors.password = intl.formatMessage({
                                        id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                    });
                                }

                                if (!values.confirmPassword) {
                                    errors.confirmPassword = intl.formatMessage({
                                        id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                    });
                                } else if (values.password !== values.confirmPassword) {
                                    errors.confirmPassword =
                                        "Password and Confirm Password didn't match.";
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

                                    <form onSubmit={handleSubmit} className={classes.resetPasswordFormContainer}>
                                        {status && <div role="alert" className="alert alert-danger">
                                            <div className="alert-text">{status}</div>
                                        </div>}
                                        <FormGroup className="input-base input-base--hasIcon">
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                type="email"
                                                name="password"
                                                placeholder="Email"
                                                value={recipient}
                                                InputProps={{
                                                    startAdornment: <MailOutlineIcon />,
                                                    readOnly: true
                                                }}
                                            /></FormGroup>
                                        <FormGroup className="input-base input-base--hasIcon">
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                fullWidth
                                                type={pwConfig.password ? 'text' : 'password'}
                                                name="password"
                                                placeholder="New Password"
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
                                                fullWidth
                                                type={pwConfig.cPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                placeholder="Confirm New Password"
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
                                                                cPassword: !pwConfig.cPassword
                                                            })
                                                        }}> {pwConfig.cPassword ? <VisibilityOff /> : <Visibility />}</IconButton>
                                                }}
                                            /></FormGroup>
                                        <Button
                                            type="submit"
                                            style={{
                                                width: '100%',
                                                marginTop: 15
                                            }} className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                {
                                                    "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": registerLoading
                                                }
                                            )}`}>Create Password</Button>
                                        <Link
                                            onClick={e => setRegisterDialog(false)}
                                            style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}>Cancel</Link>
                                    </form>
                                )}
                        </Formik>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default injectIntl(
    connect()(ConfirmInvitation)
);
