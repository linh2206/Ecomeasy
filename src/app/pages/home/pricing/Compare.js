import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableCell, TableBody, Button, Dialog, DialogContent,
    CircularProgress, TableRow, FormGroup, Select, MenuItem, TextField, Link, ButtonGroup, Grid, Icon, Chip
} from '@material-ui/core';
import { parseLocaleString } from '../../../helpers/helper'
import { Line } from 'react-chartjs-2';
import _ from "lodash"
import { Formik } from "formik";
import clsx from "clsx";
import { injectIntl } from "react-intl";
import { getPricingCategories, addLink, getPricingList, deleteTargetData, getProductGroup } from '../../../crud/pricing.crud'
import { randomColor } from "../../../helpers/helper"
import moment from "moment"
import ConfirmationPopup from "../../../partials/popup/ConfirmationPopup"

Compare.propTypes = {

};

const useStyles = makeStyles({
    root: {
        '& .active': {
            background: '#ebebeb',
            fontWeight: 800
        },
    },
    chartSection: {
        marginTop: 50,
        marginBottom: 50,
        height: 500,
    },
    ...globalStyles,
    actionSection: {
        marginBottom: 30,
        display: 'flex',
        justifyContent: 'space-between',
        '& .btn-chip': {
            display: 'none'
        }
    }
})

const chartData = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                pointHighlightStroke: 'rgba(220,220,220,1)',
                data: [65, 59, 80, 81, 56, 55, 40],
                fill: false,
                lineTension: 0.5,
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 5,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                borderColor: 'purple'
            },
            {
                label: 'My Second dataset',
                data: [28, 48, 40, 19, 86, 27, 90],
                fill: false,
                lineTension: 0.5,
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 5,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                borderColor: 'green'
            },
        ]
    }
    return data
}

function Compare(props) {
    const classes = useStyles()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [pricingList, setPricingList] = useState('')
    const { intl } = props;
    const [addLinkDialog, setAddLinkDialog] = useState(false)
    const [categories, setCategories] = useState([])
    const [filterCategory, setFilterCategory] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [chartData, setChartData] = useState([])
    const [selectedTarget, setSelectedTarget] = useState({})
    const [deleteConfirmationPopup, setDeleteConfirmationPopup] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [selectedData, setSelectedData] = useState('')
    const [chartTarget, setChartTarget] = useState([])
    const [groupContent, setGroupContent] = useState([{
        link: '',
        productName: ''
    }])
    const [groupFormInit, setGroupFormInit] = useState({})
    const [groupFormValidation, setGroupFormValidation] = useState({})

    const options = {
        scaleShowGridLines: true,
        scaleGridLineColor: 'rgba(0,0,0,.05)',
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve: true,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: true,
        maintainAspectRatio: false,
        legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',
    }

    const baseConfig = {
        fill: false,
        lineTension: 0.5,
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 5,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
    }

    const columns = [
        {
            label: 'Original Price',
            property: 'originPrice',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Current Price',
            property: 'currentPrice',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Stock',
            property: 'stock',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Sold',
            property: 'sold',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Created',
            property: 'createdBy',
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
        getProductGroup()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setCategories(_.get(res, 'data.result') || [])
                    setFilterCategory(_.get(res, 'data.result[0]._id'))
                    setSelectedCategory(_.get(res, 'data.result[0]._id'))
                }
            })
    }, [])

    const isValidShopeeLink = txt => {
        return txt.split('shopee.vn/') && txt.split('shopee.vn/').length === 2
    }

    useEffect(() => {
        filterCategory && fetchPricingList()
    }, [filterCategory])

    useEffect(() => {
        visualizeChartData(pricingList)
    }, [chartTarget])

    const visualizeChartData = (targets) => {
        let data = []
        let label = []
        targets && targets.length > 0 && targets.forEach(item => {
            chartTarget.indexOf(item._id) >= 0 && item.data && item.data.length > 0 && item.data.forEach(subItem => {
                if (label.indexOf(moment(subItem.created).format('MM/DD/YYYY')) < 0) {
                    label.push(moment(subItem.created).format('MM/DD/YYYY'))
                }
            })
        });
        label.sort((a, b) => new Date(a) - new Date(b))
        targets && targets.length > 0 && targets.forEach(item => {
            if (chartTarget.indexOf(item._id) >= 0) {
                let dataset = {
                    label: _.get(item, 'productDetail[0].productName') || item._id,
                    borderColor: randomColor(),
                    data: new Array(label.length).fill(0)
                }
                item.data && item.data.length > 0 && item.data.forEach(subItem => {
                    if (subItem.currentPrice) {
                        dataset.data[label.indexOf(moment(subItem.created).format('MM/DD/YYYY'))] = subItem.currentPrice
                    }
                })
                dataset = {
                    ...dataset,
                    ...baseConfig
                }
                data.push(dataset)
            }
        });

        setChartData({
            labels: label,
            datasets: data
        })
    }

    useEffect(() => {
        if (pricingList && pricingList.length > 0 && pricingList.find(i => i._id === selectedTarget._id) &&
            pricingList.find(i => i._id === selectedTarget._id).data && pricingList.find(i => i._id === selectedTarget._id).data.length > 0) {
            setErrorMessage('')
        }
        else {
            setErrorMessage('Empty')
        }
    }, [selectedTarget])

    const fetchPricingList = () => {
        setErrorMessage('')
        setLoading(true)
        setPricingList([])
        getPricingList(filterCategory)
            .then(res => {
                setLoading(false)
                const result = _.get(res, 'data.result')
                if (_.get(res, 'data.errMsg')) {
                    setErrorMessage(_.get(res, 'data.errMsg'))
                }
                else {
                    result && result.length === 0 && setErrorMessage('Không có dữ liệu')
                    setPricingList(_.get(res, 'data.result') || [])
                    setSelectedTarget(selectedTarget._id ? selectedTarget : _.get(res, 'data.result[0]'))
                    setChartTarget(chartTarget.length === 0 ? [_.get(res, 'data.result[0]._id')] : chartTarget)
                    visualizeChartData(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setLoading(false)
                setErrorMessage('Something went wrong')
            })
    }

    const handleAddLink = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        addLink(
            selectedCategory,
            values.link,
            values.productName.trim()
        )
            .then(res => {
                setSubmitting(false);
                resetForm()
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setStatus(errMsg)
                }
                else {
                    fetchPricingList()
                    setAddLinkDialog(false)
                }
            })
            .catch(() => {
                resetForm()
                setSubmitting(false);
                setStatus('Some thing went wrong');
            });
    }

    const handleCloseDeleteConfirmationPopup = () => {
        setDeleteConfirmationPopup(false)
        setDeleteLoading(false)
        setSelectedData('')
    }

    const handleRemoveData = () => {
        setDeleteLoading(true)
        deleteTargetData(selectedTarget._id, selectedData)
            .then(res => {
                fetchPricingList()
                setDeleteConfirmationPopup(false)
                setDeleteLoading(false)
            })
            .catch(err => {
                setDeleteConfirmationPopup(false)
                setDeleteLoading(false)
            })
    }
    const handleChangeChartFilter = item => {
        let indexOf = chartTarget.indexOf(item._id)
        if (indexOf < 0) {
            setChartTarget(chartTarget => {
                const temp = [...chartTarget]
                temp.push(item._id)
                return temp
            })
        }
        else {
            setChartTarget(chartTarget => {
                const temp = [...chartTarget]
                temp.splice(indexOf, 1)
                return temp
            })
        }
    }

    const addGroup = () => {
        let temp = [...groupContent]
        temp.push({
            link: '',
            productName: ''
        })
        setGroupContent(temp)
    }

    const removeGroup = index => {
        let temp = [...groupContent]
        temp.splice(index, 1)
        setGroupContent(temp)
    }

    useEffect(() => {
        const initVal = {}
    }, [groupContent])

    return (
        <div className={classes.root}>
            <p className={classes.headerTitle}>Compare</p>
            <div className={classes.actionSection}>
                <FormGroup style={{
                    minWidth: 200
                }} variant="outlined" className="dropdown">
                    <Select
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between'
                        }}
                        value={filterCategory}
                        onChange={e => {
                            setSelectedTarget({})
                            setFilterCategory(e.target.value)
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
                        {
                            categories.map((item, index) => (
                                <MenuItem className="flexbox-menu" key={index} value={item._id}>
                                    <span>{_.get(item, 'groupName')}</span>
                                    {/* <a style={{
                                        marginLeft: 10
                                    }}
                                        onClick={e => {
                                            e.preventDefault()
                                            setAddLinkDialog(true)
                                        }}
                                        className="btn-chip">Edit</a> */}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormGroup>
            </div>
            {pricingList && pricingList.length > 0 && <div style={{
                marginBottom: 30
            }}>
                <ButtonGroup>{
                    pricingList.map((item, index) => (
                        <Button
                            onClick={() => handleChangeChartFilter(item)}
                            className={chartTarget.indexOf(item._id) < 0 ? '' : 'active'}
                            key={index}>{_.get(item, 'productDetail[0].productName') || item._id}</Button>
                    ))
                }</ButtonGroup>
            </div>
            }
            <div className={classes.chartSection}>
                <Line data={chartData} options={options} height={"500px"} />
            </div>
            {pricingList && pricingList.length > 0 && <div style={{
                marignTop: 30,
                marginBottom: 30
            }}>
                <ButtonGroup>{
                    pricingList.map((item, index) => (
                        <Button
                            onClick={() => setSelectedTarget(item)}
                            className={item._id === selectedTarget._id ? 'active' : ''}
                            key={index}>{_.get(item, 'productDetail[0].productName') || item._id}</Button>
                    ))
                }</ButtonGroup>
            </div>
            }
            <div>
                <p>Link: <a href={_.get(selectedTarget, 'productDetail[0].link')} target="_blank">{_.get(selectedTarget, 'productDetail[0].productName')}</a></p>
            </div>
            <div className={`${classes.datatable} brand-list`} style={{
                marginBottom: 30
            }}>
                <Table aria-label="simple table">
                    <TableHead>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {pricingList && pricingList.find(i => i._id === selectedTarget._id) &&

                            pricingList.find(i => i._id === selectedTarget._id).data.sort((a, b) => new Date(b.created) - new Date(a.created)).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{parseLocaleString(row.originPrice)}</TableCell>
                                    <TableCell>{parseLocaleString(row.currentPrice)}</TableCell>
                                    <TableCell>{parseLocaleString(row.stock)}</TableCell>
                                    <TableCell>{parseLocaleString(row.sold)}</TableCell>
                                    <TableCell>{row.created}</TableCell>
                                    <TableCell><Button onClick={() => {
                                        setSelectedData(row._id)
                                        setDeleteConfirmationPopup(true)
                                    }}>Delete</Button></TableCell>
                                </TableRow>
                            ))}
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
                open={addLinkDialog}
                onClose={() => setAddLinkDialog(false)}
                keepMounted
                maxWidth="xl">
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    gorup: '',
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.group) {
                                        errors.group = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    if (!values.link) {
                                        errors.link = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    else if (!isValidShopeeLink(values.link)) {
                                        errors.link = "Invalid link. Ex: https://shopee.vn/product123"
                                    }
                                    if (!values.productName.trim()) {
                                        errors.productName = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    return errors
                                }}
                                onSubmit={handleAddLink}
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

                                            {/* <FormGroup variant="outlined" className="dropdown" style={{
                                                marginBottom: 30
                                            }}>
                                                <Select
                                                    value={selectedCategory}
                                                    onChange={e => setSelectedCategory(e.target.value)}
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
                                                        categories.map((item, index) => (
                                                            <MenuItem key={index} value={item.key}>{_.get(item, 'name.vn')}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormGroup> */}
                                            <FormGroup style={{
                                                marginBottom: 30
                                            }} className="input-base">
                                                <TextField
                                                    style={{
                                                        margin: 0
                                                    }}
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    name="group"
                                                    placeholder="Group Name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.group}
                                                    helperText={touched.group && errors.group}
                                                    error={Boolean(touched.group && errors.group)}
                                                />
                                            </FormGroup>
                                            {
                                                groupContent.map((item, index) => (
                                                    <div style={{
                                                        position: 'relative',
                                                        marginBottom: 15,
                                                    }}>
                                                        <div style={{
                                                            position: 'absolute',
                                                            top: '50%',
                                                            transform: 'translateY(-50%)',
                                                            left: `${index === groupContent.length - 1 ? '-60px' : '-38px'}`,
                                                        }}>
                                                            {
                                                                index === groupContent.length - 1 &&
                                                                <Icon
                                                                    onClick={addGroup}
                                                                    style={{
                                                                        color: 'green',
                                                                        cursor: 'pointer'
                                                                    }}

                                                                >add_icon</Icon>
                                                            }
                                                            {
                                                                groupContent.length > 1 && <Icon
                                                                    onClick={() => removeGroup(index)}
                                                                    style={{
                                                                        marginLeft: 5,
                                                                        color: 'red',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >delete_icon</Icon>
                                                            }

                                                        </div>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={6}>
                                                                <FormGroup className="input-base">
                                                                    <TextField
                                                                        style={{
                                                                            margin: 0
                                                                        }}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        required
                                                                        name="productName"
                                                                        placeholder="Product Name"
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        value={values.productName}
                                                                        helperText={touched.productName && errors.productName}
                                                                        error={Boolean(touched.productName && errors.productName)}
                                                                    />
                                                                </FormGroup>
                                                            </Grid>
                                                            <Grid item xs={6}>
                                                                <FormGroup className="input-base">
                                                                    <TextField
                                                                        style={{
                                                                            margin: 0
                                                                        }}
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        required
                                                                        name="link"
                                                                        placeholder="Link"
                                                                        onBlur={handleBlur}
                                                                        onChange={handleChange}
                                                                        value={values.link}
                                                                        helperText={touched.link && errors.link}
                                                                        error={Boolean(touched.link && errors.link)}
                                                                    />
                                                                </FormGroup>
                                                            </Grid>
                                                        </Grid>
                                                    </div>

                                                ))
                                            }
                                            <Button style={{
                                                marginTop: 15,
                                                width: '100%'
                                            }}
                                                disabled={isSubmitting}
                                                onClick={handleSubmit}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                                                    }
                                                )}`}>Add</Button>
                                            <div style={{
                                                textAlign: 'center'
                                            }}><Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block',
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setAddLinkDialog(false)
                                                }}>Cancel</Link>
                                            </div>

                                        </form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <ConfirmationPopup
                message="Bạn có chắc chắn xóa ?"
                open={deleteConfirmationPopup}
                onClose={handleCloseDeleteConfirmationPopup}
                loading={deleteLoading}
                onOK={handleRemoveData} />
        </div>
    );
}

export default injectIntl(Compare);