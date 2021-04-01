import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup, CircularProgress, Select, Input, MenuItem, Checkbox, ListItemText,
    Button, TableBody, Icon, Dialog, DialogContent, TextField, TextareaAutosize, InputLabel
} from '@material-ui/core';
import clsx from "clsx"
import { Formik } from "formik";
import { Link } from "react-router-dom";
import moment from 'moment'
import { getProductGroup, editGroup, addGroup, getProductPool } from '../../../crud/pricing.crud'
import _ from 'lodash'
import { FormattedMessage, injectIntl } from "react-intl";
Group.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function Group(props) {
    const classes = useStyles()
    const [createPostPopup, setCreateGroupPopup] = useState(false)
    const [groupList, setProductGroup] = useState([])
    const [productList, setProductList] = useState([])
    const [selectedProduct, setSelectedProduct] = useState([])
    const [fetchProductPoolLoading, setFetchProductGroupLoading] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState('')
    const { intl } = props;
    const columns = [
        {
            label: 'Group name',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Description',
            property: 'description',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Product',
            property: 'product',
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
        fetchProductGroup()
        fetchProduct()
    }, [])

    const handleEdit = group => {
        setSelectedGroup(group)
        let p = []
        group.products.forEach(item => productList.find(i => i._id === item) && p.push(productList.find(i => i._id === item)))
        setSelectedProduct(p)
        setCreateGroupPopup(true)
    }

    const fetchProductGroup = () => {
        setFetchProductGroupLoading(true)
        setProductGroup([])
        getProductGroup()
            .then(res => {
                setFetchProductGroupLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setProductGroup(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setFetchProductGroupLoading(false)
            })
    }
    const fetchProduct = () => {
        getProductPool()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setProductList(_.get(res, 'data.result') || [])
                }
            })
    }
    const handleAddGroup = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        let p = []
        if (selectedProduct && selectedProduct.length > 0) {
            selectedProduct.forEach(item => {
                p.push(item._id)
            })
            setSubmitting(true);
            setTimeout(() => {
                addGroup(
                    values.groupName,
                    values.groupDes,
                    p
                )
                    .then(res => {
                        setSubmitting(false);
                        resetForm()
                        const errMsg = _.get(res, 'data.errMsg')
                        if (errMsg) {
                            setStatus(errMsg)
                        }
                        else {
                            fetchProductGroup()
                            setCreateGroupPopup(false)
                        }
                    })
                    .catch(() => {
                        resetForm()
                        setSubmitting(false);
                        setStatus('Some thing went wrong');
                    });
            }, 1000)
        }

        else {
            setStatus('Please select product')
        }
    }

    const handleEditGroup = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        let p = []
        if (selectedProduct && selectedProduct.length > 0) {
            selectedProduct.forEach(item => {
                p.push(item._id)
            })
            setSubmitting(true);
            setTimeout(() => {
                editGroup(
                    values.groupName,
                    values.groupDes,
                    p,
                    selectedGroup._id
                )
                    .then(res => {
                        setSubmitting(false);
                        resetForm()
                        const errMsg = _.get(res, 'data.errMsg')
                        if (errMsg) {
                            setStatus(errMsg)
                        }
                        else {
                            fetchProductGroup()
                            setCreateGroupPopup(false)
                        }
                    })
                    .catch(() => {
                        resetForm()
                        setSubmitting(false);
                        setStatus('Some thing went wrong');
                    });
            }, 1000)
        }

        else {
            setStatus('Please select product')
        }
    }
    return (
        <div className={classes.root}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>Group</p>
                <Button onClick={() => {
                    setSelectedGroup('')
                    setCreateGroupPopup(true)
                    setSelectedProduct([])
                }} className="btn-base btn-base--success" >ADD GROUP</Button>
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
                            groupList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row.groupName}
                                    </TableCell>
                                    <TableCell>
                                        {row.groupDes}
                                    </TableCell>
                                    <TableCell>
                                        {
                                            row.products && row.products.map((item, sIndex) => (
                                                <p key={sIndex} style={{
                                                    margin: 0
                                                }}>{productList.find(i => i._id === item) && productList.find(i => i._id === item).productName}</p>
                                            ))
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {_.get(row, 'user.email')}
                                    </TableCell><TableCell>
                                        {row.created ? moment(row.created).format('MM/DD/YYYY') : ''}
                                    </TableCell>
                                    <TableCell style={{
                                        width: 100
                                    }}>
                                        <Link style={{
                                            cursor: 'pointer'
                                        }} onClick={() => handleEdit(row)}><Icon>edit</Icon></Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    (fetchProductPoolLoading || groupList.length === 0) &&
                    <div className="spinner-container">
                        {fetchProductPoolLoading && <CircularProgress />}
                        {!fetchProductPoolLoading && groupList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                    </div>
                }
            </div>
            <Dialog
                open={createPostPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setCreateGroupPopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    groupName: selectedGroup.groupName || '',
                                    groupDes: selectedGroup.groupDes || '',
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.groupName) {
                                        errors.groupName = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={selectedGroup ? handleEditGroup : handleAddGroup}
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
                                                }}>Group Name</InputLabel>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    name="groupName"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.groupName}
                                                    helperText={touched.groupName && errors.groupName}
                                                    error={Boolean(touched.groupName && errors.groupName)}
                                                /></FormGroup>
                                            <FormGroup className="input-base dropdown">
                                                <InputLabel style={{
                                                    margin: '15px 0',
                                                    textAlign: 'left'
                                                }}>Description</InputLabel>
                                                <TextareaAutosize
                                                    rowsMax={4}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    name="groupDes"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.groupDes}
                                                    helperText={touched.groupDes && errors.groupDes}
                                                    error={Boolean(touched.groupDes && errors.groupDes)}
                                                /></FormGroup>

                                            <FormGroup className="input-base dropdown">
                                                <InputLabel style={{
                                                    margin: '15px 0',
                                                    textAlign: 'left'
                                                }}>Product</InputLabel>
                                                <Select
                                                    labelId="demo-mutiple-checkbox-label"
                                                    id="demo-mutiple-checkbox"
                                                    multiple
                                                    value={selectedProduct}
                                                    onChange={e => setSelectedProduct(e.target.value)}
                                                    input={<Input />}
                                                    renderValue={(selected) => {
                                                        const names = []
                                                        _.forEach(selected, item => {
                                                            names.push(item.productName)
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

                                                    {productList.map((product, index) => (
                                                        <MenuItem key={index} value={product}>
                                                            <Checkbox
                                                                checked={typeof (selectedProduct.find(item => item._id === product._id)) === 'object'} />
                                                            <ListItemText primary={product.productName} />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
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
                                                )}`}>Create Group</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setCreateGroupPopup(false)
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

export default injectIntl(Group);