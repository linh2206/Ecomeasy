import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { globalStyles } from '../../../styles/globalStyles'
import _ from "lodash"
import { Formik } from "formik";
import clsx from "clsx"
import { Button, TextField, FormGroup } from '@material-ui/core';
import { createRequest } from "../../../crud/process.crud"
import { useHistory } from "react-router-dom"

ProcessForm.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function ProcessForm(props) {
    const classes = useStyles()
    const [initialValues, setInitialValues] = useState({})
    const process = _.get(props, 'process')
    const request = _.get(props, 'request') || {}
    const stepId = _.get(props, 'step')
    const isPreview = _.get(props, 'isPreview')
    let currentStep = _.get(props, 'currentStep')
    const [step, setSteps] = useState({})
    const [selectedAction, setSelectedAction] = useState('')
    let history = useHistory()

    useEffect(() => {
        let temp = {}
        if (process && process.steps && process.steps.find(item => item._id === stepId)) {
            currentStep = process.steps.find(item => item._id === stepId)
        }

        currentStep && currentStep.inputData && currentStep.inputData.forEach((item, index) => {
            temp[item.key] = request[item.key] || ''
        })
        setSteps(currentStep)
        setInitialValues(temp)
    }, [])

    useEffect(() => {
        setSteps(currentStep)
    }, [currentStep])

    const handleSubmitForm = (values, { setStatus, setSubmitting, resetForm }) => {
        setSubmitting(true)
        setStatus('')
        try {
            createRequest(step._processId, values, step.stepSlug, selectedAction.controller, request._id)
                .then(res => {
                    setSubmitting(false)
                    resetForm()
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setStatus(errMsg)
                    }
                    else {
                        history.push('/requests')
                    }
                })
                .catch(err => {
                    resetForm()
                    setStatus(err)
                    setSubmitting(false)
                })
        }
        catch (err) {
            console.log(err)
        }
    }

    return (
        <div className={classes.root}>
            <div className={`${classes.form} process-form`} style={{
                padding: 0
            }}>
                <div className={`${classes.formContainer} process-form__container`} >
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validate={values => {
                            const errors = {};

                            return errors;
                        }}
                        onSubmit={handleSubmitForm}
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
                                    {
                                        _.get(step, 'inputData') && _.get(step, 'inputData').map((item, index) => (
                                            <FormGroup key={index} className="input-base">
                                                <TextField
                                                    variant="outlined"
                                                    margin="normal"
                                                    required
                                                    fullWidth
                                                    type="text"
                                                    placeholder={item.label}
                                                    name={item.key}
                                                    id={item.key}
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values[item.key]}
                                                    helperText={touched[item.key] && errors[item.key]}
                                                    error={Boolean(touched[item.key] && errors[item.key])}
                                                /></FormGroup>
                                        ))
                                    }
                                    {
                                        _.get(step, 'actions') && _.get(step, 'actions').map((item, index) => (
                                            <Button key={index} style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                                onClick={() => setSelectedAction(item)}
                                                type="submit"
                                                disabled={isPreview || isSubmitting}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light":
                                                            isSubmitting && selectedAction.name === item.name
                                                    }
                                                )}`}>{item.name}</Button>
                                        ))
                                    }
                                </form>
                            )}
                    </Formik>
                </div>
            </div>
        </div>
    );
}

export default ProcessForm;