import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    FormGroup, Button, Dialog, DialogContent, TextField, Grid, Icon, InputLabel, FormControlLabel
} from '@material-ui/core';
import { Link } from "react-router-dom";
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash"
import clsx from "clsx"
import { Formik } from "formik";
import { globalStyles } from '../../styles/globalStyles'
import { getUserList, getDepartments, createDepartments, addUserToDepartment } from '../../crud/statitics.crud'
import { CheckBox } from '@material-ui/icons';

Deparments.propTypes = {

};

const useStyles = makeStyles({
    root: {
        '& .MuiFormControlLabel-root': {
            margin: 0
        }
    },
    departmentList: {
        marginTop: 15
    },
    deparmentCard: {
        borderRadius: '4px',
        backgroundColor: '#f7f7f7',
        boxShadow: '0 0 10px rgba(51, 51, 51, 0.15)',
        padding: '15px 20px',
        position: 'relative',
        height: '100%',
        color: '#333333'
    },
    addUserBtn: {
        color: '#014b68',
        position: 'absolute',
        right: 15
    },
    deparmentName: {
        fontSize: 18,
        fontWeight: 700,
        paddingRight: 60
    },
    ...globalStyles
})

function Deparments(props) {
    const { intl } = props;
    let classes = useStyles()
    const [departmentPopup, setDepartmentPopup] = useState(false)
    const [deparments, setDeparments] = useState([])
    const [addUserPopup, setAddUserPopup] = useState(false)
    const [users, setUsers] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState({})

    useEffect(() => {
        fetchDepartmentList()
        fetchUserList()
    }, [])

    const handleCreateDeparment = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            createDepartments(
                values.name,
            )
                .then(res => {
                    setSubmitting(false);
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        setDepartmentPopup(false)
                        fetchDepartmentList()
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    const handleAddUserToDeparment = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            addUserToDepartment(
                _.get(selectedDepartment, '_id'),
                ["huy@ecomeasy.asia"],
            )
                .then(res => {
                    setSubmitting(false);
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        setAddUserPopup(false)
                        fetchDepartmentList()
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    const fetchDepartmentList = () => {
        getDepartments()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setDeparments(_.get(res, 'data.result') || [])
                }
            })
    }

    const fetchUserList = () => {
        getUserList()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setUsers(_.get(res, 'data.result') || [])
                }
            })
    }

    const openAddUserPopup = (d) => {
        setAddUserPopup(true)
        setSelectedDepartment(d)
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <p className={classes.headerTitle}>Quản lý phòng ban</p>
            </div>
            <div className={classes.leftBtnContainer}>
                <Button onClick={() => setDepartmentPopup(true)} className="btn-base btn-base--success" >Create Department</Button>
            </div>
            <Grid container spacing={5} className={classes.departmentList}>
                {
                    deparments.map((item, index) => {
                        return (<Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                            <div className={classes.deparmentCard}>
                                <Button
                                    onClick={() => openAddUserPopup({
                                        _id: _.get(item, '_id'),
                                        name: _.get(item, 'name'),
                                        users: _.get(item, 'users')
                                    })}
                                    className={classes.addUserBtn}><Icon>person_add_icon</Icon></Button>
                                <p className={classes.deparmentName}>{_.get(item, 'name')}</p>
                                <ul>
                                    {_.get(item, 'users') && _.get(item, 'users').map((user, userIndex) => (
                                        <li key={userIndex}>{user}</li>
                                    ))}
                                </ul>
                            </div>
                        </Grid>)
                    })
                }
            </Grid>
            <Dialog
                open={departmentPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setDepartmentPopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                initialValues={{
                                    name: '',
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.name) {
                                        errors.name = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleCreateDeparment}
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
                                        <form onSubmit={handleSubmit} noValidate>
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
                                                    placeholder="Tên phòng ban"
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.name}
                                                    helperText={touched.name && errors.name}
                                                    error={Boolean(touched.name && errors.name)}
                                                /></FormGroup>

                                            <Button style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                                                    }
                                                )}`}>Submit</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setDepartmentPopup(false)
                                                }}>Cancel</Link>
                                        </form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={addUserPopup}
                keepMounted
                maxWidth="md"
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                initialValues={{
                                }}
                                validate={values => {
                                    const errors = {};
                                    return errors;
                                }}
                                onSubmit={handleAddUserToDeparment}
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
                                        <form onSubmit={handleSubmit} noValidate>
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
                                                    placeholder="Tên phòng ban"
                                                    name="name"
                                                    value={_.get(selectedDepartment, 'name')}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                /></FormGroup>
                                            <FormGroup variant="outlined" className="checkbox" style={{
                                                margin: '20px 0'
                                            }}>
                                                <InputLabel
                                                    style={{
                                                        textAlign: 'left'
                                                    }}
                                                >Users</InputLabel>
                                                <ul style={{
                                                    textAlign: 'left',
                                                    padding: 0,
                                                    listStyle: 'none',
                                                    marginTop: 10,
                                                    maxHeight: 250,
                                                    overflow: 'auto'
                                                }} >
                                                    {users && users.length > 0 && users.map((item, index) => (
                                                        <li key={index}><FormControlLabel
                                                            style={{
                                                                margin: '5px 0'
                                                            }}
                                                            control={
                                                                <CheckBox
                                                                    name="checkedB"
                                                                    color="primary"
                                                                    style={{
                                                                        marginRight: 5
                                                                    }}
                                                                />
                                                            }
                                                            label={_.get(item, 'email')}
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
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                                                    }
                                                )}`}>Submit</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setAddUserPopup(false)
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

export default injectIntl(Deparments);