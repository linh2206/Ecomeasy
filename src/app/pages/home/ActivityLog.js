import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { getLog } from "../../crud/auth.crud"
import _ from "lodash"

ActivityLog.propTypes = {

};

const useStyles = makeStyles({
    root: {

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
})

function ActivityLog(props) {
    const classes = useStyles()
    const columns = [
        {
            label: 'Activity',
            property: 'activity',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Source',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Trạng thái',
            property: 'markets',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày',
            property: 'users',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]
    const [logs, setLogs] = useState([])

    useEffect(() => {
        getLog()
            .then(res => {
                setLogs(_.get(res, 'data.result'))
            })
    }, [])

    return (
        <div className={classes.root}>
            <p className={classes.headerTitle}>Nhật ký hoạt động</p>
            <div className={`${classes.datatable} brand-list`}>
                <Table aria-label="simple table">
                    <TableHead>
                        {columns.map((col, index) => (
                            <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                align="left" key={index}>{col.label}</TableCell>
                        ))}
                    </TableHead>
                    <TableBody>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default ActivityLog;