import React from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import { Grid, Select, MenuItem, FormControl, Icon, Link } from '@material-ui/core';

ProcessDashboard.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    processList: {
        marginTop: 30
    },
    processCard: {
        boxShadow: '0 0 10px rgba(51, 51, 51, 0.15)',
        position: 'relative',
        textAlign: 'center',
        overflow: 'hidden',
        borderRadius: 5,
        height: '100%',
        '&:hover $processCardAction': {
            transform: 'translateY(0)'
        }
    },
    processCardContainer: {
        height: '100%'
    },
    processCardBanner: {
        height: 150,
        background: '#ffdb99',
    },
    processCardAction: {
        borderTop: '1px solid #dbdbdb',
        transition: '0.2s all linear',
        transform: 'translateY(52px)',
        '& a': {
            display: 'block',
            flex: 1,
            padding: 15
        }
    },
    ...globalStyles
})

function ProcessDashboard(props) {
    const classes = useStyles()

    const data = [
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
        {
            name: 'Purchase Request',
            description: 'Request an item to be purchase'
        },
    ]

    return (
        <div className={classes.root}>
            <div className={classes.headerLegend}>
                <Grid container spacing={0} style={{
                    justifyContent: 'space-between'
                }}>
                    <Grid item>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <p className={classes.headerTitle}>Process Dashboard</p>
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
                        }}>
                            <span>Show</span>
                            <FormControl style={{
                                marginLeft: 15,
                                background: 'unset',
                                height: 33,
                            }} variant="outlined" >
                                <Select
                                    value={2}
                                    style={{
                                        width: 200,
                                        maxHeight: '100%'
                                    }}
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
                                    labelId="brand"
                                    id="brand"
                                    label="Brand"
                                >
                                    <MenuItem>All Category</MenuItem>
                                    <MenuItem>Category 1</MenuItem>
                                    <MenuItem>Category 2</MenuItem>
                                    <MenuItem>Category 3</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.processList}>
                <Grid container spacing={5}>
                    <Grid item xs={12} md={6} lg={3} xl={3}>
                        <div className={classes.processCard}>
                            <div className={`${classes.processCardContainer} flexbox-center-container`}>
                                <div>
                                    <Icon style={{
                                        cursor: 'pointer',
                                        fontSize: 72,
                                        color: '#91dd47'
                                    }}>add_circle_icon</Icon>
                                    <p style={{
                                        fontSize: 20,
                                        color: '#000',
                                        fontWeight: 800
                                    }}>Create from scratch</p>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    {
                        data.map(item => {
                            return (
                                <Grid item xs={12} md={6} lg={3} xl={3}>
                                    <div className={classes.processCard}>
                                        <div className={classes.processCardContainer}>
                                            <div className={`${classes.processCardBanner} flexbox-center-container`}>
                                                <Icon style={{
                                                    fontSize: 54,
                                                    fontWeight: 800,
                                                    color: '#ffa500'
                                                }}>crop_free_icon</Icon>
                                            </div>
                                            <div style={{
                                                padding: 20,
                                                marginTop: 30,
                                                color: '#000',
                                            }}>
                                                <p style={{
                                                    fontSize: 20,
                                                    fontWeight: 800
                                                }}>{item.name}</p>
                                                <p style={{
                                                    fontSize: 16
                                                }}
                                                >{item.description}</p>
                                            </div>
                                            <div className={`${classes.processCardAction} flexbox-center-container`}>
                                                <Link style={{
                                                    borderRight: '1px solid #dbdbdb',
                                                }}>More Infor</Link>
                                                <Link>Install now</Link>
                                            </div>
                                        </div>
                                    </div>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
        </div>
    );
}

export default ProcessDashboard;