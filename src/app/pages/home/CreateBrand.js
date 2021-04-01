import React, { useState, useEffect } from 'react';
import { useHistory, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { Formik } from "formik";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
import { makeStyles } from '@material-ui/styles';
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import Header from "../../../_metronic/layout/header/Header";
import { Grid, FormControl, InputLabel, Select, MenuItem, Button, TextField } from '@material-ui/core';
import { FormattedMessage, injectIntl } from "react-intl";
import { createBrand } from '../../crud/brand.crud';
import { actionTypes } from "../../store/ducks/brand.duck"
import { actionTypes as authAction } from "../../../app/store/ducks/auth.duck"
import clsx from 'clsx';
import _ from "lodash"

CreateBrand.propTypes = {

};

const useStyles = makeStyles({
    root: {
        height: '100vh',
        backgroundImage: `url(${toAbsoluteUrl('/media/bg/brand-bg.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 0',
        position: 'relative',
        backgroundRepeat: 'no-repeat',
        '& .kt-header': {
            backgroundColor: 'transparent !important',
            border: 'none',
            position: 'relative',
            left: '0 !important'
        },
        '& .kt-spinner--right:before': {
            right: 15
        },
        '& .MuiFormControl-root': {
            marginBottom: '10px'
        },
        '& .MuiSelect-root': {
            padding: '14px 20px',
        },
        '& .MuiInputBase-root': {
            fontSize: '14px',
            color: '#6b6c6f',
            borderRadius: '20px',
            boxShadow: '0 0 3px 0 rgba(0, 0, 0, 0.05)'
        },
        '& .MuiInputBase-multiline': {
            padding: '14px 20px',
        },
        '& .kt-header__topbar-wrapper': {
            '& span': {
                color: 'rgb(1, 75, 104) !important'
            },
            '& .kt-header__topbar-user': {
                color: 'rgb(1, 75, 104) !important'
            }
        }
    },
    mainLogo: {
        position: 'absolute',
        top: 15,
        left: 30,
        zIndex: 99
    },
    formContainer: {
        zIndex: 10,
        backgroundColor: 'white',
        borderRadius: '25px',
        boxShadow: '0 0 10px rgba(192, 192, 192, 0.3)',
        padding: '50px 30px',
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        maxWidth: '100%'
    },
    formWrapper: {
        maxWidth: '350px',
        margin: '0 auto'
    },
    formLogo: {
        marginBottom: '15px',
        textAlign: 'center',
        '& img': {
            maxWidth: '100%'
        }
    },
    formTitle: {
        textAlign: 'center',
        marginBottom: '15px',
        '& p': {
            margin: 0
        },
    },
    formContent: {

    },
    createBtn: {

    }
})

function CreateBrand(props) {
    const dispatch = useDispatch();
    const classes = useStyles()
    let history = useHistory()
    const { intl } = props
    const [loading, setLoading] = useState(false);
    const [loadingButtonStyle, setLoadingButtonStyle] = useState({
        paddingRight: "2.5rem"
    });

    const enableLoading = () => {
        setLoading(true);
        setLoadingButtonStyle({ paddingRight: "3.5rem" });
    };

    const disableLoading = () => {
        setLoading(false);
        setLoadingButtonStyle({ paddingRight: "2.5rem" });
    };

    const handleSubmit = (values, { setStatus, setSubmitting }) => {
        enableLoading();
        createBrand(values.brand)
            .then((res) => {
                disableLoading()
                const errMgs = _.get(res, 'data.errMgs')
                if (errMgs) {
                    setStatus(errMgs)
                }
                else {
                    const data = _.get(res, 'data.result')
                    dispatch({
                        type: actionTypes.AddBrand,
                        payload: data
                    })
                    const defaultPage = _.get(props, 'auth.defaultPage')
                    defaultPage === '/create-brand' && dispatch({
                        type: authAction.SetPage,
                        payload: `/connect-market/${data._id}`
                    })
                    history.push('/brand')
                }

            })
            .catch(() => {
                setSubmitting(false)
                disableLoading()
            })
    }

    return (
        <div className={classes.root}>
            <Header />
            <Link className={classes.mainLogo} to="/dashboard/revenue">
                <img src={toAbsoluteUrl('/media/logos/ece-logo.svg')} />
            </Link>
            <div className={classes.formContainer}>
                <div className={classes.formWrapper}>

                    <div className={classes.formHeader}>
                        <div className={classes.formLogo}>
                            <img src={toAbsoluteUrl('/media/logos/create-brand-form-logo.svg')} />
                        </div>
                    </div>
                    <Formik
                        initialValues={{
                            brand: ''
                        }}
                        validate={values => {
                            const errors = {};

                            if (!values.brand) {
                                errors.brand = intl.formatMessage({
                                    id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                });
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
                                    {status && <div role="alert" className="alert alert-danger">
                                        <div className="alert-text">{status}</div>
                                    </div>}
                                    <div className={`${classes.formContent} create-brand`}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <FormControl className="input-base" fullWidth variant="outlined">
                                                    <TextField
                                                        id="brand"
                                                        name="brand"
                                                        helperText="This field is required"
                                                        placeholder="Tên brand"
                                                        value={values.brand}
                                                        helperText={touched.brand && errors.brand}
                                                        error={Boolean(touched.brand && errors.brand)}
                                                        variant="outlined"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange} />
                                                </FormControl>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                        {
                                                            "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading
                                                        }
                                                    )}`}
                                                    style={loadingButtonStyle}>
                                                    + ADD BRAND
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </form>
                            )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = store => ({
    brand: store.brand,
    auth: store.auth
});

export default injectIntl(connect(mapStateToProps)(CreateBrand));
