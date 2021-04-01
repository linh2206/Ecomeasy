import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup, CircularProgress,
    Button, TableBody, Icon, Dialog, DialogContent, TextField
} from '@material-ui/core';
import { Link } from "react-router-dom";
import ConfirmationPopup from "../../../partials/popup/ConfirmationPopup"
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash"
import clsx from "clsx"
import { Formik } from "formik";
import { createBank, getListBank, deletebank } from "../../../crud/finance.crud"
import moment from "moment"
import { connect, useDispatch } from "react-redux";
import { actionTypes } from '../../../store/ducks/finance.duck'

BankManagement.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    datatable: {
        border: '1px solid #e0e0e0'
    },
    table: {

    },
    tableHeader: {
        fontWeight: 800
    },
    headerTitle: {
        color: '#014b68',
        fontWeight: 800,
        fontSize: '32px',
        margin: 0
    },
    createBankForm: {
        padding: '30px',
        width: 500,
        textAlign: 'center',
        '& .kt-spinner--right:before': {
            right: 15
        },
    },
    createBankFormContainer: {
        width: 350,
        margin: '15px auto'
    }
})

function BankManagement(props) {
    const classes = useStyles()
    const [deleteBankPopup, setDeleteBankPopup] = useState(false)
    const [createBankPopup, setCreateBankPopup] = useState(false)
    const [deleteBankLoading, setDeleteBankLoading] = useState(false)
    const [bankList, setBankList] = useState([])
    const [selectedBank, setSelectedBank] = useState([])
    const [fetchBankListLoading, setFetchBankListLoading] = useState(false)
    const { intl } = props;
    const dispatch = useDispatch();
    const columns = [
        {
            label: 'Tên ngân hàng',
            property: 'bank_name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Số tài khoản',
            property: 'bank_name',
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

    useEffect(() => {
        fetchBankList()
    }, [])

    const fetchBankList = () => {
        setFetchBankListLoading(true)
        setBankList([])
        getListBank()
            .then(res => {
                setFetchBankListLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setBankList(_.get(res, 'data.result') || [])
                }
                dispatch({
                    type: actionTypes.SetBankList,
                    payload: _.get(res, 'data.result') || []
                })
            })
            .catch(err => {
                setFetchBankListLoading(false)
            })
    }

    const handleDeleteBank = () => {
        setDeleteBankLoading(true)
        deletebank(selectedBank)
            .then(res => {
                setDeleteBankLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    fetchBankList()
                    setDeleteBankPopup(false)
                }
            })
            .catch(err => {
                setDeleteBankLoading(false)
                setDeleteBankPopup(false)
            })
    }

    const handleCreateBank = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            createBank(
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
                        fetchBankList()
                        setCreateBankPopup(false)
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    return (
        <div className={classes.root}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>Danh sách ngân hàng</p>
                <Button onClick={() => setCreateBankPopup(true)} className="btn-base btn-base--success" >CREATE BANK</Button>
            </div>

            <div className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {
                            bankList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>
                                        {row.accounts && row.accounts.length > 0 && row.accounts.map(item => (
                                            <p style={{
                                                margin: '5px 0'
                                            }}>
                                                {item.accountNumber}
                                            </p>
                                        ))}
                                    </TableCell>
                                    <TableCell>
                                        {moment(row.created).format('MM/DD/YYYY')}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Link to={`/bank/${row._id}`}><Icon>edit</Icon></Link>
                                        <Icon style={{
                                            marginLeft: '15px',
                                            cursor: 'pointer'
                                        }} onClick={() => {
                                            setSelectedBank(row._id)
                                            setDeleteBankPopup(true)
                                        }}>delete</Icon>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    (fetchBankListLoading || bankList.length === 0) &&
                    <div className="spinner-container">
                        {fetchBankListLoading && <CircularProgress />}
                        {!fetchBankListLoading && bankList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                    </div>
                }
            </div>
            <Dialog
                open={createBankPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setCreateBankPopup(false)}
            >
                <DialogContent>
                    <div className={classes.createBankForm}>
                        <div className={classes.createBankFormContainer}>
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
                                onSubmit={handleCreateBank}
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
                                                    placeholder="Bank name"
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
                                                )}`}>Create Bank</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setCreateBankPopup(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmationPopup
                message="Bạn có chắc chắn xóa ngân hàng không?"
                open={deleteBankPopup}
                loading={deleteBankLoading}
                onOK={handleDeleteBank}
                onClose={() => setDeleteBankPopup(false)} />
        </div>
    );
}

const mapStateToProps = store => ({
    finance: store.finance
});

export default injectIntl(
    connect(mapStateToProps)(BankManagement)
);