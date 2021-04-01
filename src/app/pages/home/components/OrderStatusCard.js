import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Icon, Grid } from '@material-ui/core';
import { MARKET_FILTER } from '../statistics/RevenueStatistics';
import { parseLocaleString } from '../../../helpers/helper'
import _ from "lodash"
import { ORDER_STATUS } from "../../../constant/orderStatus"
import { groupOrderStatus } from "../../../helpers/helper"

OrderStatusCard.propTypes = {

};

export const STATUS_CONFIG = {
    COMPLETED: {
        name: 'Thành công',
        icon: 'check',
        color: '#91dd47'
    },
    SHIPPING: {
        name: 'Đang giao',
        icon: 'sort',
        color: '#f9d513'
    },
    CANCELLED: {
        name: 'Đã hủy',
        icon: 'close',
        color: '#ff7070'
    }
}

const useStyles = makeStyles({
    root: {
        borderRadius: '13px',
        boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        overflow: 'hidden',
        fontSize: '16px',
        color: '#014b68',
        fontWeight: 800,
        '& p': {
            margin: 0
        }
    },
    status: {
        padding: '10px 15px'
    },
    quantity: {
        position: 'relative',
        padding: '15px',
        color: '#696969',
        minHeight: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& p': {
            width: '100%'
        },
        '& .percentage-change': {
            color: '#ed0000',
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            position: 'absolute',
            right: '20px',
            top: '20px'
        },
    }
})

function OrderStatusCard(props) {
    const classes = useStyles()
    let { status, filter } = props
    const [totalOrder, setTotalOrders] = useState(0)
    const [orderData, setOrderData] = useState({})

    useEffect(() => {
        const { data, orderCount } = groupOrderStatus(status, filter)
        setOrderData(data)
        setTotalOrders(orderCount)
    }, [props])

    return (
        <div>
            <p style={{
                color: '#696969',
                fontWeight: 700
            }}>Tổng đơn hàng: {parseLocaleString(totalOrder)}</p>
            <Grid container spacing={4}>
                {
                    Object.keys(orderData).map((key, index) => {
                        return (<Grid item xs={12} sm={3} key={index}>
                            <div className={classes.root}>
                                <div className={classes.status} style={{ backgroundColor: _.get(STATUS_CONFIG[key], 'color') }}>
                                    <Icon style={{ fontSize: '24px', fontWeight: 800 }}>{_.get(STATUS_CONFIG[key], 'icon')}</Icon>
                                    <p>{_.get(STATUS_CONFIG[key], 'name')}</p>
                                </div>
                                <div className={classes.quantity}>
                                    <p style={{ fontSize: '25px' }}>{parseLocaleString(orderData[key])}</p>
                                    <p>đơn hàng</p>
                                    {/* <div className="percentage-change">
                    <Icon>{props.status.isIncrease ? 'arrow_upward' : 'arrow_downward'}</Icon><span>{props.status.percentageChange}%</span>
                </div> */}
                                </div>
                            </div>
                        </Grid>)
                    })
                }
                <Grid item xs={12} sm={3}>
                    <div className={classes.root}>
                        <div className={classes.status} style={{ backgroundColor: '#2A9DF4' }}>
                            <Icon style={{ fontSize: '24px', fontWeight: 800 }}>trending_up</Icon>
                            <p>Tỷ lệ hủy</p>
                        </div>
                        <div className={classes.quantity}>
                            <p style={{ fontSize: '25px' }}>{parseLocaleString((orderData.CANCELLED / (orderData.COMPLETED + orderData.SHIPPING + orderData.CANCELLED)) * 100)}%</p>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}

export default OrderStatusCard;