import React, { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import PropTypes, { nominalTypeHack } from 'prop-types';
import RevenueCard from '../components/RevenueCard'
import OrderStatusCard from '../components/OrderStatusCard'
import { makeStyles } from '@material-ui/styles';
import {
    Grid, Button, ButtonGroup, Select, MenuItem, FormControl, Backdrop, CircularProgress,
    TableBody, TableRow, Table, TableCell, TextField, TableHead, Avatar
} from '@material-ui/core';
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import { getProductHighlightByBrand, getRevenueByBrand } from '../../../crud/statitics.crud';
import { useHistory, useLocation, useParams } from "react-router-dom";
import moment from 'moment';
import DonutChart from '../components/chart/DonutChart';
import LineChart from '../components/chart/LineChart';
import { parseLocaleString, randomColor, groupOrderStatus } from '../../../helpers/helper'
import DayPicker, { DateUtils } from 'react-day-picker';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import { getBrandDetail, getBrandList } from '../../../crud/brand.crud';
import _ from "lodash"
import { MARKET_PLACE } from "../../../constant/marketplace"
import { useDispatch } from 'react-redux';
import { actionTypes as commonTypes } from "../../../store/ducks/common.duck"
import { actionTypes as brandTypes } from '../../../store/ducks/brand.duck'
import { Link } from "react-router-dom";

Board.propTypes = {

};

export const FILTER_OPTION = {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    MANUAL: 'manual'
}

export const GROUP_BY = {
    YEAR: {
        value: 'year',
        format: 'YYYY',
    },
    MONTH: {
        value: 'month',
        format: 'MM-YYYY',
        limit: 1065
    },
    DAY: {
        value: 'day',
        format: 'MM-DD-YYYY',
        limit: 90
    },
    HOUR: {
        value: 'hour',
        format: 'HH:MM',
        limit: 1
    }
}

export let MARKET_FILTER = {
    ALL: {
        code: 'all',
        label: 'All Market'
    },
}

const useStyles = makeStyles({
    root: {
        width: '100%',
        fontSize: '16px',
        '& .btn-base--lg': {
            borderRadius: '25px !important'
        }
    },
    revenue: {
        marginBottom: '50px'
    },
    revenueList: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 0,
        '& li': {
            padding: 0,
            width: '25%',
            marginBottom: '30px'
        }
    },
    chart: {

    },
    sku: {

    },
    orderStatus: {
        marginBottom: '50px'
    },
    marketFilterContainer: {
        minHeight: '220px',
        backgroundImage: `url(${toAbsoluteUrl("/media/bg/order-status-bg.png")})`,
        backgroundSize: 'contain',
        position: 'relative'
    },
    marketFilter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '200px',
        backgroundColor: '#014b68',
        borderRadius: '25px',
        border: 'none',
        '& .MuiInputBase-root': {
            padding: '0 5px',
            background: 'none',
            '&::before, &::after': {
                display: 'none'
            }
        },
        '& label': {
            marginLeft: '5px',
            fontSize: '14px',
            color: '#FFFFFF',
            fontWeight: '700',
        },
        '& .MuiSelect-icon': {
            color: '#FFF',
            right: '15px'
        }
    },
    table: {
        color: '#000',
        '& p': {
            margin: 0
        },
        '& td': {
            border: 'none'
        },
        '& tr': {
            '&:nth-child(even)': {
                background: 'rgba(140, 160, 179, 0.1)'
            }
        },
        '& .cell-product-name': {
            fontSize: '14px',
        },
        '& .cell-sku': {
            fontSize: '14px',
            color: '#053361',
            '& img': {
                width: 22,
                marginRight: 8
            }
        },
        '& .cell-price': {
            fontSize: '16px',
            fontWeight: 600,
            color: '#053361'
        },
        '& .cell-quantity': {
            fontSize: '14px',
            fontStyle: 'italic',
            color: '#000a12',
            minWidth: '150px',
        },
        '& .cell-market': {
            fontSize: '16px',
            color: '#333',
            border: '1px solid #979797',
            borderRadius: '15px',
            padding: '5px',
            minWidth: '100px',
            maxWidth: '200px',
            textTransform: 'capitalize'
        }
    },
    tableLegend: {
        fontSize: '20px',
        color: '#333',
        fontWeight: 800,
        marginBottom: 30,
    },
    header: {
        borderBottom: '1px solid #dbdbdb',
        margin: 0,
        padding: '15px 0',
        marginBottom: '30px',
    },
    headerTitle: {
        color: '#014b68',
        fontWeight: 800,
        fontSize: '32px',
        margin: '0 15px 0 0'
    },
    brandDropdown: {
        minWidth: '150px'
    },
    chart: {
        marginBottom: '50px'
    },
    chartContainer: {
        position: 'relative',
        height: '400px ',
        backgroundColor: '#fbfbfb',
        borderRadius: '15px',
        boxShadow: '0 0 20px 0 rgba(51, 51, 51, 0.1)'
    },
    donutChart: {
        padding: '0'
    },
    lineChart: {

    },
    lineChartTitle: {
        fontSize: '20px',
        color: '#333',
        fontWeight: 800,
        padding: '15px 30px',
        margin: 0,
        borderBottom: '1px solid #dbdbdb'
    },
    tableContainer: {
        border: '1px solid #dbdbdb',
        borderRadius: '4px'
    },
    tableHeader: {
        borderBottom: '1px solid #dbdbdb',
        padding: '15px'
    },
    datepickerContainer: {
        position: 'relative',
        '& input': {
            padding: '8px 15px'
        },
        '&:focus': {
            '& .Range': {
                background: 'red'
            }
        }
    },
    dateFilterBtnGroup: {
        '& button': {
            color: '#333',
            fontWeight: 400
        },
        '& .active': {
            background: '#ebebeb',
            fontWeight: 800
        }
    }
})

function Board(props) {
    const classes = useStyles()
    const search = useLocation().search
    const mode = search && search.split('&mode=')[1]
    const [revenueList, setRevenueList] = useState([])
    const [comparisonRevenueList, setComparisonRevenueList] = useState([])
    const [sku, setSku] = useState([])
    const [bestSellingSKU, setBestSellingSKU] = useState([])
    const [orderStatusList, setOrderStatusList] = useState([])
    const [marketFilter, setMarketFilter] = useState(MARKET_FILTER.ALL.code)
    const [shops, setShops] = useState()
    const [totalRevenue, setTotalRevenue] = useState(0)
    const [cancelledTotal, setCancelledTotal] = useState(0)
    const [comparisonTotalRevenue, setComparisonTotalRevenue] = useState(0)
    const [comparisonCancelledTotal, setComparisonCancelledTotal] = useState(0)
    const [revenueTooltip, setRevenueTooltip] = useState('')
    const startDateConfig = { hour: 0, minute: 0, second: 0, millisecond: 0 }
    const endDateConfig = { hour: 23, minute: 59, second: 59, millisecond: 999 }

    let history = useHistory()
    const dispatch = useDispatch();
    const paramsBrandId = useParams().brandId

    useEffect(() => {
        paramsBrandId && dispatch({
            type: brandTypes.ChangeBrand,
            payload: paramsBrandId
        })
    }, [])
    const brandId = _.get(props, 'brand.selectedBrand')
    const startDate = _.get(props, 'brand.filter.from')
    const endDate = _.get(props, 'brand.filter.to')
    const dateFilterOption = _.get(props, 'brand.filter.mode')


    useEffect(() => {
        if (brandId) {
            dispatch({
                type: commonTypes.ShowBackdropLoading,
                payload: true
            })
            setTotalRevenue(0)
            setRevenueList([])
            setOrderStatusList({})
            getBrandDetail(brandId)
                .then((res) => {
                    dispatch({
                        type: commonTypes.ShowBackdropLoading,
                        payload: false
                    })
                    const brand = _.get(res, 'data.result.brand')
                    setShops(_.get(brand, 'shops') || [])
                    getRevenue(_.get(brand, 'shops') || [], startDate, endDate)
                    getRevenue(_.get(brand, 'shops') || [], getRangeDateComparison(startDate, endDate, dateFilterOption).startDate,
                        getRangeDateComparison(startDate, endDate, dateFilterOption).endDate, true)
                })
                .catch(err => {
                    dispatch({
                        type: commonTypes.ShowBackdropLoading,
                        payload: false
                    })
                })
        }
    }, [brandId])

    const changeUrl = (id) => {
        history.push(`/dashboard/revenue/${id}?from=${startDate}&to=${endDate}&mode=${dateFilterOption}`)
    }

    useEffect(() => {
        getRevenue(shops, startDate, endDate)
        getRevenue(shops, getRangeDateComparison(startDate, endDate, dateFilterOption).startDate,
            getRangeDateComparison(startDate, endDate, dateFilterOption).endDate, true)

    }, [startDate, endDate])

    useEffect(() => {
        try {
            let temp = []
            Object.keys(sku).forEach(key => {
                if (key === marketFilter || marketFilter === MARKET_FILTER.ALL.code) {
                    temp = [...temp, ...sku[key]]
                }

            })
            temp = _.sortBy(temp, o => o.count).reverse()
            setBestSellingSKU((temp && temp.length > 0) ? temp.splice(0, 10) : [])
        }
        catch (err) {
            console.log(err)
        }

    }, [sku, marketFilter])

    const getGroupBy = (s, e) => {
        const diff = moment(e).diff(moment(s), 'days')
        if (diff < GROUP_BY.HOUR.limit) {
            return GROUP_BY.HOUR
        }
        else if (diff <= GROUP_BY.DAY.limit) {
            return GROUP_BY.DAY
        }
        else if (diff <= GROUP_BY.MONTH.limit) {
            return GROUP_BY.MONTH
        }
        else {
            return GROUP_BY.YEAR
        }
    }

    const getRangeDateComparison = (s, e, mode) => {
        let startDate = ''
        let endDate = ''
        let range = moment(e).diff(moment(s), 'days') + 1
        let label = ''
        switch (mode) {
            case FILTER_OPTION.YEAR:
                startDate = moment(s).subtract(1, 'year').startOf('year')
                endDate = moment(s).subtract(1, 'year').endOf('year')
                label = `Doanh thu năm ${startDate.year()}`
                break;
            case FILTER_OPTION.MONTH:
                startDate = moment(s).subtract(1, 'month').startOf('month')
                endDate = moment(s).subtract(1, 'month').endOf('month')
                label = `Doanh thu tháng ${startDate.month() + 1} - ${startDate.year()}`
                break;
            default:
                startDate = moment(s).subtract(range, 'days')
                endDate = moment(e).subtract(range, 'days')
                label = `Doanh thu từ ${startDate.format('MM-DD-YYYY')} đến ${endDate.format('MM-DD-YYYY')}`
                break;
        }
        setRevenueTooltip(label)
        startDate = startDate.set(startDateConfig).toISOString()
        endDate = endDate.set(endDateConfig).toISOString()
        return { startDate, endDate }
    }

    const getRevenue = (shopList, dateFrom, dateTo, isGetOldRevenue) => {
        MARKET_FILTER = {
            ALL: {
                code: 'all',
                label: 'All Market'
            },
        }
        setMarketFilter(MARKET_FILTER.ALL.code)
        if (brandId && shopList) {
            const groupBy = getGroupBy(dateFrom, dateTo)
            dispatch({
                type: commonTypes.ShowBackdropLoading,
                payload: true
            })
            changeUrl(brandId)
            getRevenueByBrand(brandId, dateFrom, dateTo, groupBy.value)
                .then(res => {
                    dispatch({
                        type: commonTypes.ShowBackdropLoading,
                        payload: false
                    })
                    try {
                        const dataStatitics = _.get(res, 'data.result') || {}
                        let revenue = []
                        let status = {}
                        let shopeeEscrowAmount = 0
                        if (dataStatitics['shopee'] && dataStatitics['shopee'].escrowAmount) {
                            shopeeEscrowAmount = dataStatitics['shopee'].escrowAmount.reduce((a, b) => a + (b._id === 'COMPLETED' ? b.totalAmount : 0), 0)
                        }
                        let grantTotal = - shopeeEscrowAmount
                        Object.keys(dataStatitics).forEach(key => {
                            if (key !== 'tiki') {
                                if (_.get(dataStatitics[key], 'gmv.length') > 0) {
                                    let revenueTemp = [...dataStatitics[key].gmv]
                                    revenueTemp.map(r => {
                                        r._id = moment.utc(`${r._id.month || 1}-${r._id.dayOfMonth || 1}-${r._id.year}${r._id.hour ? ' ' + r._id.hour + ':00:00' : ''}`)
                                            .local()
                                    })
                                    let total = key === 'shopee' ? - shopeeEscrowAmount : 0
                                    let data = {}
                                    let date = []
                                    revenueTemp.forEach(item => {
                                        total += item.totalAmount
                                        Object.assign(data, { [`${item._id.format(groupBy.format)}`]: item.totalAmount })
                                        date.push(item._id)
                                    })
                                    const name = (_.get(shopList.find(shop => shop._id === key), 'name') || key).toUpperCase()
                                    revenue.push({
                                        _id: key,
                                        totalAmount: total,
                                        data: data,
                                        date: date,
                                        color: randomColor(),
                                        name: name,
                                        detail: groupOrderStatus(Object.assign(status, { [`${key}`]: dataStatitics[key].status }), 'all')
                                    })
                                    MARKET_FILTER[key] = {
                                        code: key,
                                        label: name
                                    }
                                }
                                if (_.get(dataStatitics[key], 'grantTotal.length') > 0) {
                                    grantTotal += dataStatitics[key].grantTotal.reduce((a, b) => a + (b.totalAmount || 0), 0)
                                }
                                status = _.get(dataStatitics[key], 'status.length') > 0 ? Object.assign(status, { [`${key}`]: dataStatitics[key].status }) : status
                            }

                        });
                        if (isGetOldRevenue) {
                            setComparisonTotalRevenue(grantTotal)
                            setComparisonRevenueList([...revenue])
                            const { amount } = groupOrderStatus(status, 'all')
                            setComparisonCancelledTotal(_.get(amount, 'CANCELLED') || 0)
                        }
                        else {
                            setTotalRevenue(grantTotal)
                            setRevenueList([...revenue])
                            setOrderStatusList(status)
                            const { amount } = groupOrderStatus(status, 'all')
                            setCancelledTotal(_.get(amount, 'CANCELLED') || 0)
                        }

                    }
                    catch (err) {
                        dispatch({
                            type: commonTypes.ShowBackdropLoading,
                            payload: false
                        })
                        console.log(err)
                    }

                })
                .catch(err => {
                })
            if (!isGetOldRevenue) {
                getProductHighlightByBrand(brandId, dateFrom, dateTo)
                    .then(res => {
                        setSku(res.data.result || {})
                    })
            }
        }
    }

    return (
        <div className={classes.root}>
            {/* <!-- begin:: Revenue section --> */}
            <div className={classes.revenue}>
                <Grid container spacing={5} className={classes.revenueList}>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard detail={groupOrderStatus(orderStatusList, 'all')} oldRevenue={comparisonTotalRevenue} tooltip={revenueTooltip} showIcon={false} id="all" revenue={totalRevenue} name="Tổng doanh thu"></RevenueCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard oldRevenue={comparisonCancelledTotal} tooltip={revenueTooltip} showIcon={false} id="all" revenue={cancelledTotal} name="Doanh Thu thất thoát"></RevenueCard>
                    </Grid>
                    {
                        revenueList.map((item, index) => {
                            return (<Grid item xs={12} md={6} lg={4} xl={3} key={index}>
                                {<RevenueCard oldRevenue={_.get(comparisonRevenueList.find(r => r._id === item._id), 'totalAmount') || 0} tooltip={revenueTooltip}
                                    detail={item.detail}
                                    showIcon={true} id={item._id} revenue={item.totalAmount} name={item.name}></RevenueCard>}
                            </Grid>)
                        })
                    }
                </Grid>
            </div>
            {/* <!-- end:: Revenue section --> */}
            {/* <!-- begin:: Chart section --> */}
            <div className={classes.chart}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <div className={`${classes.lineChart} ${classes.chartContainer} empty-block`}>
                            <p className={classes.lineChartTitle}>Doanh thu</p>
                            {revenueList.length > 0 ?
                                <LineChart shops={shops} groupBy={getGroupBy(startDate, endDate)} revenueList={revenueList} />
                                : <p className="empty-label">Dữ liệu trống</p>}
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className={`${classes.donutChart} ${classes.chartContainer} empty-block`}>
                            {revenueList.length > 0 ? <DonutChart shops={shops} revenueList={revenueList} /> :
                                <p className="empty-label">Dữ liệu trống</p>
                            }
                        </div>
                    </Grid>
                </Grid>
            </div>
            {/* <!-- end:: Chart section --> */}
            <div style={{
                marginBottom: 30
            }}>
                <FormControl variant="outlined" className="dropdown">
                    <Select
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
                        }}
                        className="btn-base btn-base--primary"
                        value={marketFilter}
                        onChange={(e) => setMarketFilter(e.target.value)}
                    >
                        {Object.keys(MARKET_FILTER).map((key, index) => (
                            <MenuItem key={index} value={MARKET_FILTER[key].code}>{MARKET_FILTER[key].label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>
            {/* <!-- begin:: OrderStatus section --> */}
            <div className={classes.orderStatus}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <p style={{
                            color: '#333333',
                            fontSize: '20px',
                            fontWeight: '800',
                            marginBottom: 15
                        }}>Tình trạng đơn hàng</p>
                        <OrderStatusCard filter={marketFilter} status={orderStatusList}></OrderStatusCard>
                    </Grid>
                </Grid>
            </div>
            {/* <!-- end:: OrderStatus section --> */}
            {/* <!-- begin:: SKU Statitics section --> */}
            <div className={classes.skuStatitics}>
                <Grid container>
                    <Grid item xs={12}>
                        <p className={classes.tableLegend}>Top SKU bán chạy</p>
                        <div className={`${classes.tableContainer} empty-block`}>

                            {bestSellingSKU.length > 0 ?
                                <Table className={`${classes.table}`} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Thông tin sản phẩm</TableCell>
                                            <TableCell align="right">Số lượng bán được</TableCell>
                                            <TableCell align="right">Doanh thu</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {bestSellingSKU.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell style={{
                                                    width: 40
                                                }}>
                                                    {row.images && <img style={{
                                                        width: 40,
                                                        height: 40
                                                    }} src={row.images} />}
                                                </TableCell>
                                                <TableCell align="left">
                                                    <p className="cell-product-name text-overflow" title={row.item_name}>{row.item_name}</p>
                                                    <p className="cell-sku">
                                                        <img src={MARKET_PLACE[row.marketplace] ? MARKET_PLACE[row.marketplace].image
                                                            : toAbsoluteUrl('/media/logos/google-sheet.svg')} /><span>SKU: {row._id}</span></p>
                                                </TableCell>
                                                <TableCell align="right">
                                                    {/* <p className="cell-price">{row.price} {row.currency}</p> */}
                                                    <p className="cell-quantity">{parseLocaleString(row.count)}</p>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <p className="cell-quantity">{parseLocaleString(_.get(row, 'totalAmount.$numberDecimal') || row.totalAmount, true)}</p>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                : <p className="empty-label">Dữ liệu trống</p>}
                        </div>

                    </Grid>
                </Grid>
            </div>
            {/* <!-- end:: SKU Statitics section --> */}
            {/* <Backdrop style={{
                zIndex: 9999
            }} open={loading}>
                <CircularProgress />
            </Backdrop> */}
        </div >
    );
}

const mapStateToProps = store => ({
    brand: store.brand
});

export default connect(mapStateToProps)(Board);