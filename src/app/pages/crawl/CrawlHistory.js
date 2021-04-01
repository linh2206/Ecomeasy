import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableHead, TableRow, TableCell, FormGroup, CircularProgress,
    Button, TableBody, Icon, Dialog, DialogContent, TextField
} from '@material-ui/core';
import { Link } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import moment from 'moment'
import _ from 'lodash'
import { getCrawlHistory } from '../../crud/data.crud'


CrawlHistory.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function CrawlHistory(props) {
    const classes = useStyles()
    const columns = [
        {
            label: 'Email',
            property: 'email',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Count',
            property: 'count',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Detail',
            property: 'detail',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]
    const [createCampaignPopup, setCreateCampaignPopup] = useState(false)
    const [editCampaignPopup, setEditCampaignPopup] = useState(false)
    const [historyList, setHistoryList] = useState([])
    const [fetchHistoryListLoading, setFetchHistoryListLoading] = useState(false)

    const fetchHistory = () => {
        setFetchHistoryListLoading(true)
        setHistoryList([])
        getCrawlHistory()
            .then(res => {
                setFetchHistoryListLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setHistoryList(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setFetchHistoryListLoading(false)
            })
    }

    useEffect(() => {
        fetchHistory()
    }, [])
    return (
        <div className={classes.root}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>Lịch sử crawl</p>
                {/* <Button onClick={() => setCreateCampaignPopup(true)} className="btn-base btn-base--success" >CREATE CAMPAIGN</Button> */}
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
                            historyList.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {row._id}
                                    </TableCell>
                                    <TableCell>
                                        {row.count}
                                    </TableCell>
                                    <TableCell>
                                        <ul>
                                            {row.history && row.history.map((item, index) => (
                                                <li key={index}>
                                                    <p>Ngày: {moment(item.created).format('MM/DD/YYYY')}</p>
                                                    {item.keyword && <p>Keyword: {item.keyword}</p>}
                                                    {item.shopid && <p>Link: <a target="_blank" href={`https://shopee.vn/shop/${item.shopid}/`}>{`https://shopee.vn/shop/${item.shopid}/`}</a></p>}
                                                </li>
                                            ))}
                                        </ul>

                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                {
                    (fetchHistoryListLoading || historyList.length === 0) &&
                    <div className="spinner-container">
                        {fetchHistoryListLoading && <CircularProgress />}
                        {!fetchHistoryListLoading && historyList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                    </div>
                }
            </div>
        </div>
    );
}

export default CrawlHistory;