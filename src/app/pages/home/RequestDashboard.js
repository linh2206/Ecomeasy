import React from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import {
    Button, ButtonGroup, Grid, Dialog, DialogContent, TextField, Select, InputLabel,
    Table, TableBody, TableHead, TableCell, Icon, TableRow, FormGroup, MenuItem
} from '@material-ui/core';

RequestDashboard.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    datatable: {
        marginTop: 30
    },
    requestCard: {
        padding: '25px 20px',
        borderRadius: 10,
        color: '#FFF',
        '& p': {
            margin: 0
        }
    },
    ...globalStyles
})

function RequestDashboard(props) {
    const classes = useStyles()
    const columns = [
        {
            label: '',
            property: 'account_author',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Current step',
            property: 'bank_account',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },

        {
            label: '>180 days',
            property: 'balance',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '180 to 90 days',
            property: 'created',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '90 to 30 days',
            property: 'bank_name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '30 to 15 days',
            property: 'action',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '<30 days',
            property: 'action',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <p className={classes.headerTitle}>Request Dashboard</p>
            </div>
            <div className={classes.requestStatusBar} style={{
                margin: '60px 0'
            }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3} xl={3}>
                        <div className={classes.requestCard} style={{
                            background: '#FF1493'
                        }}>
                            <div className={`${classes.requestCardContainer}`}>
                                <p style={{
                                    fontSize: 36,
                                    fontWeight: 800
                                }}>16</p>
                                <p style={{
                                    fontSize: 18
                                }}>In progess items</p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} xl={3}>
                        <div className={classes.requestCard} style={{
                            background: '#ffb732'
                        }}>
                            <div className={`${classes.requestCardContainer}`}>
                                <p style={{
                                    fontSize: 36,
                                    fontWeight: 800
                                }}>1</p>
                                <p style={{
                                    fontSize: 18
                                }}>Completed items</p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} xl={3}>
                        <div className={classes.requestCard} style={{
                            background: '#4646ff'
                        }}>
                            <div className={`${classes.requestCardContainer}`}>
                                <p style={{
                                    fontSize: 36,
                                    fontWeight: 800
                                }}>32</p>
                                <p style={{
                                    fontSize: 18
                                }}>Rejected items</p>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3} xl={3}>
                        <div className={classes.requestCard} style={{
                            background: '#329932'
                        }}>
                            <div className={`${classes.requestCardContainer}`}>
                                <p style={{
                                    fontSize: 36,
                                    fontWeight: 800
                                }}>15</p>
                                <p style={{
                                    fontSize: 18
                                }}>Withdrawn items</p>
                            </div>
                        </div>
                    </Grid>
                </Grid>
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
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Step 1</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>14</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>34</TableCell>
                            <TableCell>42</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Step 1</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>14</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>34</TableCell>
                            <TableCell>42</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Step 1</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>14</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>34</TableCell>
                            <TableCell>42</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

export default RequestDashboard;