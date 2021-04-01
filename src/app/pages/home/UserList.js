import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableCell, TableBody, Dialog, DialogContent, Icon, Link, Input, Checkbox, ListItemText,
    CircularProgress, TableRow, Button, FormGroup, TextField, InputLabel, Select, MenuItem
} from '@material-ui/core';
import _ from "lodash"
import { getUserList } from "../../crud/statitics.crud"
import { getRoleList, addAdmin } from "../../crud/auth.crud"
import { Formik } from "formik";
import clsx from "clsx";
import { FormattedMessage, injectIntl } from "react-intl";
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import { connect, useDispatch } from "react-redux";
import { actionTypes as authAction } from "../../store/ducks/auth.duck"


UserList.propTypes = {

};

const useStyles = makeStyles({
    root: {
        '& tr': {
            '&:nth-child(even)': {
                background: 'rgba(140, 160, 179, 0.1)'
            }
        },
        '& .Mui-selected': {
            backgroundColor: '#FFF !important'
        }
    },
    headerTitle: {
        color: '#014b68',
        fontWeight: 800,
        fontSize: '32px',
        margin: '0 15px 30px 0'
    },
    datatable: {
        border: '1px solid #e0e0e0'
    },
    tableHeader: {
        fontWeight: 800
    },
    addRoleForm: {
        padding: '30px',
        width: 600,
        '& .kt-spinner--right:before': {
            right: 15
        },
    },
    addRoleFormContainer: {
        width: 350,
        margin: '0 auto'
    },
    formLegend: {
        color: '#014B68',
        fontSize: 20,
        marginBottom: 30,
        textAlign: 'center'
    },
})

function UserList(props) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [addRoleDialog, setAddRoleDialog] = useState(false)
    const [selectedRole, setSelectedRole] = useState('brandAdmin')
    const [selectedBrands, setSelectedBrands] = useState([])
    const [selectedEmail, setSelectedEmail] = useState([])
    const { intl } = props;

    const columns = [
        {
            label: 'ID',
            property: 'id',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Email',
            property: 'marketplace',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'created',
            property: 'brandId',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '',
            property: 'brandId',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

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

    useEffect(() => {
        setLoading(true)
        setUsers([])
        setErrorMessage('')
        getUserList()
            .then(res => {
                setLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setErrorMessage(errMsg)
                    setUsers([])
                }
                else {
                    setUsers(_.get(res, 'data.result'))
                    setErrorMessage('')
                }
            })
            .catch(err => {
                setErrorMessage(err)
            })
    }, [])

    const selectBrand = (e) => {
        setSelectedBrands(e.target.value);
    }

    const handleAddRole = (values, { setStatus, setSubmitting }) => {
        setStatus('')
        setSubmitting(true)
        if (selectedBrands.length > 0) {
            let requestes = []
            selectedBrands.forEach(item => {
                requestes.push(addAdmin(item._id, selectedEmail, selectedRole))
            })
            Promise.all(requestes)
                .then(res => {
                    setSubmitting(false)
                    setStatus('')
                    setAddRoleDialog(false)
                    setSelectedBrands([])
                })
                .catch(err => {
                    setSubmitting(false)
                    setStatus('Something went wrong')
                })
        }
        else {
            setSubmitting(false)
            setStatus('Please select brand')
        }
    }

    return (
        <div className={classes.root}>
            <p className={classes.headerTitle}>Danh sách users</p>
            <div className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {users && users.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row._id}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.created}</TableCell>
                                <TableCell><Button
                                    onClick={() => {
                                        setAddRoleDialog(true)
                                        setSelectedEmail(row.email)
                                    }}
                                >Add role</Button></TableCell>
                            </TableRow>
                        ))}
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
                open={addRoleDialog}
                keepMounted
                maxWidth="md">
                <DialogContent>
                    <div className={classes.addRoleForm}>
                        <div className={classes.formLegend}>
                            <p>Add Role</p>
                        </div>
                        <div className={classes.addRoleFormContainer}>
                            <Formik
                                initialValues={{
                                    email: selectedEmail,
                                }}
                                validate={values => {
                                    return {}
                                }}
                                onSubmit={handleAddRole}
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
                                            <FormGroup style={{
                                                flexWrap: 'nowrap',
                                                flexDirection: 'row',
                                                marginBottom: 30
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
                                                    onChange={selectBrand}
                                                    value={selectedEmail}
                                                    input={<Input name="name" id="name-readonly" readOnly />}
                                                    readOnly
                                                    InputProps={{
                                                        startAdornment: <MailOutlineIcon />
                                                    }}
                                                />
                                            </FormGroup>
                                            <FormGroup variant="outlined" className="dropdown" style={{
                                                marginBottom: 30
                                            }}>
                                                <InputLabel>Brand</InputLabel>
                                                <Select
                                                    labelId="demo-mutiple-checkbox-label"
                                                    id="demo-mutiple-checkbox"
                                                    multiple
                                                    value={selectedBrands}
                                                    onChange={selectBrand}
                                                    input={<Input />}
                                                    renderValue={(selected) => {
                                                        const names = []
                                                        _.forEach(selected, item => {
                                                            names.push(item.name)
                                                        })
                                                        return names.join(', ')
                                                    }}
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
                                                    }}>

                                                    {_.get(props, 'brand.brandList')
                                                        .sort((a, b) => a.name.localeCompare(b.name))
                                                        .map((brand, index) => (
                                                            <MenuItem key={index} value={brand}>
                                                                <Checkbox
                                                                    checked={typeof (selectedBrands.find(item => item._id === brand._id)) === 'object'} />
                                                                <ListItemText primary={brand.name} />
                                                            </MenuItem>
                                                        ))}
                                                </Select>
                                            </FormGroup>
                                            <FormGroup variant="outlined" className="dropdown" style={{
                                                marginBottom: 15
                                            }}>
                                                <InputLabel>Role</InputLabel>
                                                <Select
                                                    onChange={e => setSelectedRole(e.target.value)}
                                                    value={selectedRole}
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
                                                    }}>
                                                    {Object.keys(_.get(props, 'auth.roles')).map((item, index) => (
                                                        <MenuItem key={index} value={item}>{_.get(_.get(props, 'auth.roles')[item], 'lang.en')}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormGroup>
                                            <Button style={{
                                                marginTop: 15,
                                                width: '100%'
                                            }}
                                                disabled={isSubmitting}
                                                onClick={handleSubmit}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                                                    }
                                                )}`}>Add</Button>
                                            <div style={{
                                                textAlign: 'center'
                                            }}><Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block',
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setAddRoleDialog(false)
                                                    setSelectedBrands([])
                                                    setSelectedRole('brandAdmin')
                                                }}>Cancel</Link>
                                            </div>

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
    brand: store.brand,
    auth: store.auth
});

export default injectIntl(connect(mapStateToProps)(UserList))
