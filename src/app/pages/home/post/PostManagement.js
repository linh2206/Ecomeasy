import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup, CircularProgress,
    Button, TableBody, Icon, Dialog, DialogContent, TextField
} from '@material-ui/core';

import { createPost, getPostList } from '../../../crud/landing.crud'
import clsx from "clsx"
import { Formik } from "formik";
import { Link } from "react-router-dom";
import _ from "lodash"
import { injectIntl } from "react-intl";
import { connect, useDispatch } from "react-redux";
import moment from 'moment'

PostManagement.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function PostManagement(props) {
    const classes = useStyles()
    const [createPostPopup, setCreatePostPopup] = useState(false)
    const [postList, setPostList] = useState([])
    const [fetchPostListLoading, setFetchPostListLoading] = useState(false)
    const { intl } = props;
    const columns = [
        {
            label: 'Name',
            property: 'name',
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

    const handleCreatePost = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        setTimeout(() => {
            createPost(
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

    useEffect(() => {
        fetchPostList()
    }, [])

    const fetchPostList = () => {
        setFetchPostListLoading(true)
        setPostList([])
        getPostList()
            .then(res => {
                setFetchPostListLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setPostList(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setFetchPostListLoading(false)
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
                <p className={classes.headerTitle}>Danh sách post</p>
                <Button onClick={() => setCreatePostPopup(true)} className="btn-base btn-base--success" >CREATE POST</Button>
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
                            postList.map((row, index) => (
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
                                        <Link to={`/post-detail/${row._id}`}><Icon>edit</Icon></Link>
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
                    (fetchPostListLoading || postList.length === 0) &&
                    <div className="spinner-container">
                        {fetchPostListLoading && <CircularProgress />}
                        {!fetchPostListLoading && postList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
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

const mapStateToProps = store => ({
});

export default injectIntl(
    connect(mapStateToProps)(PostManagement)
);
