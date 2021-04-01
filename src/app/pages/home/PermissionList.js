import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStyles } from "./statistics/OrderList"
import {
    Table, TableHead, TableCell, TableBody, FormGroup, TextField, Link, FormControlLabel, Checkbox,
    CircularProgress, TableRow, Button, Dialog, DialogContent, InputLabel, Select, Menu, MenuItem
} from '@material-ui/core';
import _ from "lodash"
import { getUsers } from "../../crud/statitics.crud"
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect } from "react-redux";
import clsx from "clsx"
import { getRoleList, createRole } from "../../crud/auth.crud"
import { getUserList } from "../../crud/statitics.crud"
import { actionTypes as authAction } from "../../store/ducks/auth.duck"
import { useDispatch } from "react-redux";

PermissionList.propTypes = {

};

function PermissionList(props) {
    let permissions = { ..._.get(props, 'auth.permissions') }
    const classes = useStyles()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [emails, setEmails] = useState([])
    const [email, setEmail] = useState([])
    const [createRolePopup, setCreateRolePopup] = useState(false)
    const [createRoleloading, setCreateRoleLoading] = useState(false)
    const { intl } = props;
    const dispatch = useDispatch();
    const [selectedPermissons, setSelectedPermissons] = useState([])

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
            label: 'Permissions',
            property: 'permissions',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Scope',
            property: 'scope',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày bắt đầu',
            property: 'start',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày kết thúc',
            property: 'end',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

    useEffect(() => {
        getUserList()
            .then(res => {
                setLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setErrorMessage(errMsg)
                    setEmails([])
                }
                else {
                    let emailList = _.get(res, 'data.result')
                    emailList.sort((a, b) => a.email.localeCompare(b.email))
                    setEmails(emailList)
                    setEmail(_.get(emailList, '[0].email'))
                    setErrorMessage('')
                }
            })
            .catch(err => {
                setErrorMessage(err)
            })
    }, [])

    useEffect(() => {
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
    }, [])

    useEffect(() => {
        setLoading(true)
        setUsers([])
        setErrorMessage('')
        getUsers()
            .then(res => {
                setLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setErrorMessage(errMsg)
                    setUsers([])
                }
                else {
                    let result = []
                    _.get(res, 'data.result').forEach(item => {
                        result = [...result, ...item.users]
                    })
                    setUsers(result)
                    setErrorMessage('')
                }
            })
            .catch(err => {
                setErrorMessage(err)
            })
    }, [])

    const closeCreateRolePopup = () => {
        setCreateRolePopup(false)
        Object.keys(permissions).forEach(key => {
            if (permissions[key].ischecked) {
                delete permissions[key].ischecked
            }
        })
    }

    const handleSelectPermissions = (e, p) => {
        const temp = [...selectedPermissons]
        if (temp.find(item => item === p)) {
            temp.splice(temp.indexOf(p), 1)
        }
        else {
            temp.push(p)
        }
        setSelectedPermissons(temp)
    }

    const handleSubmitCreateRoleForm = (values, { setStatus, setSubmitting }) => {

        setSubmitting(false)
        setStatus('')
        if (selectedPermissons.length > 0) {
            setCreateRoleLoading(true)
            setSubmitting(true);
            setTimeout(() => {
                createRole(
                    values.role,
                    email,
                    selectedPermissons,
                )
                    .then(res => {
                        setCreateRoleLoading(false)
                        setSubmitting(false);
                        const errMsg = _.get(res, 'data.errMsg')
                        if (errMsg) {
                            setStatus(errMsg)
                        }
                        else {
                            setCreateRolePopup(false)
                        }
                    })
                    .catch(() => {
                        setCreateRoleLoading(false)
                        setSubmitting(false);
                        setStatus('Some thing went wrong');
                    });
            }, 1000)
        }
        else {
            setStatus('Please select permissions')
        }
    }

    return (
        <div className={classes.root}>
            <p className={classes.headerTitle}>Danh sách permissions</p>
            <div className={classes.filterSection}>
                <Button
                    onClick={() => setCreateRolePopup(true)}
                    className="btn-base btn-base--success">Create Role</Button>
            </div>
            <div className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableCell></TableCell>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {users && users.map((row, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell style={{
                                        width: 80
                                    }}>{
                                            !row.end || new Date(row.end) > new Date() ? <p className="chip chip--success">Active</p> : <p className="chip chip--danger">Expired</p>
                                        }</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.permissions && row.permissions.length > 0 && row.permissions.map((item, sindex) => (
                                        <p key={sindex} style={{
                                            margin: 0
                                        }}>{item}</p>
                                    ))}</TableCell>
                                    <TableCell>{row.scope}</TableCell>
                                    <TableCell>{row.start}</TableCell>
                                    <TableCell>{row.end}</TableCell>
                                </TableRow>
                            )
                        })
                        }
                    </TableBody>
                </Table>
                {
                    (loading || errorMessage) &&
                    <div className="spinner-container">
                        {loading && <CircularProgress />}
                        {!loading && errorMessage && <p className="table-error-message">{errorMessage}</p>}
                    </div>
                }
            </div>
            <Dialog
                open={createRolePopup}
                keepMounted
                maxWidth="md"
            >
                <DialogContent>
                    <div className={classes.createRoleForm}>
                        <div className={classes.formLegend}>
                            <p>Create role</p>
                        </div>
                        <div>
                            <Formik
                                initialValues={{
                                    role: '',
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.role) {
                                        errors.role = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleSubmitCreateRoleForm}
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

                                            <FormGroup className="input-base">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    name="role"
                                                    placeholder="Role name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.role}
                                                    helperText={touched.role && errors.role}
                                                    error={Boolean(touched.role && errors.role)}
                                                />
                                            </FormGroup>
                                            <FormGroup variant="outlined" className="dropdown" style={{
                                                margin: '10px 0'
                                            }}>
                                                <InputLabel
                                                    style={{
                                                        textAlign: 'left'
                                                    }}
                                                >Email</InputLabel>
                                                <Select
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    MenuProps={{
                                                        anchorOrigin: {
                                                            vertical: "bottom",
                                                            horizontal: "left"
                                                        },
                                                        transformOrigin: {
                                                            vertical: "top",
                                                            horizontal: "left"
                                                        },
                                                        getContentAnchorEl: null
                                                    }} >
                                                    {emails && emails.map((item, index) => (
                                                        <MenuItem value={item.email} key={index}>
                                                            {item.email}
                                                        </MenuItem>
                                                    ))}

                                                </Select>
                                            </FormGroup>
                                            <FormGroup variant="outlined" className="checkbox" style={{
                                                margin: '20px 0'
                                            }}>
                                                <InputLabel
                                                    style={{
                                                        textAlign: 'left'
                                                    }}
                                                >Permissions</InputLabel>
                                                <ul style={{
                                                    textAlign: 'left',
                                                    padding: 0,
                                                    listStyle: 'none',
                                                    marginTop: 10
                                                }} >
                                                    {Object.keys(permissions).map((p, index) => (
                                                        <li><FormControlLabel
                                                            key={index}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedPermissons.find(s => s === p)}
                                                                    onChange={(e) => handleSelectPermissions(e, p)}
                                                                    name="checkedB"
                                                                    color="primary"
                                                                />
                                                            }
                                                            label={permissions[p].name.en}
                                                        /></li>
                                                    ))}
                                                </ul>
                                            </FormGroup>
                                            <Button style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": createRoleloading
                                                    }
                                                )}`}>Create Role</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    closeCreateRolePopup()
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
    connect(mapStateToProps)(PermissionList)
);
