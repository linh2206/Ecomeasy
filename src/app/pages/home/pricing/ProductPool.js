import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup, CircularProgress,
    Button, TableBody, Icon, Dialog, DialogContent, TextField
} from '@material-ui/core';
import clsx from "clsx"
import { Formik } from "formik";
import { Link } from "react-router-dom";
import moment from 'moment'
import { getProductPool, addProduct } from '../../../crud/pricing.crud'
import _ from 'lodash'
import { FormattedMessage, injectIntl } from "react-intl";

ProductPool.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function ProductPool(props) {
    const classes = useStyles()
    const [createPostPopup, setCreatePostPopup] = useState(false)
    const [productList, setProductPool] = useState([])
    const [fetchProductPoolLoading, setFetchProductPoolLoading] = useState(false)
    const { intl } = props;
    const columns = [
        {
            label: 'Name',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Product origin',
            property: 'product_origin',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Link',
            property: 'link',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Người tạo',
            property: 'author',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày tạo',
            property: 'author',
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
        fetchProductPool()
    }, [])

    const fetchProductPool = () => {
        setFetchProductPoolLoading(true)
        setProductPool([])
        getProductPool()
            .then(res => {
                setFetchProductPoolLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setProductPool(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setFetchProductPoolLoading(false)
            })
    }
    const handleCreatePost = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            addProduct(
                values.productName,
                values.productOriginId,
                values.link,
            )
                .then(res => {
                    setSubmitting(false);
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        fetchProductPool()
                        setCreatePostPopup(false)
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
                <p className={classes.headerTitle}>Product pool</p>
                <Button onClick={() => setCreatePostPopup(true)} className="btn-base btn-base--success" >ADD PRODUCT</Button>
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
                            productList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row.productName}
                                    </TableCell>
                                    <TableCell>
                                        {row.productOriginId}
                                    </TableCell>
                                    <TableCell>
                                        <a href={row.link} target="_blank">{row.link}</a>
                                    </TableCell>
                                    <TableCell>
                                        {_.get(row, 'user.email')}
                                    </TableCell><TableCell>
                                        {row.created ? moment(row.created).format('MM/DD/YYYY') : ''}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        {/* <Link to={`/post-detail/${row._id}`}><Icon>edit</Icon></Link>
                                        <Icon style={{
                                            marginLeft: '15px',
                                            cursor: 'pointer'
                                        }} >delete</Icon> */}
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    (fetchProductPoolLoading || productList.length === 0) &&
                    <div className="spinner-container">
                        {fetchProductPoolLoading && <CircularProgress />}
                        {!fetchProductPoolLoading && productList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                    </div>
                }
            </div>
            <Dialog
                open={createPostPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setCreatePostPopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                initialValues={{
                                    productName: '',
                                    productOriginId: '',
                                    link: '',
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.productName) {
                                        errors.productName = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    if (!values.productOriginId) {
                                        errors.productOriginId = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    if (!values.link) {
                                        errors.link = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleCreatePost}
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
                                                    placeholder="Product Name"
                                                    name="productName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.productName}
                                                    helperText={touched.productName && errors.productName}
                                                    error={Boolean(touched.productName && errors.productName)}
                                                /></FormGroup>
                                            <FormGroup className="input-base">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Product origin Id"
                                                    name="productOriginId"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.productOriginId}
                                                    helperText={touched.productOriginId && errors.productOriginId}
                                                    error={Boolean(touched.productOriginId && errors.productOriginId)}
                                                /></FormGroup>
                                            <FormGroup className="input-base">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Link"
                                                    name="link"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.link}
                                                    helperText={touched.link && errors.link}
                                                    error={Boolean(touched.link && errors.link)}
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
                                                )}`}>Create Post</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setCreatePostPopup(false)
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

export default injectIntl(ProductPool);