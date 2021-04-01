import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Icon } from '@material-ui/core';
import { MARKET_PLACE } from "../../../constant/marketplace"
import { parseLocaleString } from "../../../helpers/helper"
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import Tooltip from '@material-ui/core/Tooltip';
import _ from 'lodash'

RevenueCard.propTypes = {

};

const useStyles = makeStyles({
    root: {
        borderRadius: '4px',
        backgroundColor: '#f7f7f7',
        boxShadow: '0 0 10px rgba(51, 51, 51, 0.15)',
        padding: '15px 20px',
        position: 'relative',
        '&:hover $detailSection': {
            display: 'block'
        }
    },
    detailSection: {
        position: 'absolute',
        color: 'black',
        width: '100%',
        left: 0,
        bottom: '-100%',
        zIndex: 500,
        background: 'white',
        boxShadow: '0 0 10px rgba(51, 51, 51, 0.15)',
        padding: 15,
        display: 'none',
        '& p': {
            margin: 0
        }
    },
    topSection: {
        display: 'flex',
        alignItems: 'flex-end',
        marginBottom: '10px',
        minHeight: '28px',
        '& .title': {
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            textTransform: 'capitalize',
            '& p': {
                margin: 0,
                fontSize: '18px',
                color: '#333333',
                lineHeight: 1
            }
        },
        '& .percentage-change': {
            fontSize: '10px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center'
        },
    },
    revenue: {
        fontSize: '24px',
        fontWeight: 700,
        color: '#014b68',
        margin: 0,
    }
})

function RevenueCard(props) {
    const classes = useStyles()
    const { revenue, name, id, tooltip, oldRevenue, isPrice, detail } = props
    const isIncrease = revenue > oldRevenue
    const total = revenue + oldRevenue
    const percentageChange = (Math.abs(revenue - oldRevenue) / oldRevenue) * 100
    const isInvariant = revenue === oldRevenue || oldRevenue === 0
    return (
        <div className={classes.root}>
            <div className={classes.topSection}>
                <div className="title">
                    {props.showIcon && <Avatar variant="square" alt="logo"
                        src={MARKET_PLACE[id] ? MARKET_PLACE[id].image : toAbsoluteUrl('/media/logos/google-sheet.svg')}
                        style={{ marginRight: '5px', width: '28px', height: '28px' }}></Avatar>}
                    <p>{name.toUpperCase()}</p>
                </div>
                {!isInvariant && <Tooltip title={<span style={{ fontSize: 11 }}>{`${tooltip}: ${parseLocaleString(oldRevenue)}`}</span>}>
                    <div className="percentage-change" style={{
                        color: isIncrease ? '#91dd47' : '#ed0000'
                    }}>
                        <span style={{
                            fontSize: 13
                        }}>{parseLocaleString(percentageChange)}%</span><Icon>{isIncrease ? 'trending_up' : 'trending_down'}</Icon>

                    </div>
                </Tooltip>}
            </div>
            <p className={classes.revenue}>{parseLocaleString(revenue, isPrice)}</p>
            {
                detail && <div className={`${classes.detailSection} tooltip-revenue`}>
                    <p>Đơn thành công: <b>{parseLocaleString(_.get(detail, 'amount.COMPLETED'))}</b></p>
                    <p>Đơn đang vận chuyển: <b>{parseLocaleString(_.get(detail, 'amount.SHIPPING'))}</b></p>
                    <p>Đơn huỷ: <b>{parseLocaleString(_.get(detail, 'amount.CANCELLED'))}</b></p>
                </div>
            }

        </div>
    );
}

export default RevenueCard;