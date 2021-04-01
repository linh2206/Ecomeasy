import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Button, ButtonGroup, Grid, Table, TableBody, TableHead,
    TableCell, Icon, TableRow, Dialog, DialogContent, FormGroup, TextField
} from '@material-ui/core';
import { Link } from "react-router-dom";
import { parseLocaleString } from "../../../helpers/helper"
import { useParams, useHistory } from 'react-router-dom'
import { connect, useDispatch } from "react-redux"
import _ from "lodash"
import { editBalance, getBalanceDetail, deleteBalance } from "../../../crud/finance.crud"
import { actionTypes } from '../../../store/ducks/finance.duck'
import clsx from "clsx"
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import moment from "moment"
import { globalStyles } from "../../../styles/globalStyles"
import ConfirmationPopup from "../../../partials/popup/ConfirmationPopup"

BankAccountDetail.propTypes = {

};

const useStyles = makeStyles({
    root: {
        fontSize: '16px',
        '& >div': {
            margin: '30px 0'
        },
        '& .percentage-change': {
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
        },
        '& .active': {
            background: '#ebebeb',
            fontWeight: 800
        }
    },
    header: {
        margin: '0 !important',
        padding: '15px 0',
    },
    headerTitle: {
        color: '#014b68',
        fontWeight: 800,
        fontSize: '32px',
        margin: '0 15px 0 0'
    },
    ...globalStyles
})

function BankAccountDetail(props) {
    const classes = useStyles()
    const { intl } = props;
    const columns = [
        {
            label: 'Ngày nhập',
            property: 'created',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày kiểm kê',
            property: 'date',
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
            label: '',
            property: 'action',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]
    const dispatch = useDispatch()
    const { bankAccountId } = useParams()
    const [bankAcc, setBankAcc] = useState({})
    const [selectedBalance, setSelectedBalance] = useState({})
    const [editBalancePopup, setEditBalancePopup] = useState(false)
    const [deleteBalancePopup, setDeleteBalancePopup] = useState(false)
    const [deleteBalanceLoading, setDeleteBalanceLoading] = useState(false)

    let history = useHistory()

    useEffect(() => {
        fetchData()
    }, [])

    const handleDeleteBalance = () => {
        setDeleteBalanceLoading(true)
        deleteBalance(selectedBalance._id)
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    fetchData()
                    setDeleteBalanceLoading(false)
                    setDeleteBalancePopup(false)
                }
            })
    }

    const handleEditBalance = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            editBalance(
                selectedBalance._id,
                values.balance
            )
                .then(res => {
                    setSubmitting(false);
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        fetchData()
                        setEditBalancePopup(false)
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    const fetchData = () => {
        getBalanceDetail(bankAccountId)
            .then(res => {
                setBankAcc({
                    balances: _.get(res, 'data.result') || []
                })
                if (_.get(res, 'data.result') && _.get(res, 'data.result').length === 0) {
                    history.push('/finance-overview')
                }
            })
    }

    return (
        <div className={classes.root}>
            <Link to="/finance-overview"><Icon>arrow_back</Icon></Link>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>{`Chi tiết tài khoản: 
                ${_.get(bankAcc, 'balances[0].bankName') || ''} - 
                ${_.get(bankAcc, 'balances[0].accountName') || ''} 
                 - ${_.get(bankAcc, 'balances[0].accountNumber') || ''} `}</p>
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
                            _.get(bankAcc, 'balances') && _.get(bankAcc, 'balances').map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {moment(row.created).format('MM/DD/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        {moment(row.date).format('MM/DD/YYYY')}
                                    </TableCell>
                                    <TableCell>
                                        {parseLocaleString(row.balance, true)}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Link onClick={e => {
                                            e.preventDefault()
                                            setSelectedBalance(row)
                                            setEditBalancePopup(true)
                                        }}><Icon>edit</Icon></Link>
                                        <Icon style={{
                                            marginLeft: '15px',
                                            cursor: 'pointer'
                                        }}
                                            onClick={() => {
                                                setSelectedBalance(row)
                                                setDeleteBalancePopup(true)
                                            }}>delete</Icon>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
            <Dialog
                open={editBalancePopup}
                keepMounted
                maxWidth="md"
                onClose={() => setEditBalancePopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    balance: selectedBalance.balance,
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.balance) {
                                        errors.balance = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleEditBalance}
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
                                            <FormGroup className="input-base disabled">
                                                <TextField
                                                    disabled={true}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    value={selectedBalance.bankName}
                                                /></FormGroup>
                                            <FormGroup className="input-base disabled">
                                                <TextField
                                                    disabled={true}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    value={selectedBalance.accountName}
                                                /></FormGroup>
                                            <FormGroup className="input-base disabled">
                                                <TextField
                                                    disabled={true}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    name="balance"
                                                    value={selectedBalance.accountNumber}
                                                /></FormGroup>
                                            <FormGroup className="input-base disabled">
                                                <TextField
                                                    disabled={true}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    value={moment(selectedBalance.date).format('MM/DD/YYYY')}
                                                /></FormGroup>
                                            <FormGroup className="input-base">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Balance"
                                                    name="balance"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.balance}
                                                    helperText={touched.balance && errors.balance}
                                                    error={Boolean(touched.balance && errors.balance)}
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
                                                )}`}>Update Balance</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setEditBalancePopup(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmationPopup
                message="Bạn có chắc chắn xóa thông tin này này?"
                open={deleteBalancePopup}
                onClose={() => setDeleteBalancePopup(false)}
                loading={deleteBalanceLoading}
                onOK={handleDeleteBalance} />
        </div>
    );
}
const mapStateToProps = store => ({
    finance: store.finance
});

export default injectIntl(
    connect(mapStateToProps)(BankAccountDetail)
);
