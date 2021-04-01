import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup,
    Button, TableBody, Icon, Dialog, DialogContent, TextField
} from '@material-ui/core';
import { Link } from "react-router-dom";
import ConfirmationPopup from "../../../partials/popup/ConfirmationPopup"
import { FormattedMessage, injectIntl } from "react-intl";
import _ from "lodash"
import clsx from "clsx"
import { Formik } from "formik";
import { parseLocaleString } from "../../../helpers/helper"
import { createBankAccount } from '../../../crud/finance.crud'
import { useParams } from "react-router-dom"
import { connect, useDispatch } from "react-redux";
import { actionTypes } from '../../../store/ducks/finance.duck'
import { deleteAccount, getListBank } from "../../../crud/finance.crud"

BankDetail.propTypes = {

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

function BankDetail(props) {
    const classes = useStyles()
    const { bankId } = useParams()
    const bank = _.get(props, 'finance.bankList') && _.get(props, 'finance.bankList').find(item => item._id === bankId)
    const [deleteBankPopup, setDeleteBankPopup] = useState(false)
    const [createBankAccountPopup, setCreateBankAccountPopup] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState({})
    const { intl } = props;
    const dispatch = useDispatch();
    const columns = [
        {
            label: 'Tên tài khoản',
            property: 'bank_account_name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Số tài khoản',
            property: 'bank_account',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Số dư',
            property: 'balance',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày',
            property: 'date',
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

        getListBank()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    dispatch({
                        type: actionTypes.SetBankList,
                        payload: _.get(res, 'data.result') || []
                    })
                }
            })
    }

    const handleCreateBankAccount = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            createBankAccount(
                bankId,
                values.bank_name,
                values.bank_account
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
                        setCreateBankAccountPopup(false)
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    const handleDelelteBankAccount = () => {
        setDeleteLoading(true)
        deleteAccount(bankId, selectedAccount.accountNumber, selectedAccount.accountName)
            .then(res => {
                setDeleteBankPopup(false)
                setDeleteLoading(false)
                fetchBankList()
            })
            .catch(err => setDeleteLoading(false))
    }

    return (
        <div className={classes.root}>
            <Link to="/bank-list"><Icon>arrow_back</Icon></Link>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>{bank.name}</p>
                <Button onClick={() => setCreateBankAccountPopup(true)} className="btn-base btn-base--success" >Add Bank Account</Button>
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
                            bank.accounts.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row.accountName}
                                    </TableCell>
                                    <TableCell>
                                        {row.accountNumber}
                                    </TableCell>
                                    <TableCell>
                                        {parseLocaleString(row.balance, true)}
                                    </TableCell>
                                    <TableCell>
                                        {row.created}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Icon style={{
                                            color: '#5867dd',
                                            cursor: 'pointer'
                                        }} onClick={() => setCreateBankAccountPopup(true)}>edit</Icon>
                                        <Icon style={{
                                            marginLeft: '15px',
                                            cursor: 'pointer'
                                        }} onClick={() => {
                                            setSelectedAccount(row)
                                            setDeleteBankPopup(true)
                                        }}>delete</Icon>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <Dialog
                open={createBankAccountPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setCreateBankAccountPopup(false)}
            >
                <DialogContent>
                    <div className={classes.createBankForm}>
                        <div className={classes.createBankFormContainer}>
                            <Formik
                                initialValues={{
                                    bank_name: '',
                                    bank_account: ''
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.bank_name) {
                                        errors.bank_name = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    if (!values.bank_account) {
                                        errors.bank_account = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleCreateBankAccount}
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
                                                    placeholder="Tên tài khoản"
                                                    name="bank_name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.bank_name}
                                                    helperText={touched.bank_name && errors.bank_name}
                                                    error={Boolean(touched.bank_name && errors.bank_name)}
                                                /></FormGroup>
                                            <FormGroup className="input-base">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Số tài khoản"
                                                    name="bank_account"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.bank_account}
                                                    helperText={touched.bank_account && errors.bank_account}
                                                    error={Boolean(touched.bank_account && errors.bank_account)}
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
                                                )}`}>Create Bank Account</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setCreateBankAccountPopup(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmationPopup
                message="Bạn có chắc chắn xóa tài khoản không?"
                open={deleteBankPopup}
                onClose={() => setDeleteBankPopup(false)}
                onOK={handleDelelteBankAccount}
                loading={deleteLoading}
            />
        </div>
    );
}

const mapStateToProps = store => ({
    finance: store.finance
});

export default injectIntl(
    connect(mapStateToProps)(BankDetail)
);
