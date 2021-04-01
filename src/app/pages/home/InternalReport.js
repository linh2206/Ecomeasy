import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Button, ButtonGroup, Grid, makeStyles, Icon, Tooltip,
    Table, TableCell, TableHead, TableBody, TableRow, FormGroup, FormControlLabel, Checkbox, ListItemText
} from '@material-ui/core';
import RevenueCard from './components/RevenueCard'
import DonutChart from './components/chart/DonutChart'
import LineChart from './components/chart/LineChart'
import _ from "lodash"
import { parseLocaleString, calucateGrowthRate } from "../../helpers/helper"
import RangeDatePicker from "./components/RangeDatePicker"
import moment from "moment"
import Slider from "react-slick";
import { MARKET_PLACE } from "../../constant/marketplace"
import { getBrandReport } from "../../crud/statitics.crud"
import { useHistory, useLocation } from "react-router-dom";
import { syncCommentData } from '../../crud/monitoring.crud';
import { groupOrderStatus, randomColor } from '../../helpers/helper'
import { useDispatch } from 'react-redux';
import { actionTypes as commonTypes } from "../../store/ducks/common.duck"
import { GROUP_BY, FILTER_OPTION } from "./statistics/RevenueStatistics"
import { ORDER_CANCELLED_ORDER } from "../../constant/orderStatus"
import { connect } from "react-redux";
import { CheckBoxOutlineBlank } from '@material-ui/icons';

InternalReport.propTypes = {

};

export const FILTER_CHART = {
    SALE_CHANNEL: 'sale-channel',
    BRAND: 'brand'
}

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
    revenueSection: {
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
    tableLegend: {
        fontSize: '20px',
        color: '#333',
        fontWeight: 800,
        marginBottom: 30,
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
    tableContainer: {
        border: '1px solid #dbdbdb',
        borderRadius: '4px'
    },
    brandFilter: {
        listStyle: 'none',
        padding: 0,
        color: '#000',
        display: 'flex',
        flexWrap: 'wrap',
        '& li': {
            padding: 10,
            display: 'flex',
            alignItems: 'center'
        }
    }
})

export const MARKET_FILTER = {
    shopee: {
        key: 'shopee',
        name: 'Shopee',
    },
    sendo: {
        key: 'sendo',
        name: 'Sendo',
    },
    lazada: {
        key: 'lazada',
        name: 'Lazada',
    },
    others: {
        key: 'others',
        name: 'Others',
    },
    yes24: {
        key: 'yes24',
        name: 'Yes 24',
    }
}

function InternalReport(props) {
    const classes = useStyles()
    const [filter, setFilter] = useState('all')
    const startDateConfig = { hour: 0, minute: 0, second: 0, millisecond: 0 }
    const endDateConfig = { hour: 23, minute: 59, second: 59, millisecond: 999 }
    const search = useLocation().search
    const dateFilter = search && search.split('&mode=')[1]
    const queryString = search ? search.split('&mode=')[0].split('?from=')[1].split('&to=') : []
    const [mode, setMode] = useState(dateFilter || 'year')
    const [from, setFrom] = useState(queryString.length > 0 ? queryString[0] :
        moment().startOf('year').set(startDateConfig).toISOString())
    const [to, setTo] = useState(queryString.length > 0 ? queryString[1] : moment().set(endDateConfig).toISOString())
    let history = useHistory()
    const dispatch = useDispatch();
    const [groupedData, setgroupedData] = useState({})
    const [brands, setBrands] = useState({})
    const [chartData, setChartData] = useState({})
    const [oldGroupedData, setOldGroupedData] = useState({})
    const [oldBrands, setOldBrands] = useState({})
    const [revenueTooltip, setRevenueTooltip] = useState('')
    const [chartDataByBrand, setChartDataByBrand] = useState({})
    const [filterChart, setFilterChart] = useState(FILTER_CHART.BRAND)
    const [brandFilter, setBrandFilter] = useState()
    const [apiRes, setApiRes] = useState({})
    const [oldApiRes, setOldApiRes] = useState({})

    const getLostRevenue = (key, status) => {
        const params = {}
        params[key] = getStatus(status)
        return _.get(groupOrderStatus(params, 'all'), 'amount.CANCELLED')
    }

    const getLostOrder = (key, status) => {
        const params = {}
        params[key] = getStatus(status)
        return _.get(groupOrderStatus(params, 'all'), 'data.CANCELLED')
    }

    const getStatus = data => {
        let status = []
        data.forEach(item => {
            if (brandFilter && brandFilter[item._id.brandId]) {
                status.push({
                    ...item,
                    _id: _.get(item, '_id.status')
                })
            }
        })
        return status
    }

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 7,
        slidesToScroll: 1
    };

    const handleStartDateChange = e => {
        setFrom(moment(e).set(startDateConfig).toISOString())
    }

    const handleEndDateChange = e => {
        setTo(moment(e).set(endDateConfig).toISOString())
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
                label = `Số liệu năm ${startDate.year()}`
                break;
            case FILTER_OPTION.MONTH:
                startDate = moment(s).subtract(1, 'month').startOf('month')
                endDate = moment(s).subtract(1, 'month').endOf('month')
                label = `Số liệu tháng ${startDate.month() + 1} - ${startDate.year()}`
                break;
            default:
                startDate = moment(s).subtract(range, 'days')
                endDate = moment(e).subtract(range, 'days')
                label = `Số liệu từ ${startDate.format('MM-DD-YYYY')} đến ${endDate.format('MM-DD-YYYY')}`
                break;
        }
        setRevenueTooltip(label)
        startDate = startDate.set(startDateConfig).toISOString()
        endDate = endDate.set(endDateConfig).toISOString()
        return { startDate, endDate }
    }

    const isCheckAll = filter => {
        let count = 0
        Object.keys(filter).forEach(key => {
            filter[key] && count++
        })
        return count === _.get(props, 'brand.brandList').length
    }

    const checkAllBrandFilter = flag => {
        const temp = {}
        _.get(props, 'brand.brandList').forEach(item => {
            temp[item._id] = flag
        })
        setBrandFilter(temp)
    }

    useEffect(() => {
        if (from && to) {
            const oldRangeDate = getRangeDateComparison(from, to, mode)
            visualizeData(from, to)
            visualizeData(oldRangeDate.startDate, oldRangeDate.endDate, true)
        }
    }, [from, to])

    useEffect(() => {
        refactorData(apiRes, false)
        refactorData(oldApiRes, true)
    }, [brandFilter, filter])

    const visualizeData = (f, t, isGetOldRevenue) => {
        dispatch({
            type: commonTypes.ShowBackdropLoading,
            payload: true
        })
        !isGetOldRevenue && history.push(`/internal-report?from=${f}&to=${t}&mode=${mode}`)
        getBrandReport(f, t, getGroupBy(f, t).value)
            .then(res => {
                try {
                    dispatch({
                        type: commonTypes.ShowBackdropLoading,
                        payload: false
                    })
                    refactorData(_.get(res, 'data.result'), isGetOldRevenue)
                    isGetOldRevenue ? setOldApiRes(_.get(res, 'data.result')) : setApiRes(_.get(res, 'data.result'))
                    brandFilter || checkAllBrandFilter(true)
                }
                catch (err) {
                    console.log(err)
                }
                finally {
                    dispatch({
                        type: commonTypes.ShowBackdropLoading,
                        payload: false
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

    const refactorData = (data, isGetOldRevenue) => {
        let temp = {}
        let tempBrand = {}
        let tempChartData = []
        let tempDate = []
        let tempTotalAmount = 0
        let revenueList = []
        const tempChartDataByBrand = {}
        Object.keys(data).forEach(item => {
            if (item !== 'tiki' && (filter === 'all' || filter === item)) {
                temp[item] = {
                    gmv: _.get(data[item], '[0].revenueGroupBrand').filter(item => brandFilter && brandFilter[item._id]).reduce((a, b) => +a + +b.totalAmount, 0),
                    lost_revenue: getLostRevenue(item, _.get(data[item], '[0].revenueGroupByStatusBrand')),
                    total_order: _.get(data[item], '[0].revenueGroupBrand').filter(item => brandFilter && brandFilter[item._id]).reduce((a, b) => +a + +b.count, 0),
                    total_lost_order: getLostOrder(item, _.get(data[item], '[0].revenueGroupByStatusBrand'))
                }
                if (data[item][0].revenueGroupByStatusBrand && data[item][0].revenueGroupByStatusBrand.length > 0) {
                    data[item][0].revenueGroupByStatusBrand.forEach(subItem => {
                        if (_.get(subItem, '_id.brandId') && brandFilter && brandFilter[_.get(subItem, '_id.brandId')]) {
                            if (tempBrand[subItem._id.brandId]) {
                                tempBrand[subItem._id.brandId] = {
                                    ...tempBrand[subItem._id.brandId],
                                    totalAmount: tempBrand[subItem._id.brandId].totalAmount + subItem.totalAmount,
                                    count: tempBrand[subItem._id.brandId].count + subItem.count
                                }
                            }
                            else {
                                tempBrand[subItem._id.brandId] = {
                                    totalAmount: subItem.totalAmount,
                                    count: subItem.count,
                                    total_lost_revenue: 0,
                                    total_lost_order: 0
                                }
                            }
                            const status = typeof (subItem._id.status) === 'object' ? subItem._id.status[0] : subItem._id.status
                            if (ORDER_CANCELLED_ORDER[item].includes(status)) {
                                tempBrand[subItem._id.brandId].total_lost_revenue += subItem.totalAmount
                                tempBrand[subItem._id.brandId].total_lost_order += subItem.count
                            }
                        }
                    })
                }
                if (data[item][0].revenueGroupByTimeBrand && data[item][0].revenueGroupByTimeBrand.length > 0) {
                    data[item][0].revenueGroupByTimeBrand.forEach(r => {

                        //get chart data by gmv
                        const id = moment.utc(`${r._id.time.month || 1}-${r._id.time.dayOfMonth || 1}-
                                    ${r._id.time.year}${r._id.time.hour ? ' ' + r._id.time.hour + ':00:00' : ''}`)
                            .local()
                        tempTotalAmount += r.totalAmount
                        Object.assign(tempChartData, { [`${id.format(getGroupBy(from, to).format)}`]: r.totalAmount })
                        tempDate.push(id)

                        //get chart data by brand
                        if (r._id.brandId && brandFilter && brandFilter[r._id.brandId]) {
                            if (tempChartDataByBrand[r._id.brandId]) {
                                let newDate = [...tempChartDataByBrand[r._id.brandId].date]
                                let newData = { ...tempChartDataByBrand[r._id.brandId].data }
                                let newTotalAmount = tempChartDataByBrand[r._id.brandId].totalAmount + r.totalAmount
                                if (newData[`${id.format(getGroupBy(from, to).format)}`]) {
                                    newData[`${id.format(getGroupBy(from, to).format)}`] += r.totalAmount
                                }
                                else {
                                    newData[`${id.format(getGroupBy(from, to).format)}`] = r.totalAmount
                                }
                                newDate.push(id)
                                tempChartDataByBrand[r._id.brandId] = {
                                    ...tempChartDataByBrand[r._id.brandId],
                                    date: newDate,
                                    data: newData,
                                    totalAmount: newTotalAmount
                                }
                            }
                            else {
                                tempChartDataByBrand[r._id.brandId] = {
                                    _id: _.get(_.get(props, 'brand.brandList').find(i => i._id === r._id.brandId), 'name') || r._id.brandId,
                                    name: _.get(_.get(props, 'brand.brandList').find(i => i._id === r._id.brandId), 'name') || r._id.brandId,
                                    color: randomColor(),
                                    data: {
                                        [`${id.format(getGroupBy(from, to).format)}`]: r.totalAmount
                                    },
                                    date: [id],
                                    totalAmount: r.totalAmount
                                }
                            }
                        }

                    })
                }

                revenueList.push({
                    _id: item,
                    name: item,
                    color: MARKET_PLACE[item] ? MARKET_PLACE[item].color : randomColor(),
                    data: tempChartData,
                    date: tempDate,
                    totalAmount: tempTotalAmount
                })
                tempDate = []
                tempChartData = {}
                tempTotalAmount = 0
            }
        })
        temp['all'] = {
            gmv: Object.values(temp).reduce((a, b) => +a + +b.gmv, 0),
            lost_revenue: Object.values(temp).reduce((a, b) => +a + +b.lost_revenue, 0),
            total_order: Object.values(temp).reduce((a, b) => +a + +b.total_order, 0),
            total_lost_order: Object.values(temp).reduce((a, b) => +a + +b.total_lost_order, 0)
        }
        if (isGetOldRevenue) {
            setOldBrands(tempBrand)
            setOldGroupedData(temp)
        }
        else {
            setgroupedData(temp)
            console.log(tempBrand)
            setBrands(tempBrand)
            setChartData(revenueList)
            const tempData = []
            Object.keys(tempChartDataByBrand).forEach(item => {
                tempData.push(tempChartDataByBrand[item])
            })
            setChartDataByBrand(tempData)
        }
    }

    const handleChangeMode = (m) => {
        setMode(m)
    }

    const handleChangeBrandFilter = id => {
        const temp = { ...brandFilter }
        temp[id] = !temp[id]
        setBrandFilter(temp)
    }

    const handleCheckAllBrandFilter = () => {
        checkAllBrandFilter(!isCheckAll(brandFilter))
    }

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
                            <p className={classes.headerTitle}>Internal report</p>
                        </div>
                    </Grid>
                    <Grid item style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <RangeDatePicker setFrom={handleStartDateChange}
                            setMode={handleChangeMode}
                            setTo={handleEndDateChange}
                            from={from ? new Date(from) : null}
                            to={to ? new Date(to) : null} mode={mode} />
                    </Grid>
                </Grid>
            </div>
            <div className={classes.filterSection}></div>
            <div style={{
                margin: '50px 0'
            }}>
                <ul className="filter-tabs">
                    <Slider {...settings}>
                        <li className="filter-tabs__item">
                            <div
                                onClick={(() => setFilter('all'))}
                                className={`filter-tabs__item__container ${filter === 'all' ? 'filter-tabs__item--selected' : ''}`}>
                                <Icon className="filter-tabs__item__icon">check_circle_icon</Icon>
                                <div className="filter-tabs__item__label">Tất cả</div>
                            </div>
                        </li>
                        {Object.keys(MARKET_FILTER).map((item, index) => (
                            item != 'all' && <li className="filter-tabs__item" key={index}>
                                <div
                                    onClick={(() => setFilter(item))}
                                    className={`filter-tabs__item__container ${filter === item ? 'filter-tabs__item--selected' : ''}`}>
                                    <Icon className="filter-tabs__item__icon">check_circle_icon</Icon>
                                    <div className="filter-tabs__item__label">{_.get(MARKET_PLACE[item], 'image') && <img src={_.get(MARKET_PLACE[item], 'image')} style={{
                                        width: 25,
                                        height: 25
                                    }} />}{_.get(MARKET_PLACE[item], 'name')}</div>
                                </div>
                            </li>
                        ))}
                    </Slider>
                </ul>
            </div>
            <div>
                {
                    brandFilter &&

                    <ul className={classes.brandFilter}>
                        <li>
                            <Checkbox
                                checked={isCheckAll(brandFilter)}
                                onChange={handleCheckAllBrandFilter}
                            />
                            <ListItemText primary="All" />
                        </li>
                        {
                            _.get(props, 'brand.brandList').map((item, index) => {
                                return (
                                    <li key={index}>
                                        <Checkbox
                                            onChange={() => handleChangeBrandFilter(item._id)}
                                            checked={brandFilter[item._id]} />
                                        <ListItemText primary={item.name} />
                                    </li>
                                )
                            })
                        }
                    </ul>
                }
            </div>
            <div className={classes.revenueSection}>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard tooltip={revenueTooltip} name="Tổng GMV" oldRevenue={_.get(oldGroupedData[filter], 'gmv')}
                            isPrice={true} showIcon={false} id="all" revenue={_.get(groupedData[filter], 'gmv')}></RevenueCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard tooltip={revenueTooltip} name="Tổng NMV" oldRevenue={_.get(oldGroupedData[filter], 'gmv') - _.get(oldGroupedData[filter], 'lost_revenue')}
                            isPrice={true} showIcon={false} id="all" revenue={_.get(groupedData[filter], 'gmv') - _.get(groupedData[filter], 'lost_revenue')}></RevenueCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard tooltip={revenueTooltip} name="Tổng đơn hàng" oldRevenue={_.get(oldGroupedData[filter], 'total_order')}
                            isPrice={false} showIcon={false} id="all" revenue={_.get(groupedData[filter], 'total_order')}></RevenueCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard tooltip={revenueTooltip} name="Tổng giá trị đơn hủy" oldRevenue={_.get(oldGroupedData[filter], 'lost_revenue')}
                            isPrice={true} showIcon={false} id="all" revenue={_.get(groupedData[filter], 'lost_revenue')}></RevenueCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard tooltip={revenueTooltip} name="Tổng đơn hủy" oldRevenue={_.get(oldGroupedData[filter], 'total_lost_order')}
                            isPrice={false} showIcon={false} id="all" revenue={_.get(groupedData[filter], 'total_lost_order')}></RevenueCard>
                    </Grid>
                    <Grid item xs={12} md={6} lg={4} xl={3}>
                        <RevenueCard tooltip={revenueTooltip} name="EE Revenue" oldRevenue={_.get(oldGroupedData[filter], 'gmv') * 0.08}
                            isPrice={true} showIcon={false} id="all" revenue={_.get(groupedData[filter], 'gmv') * 0.08}></RevenueCard>
                    </Grid>
                </Grid>
            </div>
            <div>
                <ButtonGroup>
                    <Button
                        className={filterChart === FILTER_CHART.BRAND && 'active'}
                        onClick={() => setFilterChart(FILTER_CHART.BRAND)}>Brand</Button>
                    <Button
                        className={filterChart === FILTER_CHART.SALE_CHANNEL && 'active'}
                        onClick={() => setFilterChart(FILTER_CHART.SALE_CHANNEL)}>Sale channel</Button>

                </ButtonGroup>
            </div>
            {
                chartDataByBrand &&
                <div className={classes.chart}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <div className={`${classes.lineChart} ${classes.chartContainer} empty-block`}>
                                <p className={classes.lineChartTitle}>Revenue trend</p>
                                {filterChart === FILTER_CHART.SALE_CHANNEL ? <LineChart shops={[]} groupBy={getGroupBy(from, to)}
                                    revenueList={chartData} />
                                    : <LineChart shops={[]} groupBy={getGroupBy(from, to)}
                                        revenueList={chartDataByBrand} />}
                            </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <div className={`${classes.donutChart} ${classes.chartContainer} empty-block`}>
                                {filterChart === FILTER_CHART.SALE_CHANNEL ? <DonutChart shops={[]} revenueList={chartData} />
                                    : <DonutChart shops={[]} revenueList={chartDataByBrand} />}
                            </div>
                        </Grid>
                    </Grid>
                </div>
            }

            <div className={classes.skuStatitics}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={`${classes.tableContainer}`}>
                            <Table className={`${classes.table}`} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>STT</TableCell>
                                        <TableCell>Brand</TableCell>
                                        <TableCell>GMV</TableCell>
                                        <TableCell>NMV</TableCell>
                                        <TableCell>AOV</TableCell>
                                        <TableCell>Số đơn huỷ</TableCell>
                                        <TableCell>Doanh thu thất thoát</TableCell>
                                        <TableCell>Tỷ lệ thất thoát</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.keys(brands).map((key, index) => {
                                        const newGMV = _.get(brands[key], 'totalAmount')
                                        const oldGMV = _.get(oldBrands[key], 'totalAmount')
                                        const gmvComparison = calucateGrowthRate(oldGMV, newGMV)
                                        const newAOV = _.get(brands[key], 'totalAmount') / _.get(brands[key], 'count')
                                        const oldAOV = _.get(oldBrands[key], 'totalAmount') / _.get(oldBrands[key], 'count')
                                        const aovComparison = calucateGrowthRate(oldAOV, newAOV)
                                        const newLostRevenue = _.get(brands[key], 'total_lost_revenue')
                                        const oldLostRevenue = _.get(oldBrands[key], 'total_lost_revenue')
                                        const lostRevenueComparison = calucateGrowthRate(oldLostRevenue, newLostRevenue)
                                        const newLostOrder = _.get(brands[key], 'total_lost_order')
                                        const oldLostOrder = _.get(oldBrands[key], 'total_lost_order')
                                        const lostOrderComparison = calucateGrowthRate(oldLostRevenue, newLostRevenue)
                                        const newNMV = newGMV - newLostRevenue
                                        const oldNMV = oldGMV - oldLostRevenue
                                        const nmvComparison = calucateGrowthRate(oldNMV, newNMV)
                                        const newRateofLostRevenue = (newLostRevenue / newGMV) * 100
                                        const oldRateofLostRevenue = (oldLostRevenue / oldGMV) * 100
                                        const rateofLostRevenueComparison = calucateGrowthRate(oldRateofLostRevenue, newRateofLostRevenue)
                                        return (<TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>{_.get(_.get(props, 'brand.brandList').find(i => i._id === key), 'name') || key}</TableCell>
                                            <TableCell>
                                                <p>{parseLocaleString(newGMV)}</p>
                                                {
                                                    !gmvComparison.isInvariant &&
                                                    <Tooltip title={`${revenueTooltip}: 
                                                    ${parseLocaleString(oldGMV)}`}>
                                                        <div className="percentage-change" style={{
                                                            color: gmvComparison.isIncrease ? '#91dd47' : '#ed0000'
                                                        }}>
                                                            <span style={{
                                                                fontSize: 13
                                                            }}>{parseLocaleString(gmvComparison.percentageChange)}%</span>
                                                            <Icon>{gmvComparison.isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                                                        </div>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <p>{parseLocaleString(newNMV)}</p>
                                                {
                                                    !nmvComparison.isInvariant &&
                                                    <Tooltip title={`${revenueTooltip}: 
                                                    ${parseLocaleString(oldNMV)}`}>
                                                        <div className="percentage-change" style={{
                                                            color: nmvComparison.isIncrease ? '#91dd47' : '#ed0000'
                                                        }}>
                                                            <span style={{
                                                                fontSize: 13
                                                            }}>{parseLocaleString(nmvComparison.percentageChange)}%</span>
                                                            <Icon>{nmvComparison.isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                                                        </div>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <p>{parseLocaleString(newAOV)}</p>
                                                {
                                                    !aovComparison.isInvariant &&
                                                    <Tooltip title={`${revenueTooltip}: 
                                                    ${parseLocaleString(oldAOV)}`}>
                                                        <div className="percentage-change" style={{
                                                            color: aovComparison.isIncrease ? '#91dd47' : '#ed0000'
                                                        }}>
                                                            <span style={{
                                                                fontSize: 13
                                                            }}>{parseLocaleString(aovComparison.percentageChange)}%</span>
                                                            <Icon>{aovComparison.isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                                                        </div>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <p>{parseLocaleString(newLostOrder)}</p>
                                                {
                                                    !lostOrderComparison.isInvariant &&
                                                    <Tooltip title={`${revenueTooltip}: 
                                                    ${parseLocaleString(oldLostOrder)}`}>
                                                        <div className="percentage-change" style={{
                                                            color: lostOrderComparison.isIncrease ? '#91dd47' : '#ed0000'
                                                        }}>
                                                            <span style={{
                                                                fontSize: 13
                                                            }}>{parseLocaleString(lostOrderComparison.percentageChange)}%</span>
                                                            <Icon>{lostOrderComparison.isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                                                        </div>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <p>{parseLocaleString(newLostRevenue)}</p>
                                                {
                                                    !lostRevenueComparison.isInvariant &&
                                                    <Tooltip title={`${revenueTooltip}: 
                                                    ${parseLocaleString(oldLostRevenue)}`}>
                                                        <div className="percentage-change" style={{
                                                            color: lostRevenueComparison.isIncrease ? '#91dd47' : '#ed0000'
                                                        }}>
                                                            <span style={{
                                                                fontSize: 13
                                                            }}>{parseLocaleString(lostRevenueComparison.percentageChange)}%</span>
                                                            <Icon>{lostRevenueComparison.isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                                                        </div>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <p>{parseLocaleString(newRateofLostRevenue) + '%'}</p>
                                                {
                                                    !rateofLostRevenueComparison.isInvariant &&
                                                    <Tooltip title={`${revenueTooltip}: 
                                                    ${parseLocaleString(oldRateofLostRevenue) + '%'}`}>
                                                        <div className="percentage-change" style={{
                                                            color: rateofLostRevenueComparison.isIncrease ? '#91dd47' : '#ed0000'
                                                        }}>
                                                            <span style={{
                                                                fontSize: 13
                                                            }}>{parseLocaleString(rateofLostRevenueComparison.percentageChange)}%</span>
                                                            <Icon>{rateofLostRevenueComparison.isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                                                        </div>
                                                    </Tooltip>
                                                }
                                            </TableCell>
                                        </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

const mapStateToProps = store => ({
    brand: store.brand
});

export default connect(mapStateToProps)(InternalReport);