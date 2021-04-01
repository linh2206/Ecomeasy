import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Prompt } from "react-router-dom";
import {
    FormGroup, TextField, InputLabel, Link, Avatar,
    Button, Icon, Dialog, DialogContent, IconButton,
    CircularProgress
} from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import { changePassword } from "../../crud/auth.crud"
import _ from "lodash"
import clsx from "clsx"
import CropImageForm from "./components/CropImageForm"
import { editUser, getRoleList } from "../../crud/auth.crud"
import { useDispatch } from "react-redux";
import { actionTypes as authAction } from "../../store/ducks/auth.duck"
import { ROLE_DETAIL } from "../../constant/role"

Profile.propTypes = {

};

const useStyles = makeStyles({
    root: {
        backgroundColor: '#fbfbfb',
        padding: '80px 50px',
        '& .input-base': {
            marginBottom: 20,
            '& .MuiFormLabel-root': {
                color: '#014B68'
            }
        },
    },
    userInfo: {
        marginRight: 30,
        textAlign: 'center',
        minWidth: 250
    },
    commomInfor: {
        width: 420,
        padding: '0 15px',
    },
    userLogo: {
        display: 'inline-block',
        position: 'relative',
    },
    userLogoImg: {
        width: '162px',
        height: '162px',
        background: '#bdbdbd'
    },
    avatar: {
        padding: '0 15px',
    },
    avatarContainer: {
        width: 300,
        textAlign: 'center'
    },
    formAction: {
        display: 'flex',
        justifyContent: 'space-between',
        '& button': {
            width: 'calc(50% - 7px)'
        }
    },
    previewAvatar: {
        width: 125,
        height: 125,
        borderRadius: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 30px auto',
        '& .material-icons': {
            color: 'white',
            fontSize: 80
        }
    },
    uploadBtn: {
        width: 160,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        color: '#014B68',
        border: '1px solid #014B68',
        padding: 8,
        borderRadius: '30px',
        '& .material-icons': {
            marginRight: 5
        }
    },
    resetPasswordForm: {
        padding: '30px',
        width: 600,
        textAlign: 'center',
        '& .kt-spinner--right:before': {
            right: 15
        },
    },
    resetPasswordFormContainer: {
        width: 350,
        margin: '0 auto'
    },
    actionBtn: {
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#f3f3f3',
        minWidth: '44px',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    uploadAction: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: 'translateX(50%)'
    },
    formLegend: {
        color: '#014B68',
        fontSize: 20,
        marginBottom: 15
    },
    permissionList: {
        marginTop: 20,
        padding: 0,
        '& li': {
            listStyle: 'none',
            marginBottom: 10,
            color: '#6b6c6f',
            display: 'flex',
            alignItems: 'center',
            '& .material-icons': {
                marginRight: 5
            },
            '&:before': {
                content: '✓',
                display: 'block'
            }
        }
    },
})

function Profile(props) {
    const classes = useStyles()
    const { intl } = props;
    const [openChangePasswordDialog, setChangePasswordDialog] = useState(false)
    const [openUploadDataDialog, setUploadDataDialog] = useState(false)
    const [tempImageURL, setTempImageURL] = useState('')
    const [userDefaultLogo, setUserDefaultLogo] = useState(_.get(props, 'auth.user.avatar'))
    const [user, setUser] = useState(_.get(props, 'auth.user') || {})
    const [changePasswordLoading, setChangePasswordLoading] = useState(false)
    const [file, setFile] = useState('')
    const [uploadLogoLoading, setUploadLogoLoading] = useState(false)
    const [logoErr, setLogoErr] = useState('')
    const [pwConfig, setPWConfig] = useState({
        oldPW: false,
        newPW: false,
        confirmPW: false
    })

    const dispatch = useDispatch();

    const handleCloseUploadDialog = () => {
        setFile('')
        setUploadDataDialog(false)
        setLogoErr('')
    }

    useEffect(() => {
        if (!_.get(props, 'auth.roles')) {
            getRoleList()
                .then(res => {
                    dispatch({
                        type: authAction.SetRoles,
                        payload: _.get(res, 'data.result.roles')
                    })
                    dispatch({
                        type: authAction.SetPermissions,
                        payload: _.get(res, 'data.result.permissions')
                    })
                })
        }

    }, [])

    const uploadImage = e => {
        let avatar = e.target.files[0]
        if (avatar && avatar.type) {
            if (avatar.type.includes('image')) {
                setUploadDataDialog(true)
                setLogoErr('')
                setTempImageURL((window.URL
                    ? URL
                    : window.webkitURL
                ).createObjectURL(avatar))
            }
            else {
                setLogoErr('Wrong image format. Please select another file')
            }
        }
    }

    const handleEditUserAvatar = (img) => {
        setUploadLogoLoading(true)
        setLogoErr('')
        setTimeout(() => {
            editUser(_.get(img, 'file'))
                .then(res => {
                    setUploadLogoLoading(false)
                    setUploadDataDialog(false)
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setLogoErr(errMsg)
                    }
                    else {
                        const user = _.get(props, 'auth.user')
                        user.avatar = _.get(img, 'url')
                        dispatch({
                            type: authAction.UpdateUser,
                            payload: user
                        })
                        setUploadDataDialog(false)
                        setUserDefaultLogo(user.avatar)
                    }
                })
                .catch(err => {
                    setLogoErr('Network error. Please try again')
                    setUploadLogoLoading(false)
                    setUploadDataDialog(false)
                })
        }, 500)
    }

    const handleChangePassword = (values, { setStatus, setSubmitting }) => {
        setChangePasswordLoading(true)
        setSubmitting(true);
        setTimeout(() => {
            changePassword(
                values.oldpassword,
                values.password
            )
                .then(res => {
                    setChangePasswordLoading(false)
                    setSubmitting(false);
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        setChangePasswordDialog(false)
                    }
                })
                .catch(() => {
                    setChangePasswordLoading(false)
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    return (
        <div className={classes.root}>
            <form style={{
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div className={classes.userInfo}>
                    <div className={classes.userLogo}>
                        <Avatar className={classes.userLogoImg} src={userDefaultLogo}></Avatar>
                        <div className={classes.uploadAction}>
                            <label htmlFor="file-input" className={classes.actionBtn}><Icon>publish</Icon></label>
                        </div>
                    </div>
                    {logoErr && <div role="alert" style={{
                        width: 230,
                        margin: '20px 0'
                    }} className="alert alert-danger">
                        <div className="alert-text">{logoErr}</div>
                    </div>}
                    <TextField
                        id="file-input"
                        type="file"
                        style={{
                            display: 'none'
                        }}
                        value={file}
                        onChange={uploadImage}
                    />
                </div>
                <div className={classes.commomInfor}>
                    <FormGroup className="input-base">
                        <InputLabel>Your Name</InputLabel>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            placeholder="Your name"
                            value="Ecomeasy"
                        />
                    </FormGroup>
                    <FormGroup className="input-base">
                        <InputLabel>Password</InputLabel>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            type="password"
                            placeholder="Your password"
                            value="123456"
                            InputProps={{
                                readOnly: true,
                            }}
                            style={{
                                opacity: 0.5,
                                pointerEvents: 'none'
                            }}
                        />
                        <Link className="input-base__action" onClick={() => setChangePasswordDialog(true)}>Change</Link>
                    </FormGroup>
                    <FormGroup className="input-base">
                        <InputLabel>Your email</InputLabel>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            placeholder="Your email"
                            value={user.email}
                            InputProps={{
                                readOnly: true,
                            }}
                            style={{
                                opacity: 0.5,
                                pointerEvents: 'none'
                            }}
                        />
                    </FormGroup>
                    <FormGroup className="input-base">
                        <InputLabel>Your role</InputLabel>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="email"
                            placeholder="Your email"
                            value={user.role}
                            InputProps={{
                                readOnly: true,
                            }}
                            style={{
                                opacity: 0.5,
                                pointerEvents: 'none'
                            }}
                        />
                    </FormGroup>
                    <FormGroup className="input-base">
                        <InputLabel>Your permissions:</InputLabel>
                        <ul className={classes.permissionList}>
                            {user && user.permissions && user.permissions.length > 0 && user.permissions.map((item, index) => (
                                <li key={index}>
                                    <Icon>check</Icon>{_.get(_.get(props, 'auth.permissions')[item], 'name.en')}
                                </li>
                            ))}

                        </ul>
                    </FormGroup>
                    <div className={classes.formAction}>
                        <Button className="btn-base btn-base--cancel btn-base--lg">Cancel</Button>
                        <Button className="btn-base btn-base--success btn-base--lg">Save</Button>
                    </div>
                </div>
            </form>
            <Dialog
                open={openUploadDataDialog}
                keepMounted
                maxWidth="md"
                onClose={handleCloseUploadDialog}
            >
                <DialogContent>
                    <CropImageForm
                        loading={uploadLogoLoading}
                        src={tempImageURL}
                        onCancel={handleCloseUploadDialog}
                        onSave={handleEditUserAvatar} />
                </DialogContent>
            </Dialog>
            <Dialog
                open={openChangePasswordDialog}
                keepMounted
                maxWidth="md"
                onClose={() => setChangePasswordDialog(false)}
            >
                <DialogContent>
                    <div className={classes.resetPasswordForm}>
                        <div className={classes.formLegend}>
                            <Icon fontSize="large">lock</Icon>
                            <p>Reset your password</p>
                        </div>
                        <div className={classes.resetPasswordFormContainer}>
                            <Formik
                                initialValues={{
                                    oldpassword: '',
                                    password: '',
                                    confirmPassword: ''
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.oldpassword) {
                                        errors.oldpassword = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

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
                                onSubmit={handleChangePassword}
                            >
                                {({
                                    values,
                                    status,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting,
                                    resetForm
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
                                                    type={pwConfig.oldPW ? 'text' : 'password'}
                                                    placeholder="Current password"
                                                    name="oldpassword"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.oldpassword}
                                                    helperText={touched.oldpassword && errors.oldpassword}
                                                    error={Boolean(touched.oldpassword && errors.oldpassword)}
                                                    InputProps={{
                                                        startAdornment: <VpnKeyIcon />,
                                                        endAdornment: <IconButton
                                                            onClick={() => {
                                                                setPWConfig({
                                                                    ...pwConfig,
                                                                    oldPW: !pwConfig.oldPW
                                                                })
                                                            }}> {pwConfig.oldPW ? <VisibilityOff /> : <Visibility />}</IconButton>
                                                    }}
                                                /></FormGroup>
                                            <FormGroup className="input-base input-base--hasIcon">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type={pwConfig.newPW ? 'text' : 'password'}
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
                                                                    newPW: !pwConfig.newPW
                                                                })
                                                            }}> {pwConfig.newPW ? <VisibilityOff /> : <Visibility />}</IconButton>
                                                    }}
                                                /></FormGroup>

                                            <FormGroup className="input-base input-base--hasIcon">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type={pwConfig.confirmPW ? 'text' : 'password'}
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
                                                                    confirmPW: !pwConfig.confirmPW
                                                                })
                                                            }}> {pwConfig.confirmPW ? <VisibilityOff /> : <Visibility />}</IconButton>
                                                    }}
                                                /></FormGroup>

                                            <Button style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": changePasswordLoading
                                                    }
                                                )}`}>Reset Password</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setChangePasswordDialog(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const mapStateToProps = store => ({
    auth: store.auth
});

export default injectIntl(
    connect(mapStateToProps)(Profile)
);