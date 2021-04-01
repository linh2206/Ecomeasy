import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup, CircularProgress,
    Button, TableBody, Icon, Dialog, DialogContent, TextField, InputLabel
} from '@material-ui/core';
import { createCampaign, getCampaignList, editCampaign, getCampaignDetail } from '../../../crud/landing.crud'
import clsx from "clsx"
import { Formik } from "formik";
import _ from "lodash"
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import moment from 'moment'
LiveManagement.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function LiveManagement(props) {
    const classes = useStyles()
    const [createCampaignPopup, setCreateCampaignPopup] = useState(false)
    const [editCampaignPopup, setEditCampaignPopup] = useState(false)
    const [campaignList, setCampaignList] = useState([])
    const [fetchCampaignListLoading, setFetchCampaignListLoading] = useState(false)
    const [selectedCampaign, setSelectedCampagin] = useState({})
    const { intl } = props;
    const columns = [
        {
            label: 'Name',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày phát',
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
        fetchCampaignList()
    }, [])

    const handleEditCampaign = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            editCampaign(
                selectedCampaign._id,
                values.outputStream,
                values.slug
            )
                .then(res => {
                    setSubmitting(false);
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        setEditCampaignPopup(false)
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    const handleCreateCampaign = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            createCampaign(
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
                        setCreateCampaignPopup(false)
                        fetchCampaignList()
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }, 1000)
    }

    const fetchCampaignList = () => {
        setFetchCampaignListLoading(true)
        setCampaignList([])
        getCampaignList()
            .then(res => {
                setFetchCampaignListLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setCampaignList(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setFetchCampaignListLoading(false)
            })
    }

    const handleGetCampaignDetail = (id) => {
        console.log(id)
        getCampaignDetail(id)
            .then(res => {
                setSelectedCampagin(_.get(res, 'data.result'))
                setEditCampaignPopup(true)
            })
    }

    return (
        <div className={classes.root}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>Danh sách campaign</p>
                <Button onClick={() => setCreateCampaignPopup(true)} className="btn-base btn-base--success" >CREATE CAMPAIGN</Button>
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
                            campaignList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row.name}
                                    </TableCell>
                                    <TableCell>
                                        {moment(row.created).format('MM/DD/YYYY')}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Link onClick={() => handleGetCampaignDetail(row._id)}><Icon>edit</Icon></Link>
                                        <Icon style={{
                                            marginLeft: '15px',
                                            cursor: 'pointer'
                                        }} >delete</Icon>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    (fetchCampaignListLoading || campaignList.length === 0) &&
                    <div className="spinner-container">
                        {fetchCampaignListLoading && <CircularProgress />}
                        {!fetchCampaignListLoading && campaignList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                    </div>
                }
            </div>
            <Dialog
                open={createCampaignPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setCreateCampaignPopup(false)}
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
                                onSubmit={handleCreateCampaign}
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
                                                    placeholder="Name"
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
                                                )}`}>Create Campaign</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setCreateCampaignPopup(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={editCampaignPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setEditCampaignPopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    outputStream: selectedCampaign.outputStream || '',
                                    slug: selectedCampaign.slug || ''
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.outputStream) {
                                        errors.outputStream = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    if (!values.slug) {
                                        errors.slug = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    else if (values.slug.indexOf(' ') >= 0) {
                                        errors.slug = 'Please remove spaces'
                                    }

                                    else if (values.slug.toLowerCase() !== values.slug) {
                                        errors.slug = 'This field only accepts lowercase letters'
                                    }

                                    return errors;
                                }}
                                onSubmit={handleEditCampaign}
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
                                                <InputLabel style={{
                                                    textAlign: 'left'
                                                }}>Output Stream</InputLabel>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Output Stream"
                                                    name="outputStream"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.outputStream}
                                                    helperText={touched.outputStream && errors.outputStream}
                                                    error={Boolean(touched.outputStream && errors.outputStream)}
                                                /></FormGroup>

                                            <FormGroup className="input-base">
                                                <InputLabel style={{
                                                    marginTop: 15,
                                                    textAlign: 'left'
                                                }}>Slug</InputLabel>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Slug"
                                                    name="slug"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.slug}
                                                    helperText={touched.slug && errors.slug}
                                                    error={Boolean(touched.slug && errors.slug)}
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
                                                    setEditCampaignPopup(false)
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
});


export default injectIntl(
    connect(mapStateToProps)(LiveManagement)
);