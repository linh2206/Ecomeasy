import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress, TableHead, TableCell, Checkbox, Table, TableRow, TableBody, Button, TablePagination, Icon, Avatar, ListItem, List } from '@material-ui/core';
import { getBrandList, deleteBrand } from '../../crud/brand.crud';
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from '../../../_metronic/utils/utils'
import { MARKET_PLACE } from '../../constant/marketplace'
import _ from "lodash"
import moment from "moment"
import ConfirmationPopup from "../../partials/popup/ConfirmationPopup"
import { ROLE_DETAIL, PERMISSIONS } from "../../constant/role"
import { isAuthenticated } from "../../helpers/helper"
import { connect } from "react-redux";

BrandList.propTypes = {

};

const useStyles = makeStyles({
    root: {
        fontSize: '14px',
        color: '#333',
        '& tr': {
            '&:nth-child(even)': {
                background: 'rgba(140, 160, 179, 0.1)'
            }
        },
    },
    shopStatus: {

    },
    datatable: {
        border: '1px solid #e0e0e0'
    },
    tableHeader: {
        fontWeight: 800
    },
    filterSection: {
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    deleteBtn: {
        border: '1px solid #dbdee4',
        marginRight: '15px'
    },
    searchBlock: {
        marginRight: '15px'
    },
    tableCell: {
        fontSize: '14px'
    },
    table: {
        tablePagination: '30px'
    }
})

const CREATE_BRAND_PERMISSONS = [PERMISSIONS.CREATE_BRAND]
const UPDATE_BRAND_PERMISSONS = [PERMISSIONS.UPDATE_ADMIN_BRAND]

function BrandList(props) {
    const classes = useStyles()
    const [brandList, setBrandList] = useState([])
    const [loading, setLoading] = useState(true)
    const [userAvatarList, setUserAvatarList] = useState([])
    const [deleteConfirmationPopup, setDeleteConfirmationPopup] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [selectedDeleteBrand, setSelectedDeleteBrand] = useState('')
    const userRole = _.get(props, 'auth.user.permissions')

    useEffect(() => {
        getBrandList()
            .then((res) => {
                setLoading(false)
                setBrandList(_.get(res, 'data.result.brands') || [])
                setUserAvatarList(_.get(res, 'data.result.avatarByEmail') || [])
            })
    }, [])

    const handleCloseDeleteConfirmationPopup = () => {
        setDeleteConfirmationPopup(false)
        setDeleteLoading(false)
        setSelectedDeleteBrand('')
    }

    const columns = [
        {
            label: '',
            property: '',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Tên brand',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Sales Channel',
            property: 'markets',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'User',
            property: 'users',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Tạo ngày',
            property: 'createdDate',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: '',
            property: '',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
    ]

    const changePage = () => {

    }

    const removeBrand = () => {
        setDeleteLoading(true)
        deleteBrand(selectedDeleteBrand)
            .then(res => {
                getBrandList()
                    .then((res) => {
                        setDeleteConfirmationPopup(false)
                        setDeleteLoading(false)
                        setBrandList(_.get(res, 'data.result.brands') || [])
                    })
            })
            .catch(err => {
                setDeleteConfirmationPopup(false)
                setDeleteLoading(false)
            })
    }

    return (
        <div className={classes.root}>
            <div className={classes.filterSection}>
                {/* <Button className={classes.deleteBtn}><Icon>delete</Icon></Button> */}
                <div className={`${classes.searchBlock} search`}>
                    <input placeholder="Search" />
                    <Icon>search</Icon>
                </div>
                {
                    isAuthenticated(userRole, CREATE_BRAND_PERMISSONS) && <Link to="/create-brand"><Button className="btn-base btn-base--success" >+ ADD BRAND</Button></Link>
                }
            </div>
            <div className={`${classes.datatable} brand-list`}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell padding="checkbox" align="left">
                                <Checkbox className="checkbox" />
                            </TableCell> */}
                            {columns.map((col, index) => (
                                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`} align="left" key={index}>{col.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {brandList.map((row, index) => (
                            <TableRow key={index}>
                                {/* <TableCell align="left" padding="checkbox">
                                    <Checkbox className="checkbox" />
                                </TableCell> */}
                                <TableCell style={{
                                    width: '50px'
                                }} align="left" className={classes.tableCell}>
                                    <Avatar src={_.get(row, 'avatarUrl.Location')}></Avatar>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>
                                    {row.name}
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell} style={{
                                    width: 500,
                                }}>
                                    <List className="list-market-place">
                                        {
                                            row.shops && row.shops.length > 0 && row.shops.find(item => !item.disconnected) ?
                                                row.shops.map((shop, index) => (
                                                    !shop.disconnected && shop.marketplace !== 'tiki' && <ListItem key={index}>
                                                        <Avatar className="marketplaceLogo" variant="square"
                                                            src={MARKET_PLACE[shop.marketplace] ? MARKET_PLACE[shop.marketplace].image : MARKET_PLACE['googleSheet'].image}></Avatar>
                                                        {
                                                            shop.error ? <Icon className="marketplace-status" style={{
                                                                color: 'red'
                                                            }}>error_icon</Icon> : <Icon className="marketplace-status" style={{
                                                                color: 'green'
                                                            }}>check_circle_icon</Icon>
                                                        }
                                                    </ListItem>
                                                ))
                                                :
                                                <Link to={`connect-market/${row._id}`}>Kết nối</Link>
                                        }
                                    </List>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell} style={{
                                }}>
                                    <List>
                                        {/* {row.admins && row.admins.map((item, index) => index < 3 && (
                                            < ListItem key={index} style={{
                                                left: index * 32 + 'px',
                                                zIndex: row.admins.length - index + 1
                                            }}>
                                                <Avatar title={item.email} src={
                                                    item && _.get(userAvatarList.find(u => u.email === item.email), 'avatar.Location')
                                                }></Avatar>
                                            </ListItem>
                                        ))}

                                        {row.admins && row.admins.length > 3 && <ListItem className="more-user">
                                            <p>+{row.admins && (row.admins.length - 3)}</p>
                                        </ListItem>} */}
                                        {row.admins && row.admins.map((item, index) => (
                                            <ListItem key={index}>{item.email} - {_.get(ROLE_DETAIL[item.role], 'label')}</ListItem>
                                        ))}

                                    </List>
                                </TableCell>
                                <TableCell align="left" className={classes.tableCell}>{row.created ? moment(row.created).format('MM-DD-YYYY') : ''}</TableCell>
                                <TableCell style={{
                                    width: '100px'
                                }} align="left" className={classes.tableCell}>
                                    {isAuthenticated(userRole, UPDATE_BRAND_PERMISSONS) &&
                                        <Icon style={{
                                            marginRight: '15px',
                                            cursor: 'pointer'
                                        }}
                                            onClick={() => {
                                                setSelectedDeleteBrand(row._id)
                                                setDeleteConfirmationPopup(true)
                                            }}>delete</Icon>
                                    }
                                    {isAuthenticated(userRole, UPDATE_BRAND_PERMISSONS) &&
                                        <Link to={`/brand-detail/${row._id}`}><Icon>edit</Icon></Link>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {
                (loading || brandList.length === 0) &&
                <div className="spinner-container">
                    {loading && <CircularProgress />}
                    {!loading && brandList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                </div>
            }

            <div className={classes.tablePagination}>
                <TablePagination
                    onChangePage={changePage}
                    component="div"
                    count={50}
                    rowsPerPage={10}
                    page={1}
                />
            </div>
            <ConfirmationPopup
                message="Bạn có chắc chắn xóa brand?"
                open={deleteConfirmationPopup}
                onClose={handleCloseDeleteConfirmationPopup}
                loading={deleteLoading}
                onOK={removeBrand} />
        </div >

    );
}

const mapStateToProps = store => ({
    brand: store.brand,
    auth: store.auth
});

export default connect(mapStateToProps)(BrandList);