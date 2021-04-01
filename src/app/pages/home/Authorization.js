import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    FormGroup, TextField, Icon, InputLabel, Table, TableHead, Link, Snackbar,
    CircularProgress, TableRow, TableCell, TableBody, Button, Select, MenuItem
} from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { connect, useDispatch } from "react-redux";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash"
import { getRoleList, inviteUser, removeAdmin } from "../../crud/auth.crud"
import { getBrandDetail } from "../../crud/brand.crud"
import { actionTypes } from "../../store/ducks/auth.duck"
import { Formik } from "formik";
import { isValidEmail, isAuthenticated } from "../../helpers/helper"
import clsx from "clsx";
import { ROLE_DETAIL, PERMISSIONS } from "../../constant/role"
import ConfirmationPopup from "../../partials/popup/ConfirmationPopup"

const REMOVE_ADMIN_PERMISSONS = [PERMISSIONS.UPDATE_ADMIN_BRAND]

Authorization.propTypes = {

};

const useStyles = makeStyles({
    root: {
        background: '#FBFBFB',
        padding: 50,
        '& .input-base': {
            marginBottom: 30
        },
        '& .kt-spinner--right:before': {
            right: 15
        },
        '& tr': {
            '&:nth-child(even)': {
                background: 'rgba(140, 160, 179, 0.1)'
            }
        },
        '& td, th': {
            fontSize: '14px'
        },
        '& .MuiSnackbarContent-root': {
            background: 'green'
        }
    },
    formLegend: {
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 700,
        marginBottom: 50
    },
    formContainer: {
        maxWidth: 350,
        margin: '0 auto'
    },
    permissionList: {
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
    datatable: {
        border: '1px solid #e0e0e0',
        margin: '50px auto 0 auto',
        maxWidth: 1000
    },
})

function Authorization(props) {

    const classes = useStyles()
    const { brandId, admins } = props
    const { intl } = props;
    const dispatch = useDispatch();
    const brandList = _.get(props, 'brand.brandList')
    const [selectedRole, setSelectedRole] = useState('brandAdmin')
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [loading, setLoading] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false)
    const [successToast, setSuccessToast] = useState(false)
    const [deleteConfirmationPopup, setDeleteConfirmationPopup] = useState(false)
    const [selectedUser, setSelectedUser] = useState('')
    const userRole = _.get(props, 'auth.user.permissions')

    const columns = [
        {
            label: 'Email',
            property: 'email',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Role',
            property: 'role',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Status',
            property: 'status',
            horizontalAlign: 'center',
            cellFormat: 'string'
        },
        {
            label: '',
            property: 'syncDate',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '',
            property: 'syncDate',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

    const handleRemoveAdmin = () => {
        setDeleteLoading(true)
        removeAdmin(brandId, selectedUser)
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                props.onUpdatedAdmin()
                setDeleteConfirmationPopup(false)
                setDeleteLoading(false)
            })
            .catch(err => {
                setDeleteConfirmationPopup(false)
                setDeleteLoading(false)
            })
    }


    const handleInviteSubmit = (values, { setStatus, setSubmitting }) => {
        setLoading(true)
        setSubmitting(true)
        setStatus('')
        inviteUser(brandId, values.email, selectedRole)
            .then(res => {
                setLoading(false)
                setSubmitting(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setStatus(errMsg)
                }
                else {
                    props.onUpdatedAdmin()
                    setSuccessToast(true)
                    values.email = ''
                    setStatus('')
                }
            })
            .catch(err => {
                setLoading(false)
                setSubmitting(false)
            })
    }

    const handleCloseToast = () => {
        setSuccessToast(false)
    };

    const resendInvitation = (event, email, role) => {
        event.preventDefault()
        inviteUser(brandId, email, role)
            .then(res => {
                setSuccessToast(true)
            })
    }

    useEffect(() => {
        if (!_.get(props, 'auth.roles')) {
            getRoleList()
                .then(res => {
                    dispatch({
                        type: actionTypes.SetRoles,
                        payload: _.get(res, 'data.result.roles')
                    })
                    dispatch({
                        type: actionTypes.SetPermissions,
                        payload: _.get(res, 'data.result.permissions')
                    })
                })
        }

    }, [])

    const handleCloseDeleteConfirmationPopup = () => {
        setDeleteConfirmationPopup(false)
        setDeleteLoading(false)
        setSelectedUser('')
    }

    return (
        <div className={classes.root}>
            <div className={classes.formContainer}>
                <Formik
                    initialValues={{
                        email: '',
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
                    onSubmit={handleInviteSubmit}
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
                                <FormGroup style={{
                                    flexWrap: 'nowrap',
                                    flexDirection: 'row'
                                }} className="input-base input-base--hasIcon">
                                    <TextField
                                        style={{
                                            margin: 0
                                        }}
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        name="email"
                                        placeholder="Email"
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
                                <FormGroup variant="outlined" className="dropdown" style={{
                                    marginBottom: 30
                                }}>
                                    <InputLabel>Role</InputLabel>
                                    <Select value="admin" MenuProps={{
                                        anchorOrigin: {
                                            vertical: "bottom",
                                            horizontal: "left"
                                        },
                                        transformOrigin: {
                                            vertical: "top",
                                            horizontal: "left"
                                        },
                                        getContentAnchorEl: null
                                    }}
                                        value={selectedRole}
                                        onChange={e => setSelectedRole(e.target.value)}>
                                        {Object.keys(_.get(props, 'auth.roles')).map((item, index) => (
                                            <MenuItem key={index} value={item}>{_.get(_.get(props, 'auth.roles')[item], 'lang.en')}</MenuItem>
                                        ))}

                                    </Select>
                                </FormGroup>
                                <ul className={classes.permissionList}>
                                    {_.get(props, 'auth.roles')[selectedRole]
                                        && _.get(props, 'auth.roles')[selectedRole].permissions
                                        && _.get(props, 'auth.roles')[selectedRole].permissions.map((item, index) => (
                                            _.get(_.get(props, 'auth.permissions')[item], 'name.en') &&
                                            <li key={index}>
                                                <Icon>check</Icon>{_.get(_.get(props, 'auth.permissions')[item], 'name.en')}
                                            </li>
                                        ))}

                                </ul>
                                <Button style={{
                                    marginTop: 15,
                                    width: '100%'
                                }}
                                    disabled={isSubmitting}
                                    onClick={handleSubmit}
                                    className={`btn-base btn-base--success btn-base--lg ${clsx(
                                        {
                                            "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                                        }
                                    )}`}>Invite</Button>
                            </form>
                        )}
                </Formik>
            </div>
            <div className={classes.datatable}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableCell align={col.horizontalAlign} key={index}>{col.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            admins && admins.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row.email}
                                    </TableCell>
                                    <TableCell>
                                        {ROLE_DETAIL[row.role] && ROLE_DETAIL[row.role].label}
                                    </TableCell>
                                    <TableCell align="center">
                                        {
                                            row.isPending ? <p className="chip chip--secondary">Pending</p>
                                                : <p className="chip chip--success">Active</p>
                                        }
                                    </TableCell>
                                    <TableCell style={{
                                        width: 80,
                                        textAlign: 'center'
                                    }}>
                                        {row.isPending &&
                                            <Link
                                                onClick={(e) => resendInvitation(e, row.email, row.role)}
                                                href="">
                                                Resend
                                        </Link>}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 80,
                                        textAlign: 'center'
                                    }}>
                                        {
                                            isAuthenticated(userRole, REMOVE_ADMIN_PERMISSONS) &&
                                            <Link
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    setSelectedUser(row.email)
                                                    setDeleteConfirmationPopup(true)
                                                }}
                                                href="">
                                                Remove
                                            </Link>
                                        }

                                    </TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
                {adminLoading && <div className="spinner-container">
                    <CircularProgress />
                </div>}
            </div>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={successToast}
                autoHideDuration={6000}
                onClose={handleCloseToast}
                message="Invite successfully">
            </Snackbar>
            <ConfirmationPopup
                message={`Bạn có chắc chắn bỏ quyền quản lý  của ${selectedUser} không`}
                open={deleteConfirmationPopup}
                onClose={handleCloseDeleteConfirmationPopup}
                loading={deleteLoading}
                onOK={handleRemoveAdmin} />
        </div>
    );
}

const mapStateToProps = store => ({
    brand: store.brand,
    auth: store.auth
});

export default injectIntl(connect(mapStateToProps)(Authorization))