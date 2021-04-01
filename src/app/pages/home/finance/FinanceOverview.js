import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Button, FormGroup, Grid, Dialog, DialogContent, TextField, Select, InputLabel,
    Table, TableBody, TableHead, TableCell, Icon, TableRow, Chip, MenuItem
} from '@material-ui/core';
import { Link } from "react-router-dom";
import { parseLocaleString } from "../../../helpers/helper"
import clsx from "clsx"
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory, useLocation } from "react-router-dom";
import RangeDatePicker from "../../home/components/RangeDatePicker"
import moment from "moment"
import _ from "lodash"
import { connect, useDispatch } from "react-redux"
import { actionTypes } from '../../../store/ducks/finance.duck'
import { addBalance, getListBank, getBalance, sendReport } from "../../../crud/finance.crud"
import { actionTypes as commonTypes } from "../../../store/ducks/common.duck"
import { isValidEmail } from "../../../helpers/helper"

FinanceOverview.propTypes = {

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
        borderBottom: '1px solid #dbdbdb',
        margin: '0 !important',
        padding: '15px 0',
    },
    headerTitle: {
        color: '#014b68',
        fontWeight: 800,
        fontSize: '32px',
        margin: '0 15px 0 0'
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
    },
    recipientsList: {
        listStyle: 'none',
        padding: 15,
        marginBottom: 15,
        border: '1px solid #dbdbdb',
        width: 380
    },
    recipient: {
        margin: 5,
        float: 'left'
    },
    selectedEmail: {
        padding: 15
    }
})

function FinanceOverview(props) {
    const classes = useStyles()
    const { intl } = props;
    const [createBankPopup, setCreateBankPopup] = useState(false)
    const [financeReportPopup, setFinanceReportPopup] = useState(false)
    const search = useLocation().search
    const dateFilter = search && search.split('&mode=')[1]
    const queryString = search ? search.split('&mode=')[0].split('?from=')[1].split('&to=') : []
    const [balance, setBalance] = useState([])
    const startDateConfig = { hour: 0, minute: 0, second: 0, millisecond: 0 }
    const endDateConfig = { hour: 23, minute: 59, second: 59, millisecond: 999 }
    const [mode, setMode] = useState(dateFilter || 'year')
    const [total, setTotal] = useState(0)
    const [from, setFrom] = useState(queryString.length > 0 ? queryString[0] :
        moment().startOf('year').set(startDateConfig).toISOString())
    const [to, setTo] = useState(queryString.length > 0 ? queryString[1] : moment().set(endDateConfig).toISOString())
    let history = useHistory()
    const dispatch = useDispatch()
    const [recipients, setRecipients] = useState(['ngoc@ecomeasy.asia', 'nhung@ecomeasy.asia'])
    const [recipient, setRecipient] = useState('')
    const [recipientStatus, setRecipientStatus] = useState('')
    const [recipientLoading, setRecipientLoading] = useState(false)
    const handleStartDateChange = e => {
        setFrom(moment(e).set(startDateConfig).toISOString())
    }

    const handleEndDateChange = e => {
        setTo(moment(e).set(endDateConfig).toISOString())
    }

    const handleChangeMode = (m) => {
        setMode(m)
    }

    useEffect(() => {
        fetchBankList()
    }, [])

    useEffect(() => {
        fetchBalance()
    }, [from, to])

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

    const fetchBalance = () => {
        dispatch({
            type: commonTypes.ShowBackdropLoading,
            payload: true
        })
        getBalance(from, to)
            .then(res => {
                dispatch({
                    type: commonTypes.ShowBackdropLoading,
                    payload: false
                })
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {

                    const temp = _.get(res, 'data.result') || []
                    temp.forEach(item => {
                        item['balance'] = item.balances && item.balances.sort((a, b) => new Date(b.date) - new Date(a.date))[0]
                    })
                    setTotal(temp.reduce(function (acc, obj) { return acc + obj.balance.balance; }, 0))
                    setBalance(temp)

                    dispatch({
                        type: actionTypes.SetBalanceList,
                        payload: _.get(res, 'data.result') || []
                    })
                }
            })
            .catch(err => {
                dispatch({
                    type: commonTypes.ShowBackdropLoading,
                    payload: false
                })
            })
    }

    useEffect(() => {
        if (from && to) {
            history.push(`/finance-overview?from=${from}&to=${to}&mode=${mode}`)
        }
    }, [from, to])

    const columns = [
        {
            label: 'Tên tài khoản',
            property: 'account_author',
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
            label: 'Ngày nhập',
            property: 'created',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Tên ngân hàng',
            property: 'bank_name',
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

    const handleInputBalance = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        addBalance(
            values.bank.name,
            values.bank._id,
            values.bank_account.accountName,
            values.bank_account.accountNumber,
            values.balance.trim(),
            moment(values.date).utc().toISOString()
        )
            .then(res => {
                setSubmitting(false);
                resetForm()
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setStatus(errMsg)
                }
                else {
                    fetchBalance()
                    setCreateBankPopup(false)
                }
            })
            .catch(() => {
                resetForm()
                setSubmitting(false);
                setStatus('Some thing went wrong');
            });
    }

    const handleRemoveRecipients = (data) => {
        setRecipients(recipients => recipients.filter(r => r !== data));
    }
    const handleInputRecipient = (event) => {
        setRecipientStatus('')
        if (event.keyCode === 13 && recipient) {
            if (isValidEmail(recipient)) {
                if (!recipients.includes(recipient)) {
                    const temp = [...recipients]
                    temp.push(recipient)
                    setRecipients(temp);
                    setRecipient('')
                }
                else {
                    setRecipient('')
                }
            }
            else {
                setRecipientStatus(`${recipient} is not an email`)
            }
        }
    }

    const handleSendReport = () => {
        if (recipients.length > 0) {
            setRecipientLoading(true)
            setRecipientStatus('')
            sendReport(recipients)
                .then(res => {
                    const errMsg = _.get(res, 'data.errMsg')
                    setRecipientLoading(false)
                    if (!errMsg) {
                        setFinanceReportPopup(false)
                        setRecipients(['ngoc@ecomeasy.asia', 'nhung@ecomeasy.asia'])
                    }
                    else {
                        setRecipientStatus(errMsg)
                    }
                })
                .catch(err => {
                    setRecipientLoading(false)
                    setRecipientStatus('Something went wrong')
                })
        }
        else {
            setRecipientStatus('Empty recipients')
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <Grid container spacing={0} style={{
                    justifyContent: 'space-between'
                }}>
                    <Grid item>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <p className={classes.headerTitle}>Báo cáo tài chính</p>
                        </div>
                    </Grid>
                    <Grid item style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <RangeDatePicker setFrom={handleStartDateChange}
                            isShowDateSelection={true}
                            setMode={handleChangeMode}
                            setTo={handleEndDateChange}
                            from={from ? new Date(from) : null}
                            to={to ? new Date(to) : null} mode={mode} />
                    </Grid>
                </Grid>
            </div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '30px 0 15px 0'
            }}>
                <p style={{
                    fontSize: 24,
                    fontWeight: 800,
                    margin: 0
                }}>{`Tổng: ${parseLocaleString(total)}`}</p>
                <div>
                    <Button onClick={() => setCreateBankPopup(true)} className="btn-base btn-base--success" >Input Balance</Button>
                    <Button style={{
                        marginLeft: 15
                    }} onClick={() => setFinanceReportPopup(true)} className="btn-base btn-base--success" >Send Report</Button>
                </div>
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
                            balance && balance.length > 0 && balance.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {_.get(row, 'balances[0].accountName')}
                                    </TableCell>
                                    <TableCell>
                                        {_.get(row, 'balances[0].accountNumber')}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            <p style={{
                                                margin: '5px 0'
                                            }}>{parseLocaleString(_.get(row, 'balance.balance'))}</p>

                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            <p style={{
                                                margin: '5px 0'
                                            }}>{moment(row.balances && row.balances.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date).format('MM/DD/YYYY')}</p>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {_.get(row, 'balances[0].bankName')}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Link to={`account_number/${row._id}`}><Icon>edit</Icon></Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
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
                                enableReinitialize
                                initialValues={{
                                    bank: '',
                                    bank_account: '',
                                    balance: '',
                                    date: moment().format('YYYY-MM-DD')
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.bank) {
                                        errors.bank = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    if (!values.bank_account) {
                                        errors.bank_account = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    if (!values.balance) {
                                        errors.balance = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    else if (!Number(values.balance)) {
                                        errors.balance = 'Invalid number';
                                    }
                                    if (!values.date) {
                                        errors.date = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleInputBalance}
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
                                            <FormGroup variant="outlined" className="dropdown" style={{
                                                marginBottom: 30,
                                                textAlign: 'left'
                                            }}>
                                                <InputLabel>Ngân hàng</InputLabel>
                                                <Select
                                                    name="bank"
                                                    value={values.bank}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={touched.bank && errors.bank}
                                                    error={Boolean(touched.bank && errors.bank)}
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
                                                    {
                                                        _.get(props, 'finance.bankList') && props.finance.bankList.map(item => (
                                                            <MenuItem key={item._id} value={item}>{item.name}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormGroup>
                                            <FormGroup variant="outlined" className="dropdown" style={{
                                                marginBottom: 15,
                                                textAlign: 'left'
                                            }}>
                                                <InputLabel>Số tài khoản</InputLabel>
                                                <Select
                                                    name="bank_account"
                                                    value={values.bank_account}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    helperText={touched.bank_account && errors.bank_account}
                                                    error={Boolean(touched.bank_account && errors.bank_account)}
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
                                                    {
                                                        _.get(props, 'finance.bankList') && _.get(props, 'finance.bankList')
                                                            .find(item => item._id === values.bank._id)
                                                        && _.get(props, 'finance.bankList')
                                                            .find(item => item._id === values.bank._id).accounts.map((item, index) => (
                                                                <MenuItem key={index} value={item}>{item.accountNumber}</MenuItem>
                                                            ))
                                                    }
                                                </Select>
                                            </FormGroup>
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
                                                    error={Boolean(touched.banbalance && errors.balance)}
                                                /></FormGroup>
                                            <FormGroup className="input-base">
                                                <TextField
                                                    name="date"
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="date"
                                                    placeholder="Date"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.date}
                                                    helperText={touched.date && errors.date}
                                                    error={Boolean(touched.bank && errors.date)}
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
                                                    setCreateBankPopup(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={financeReportPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setFinanceReportPopup(false)}
            >
                <DialogContent>
                    <div style={{
                        padding: '15px 30px'
                    }}>
                        <div className={classes.selectedEmail}>
                            {recipientStatus && <div style={{
                                marginBottom: 10
                            }} role="alert" className="alert alert-danger">
                                <div className="alert-text">{recipientStatus}</div>
                            </div>}
                            <ul className={`${classes.recipientsList} clearfix`}>
                                {
                                    recipients && recipients.map(item => (
                                        <li className={classes.recipient}>
                                            <Chip
                                                label={item}
                                                onDelete={() => handleRemoveRecipients(item)}
                                            />
                                        </li>
                                    ))
                                }
                                <li style={{
                                    padding: '0 10px'
                                }}><TextField style={{
                                    width: '100%',
                                }}
                                    value={recipient}
                                    onChange={e => setRecipient(e.target.value)}
                                    id="recipient"
                                    label="Email"
                                    onKeyUp={e => handleInputRecipient(e)} /></li>
                            </ul>
                        </div>
                        <div style={{
                            textAlign: 'center'
                        }}><Button
                            onClick={handleSendReport}
                            className={`btn-base btn-base--success ${clsx(
                                {
                                    "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": recipientLoading
                                }
                            )}`}>Submit</Button></div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const mapStateToProps = store => ({
    finance: store.finance
});

export default injectIntl(
    connect(mapStateToProps)(FinanceOverview)
);
