import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Table, TableHead, TableCell, TableBody, CircularProgress, TableRow } from '@material-ui/core';
import { getShops } from "../../crud/statitics.crud"
import _ from "lodash"

ShopList.propTypes = {

};

const useStyles = makeStyles({
    root: {
        '& tr': {
            '&:nth-child(even)': {
                background: 'rgba(140, 160, 179, 0.1)'
            }
        },
    },
    headerTitle: {
        color: '#014b68',
        fontWeight: 800,
        fontSize: '32px',
        margin: '0 15px 30px 0'
    },
    datatable: {
        border: '1px solid #e0e0e0'
    },
    tableHeader: {
        fontWeight: 800
    },
})

function ShopList(props) {
    const classes = useStyles()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [shops, setShops] = useState([])

    const columns = [
        {
            label: 'Tên shop',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Marketplace',
            property: 'marketplace',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Connected shop',
            property: 'connectedshop',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Source detail',
            property: 'sourcedetail',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'spreadSheet',
            property: 'spreadSheet',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Sync date',
            property: 'syncdate',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Brand ID',
            property: 'brandId',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

    useEffect(() => {
        setLoading(true)
        setShops([])
        setErrorMessage('')
        getShops()
            .then(res => {
                setLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setErrorMessage(errMsg)
                    setShops([])
                }
                else {
                    setShops(_.get(res, 'data.result'))
                    setErrorMessage('')
                }
            })
            .catch(err => {
                setErrorMessage(err)
            })
    }, [])

    return (
        <div className={classes.root}>
            <p className={classes.headerTitle}>Danh sách shops</p>
            <div className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                        {shops && shops.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.marketplace}</TableCell>
                                <TableCell><span style={{
                                    wordBreak: 'break-all'
                                }}>{row.connectedShop && JSON.stringify(row.connectedShop)}</span></TableCell>
                                <TableCell><span style={{
                                    wordBreak: 'break-all'
                                }}>{row.sourceDetail && JSON.stringify(row.sourceDetail)}</span></TableCell>
                                <TableCell><span style={{
                                    wordBreak: 'break-all'
                                }}>{row.spreadSheet}</span></TableCell>
                                <TableCell>{row.syncDate}</TableCell>
                                <TableCell>{row.brandId}</TableCell>
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
        </div>
    );
}

export default ShopList;