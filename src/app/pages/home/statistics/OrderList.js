import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableCell, TableBody, ButtonGroup, Dialog, DialogContent,
    Button, TablePagination, CircularProgress, TableRow, Avatar, FormGroup, TextField
} from '@material-ui/core';
import _ from "lodash"
import { connect } from "react-redux";
import { getOrders } from "../../../crud/statitics.crud"
import { parseLocaleString, getSendoOrderLabel } from "../../../helpers/helper"
import { MARKET_PLACE } from "../../../constant/marketplace"
import UploadPage from '../UploadPage'
import { FILE_COLLUMNS_CONFIG } from '../UploadPage'
import { globalStyles } from '../../../styles/globalStyles'
import FormEntry from '../FormEntry'
import { useHistory, useLocation, useParams } from "react-router-dom";
import { actionTypes as brandTypes } from '../../../store/ducks/brand.duck'
import { useDispatch } from 'react-redux';
import { getBrandDetail, getBrandList } from '../../../crud/brand.crud';
import { Link } from "react-router-dom";
import clsx from "clsx"
import { Formik } from "formik";

OrderList.propTypes = {

};

export const colSetting = {
    lazada: ['order_id', 'created_at', 'eceOrderDate', 'syncDate', 'updated_at', 'ecePrice', 'price', 'shipping_fee',
        'shipping_fee_discount_platform', 'shipping_fee_discount_seller', 'shipping_fee_original', 'voucher', 'voucher_platform', 'voucher_seller'],
    tiki: ['_id', 'created_at', 'syncDate', 'updated_at', 'invoice.grand_total', 'invoice.collectible_amount', 'invoice.shipping_amount_after_discount',
        'invoice.subtotal', 'invoice.total_seller_fee', 'invoice.total_seller_income'],
    shopee: ['_id', 'create_time', 'update_time', 'note_update_time', 'pay_time', 'ship_by_date', 'order_status', 'total_amount', 'escrow_amount', 'escrow_tax', 'estimated_shipping_fee'],
    sendo: ['sales_order.order_number', 'syncDate', , 'eceOrderDate', 'sales_order.sub_total', 'sales_order.total_amount', 'sales_order.total_amount_buyer', 'sales_order.order_status']
}

export const useStyles = makeStyles({
    root: {
        '& tr': {
            '&:nth-child(even)': {
                background: 'rgba(140, 160, 179, 0.1)'
            }
        },
        '& td': {
            whiteSpace: 'nowrap'
        }
    },
    sourceFilterBtnGroup: {
        '& button': {
            color: '#333',
            fontWeight: 400
        },
        '& .active': {
            background: '#ebebeb',
            fontWeight: 800
        },
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
        margin: '0 15px 30px 0'
    },
    filterSection: {
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    createRoleForm: {
        padding: '30px',
        width: 600,
        textAlign: 'center',
        '& .kt-spinner--right:before': {
            right: 15
        },
    },
    createRoleFormContainer: {
        width: 350,
        margin: '0 auto'
    },
    formLegend: {
        color: '#014B68',
        fontSize: 20,
        marginBottom: 15
    },
    tablePagination: {
        marginTop: 15,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    ...globalStyles
})

function OrderList(props) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [shops, setShops] = useState([])
    const [brandList, setBrandList] = useState([])
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState([])
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [count, setCount] = useState(0)
    const [addOrderPopup, setAddOrderPopup] = useState(false)
    const [uploadSourcePopup, setUploadSourcePopup] = useState(false)
    const [formEntryPopup, setFormEntryPopup] = useState(false)
    const [gridRow, setGridRow] = useState([])
    const [gridCol, setGridCol] = useState([])
    const search = useLocation().search
    let history = useHistory()
    const paramsBrandId = useParams().brandId
    const paramsShopId = useParams().shopId
    const paramsSource = useParams().source
    const from = _.get(props, 'brand.filter.from')
    const to = _.get(props, 'brand.filter.to')
    const mode = _.get(props, 'brand.filter.mode')
    const { intl } = props;

    useEffect(() => {
        paramsBrandId && dispatch({
            type: brandTypes.ChangeBrand,
            payload: paramsBrandId
        })
        paramsShopId && dispatch({
            type: brandTypes.ChangeShop,
            payload: paramsShopId
        })
        paramsSource && dispatch({
            type: brandTypes.ChangeSource,
            payload: paramsSource
        })
    }, [])

    const changeUrl = (brandId, shopId, source) => {
        history.push(`/dashboard/orders/${brandId}/${shopId}/${source}?from=${from}&to=${to}&mode=${mode}`)
    }

    const brandId = _.get(props, 'brand.selectedBrand')
    const currentShop = _.get(props, 'brand.selectedShop')
    const currentSource = _.get(props, 'brand.selectedSource')

    useEffect(() => {
        const tempCol = []
        const initialRow = {}
        const tempRow = []
        Object.keys(FILE_COLLUMNS_CONFIG).forEach(item => {
            initialRow[item] = ''
            item && tempCol.push({
                key: item,
                name: FILE_COLLUMNS_CONFIG[item].name,
                resizable: true,
                width: 120,
                editable: function (rowData) {
                    return rowData.allowEdit ? true : false;
                }
            })
        })
        for (let i = 1; i < 50; i++) {
            tempRow.push({ ...initialRow })
        }
        setGridCol(tempCol)
        setGridRow(tempRow)
    }, [])


    useEffect(() => {
        if (_.get(props, 'brand.brandList').length > 0) {
            setBrandList(_.get(props, 'brand.brandList'))
        }
        else {
            getBrandList()
                .then(res => {
                    const result = _.get(res, 'data.result.brands')
                    if (result && result.length > 0) {
                        setBrandList(result)
                        fetchData()
                        dispatch({
                            type: brandTypes.SetBrandList,
                            payload: result
                        })
                    }
                })
        }
    }, [])

    useEffect(() => {
        setPage(0)
        changeUrl(brandId, currentShop, currentSource)
    }, [currentShop, brandId, to, from, mode])

    useEffect(() => {
        changeShop(currentShop, currentSource, 0, limit, from, to)
    }, [from, to, mode])

    useEffect(() => {
        fetchData()
    }, [brandId])

    const fetchData = () => {
        getBrandDetail(brandId)
            .then(res => {
                const shopList = _.get(res, 'data.result.brand.shops')
                if (shopList.length > 0) {
                    setShops(shopList)
                    changeShop(currentShop || _.get(shopList, '[0]._id'), currentSource || _.get(shopList, '[0].marketplace'), page, limit, from, to)
                }
                else {
                    setShops([])
                    setOrders([])
                    setErrorMessage('Brand chưa kết nói dữ liệu')
                }
            })
            .catch(err => {
                setErrorMessage('Brand chưa kết nói dữ liệu')
            })
    }

    const changeShop = (shop, source, p, limit, from, to) => {
        dispatch({
            type: brandTypes.ChangeShop,
            payload: shop
        })
        dispatch({
            type: brandTypes.ChangeSource,
            payload: source
        })
        setErrorMessage('')
        setOrders([])
        setLoading(true)
        getOrders(shop, source, p, limit, from, to, mode)
            .then(res => {
                setLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                const orderList = _.get(res, 'data.result[0].data')
                if (errMsg) {
                    setErrorMessage(errMsg)
                }
                else {
                    setCount(_.get(res, 'data.result[0].metadata[0].total') || 0)
                    if (orderList && orderList.length > 0) {
                        setOrders(orderList)
                    }
                    else {
                        setErrorMessage('Không có order')
                    }
                }
            })
            .catch(err => {
                setLoading(false)
            })
    }

    const changePage = (e, p) => {
        setPage(p)
        changeShop(currentShop, currentSource, p, limit, from, to)
    }

    const changeRowsPerPage = e => {
        setPage(0)
        setLimit(e.target.value)
        changeShop(currentShop, currentSource, 0, e.target.value, from, to)
    }

    const getPropertybySource = (source, row) => {
        let property = []
        let itemCol = ''
        switch (source) {
            case 'shopee':
                property = ['create_time', 'ordersn', 'order_status', 'total_amount']
                itemCol = <React.Fragment>
                    {row['items'] && row['items'].length > 0 && row['items'].map((item, sindex) => (
                        <p key={sindex} style={{
                            margin: 0,
                            whiteSpace: 'nowrap'
                        }}>{item['item_name']}</p>
                    ))}
                </React.Fragment>
                break;
            case 'lazada':
                property = ['created_at', 'order_number', 'statuses', 'ecePrice']
                itemCol = <React.Fragment>
                    {row['items'] && row['items'].length > 0 && row['items'].map((item, sindex) => (
                        <p key={sindex} style={{
                            margin: 0,
                            whiteSpace: 'nowrap'
                        }}>{item['name']}</p>
                    ))}
                </React.Fragment>
                break;
            case 'tiki':
                property = ['created_at', 'code', 'status', 'invoice.grand_total']
                itemCol = <React.Fragment>
                    {row['items'] && row['items'].length > 0 && row['items'].map((item, sindex) => (
                        <p key={sindex} style={{
                            margin: 0,
                            whiteSpace: 'nowrap'
                        }}>{_.get(item, 'product.name')}</p>
                    ))}
                </React.Fragment>
                break;
            case 'sendo':
                property = ['created_at', 'code', 'status', 'invoice.grand_total']
                itemCol = <React.Fragment>
                    {row['sku_details'] && row['sku_details'].length > 0 && row['sku_details'].map((item, sindex) => (
                        <p key={sindex} style={{
                            margin: 0,
                            whiteSpace: 'nowrap'
                        }}>{_.get(item, 'product_name')}</p>
                    ))}
                </React.Fragment>
                break;
            default:
                property = ['Date_Request', 'Order_Number', 'Status', 'Paid_Price']
                itemCol = <React.Fragment><p style={{
                    margin: 0
                }}>{row['Item_Name']}</p></React.Fragment>
                break;
        }
        return { property, itemCol }
    }

    const gotoPage = (values, { setStatus, setSubmitting, resetForm }) => {
        setPage(values.gotoPage - 1)
        changeShop(currentShop, currentSource, values.gotoPage - 1, limit, from, to)
        resetForm()
    }

    return (
        <div className={classes.root}>
            <div style={{
                margin: '30px 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <ButtonGroup aria-label="outlined button group" className={classes.sourceFilterBtnGroup}>
                    {
                        shops.map(shop => (
                            <Button
                                style={{
                                    padding: '12px 15px'
                                }}
                                onClick={() => changeShop(shop._id, shop.marketplace, 0, 10, from, to)}
                                className={shop._id === currentShop ? 'active' : ''}
                                key={shop._id}><Avatar variant="square" style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 10
                                }} src={MARKET_PLACE[shop.marketplace] && MARKET_PLACE[shop.marketplace].image}></Avatar><span>{shop.name || shop.marketplace}</span></Button>
                        ))
                    }
                </ButtonGroup>
                {
                    (currentSource === MARKET_PLACE.others.key || currentSource === MARKET_PLACE.googleSheet.key) &&
                    <Button
                        onClick={() => setAddOrderPopup(true)}
                        className="btn-base btn-base--success" >Add more orders</Button>
                }


            </div>
            <div style={{
                maxWidth: '100%',
                overflow: 'auto'
            }} className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        {
                            (currentSource === MARKET_PLACE.others.key || currentSource === MARKET_PLACE.googleSheet.key) || colSetting[currentSource] && colSetting[currentSource].map((key, index) => (
                                key && <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                    align="left" key={index}>{key}</TableCell>
                            ))
                        }
                        {
                            (currentSource === MARKET_PLACE.others.key || currentSource === MARKET_PLACE.googleSheet.key) && gridCol.map((col, index) => (
                                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                    align="left" key={index}>{col && col.name}</TableCell>
                            ))
                        }
                        {
                            currentSource === MARKET_PLACE.sendo.key &&
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left">Trạng thái</TableCell>
                        }
                        <TableCell style={{
                            width: 250
                        }} className={`${classes.tableHeader} ${classes.tableCell}`}>Products</TableCell>
                    </TableHead>
                    <TableBody>
                        {(currentSource === MARKET_PLACE.others.key || currentSource === MARKET_PLACE.googleSheet.key) || orders && orders.length > 0 && orders.map((row, index) => (
                            <TableRow key={index}>
                                {
                                    colSetting[currentSource] && colSetting[currentSource].map((key, index) => (
                                        <TableCell key={key}>{_.get(row, `${key}`)}</TableCell>
                                    ))
                                }
                                {
                                    currentSource === MARKET_PLACE.sendo.key &&
                                    <TableCell><span style={{
                                        whiteSpace: 'nowrap'
                                    }}>{getSendoOrderLabel(_.get(row, 'sales_order.order_status'))}</span></TableCell>
                                }
                                <TableCell>{getPropertybySource(currentSource, row).itemCol}</TableCell>
                            </TableRow>
                        ))}
                        {(currentSource === MARKET_PLACE.others.key || currentSource === MARKET_PLACE.googleSheet.key) && orders && orders.map((row, index) => (
                            <TableRow key={index}>
                                {
                                    Object.keys(FILE_COLLUMNS_CONFIG).map(key => (
                                        <TableCell key={key}>{FILE_COLLUMNS_CONFIG[key] && row[FILE_COLLUMNS_CONFIG[key].name]}</TableCell>
                                    ))
                                }
                                <TableCell>{getPropertybySource(currentSource, row).itemCol}</TableCell>
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
            <div className={classes.tablePagination}>
                <div style={{
                    marginRight: 15
                }}>
                    <Formik
                        initialValues={{
                            gotoPage: '',
                        }}
                        validate={values => {
                            const errors = {};
                            if (values.gotoPage !== '' && !Number(values.gotoPage)) {
                                errors.gotoPage = "Invalid page"
                            }
                            else if (Number(values.gotoPage > Math.ceil(count / limit))) {
                                errors.gotoPage = `Max page is ${Math.ceil(count / limit)}`
                            }
                            return errors;
                        }}
                        onSubmit={gotoPage}
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
                                <form style={{
                                    display: 'flex'
                                }} onSubmit={handleSubmit} noValidate>
                                    {status && <div role="alert" className="alert alert-danger">
                                        <div className="alert-text">{status}</div>
                                    </div>}
                                    <FormGroup style={{
                                        width: 100,
                                        marginRight: 10
                                    }}>
                                        <TextField
                                            required
                                            fullWidth
                                            type="text"
                                            placeholder="Page"
                                            name="gotoPage"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.gotoPage}
                                            helperText={touched.gotoPage && errors.gotoPage}
                                            error={Boolean(touched.gotoPage && errors.gotoPage)}
                                        />
                                    </FormGroup>
                                    <Button type="submit">Go</Button>

                                </form>
                            )}
                    </Formik>
                </div>
                <TablePagination
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                    component="div"
                    count={count}
                    rowsPerPage={limit}
                    page={page}
                    SelectProps={{
                        native: false,
                    }}
                ></TablePagination>
            </div>
            <Dialog
                open={addOrderPopup}
                keepMounted
                onClose={() => setAddOrderPopup(false)}
                maxWidth="sm"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <div style={{
                        textAlign: 'center',
                        width: 350
                    }}>
                        <div style={{
                            marginTop: 30,
                            marginBottom: 15
                        }}>
                            <Button onClick={() => {
                                setAddOrderPopup(false)
                                setFormEntryPopup(true)
                            }} className="btn-base btn-base--success" >Form Entry</Button>
                        </div>
                        <div style={{
                            marginBottom: 45
                        }}>
                            <Button
                                onClick={() => {
                                    setAddOrderPopup(false)
                                    setUploadSourcePopup(true)
                                }}
                                className="btn-base btn-base--success" >Upload File</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={uploadSourcePopup}
                keepMounted
                fullWidth={true}
                onClose={() => setUploadSourcePopup(false)}
                maxWidth="sm"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <UploadPage
                        onDone={() => {
                            changeShop(currentShop, currentSource, 0, limit, from, to)
                            setUploadSourcePopup(false)
                        }}
                        flag={uploadSourcePopup} brand={brandId} source={currentShop} />
                </DialogContent>
            </Dialog>
            <Dialog
                open={formEntryPopup}
                keepMounted
                fullWidth={true}
                onClose={() => setFormEntryPopup(false)}
                maxWidth="lg"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <FormEntry onDone={() => {
                        changeShop(currentShop, currentSource, 0, limit, from, to)
                        setFormEntryPopup(false)
                    }} brand={brandId} source={currentShop} />
                </DialogContent>
            </Dialog>
        </div >
    );
}

const mapStateToProps = store => ({
    brand: store.brand
});

export default connect(mapStateToProps)(OrderList);

