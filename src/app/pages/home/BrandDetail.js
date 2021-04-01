import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { useParams, Link, Prompt } from "react-router-dom";
import { getBrandDetail, editBrand, disconnect, connectSendo } from '../../crud/brand.crud';
import {
    TableHead, TableCell, Table, TableRow, TableBody, Dialog, DialogContent,
    Button, Avatar, Icon, TextField, FormControl, FormGroup, Tooltip, InputLabel
} from '@material-ui/core';
import { MARKET_PLACE } from '../../constant/marketplace'
import moment from 'moment';
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { reducer } from '../../store/ducks/brand.duck';
import { CircularProgress } from '@material-ui/core'
import { useDispatch } from 'react-redux';
import { actionTypes } from "../../store/ducks/brand.duck"
import _ from "lodash"
import CropImageForm from "./components/CropImageForm"
import ConfirmationPopup from "../../partials/popup/ConfirmationPopup"
import { PERMISSIONS, ROLES } from "../../constant/role"
import { isAuthenticated } from "../../helpers/helper"
import { connect } from "react-redux";
import Authorization from '../home/Authorization'
import clsx from "clsx"
import { globalStyles } from '../../styles/globalStyles'

BrandDetail.propTypes = {
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
        '& .cell-marketplace': {
            display: 'flex',
            alignItems: 'center',
            '& img': {
                width: '20px',
                height: '20px',
                borderRadius: '4px'
            },
            '& p': {
                margin: 0,

            }
        },
        '& .cell-action': {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            padding: '8px 0',
            '& button': {
                margin: '8px 0'
            }
        },
        '& .edit-brand-action': {
            minWidth: '20px',
            padding: 0,
            marginLeft: '10px',
            '& .material-icons': {
                margin: 0
            },
            '&--danger': {
                '& .material-icons': {
                    color: 'red'
                }
            },
            '&--success': {
                '& .material-icons': {
                    color: 'green'
                }
            }
        }
    },
    datatable: {
        border: '1px solid #e0e0e0'
    },
    tableHeader: {
        fontWeight: 800
    },
    filterSection: {
        marginBottom: '30px',
        textAlign: 'right'
    },
    btnAction: {
        fontSize: '12px !important'
    },
    tableCell: {
        fontSize: '14px'
    },
    brandLogo: {
        display: 'inline-block',
        position: 'relative'
    },
    brandInfo: {
        display: 'flex',
        alignItems: 'center'
    },
    brandLogoImg: {
        width: '162px',
        height: '162px',
        background: '#bdbdbd'
    },
    uploadAction: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        transform: 'translateX(50%)'
    },
    actionBtn: {
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#f3f3f3',
        minWidth: '44px',
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    brandName: {
        marginLeft: '50px',
        '& span': {
            fontSize: '24px',
            fontWeight: 800,
            color: '#2c2c2c',
        },
        '& .material-icons': {
            fontSize: '20px',
            color: '#b2b2b2',
            marginLeft: '10px'
        }
    },
    brandNameViewMode: {
    },
    brandNameEditMode: {
        display: 'flex',
        alignItems: 'center'
    },
    ...globalStyles
})

const columns = [
    {
        label: 'Thông tin shop',
        property: 'market',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: 'Trạng thái',
        property: 'status',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: 'Ngày đồng bộ',
        property: 'syncDate',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: 'Ngày kết nối',
        property: 'connectedDate',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: '',
        property: 'action',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: '',
        property: 'action',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: '',
        property: 'action',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
    {
        label: '',
        property: 'action',
        horizontalAlign: 'left',
        cellFormat: 'string'
    },
]

const CONNECT_PERMISSION = [PERMISSIONS.CONNECT_SOURCE]
const DISCONNECT_PERMISSION = [ROLES.SUPERADMIN]

function BrandDetail(props) {
    const dispatch = useDispatch();
    const classes = useStyles()
    const { brandId } = useParams()
    const { intl } = props
    const [brand, setBrand] = useState({
        name: '',
        shops: []
    })
    const [isEditMode, setIsEditMode] = useState(false)
    const [tempImageURL, setTempImageURL] = useState('')
    const [brandLogo, setBrandLogo] = useState('')
    const [brandDefaultLogo, setBrandDefaultLogo] = useState('')
    const [logoErr, setLogoErr] = useState('')
    const [file, setFile] = useState('')
    const [openUploadDataDialog, setUploadDataDialog] = useState(false)
    const [uploadLogoLoading, setUploadLogoLoading] = useState(false)
    const [shops, setShops] = useState([])
    const [disconnectId, setDisconnectId] = useState('')
    const [disconnectConfirmationPopup, setDisconnectConfirmationPopup] = useState(false)
    const [disconnectLoading, setDisconnectLoading] = useState(false)
    const [connectingURL, setConnectingURL] = useState({})
    const [connectSendoPopup, setConnectSendoPopup] = useState(false)
    const userRole = _.get(props, 'auth.user.permissions')
    const [sendoKey, setSendoKey] = useState({
        shop_key: '',
        secret_key: ''
    })

    useEffect(() => {
        fetchBrandDetail()
    }, [brandId])

    const fetchBrandDetail = () => {
        getBrandDetail(brandId)
            .then((res) => {
                const brand = _.get(res, 'data.result.brand')
                setConnectingURL(_.get(res, 'data.result') || {})
                setShops(_.get(res, 'data.result.brand.shops'))
                setBrand(brand || {})
                setBrandDefaultLogo(_.get(brand, 'avatarUrl.Location'))
            })
    }

    const uploadImage = e => {
        let avatar = e.target.files[0]
        if (avatar && avatar.type) {
            if (avatar.type.includes('image')) {
                setUploadDataDialog(true)
                setLogoErr('')
                setTempImageURL((window.URL
                    ? URL
                    : window.webkitURL
                ).createObjectURL(avatar))
            }
            else {
                setLogoErr('Wrong image format. Please select another file')
            }
        }
    }

    const disconnectShop = () => {
        setDisconnectLoading(true)
        disconnect(disconnectId)
            .then(res => {
                setDisconnectConfirmationPopup(false)
                setDisconnectLoading(false)
                getBrandDetail(brandId)
                    .then((res) => {
                        setShops(_.get(res, 'data.result.brand.shops'))
                    })
            })
            .catch(err => {
                setDisconnectConfirmationPopup(false)
                setDisconnectLoading(false)
            })
    }

    const handleCloseDisconnectConfirmationPopup = () => {
        setDisconnectConfirmationPopup(false)
        setDisconnectLoading(false)
    }

    const handleEditBrandLogo = (img) => {
        setUploadLogoLoading(true)
        setLogoErr('')
        setTimeout(() => {
            editBrand(brandId, '', _.get(img, 'file'))
                .then(res => {
                    setUploadLogoLoading(false)
                    setUploadDataDialog(false)
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setLogoErr(errMsg)
                    }
                    else {
                        setBrandDefaultLogo(_.get(img, 'url'))
                    }
                })
                .catch(err => {
                    setLogoErr('Network error. Please try again')
                    setUploadLogoLoading(false)
                    setUploadDataDialog(false)
                })
        }, 500)
    }

    const handleCloseUploadDialog = () => {
        setFile('')
        setUploadDataDialog(false)
        setLogoErr('')
    }

    const handleSubmit = (values, { setStatus, setSubmitting }) => {
        setSubmitting(true)
        setStatus('')
        setTimeout(() => {
            editBrand(brandId, values.brand)
                .then(res => {
                    setSubmitting(false)
                    setIsEditMode(false)
                    if (res.data.errMsg) {
                        setStatus(res.data.errMsg)
                    }
                    else {
                        setBrand({
                            ...brand,
                            name: res.data.result.name
                        })
                        dispatch({
                            type: actionTypes.EditBrand,
                            payload: res.data.result
                        })
                    }

                })
                .catch(err => {
                    setStatus('Network error. Please try again')
                    setSubmitting(false)
                })
        }, 500)

    }

    const getConnectLink = marketplace => {
        switch (marketplace) {
            case 'lazada':
                return connectingURL['lazadaAuth']
            case 'tiki':
                return connectingURL['tiki']
            case 'shopee':
                return connectingURL['shopeeAuth']
            default:
                return '#'
        }
    }

    const handleConnectSendo = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);

        connectSendo(
            values.shop_key,
            values.secret_key,
            brandId
        )
            .then(res => {
                setSubmitting(false);
                resetForm()
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setStatus(JSON.stringify(errMsg))
                }
                else {
                    setConnectSendoPopup(false)
                    fetchBrandDetail()
                }
            })
            .catch(() => {
                resetForm()
                setSubmitting(false);
                setStatus('Some thing went wrong');
            });
    }

    return (
        <div className={classes.root}>
            <Formik
                enableReinitialize
                initialValues={{
                    brand: brand.name || '',
                    avatar: ''
                }}
                validate={values => {
                    const errors = {};

                    if (!values.brand) {
                        errors.brand = intl.formatMessage({
                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                        });
                    }

                    if (values.avatar) {
                        errors.avatar = 'test'
                    }

                    return errors;
                }}
                onSubmit={handleSubmit}
            >
                {({
                    values,
                    status,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting
                }) => (
                        <form autoComplete="off" noValidate={true} onSubmit={handleSubmit}>
                            <div className={classes.brandInfo}>
                                <div className={classes.brandLogo}>
                                    <Avatar className={classes.brandLogoImg} src={brandDefaultLogo}></Avatar>
                                    <div className={classes.uploadAction}>
                                        <label for="file-input" className={classes.actionBtn}><Icon>publish</Icon></label>
                                    </div>

                                </div>
                                <TextField
                                    id="file-input"
                                    type="file"
                                    style={{
                                        display: 'none'
                                    }}
                                    value={file}
                                    onChange={uploadImage}
                                />
                                <div className={classes.brandName}>
                                    {
                                        isEditMode ? <div className={classes.brandNameEditMode}>
                                            <FormControl fullWidth >
                                                <TextField
                                                    id="brand"
                                                    name="brand"
                                                    placeholder="Tên brand"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.brand}
                                                    helperText={touched.brand && errors.brand}
                                                    error={Boolean(touched.brand && errors.brand)}
                                                />
                                            </FormControl>
                                            {
                                                isSubmitting ? <div>
                                                    <CircularProgress size="20px" />
                                                </div>
                                                    :
                                                    <div style={{
                                                        display: 'flex'
                                                    }}>
                                                        <Button
                                                            onClick={() => {
                                                                values.brand = brand.name
                                                                setIsEditMode(false)
                                                            }}
                                                            className="edit-brand-action edit-brand-action--danger"><Icon>clear</Icon></Button>
                                                        <Button
                                                            className={`edit-brand-action edit-brand-action--success ${!values.brand || values.brand === brand.name ? 'disabled' : ''}`}
                                                            type="submit"><Icon>check</Icon></Button>
                                                    </div>
                                            }
                                        </div> :
                                            <div className={classes.brandNameViewMode}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center'
                                                }}>
                                                    <span>{brand.name}</span>
                                                    <Button
                                                        onClick={() => {
                                                            setIsEditMode(true)
                                                            values.brand = brand.name
                                                            errors.brand = ''
                                                        }}
                                                        className="edit-brand-action"><Icon>edit</Icon></Button>
                                                </div>
                                                <p style={{
                                                    margin: 0
                                                }}>Người tạo: {_.get(brand, 'createBy.email')}</p>
                                                <p>Ngày tạo: {moment(_.get(brand, 'created')).format('MM/DD/YYYY')}</p>
                                            </div>
                                    }
                                </div>
                            </div>
                            {status && <div role="alert" style={{
                                maxWidth: '400px',
                                margin: '20px 0'
                            }} className="alert alert-danger">
                                <div className="alert-text">{status}</div>
                            </div>}
                            {logoErr && !status && <div role="alert" style={{
                                maxWidth: '400px',
                                margin: '20px 0'
                            }} className="alert alert-danger">
                                <div className="alert-text">{logoErr}</div>
                            </div>}
                            <Prompt
                                when={(brand.name && values.brand !== brand.name)}
                                message="Are you sure you want to leave?"
                            />
                        </form>
                    )}
            </Formik>

            <div className={classes.filterSection}>
                {
                    isAuthenticated(userRole, CONNECT_PERMISSION) &&
                    <Link to={`/connect-market/${brandId}`}><Button className="btn-base btn-base--success">Kết nối</Button></Link>
                }
            </div>
            <div className={classes.datatable}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((col, index) => (
                                <TableCell className={classes.tableCell} className={classes.tableHeader} align="left" key={index}>{col.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {shops && shops.map((row, index) => (
                            !row.disconnected && row.marketplace !== 'tiki' &&
                            <TableRow key={index}>
                                <TableCell className={`${classes.tableCell}`} align="left">
                                    <div className="cell-marketplace">
                                        <Avatar variant="square"
                                            src={MARKET_PLACE[row.marketplace] ? MARKET_PLACE[row.marketplace].image : MARKET_PLACE['googleSheet'].image}>
                                        </Avatar>
                                        {row.name || (row[row.connectedShop] && (row[row.connectedShop].shop_name || row[row.connectedShop].name))}
                                        {/* <p>{MARKET_PLACE[row.marketplace] && MARKET_PLACE[row.marketplace].name}</p> */}
                                    </div>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="left">

                                    {row.error ?
                                        <Tooltip title={<span style={{ fontSize: 11 }}>{`Error: ${JSON.stringify(_.get(row, 'error.message') || '')}`}</span>}><p className="chip chip--danger">Error</p></Tooltip> :
                                        <p className="chip chip--success">Active</p>}</TableCell>
                                <TableCell className={classes.tableCell} align="left">-</TableCell>
                                <TableCell className={classes.tableCell} align="left">
                                    {moment.utc(row.created).local().format('MM-DD-YYYY')}</TableCell>
                                <TableCell style={{
                                    width: 80
                                }}>{row.error && <a href={getConnectLink(row.marketplace)} onClick={(e) => {
                                    if (row.marketplace === 'sendo') {
                                        e.preventDefault()
                                        setSendoKey({
                                            shop_key: _.get(row, 'sourceDetail.shop_key'),
                                            secret_key: _.get(row, 'sourceDetail.secret_key')
                                        })
                                        setConnectSendoPopup(true)
                                    }
                                }} target="_blank">Reconnect</a>}
                                </TableCell>
                                <TableCell style={{
                                    width: 80
                                }}>{row.spreadSheet && <div>{row.connectedShop.email}</div>
                                    }</TableCell>
                                <TableCell style={{
                                    width: 80
                                }}>{row.spreadSheet && <a
                                    href={`https://docs.google.com/spreadsheets/d/${row.spreadSheet}`}>Preview</a>
                                    }</TableCell>
                                <TableCell style={{
                                    width: 80,
                                    padding: 0,
                                    textAlign: 'center'
                                }} className={classes.tableCell} align="left">
                                    <div className="cell-action">
                                        {
                                            isAuthenticated(userRole, DISCONNECT_PERMISSION) &&

                                            <Link
                                                onClick={(e) => {
                                                    setDisconnectConfirmationPopup(true)
                                                    setDisconnectId(row._id)
                                                }}
                                                href="#">Xóa</Link>
                                        }
                                        {/* <Button className={`btn-base btn-base--table-action`}><Icon>loop</Icon>Đồng bộ sản phẩm</Button>
                                        <Button className={`btn-base btn-base--table-action`}><Icon>loop</Icon>Đồng bộ đơn hàng</Button> */}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <Authorization onUpdatedAdmin={fetchBrandDetail} brandId={brandId} admins={brand.admins && brand.invitations && [...brand.admins, ...brand.invitations]} />
            <Dialog
                open={openUploadDataDialog}
                keepMounted
                maxWidth="md"
                onClose={handleCloseUploadDialog}
            >
                <DialogContent>
                    <CropImageForm
                        loading={uploadLogoLoading}
                        src={tempImageURL}
                        onCancel={handleCloseUploadDialog}
                        onSave={handleEditBrandLogo} />
                </DialogContent>
            </Dialog>
            <ConfirmationPopup
                message="Bạn có chắc chắn ngưng kết nối không? Ngưng kết nối sẽ mất hết dữ liệu"
                open={disconnectConfirmationPopup}
                onClose={handleCloseDisconnectConfirmationPopup}
                loading={disconnectLoading}
                onOK={disconnectShop} />
            <Dialog
                open={connectSendoPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setConnectSendoPopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    shop_key: sendoKey.shop_key,
                                    secret_key: sendoKey.secret_key
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.shop_key) {
                                        errors.shop_key = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    if (!values.secret_key) {
                                        errors.secret_key = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleConnectSendo}
                            >
                                {({
                                    values,
                                    status,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    handleSubmit,
                                    isSubmitting,
                                    resetForm
                                }) => (
                                        <form onSubmit={handleSubmit} noValidate>
                                            {status && <div role="alert" className="alert alert-danger">
                                                <div className="alert-text">{status}</div>
                                            </div>}
                                            <FormGroup className="input-base">
                                                <InputLabel className="input-base__label">Shop key</InputLabel>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Shop key"
                                                    name="shop_key"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.shop_key}
                                                    helperText={touched.shop_key && errors.shop_key}
                                                    error={Boolean(touched.shop_key && errors.shop_key)}
                                                /></FormGroup>
                                            <FormGroup className="input-base">
                                                <InputLabel className="input-base__label">Secret key</InputLabel>
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Secret key"
                                                    name="secret_key"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.secret_key}
                                                    helperText={touched.secret_key && errors.secret_key}
                                                    error={Boolean(touched.secret_key && errors.secret_key)}
                                                /></FormGroup>

                                            <Button style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                                                    }
                                                )}`}>Submit</Button>
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setConnectSendoPopup(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>

                    </div>
                </DialogContent>
            </Dialog>
        </div >
    );
}

const mapStateToProps = store => ({
    brand: store.brand,
    auth: store.auth
});

export default injectIntl(connect(mapStateToProps)(BrandDetail));