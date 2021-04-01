import React, { Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Grid, FormControl, Select, MenuItem, ButtonGroup, Button
} from '@material-ui/core';
import _ from "lodash"
import RangeDatePicker from "../components/RangeDatePicker"
import { useDispatch } from 'react-redux';
import { actionTypes as brandTypes } from '../../../store/ducks/brand.duck'
import { getBrandDetail, getBrandList } from '../../../crud/brand.crud';
import moment from 'moment';
import { connect } from "react-redux";
import { Redirect, Route, Switch, useHistory, BrowserRouter, Link } from 'react-router-dom'
import OrderList from './OrderList'
import RevenueStatistics from './RevenueStatistics'
import BrandDetail from '../BrandDetail'

Dashboard.propTypes = {

};

const ROUTES = {
    BRAND: 'brand',
    STATISTICS: 'statistics',
    ORDERS: 'orders'
}

const useStyles = makeStyles({
    root: {
        '& .active': {
            background: '#ebebeb',
            fontWeight: 800,
            pointerEvent: 'none'
        }
    },
    ...globalStyles
})


function Dashboard(props) {
    const classes = useStyles()
    const brandId = _.get(props, 'brand.selectedBrand')
    const [brandList, setBrandList] = useState([])
    const dispatch = useDispatch()
    const [mode, setMode] = useState('year')
    const startDateConfig = { hour: 0, minute: 0, second: 0, millisecond: 0 }
    const endDateConfig = { hour: 23, minute: 59, second: 59, millisecond: 999 }
    const [from, setFrom] = useState(moment().startOf('year').set(startDateConfig).toISOString())
    const [to, setTo] = useState(moment().set(endDateConfig).toISOString())
    const history = useHistory()
    const [currentPath, setCurrentPath] = useState('')

    useEffect(() => {
        getBrandList()
            .then(res => {
                const result = _.get(res, 'data.result.brands')
                if (result && result.length > 0) {
                    setBrandList(result)
                    if (!_.get(props, 'brand.selectedBrand')) {
                        dispatch({
                            type: brandTypes.ChangeBrand,
                            payload: result[0] && result[0]._id
                        })
                    }
                    dispatch({
                        type: brandTypes.SetBrandList,
                        payload: result
                    })
                }

            })
    }, [])

    history.listen((location, action) => {
        setCurrentPath(getCurrentPath())
    })

    useEffect(() => {
        dispatch({
            type: brandTypes.SetFilter,
            payload: {
                from: from,
                to: to,
                mode: mode
            }
        })
    }, [from, to, mode])

    useEffect(() => {
        if (currentPath === ROUTES.BRAND) {
            history.push(`/dashboard/detail/${brandId}`)
        }
    }, [brandId])

    const getCurrentPath = () => {
        let path = history.location.pathname
        if (path.split('/detail').length === 2) {
            return ROUTES.BRAND
        }
        if (path.split('/orders').length === 2) {
            return ROUTES.ORDERS
        }
        if (path.split('/revenue').length === 2) {
            return ROUTES.STATISTICS
        }
    }

    const handleSelectBrand = e => {
        dispatch({
            type: brandTypes.ChangeBrand,
            payload: e.target.value
        })
    }

    const handleStartDateChange = e => {
        setFrom(moment(e).set(startDateConfig).toISOString())
    }

    const handleEndDateChange = e => {
        setTo(moment(e).set(endDateConfig).toISOString())
    }

    const handleChangeMode = (m) => {
        setMode(m)
    }

    return (
        <div className={classes.root}>
            <div className={classes.headerLegend}>
                <Grid container spacing={0} style={{
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Grid item>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <p className={classes.headerTitle}>Dashboard</p>
                        </div>
                    </Grid>
                    <Grid item style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end'
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
                                    className="btn-base btn-base--success"
                                    labelId="brand"
                                    id="brand"
                                    label="Brand"
                                    value={brandId}
                                    onChange={handleSelectBrand}
                                >
                                    {brandList && brandList.map(item => (
                                        <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                    ))}
                                </Select>

                            </FormControl>

                            {
                                currentPath !== ROUTES.BRAND &&
                                <div style={{
                                    marginLeft: 15
                                }} >
                                    <RangeDatePicker
                                        isShowAll={currentPath === ROUTES.ORDERS}
                                        setFrom={handleStartDateChange}
                                        setMode={handleChangeMode}
                                        setTo={handleEndDateChange}
                                        from={from ? new Date(from) : null}
                                        to={to ? new Date(to) : null} mode={mode} />
                                </div>
                            }
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div style={{
                marginBottom: 30,
                marginTop: 30
            }}>
                <ButtonGroup aria-label="outlined button group" className={classes.sourceFilterBtnGroup}>
                    <Button className={`${currentPath === ROUTES.STATISTICS && 'active'}`}><Link to={`/dashboard/revenue`}>Statistics</Link></Button>
                    <Button className={`${currentPath === ROUTES.ORDERS && 'active'}`}><Link to="/dashboard/orders">Orders</Link></Button>
                    <Button className={`${currentPath === ROUTES.BRAND && 'active'}`}><Link to={`/dashboard/detail/${brandId}`}>Detail</Link></Button>
                </ButtonGroup>
            </div>
            <Suspense>
                <Switch>
                    <Route path="/dashboard/revenue" component={RevenueStatistics} />
                    <Route path="/dashboard/orders" component={OrderList} />
                    <Route path="/dashboard/detail/:brandId" component={BrandDetail} />
                    <Redirect from="/dashboard" to="/dashboard/revenue" />
                </Switch>
            </Suspense>
        </div>
    );
}

const mapStateToProps = store => ({
    brand: store.brand
});

export default connect(mapStateToProps)(Dashboard);