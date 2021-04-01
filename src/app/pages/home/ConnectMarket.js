import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import { Button, Grid, Link, Icon, Dialog, DialogContent, Slide, FormGroup, TextField, InputLabel } from '@material-ui/core';
import { useParams, useHistory } from "react-router-dom";
import { getBrandDetail, connectGoogleDrive, getGoogleSheetFiles, connectSendo, uploadExternalData, selectGoogleDriveFile } from '../../crud/brand.crud';
import { MARKET_PLACE } from '../../constant/marketplace'
import GoogleDriveFilesTracking from './components/GoogleDriveFilesTracking'
import { popupWindow } from '../../helpers/helper'
import _ from "lodash"
import { globalStyles } from '../../styles/globalStyles'
import clsx from "clsx"
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect, useDispatch } from "react-redux";
import { actionTypes } from "../../store/ducks/brand.duck"


ConnectMarket.propTypes = {

};

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
    root: {
        padding: '50px',
        '& .connected': {
            pointerEvents: 'none',
            '& button': {
                backgroundColor: '#fff1ed',
                border: '1px solid #f3592b !important',
                color: '#f3592b',
            }
        }
    },
    formCotnainer: {
        backgroundColor: '#fbfbfb',
        padding: '50px'
    },
    formWrapper: {
        maxWidth: '600px',
        margin: '0 auto'
    },
    formBanner: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    formTitle: {
        fontSize: '20px',
        textAlign: 'center',
        marginBottom: '30px',
        '& p': {
            margin: 0
        }
    },
    legend: {
        fontSize: '30px',
        fontWeight: 800
    },
    marketOption: {
        margin: '0 auto',
        maxWidth: '120px',
        width: '100%',
        border: '1px solid #979797 !important',
        borderRadius: '4px !important',
        color: '#696969',
        padding: '20px 15px',
        fontWeight: 800,
        display: 'block',
        height: 115,
        overflow: 'hidden',
        '& img': {
            borderRadius: 4,
            marginBottom: 10
        },
        '& p': {
            margin: 0
        }
    },
    marketOptionLink: {
        flex: 1,
        textAlign: 'center'
    },
    connectBtn: {
        width: '200px',
        margin: '30px auto',
        display: 'block'
    },
    marketOptionGroup: {
        justifyContent: 'center'
    },
    googleSheetDialog: {
        '& .MuiDialogContent-root': {
            padding: 0
        }
    },
    ...globalStyles
})

function ConnectMarket(props) {
    const classes = useStyles()
    const { brandId } = useParams();
    const [brand, setBrand] = useState()
    const [source, setSource] = useState('')
    const [uploadExternalDialog, setUploadExternalDialog] = useState(false);
    const [googleSheetFileDialog, setGoogleSheetFileDialog] = useState(false);
    const [speadSheetList, setSpeadSheetList] = useState([])
    const [isDriveConnected, setIsDriveConnected] = useState(false)
    const [shop, setShop] = useState('')
    const [connectSendoPopup, setConnectSendoPopup] = useState(false)
    const [isCreateSheet, setIsCreateSheet] = useState(false)
    let googleWindow = ''
    const { intl } = props;
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        getBrandDetail(brandId)
            .then((res) => {
                setBrand(_.get(res, 'data.result') || {})
            })
    }, [])

    // useEffect(() => {
    //     getGoogleSheetFiles(brandId)
    //         .then((res) => {
    //             var data = _.get(res, 'data.result')
    //             if (data !== 'connecting') {
    //                 setIsDriveConnected(true)
    //                 setSpeadSheetList(data.spreadSheetList || [])
    //                 setShop(_.get(data, 'shop._id'))
    //             }
    //         })
    // }, [])

    const getFileTimer = (s) => {
        var timer
        timer = setInterval(() => {
            getGoogleSheetFiles(s)
                .then((res) => {
                    var data = _.get(res, 'data.result')
                    if (data !== 'connecting') {
                        setIsDriveConnected(true)
                        setSpeadSheetList(data.spreadSheetList || [])
                        setShop(_.get(data, 'shop._id'))
                        clearInterval(timer)
                        setGoogleSheetFileDialog(true)
                        googleWindow.close()
                    }
                })
        }, 3000)
    }

    const handleConnectGoogleDrive = (url, s) => {
        googleWindow = popupWindow(url, 'googlesheet', window, 400, 600);
        getFileTimer(s)
    }


    const handleCreateSource = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        if (isCreateSheet) {
            selectGoogleDriveFile(values.name, brandId)
                .then(res => {
                    setSubmitting(false)
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        setUploadExternalDialog(false)
                        setSource(_.get(res, 'data.result.source._id'))
                        handleConnectGoogleDrive(_.get(res, 'data.result.googleOauth'), _.get(res, 'data.result.source._id'))
                    }
                })
                .catch(err => {
                    setStatus('Network error. Please try again')
                    setSubmitting(false)
                })
        }
        else {
            uploadExternalData(
                values.name,
                brandId
            )
                .then(res => {
                    setSubmitting(false);
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        dispatch({
                            type: actionTypes.ChangeBrand,
                            payload: brandId
                        })
                        dispatch({
                            type: actionTypes.ChangeShop,
                            payload: _.get(res, 'data.result._id')
                        })

                        history.push('/dashboard/orders')
                    }
                })
                .catch(() => {
                    resetForm()
                    setSubmitting(false);
                    setStatus('Some thing went wrong');
                });
        }

    }

    const isGoogleDriveConnected = () => brand && _.get(brand, 'brand.shops').find(shop =>
        !shop.disconnected && shop.marketplace === 'googleSheet')

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
                    dispatch({
                        type: actionTypes.ChangeBrand,
                        payload: brandId
                    })

                    history.push('/dashboard/revenue')
                }
            })
            .catch(() => {
                resetForm()
                setSubmitting(false);
                setStatus('Some thing went wrong');
            });
    }


    const marketList = [
        {
            name: 'Shopee',
            val: 'shopee',
            url: 'shopeeAuth'
        },
        {
            name: 'Lazada',
            val: 'lazada',
            url: 'lazadaAuth'
        },
        // {
        //     name: 'Tiki',
        //     val: 'tiki',
        //     url: 'tiki'
        // }
    ]
    return (
        <div className={classes.root}>
            <div className={classes.formCotnainer}>
                <div className={classes.formWrapper}>
                    <div className={classes.formBanner}>
                        <img src={toAbsoluteUrl('/media/banners/connect-market-banner.svg')} />
                    </div>
                    <div className={classes.formTitle}>
                        <p className={classes.legend}>KẾT NỐI KÊNH BÁN HÀNG CỦA BẠN</p>
                        <p>Liên kết sàn để theo dõi dữ liệu</p>
                    </div>
                    <div className={classes.formContent}>
                        <Grid justify="center" container alignItems="center" spacing={2}>
                            {brand && <Grid item xs={12} sm={6} md={2}>
                                <Link
                                    onClick={() => setConnectSendoPopup(true)}
                                    className={`${classes.marketOptionLink} 
                                    ${_.get(brand, 'brand.shops').find(b => !b.disconnected && b.marketplace === 'sendo') ? 'connected' : ''}`}>
                                    <Button
                                        className={classes.marketOption}>
                                        <img src={MARKET_PLACE['sendo'].image} />
                                        <p>Sendo</p>
                                    </Button>
                                </Link>
                            </Grid>}
                            {brand && marketList.map((item, index) => (
                                <Grid item xs={12} sm={6} md={2} key={index}>
                                    <Link href={brand[item.url]}
                                        className={`${classes.marketOptionLink} 
                                    ${_.get(brand, 'brand.shops').find(b => !b.disconnected && item.val === b.marketplace) ? 'connected' : ''}`}>
                                        <Button
                                            className={classes.marketOption}
                                            key={index}>
                                            <img src={MARKET_PLACE[item.val].image} />
                                            <p>{item.name}</p>
                                        </Button>
                                    </Link>
                                </Grid>
                            ))}
                            <Grid item xs={12} sm={6} md={2}>
                                <Link className={classes.marketOptionLink}
                                    onClick={() => {
                                        setIsCreateSheet(true)
                                        setUploadExternalDialog(true)
                                    }}>
                                    <Button
                                        className={classes.marketOption}
                                        key="google-sheet">
                                        <img src={toAbsoluteUrl('/media/logos/google-sheet.svg')} />
                                        <p>Google sheets</p>
                                    </Button>
                                </Link>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Link className={classes.marketOptionLink} onClick={() => {
                                    setIsCreateSheet(false)
                                    setUploadExternalDialog(true)
                                }}>
                                    <Button
                                        className={classes.marketOption}
                                        key="upload">
                                        <Icon style={{
                                            fontSize: 32,
                                            color: '#014B68'
                                        }}>backup</Icon>
                                        <p>Upload</p>
                                    </Button>
                                </Link>

                            </Grid>
                        </Grid>

                    </div>
                </div>
            </div>
            <Dialog
                open={uploadExternalDialog}
                TransitionComponent={Transition}
                keepMounted
                fullWidth={true}
                onClose={() => setUploadExternalDialog(false)}
                maxWidth="sm"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                initialValues={{
                                    name: '',
                                }}
                                validate={values => {
                                    const errors = {};

                                    if (!values.name) {
                                        errors.name = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    return errors;
                                }}
                                onSubmit={handleCreateSource}
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
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder="Source"
                                                    name="name"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values.name}
                                                    helperText={touched.name && errors.name}
                                                    error={Boolean(touched.name && errors.name)}
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
                                                    setUploadExternalDialog(false)
                                                }}>Cancel</Link>

                                        </form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                className={classes.googleSheetDialog}
                open={googleSheetFileDialog}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => setGoogleSheetFileDialog(false)}
                maxWidth="xl"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <GoogleDriveFilesTracking
                        onClose={() => setGoogleSheetFileDialog(false)}
                        speadSheetList={speadSheetList}
                        shop={shop}
                        source={source}
                        brandId={brandId} />
                </DialogContent>
            </Dialog>
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
                                initialValues={{
                                    shop_key: '',
                                    secret_key: ''
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
        </div>

    );
}
export default injectIntl(ConnectMarket)