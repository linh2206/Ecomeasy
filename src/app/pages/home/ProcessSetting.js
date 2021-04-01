import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../styles/globalStyles'
import _ from "lodash"
import { makeStyles } from '@material-ui/styles';
import {
    Button, Table, TableHead, TableCell, Icon, FormGroup, TextField,
    TableBody, TableRow, CircularProgress, Dialog, DialogContent
} from '@material-ui/core';
import { Link } from "react-router-dom";
import clsx from "clsx"
import { Formik } from "formik";
import { createProcess, getProcessList } from '../../crud/process.crud'
import { FormattedMessage, injectIntl } from "react-intl";
import { connect, useDispatch } from "react-redux";
import { actionTypes } from '../../store/ducks/process.duck'

ProcessSetting.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function ProcessSetting(props) {
    const classes = useStyles()
    const { intl } = props;
    const [createProcessPopup, setCreateProcessPopup] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    const [processes, setProcesses] = useState([])

    const columns = [
        {
            label: 'Tên qui trình',
            property: 'process',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Số bước',
            property: 'step',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày tạo',
            property: 'created',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '',
            property: 'action',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

    const fetchProcessList = () => {
        getProcessList()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    dispatch({
                        type: actionTypes.SetProcessList,
                        payload: _.get(res, 'data.result') || []
                    })
                    setProcesses(_.get(res, 'data.result') || [])
                }
            })
    }

    useEffect(() => {
        fetchProcessList()
    }, [])

    const handleCreateProcess = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        createProcess(
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
                    fetchProcessList()
                    setCreateProcessPopup(false)
                }
            })
            .catch(() => {
                resetForm()
                setSubmitting(false);
                setStatus('Some thing went wrong');
            });
    }


    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <p className={classes.headerTitle}>Quản lý qui trình</p>
            </div>
            <div className={classes.leftBtnContainer}>
                <Button onClick={() => setCreateProcessPopup(true)} className="btn-base btn-base--success" >Create Process</Button>
            </div>
            <div style={{
                marginTop: 15
            }} className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {
                            processes && processes.length > 0 && processes.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>{row.steps && row.steps.length}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Link to={`/process/${row._id}`}><Icon>edit</Icon></Link>
                                        <Icon style={{
                                            marginLeft: '15px',
                                            cursor: 'pointer'
                                        }}>delete</Icon>
                                    </TableCell>
                                </TableRow>
                            ))
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
                open={createProcessPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setCreateProcessPopup(false)}
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
                                onSubmit={handleCreateProcess}
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
                                            <div>
                                                <FormGroup className="input-base">
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="text"
                                                        placeholder="Tên qui trình"
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.name}
                                                        helperText={touched.name && errors.name}
                                                        error={Boolean(touched.name && errors.name)}
                                                    />
                                                </FormGroup>
                                            </div>
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
                                                    setCreateProcessPopup(false)
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
    process: store.process
});

export default injectIntl(
    connect(mapStateToProps)(ProcessSetting)
);