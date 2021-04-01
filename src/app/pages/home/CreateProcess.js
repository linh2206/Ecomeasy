import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { globalStyles } from '../../styles/globalStyles'
import {
    Button, FormGroup, TextField, Icon, InputLabel, Link, Checkbox,
    FormControlLabel, Select, MenuItem, Dialog, DialogContent, TextareaAutosize
} from '@material-ui/core';
import _ from "lodash"
import clsx from "clsx"
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { getUserList } from '../../crud/statitics.crud'
import { useParams } from "react-router-dom"
import { connect, useDispatch } from "react-redux";
import { getProcessList, createStep, editStep, getStepActionList } from "../../crud/process.crud"
import { actionTypes } from '../../store/ducks/process.duck'
import ProcessForm from './components/ProcessForm'

CreateProcess.propTypes = {

};

const useStyles = makeStyles({
    root: {
        '& .dropdown .MuiInputLabel-root': {
            marginBottom: 17
        },
        '& .process-form': {
            width: 'unset !important',
            padding: '0 30px !important'
        },
        '& .process-form__container': {
            width: '250px !important'
        }
    },
    departmentList: {
        marginTop: 15
    },
    processCard: {
        borderRadius: '4px',
        backgroundColor: '#f7f7f7',
        boxShadow: '0 0 10px rgba(51, 51, 51, 0.15)',
        padding: '15px 20px',
        position: 'relative',
        height: '100%',
        color: '#333333'
    },
    processName: {
        fontSize: 18,
        fontWeight: 700,
        paddingRight: 60
    },
    stepList: {
        listStyle: 'none',
        padding: 0,
        marginTop: 30
    },
    stepItem: {
        backgroundColor: '#f7f7f7',
        boxShadow: '0 0 10px rgba(51, 51, 51, 0.15)',
        padding: '30px',
        position: 'relative',
        margin: '30px auto',
        display: 'flex'
    },
    stepOptions: {
        border: '1px solid #CECECE',
        marginTop: 15,
        padding: 30,
        position: 'relative'
    },
    absoluteAction: {
        color: 'red',
        position: 'absolute',
        right: 15,
        top: 15
    },
    stepHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    stepTitle: {
        color: '#333',
        fontSize: 14,
        fontWeight: 800,
        margin: 0
    },
    stepIconButton: {
        cursor: 'pointer'
    },
    stepField: {
        display: 'flex',
        alignItems: 'flex-start',
        '& >div': {
            flex: 1,
            margin: '0 7px'
        },
        marginBottom: 15
    },
    ...globalStyles
})

function CreateProcess(props) {
    const classes = useStyles()
    const { intl } = props;
    const { processId } = useParams()
    const dispatch = useDispatch()
    const [originalStep, setOriginalStep] = useState([])

    const baseField = {
        key: '',
        label: '',
        type: '',
        hint: '',
        required: false
    }
    const baseNextStep = {
        name: '',
        description: '',
        controller: '',
        nextStep: '',
    }
    const baseStep = {
        stepName: '',
        stepDes: '',
        stepSlug: '',
        inputData: [{ ...baseField }],
        processor: [],
        actions: [{ ...baseNextStep }]
    }
    const [users, setUsers] = useState([])
    const [addUserPopup, setAddUserPopup] = useState(false)
    const [createStepPopup, setcreateStepPopup] = useState(false)
    const [steps, setSteps] = useState([])
    const [currentProcess, setCurrentProcess] = useState({})
    const [selectedStep, setSelectedStep] = useState({})
    const [stepActionList, setStepActionList] = useState({})

    const fetchUserList = () => {
        getUserList()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setCurrentProcess(_.get(props, 'process.processList').find(item => item._id === processId))
                    setUsers(_.get(res, 'data.result') || [])
                }
            })
    }

    const fetchStepActionList = () => {
        getStepActionList()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setStepActionList(_.get(res, 'data.result') || [])
                }
            })
    }

    useEffect(() => {
        fetchUserList()
        fetchProcessList()
        fetchStepActionList()
    }, [])

    const fetchProcessList = () => {
        getProcessList()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    dispatch({
                        type: actionTypes.SetProcessList,
                        payload: _.get(res, 'data.result') || []
                    })
                    const tempStep = _.get(_.get(res, 'data.result').find(item => item._id === processId), 'steps')
                    setSteps(_.cloneDeep(tempStep))
                }
            })
    }

    const removeStep = (index) => {
        let tempStep = [...steps]
        tempStep.splice(index, 1)
        setSteps(tempStep)
    }

    const addField = (index) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData.push({ ...baseField })
        setSteps(tempStep)
    }

    const handleChangeStepDescription = (e, index) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].stepDes = e.target.value
        setSteps(tempStep)
    }

    const removeField = (index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData.splice(subIndex, 1)
        setSteps(tempStep)
    }

    const addNextStep = (index) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].actions.push({ ...baseNextStep })
        setSteps(tempStep)
    }

    const removeNextStep = (index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].actions.splice(subIndex, 1)
        setSteps(tempStep)
    }

    const handleAsign = () => {
        setAddUserPopup(false)
    }

    const handleCreateStep = (values, { setStatus, setSubmitting, resetForm }) => {
        setStatus('')
        setSubmitting(true);
        createStep(
            processId,
            values.name,
            values.slug,
            values.description,
        )
            .then(res => {
                setSubmitting(false);
                resetForm()
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                    setStatus(errMsg)
                }
                else {
                    const tempSteps = _.cloneDeep(steps)
                    tempSteps.push(_.get(res, 'data.result'))
                    setSteps(tempSteps)
                    setcreateStepPopup(false)
                }
            })
            .catch(() => {
                resetForm()
                setSubmitting(false);
                setStatus('Some thing went wrong');
            });
    }

    const handleChangetype = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData[subIndex].type = event.target.value
        setSteps(tempStep)
    }

    const handleCheckRequired = (e, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData[subIndex].required = e.target.checked
        setSteps(tempStep)
    }

    const handleSelectUser = (e, id) => {
        let tempStep = _.cloneDeep(steps)
        let tempProcessor = [...selectedStep.processors]
        if (tempProcessor.includes(id)) {
            tempProcessor.splice(tempProcessor.indexOf(id), 1)
        }
        else {
            tempProcessor.push(id)
        }
        tempStep.find(item => item._id === selectedStep._id).processors = [...tempProcessor]

        setSteps(tempStep)
        setSelectedStep(tempStep.find(item => item._id === selectedStep._id))
    }

    const handleEditSteps = () => {
        let editPromise = []
        if (steps && steps.length > 0) {
            steps.forEach(s => {
                editPromise.push(editStep(processId, s.stepSlug, s.inputData, s.actions))
            })
        }
        Promise.all(editPromise)
            .then(res => {
            })
    }

    const handleChangeKey = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData[subIndex].key = event.target.value
        setSteps(tempStep)
    }

    const handleChangeActionName = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].actions[subIndex].name = event.target.value
        setSteps(tempStep)
    }

    const handleChangeActionDescription = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].actions[subIndex].description = event.target.value
        setSteps(tempStep)
    }

    const handleChangeActionController = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].actions[subIndex].controller = event.target.value
        setSteps(tempStep)
    }

    const handleChangeActionStep = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].actions[subIndex].nextStep = event.target.value
        setSteps(tempStep)
    }

    const handleChangeLabel = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData[subIndex].label = event.target.value
        setSteps(tempStep)
    }

    const handleChangeHint = (event, index, subIndex) => {
        let tempStep = _.cloneDeep(steps)
        tempStep[index].inputData[subIndex].hint = event.target.value
        setSteps(tempStep)
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <p className={classes.headerTitle}>{_.get(currentProcess, 'name')}</p>
            </div>
            <div>
                <Button
                    onClick={() => setcreateStepPopup(true)}
                    style={{
                        marginTop: 15
                    }} className="btn-base btn-base--success">Add Step</Button>
                <ul className={classes.stepList}>
                    {
                        steps && steps.length > 0 && steps.map((item, index) => {
                            return <React.Fragment>
                                <li key={index} className={classes.stepItem}>
                                    <div style={{
                                        flex: 1
                                    }}>
                                        {
                                            steps.length > 1 &&
                                            <Button
                                                className={classes.absoluteAction}
                                                onClick={() => removeStep(index)}><Icon>delete_icon</Icon></Button>
                                        }

                                        <p style={{
                                            color: '#333333',
                                            fontSize: 20,
                                            fontWeight: 800,
                                            marginBottom: 30
                                        }}>{`${item.stepName} (${item.stepSlug})`}</p>
                                        <FormGroup className="input-base dropdown">
                                            <InputLabel>Description</InputLabel>
                                            <TextareaAutosize
                                                rowsMax={4}
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                type="text"
                                                name="description"
                                                value={item.stepDes}
                                                onChange={e => handleChangeStepDescription(e, index)}
                                            />
                                        </FormGroup>
                                        <div className={classes.stepOptions}>
                                            <div className={classes.stepHeader}>
                                                <p className={classes.stepTitle}>Data</p>
                                                {<Icon
                                                    className={classes.stepIconButton}
                                                    style={{
                                                        color: 'green'
                                                    }}
                                                    onClick={() => addField(index)}
                                                >add_icon</Icon>
                                                }
                                            </div>
                                            {
                                                item && item.inputData && item.inputData.length > 0 && item.inputData.map((subItem, subIndex) => (

                                                    <div key={subIndex} style={{
                                                        display: 'flex'
                                                    }} >
                                                        <div style={{
                                                            width: '60%',
                                                            marginRight: 15
                                                        }}>
                                                            <div className={classes.stepField}>
                                                                <button style={{
                                                                    flex: 'unset',
                                                                    transform: 'translateY(38px)',
                                                                    background: 'none',
                                                                    border: 'none'
                                                                }}>
                                                                    <Icon
                                                                        className={classes.stepIconButton}
                                                                        style={{
                                                                            color: 'red'
                                                                        }}
                                                                        onClick={() => removeField(index, subIndex)}
                                                                    >delete_icon</Icon>
                                                                </button>
                                                                <FormGroup className="input-base">
                                                                    <InputLabel>Key</InputLabel>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        required
                                                                        fullWidth
                                                                        type="text"
                                                                        placeholder="Key"
                                                                        name="name"
                                                                        onChange={e => handleChangeKey(e, index, subIndex)}
                                                                        value={subItem.key}
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="input-base">
                                                                    <InputLabel>Label</InputLabel>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        required
                                                                        fullWidth
                                                                        type="text"
                                                                        placeholder="Label"
                                                                        name="name"
                                                                        onChange={e => handleChangeLabel(e, index, subIndex)}
                                                                        value={subItem.label}
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                            <div className={classes.stepField}>
                                                                <FormGroup variant="outlined" className="dropdown" style={{
                                                                    marginLeft: 40
                                                                }}>
                                                                    <InputLabel>Type</InputLabel>
                                                                    <Select
                                                                        onChange={e => handleChangetype(e, index, subIndex)}
                                                                        value={subItem.string} MenuProps={{
                                                                            anchorOrigin: {
                                                                                vertical: "bottom",
                                                                                horizontal: "left"
                                                                            },
                                                                            transformOrigin: {
                                                                                vertical: "top",
                                                                                horizontal: "left"
                                                                            },
                                                                            getContentAnchorEl: null
                                                                        }}>
                                                                        <MenuItem value="string">String</MenuItem>
                                                                        <MenuItem value="number">Number</MenuItem>
                                                                        <MenuItem value="date">Date</MenuItem>
                                                                    </Select>
                                                                </FormGroup>
                                                                <FormGroup variant="outlined" className="checkbox" style={{
                                                                    marginTop: 25,
                                                                }}>
                                                                    <FormControlLabel
                                                                        style={{
                                                                            margin: '5px 0'
                                                                        }}
                                                                        control={
                                                                            <Checkbox
                                                                                name="checkedB"
                                                                                color="primary"
                                                                                checked={subItem.required}
                                                                                onChange={e => handleCheckRequired(e, index, subIndex)}
                                                                                style={{
                                                                                    marginRight: 5
                                                                                }}
                                                                            />
                                                                        }
                                                                        label="Required"
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            width: '40%',
                                                        }}>
                                                            <FormGroup className="input-base dropdown">
                                                                <InputLabel>Hint</InputLabel>
                                                                <TextareaAutosize
                                                                    rowsMax={4}
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    required
                                                                    fullWidth
                                                                    type="text"
                                                                    name="hint"
                                                                    onChange={e => handleChangeHint(e, index, subIndex)}
                                                                />
                                                            </FormGroup></div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className={classes.stepOptions}>
                                            <div className={classes.stepHeader}>
                                                <p className={classes.stepTitle}>Actions</p>

                                                {<Icon
                                                    className={classes.stepIconButton}
                                                    style={{
                                                        color: 'green'
                                                    }}
                                                    onClick={() => addNextStep(index)}
                                                >add_icon</Icon>
                                                }
                                            </div>
                                            {
                                                item && item.actions && item.actions.length > 0 && item.actions.map((subItem, subIndex) => (
                                                    <div key={subIndex} style={{
                                                        display: 'flex'
                                                    }} >
                                                        <div style={{
                                                            width: '60%',
                                                            marginRight: 15
                                                        }}>
                                                            <div className={classes.stepField}>
                                                                <button style={{
                                                                    flex: 'unset',
                                                                    transform: 'translateY(38px)',
                                                                    background: 'none',
                                                                    border: 'none'
                                                                }}>
                                                                    <Icon
                                                                        className={classes.stepIconButton}
                                                                        style={{
                                                                            color: 'red'
                                                                        }}
                                                                        onClick={() => removeNextStep(index, subIndex)}
                                                                    >delete_icon</Icon>
                                                                </button>
                                                                <FormGroup className="input-base">
                                                                    <InputLabel>Action name</InputLabel>
                                                                    <TextField
                                                                        variant="outlined"
                                                                        margin="normal"
                                                                        required
                                                                        fullWidth
                                                                        type="text"
                                                                        placeholder="Action name"
                                                                        name="name"
                                                                        value={subItem.name}
                                                                        onChange={e => handleChangeActionName(e, index, subIndex)}
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup variant="outlined" className="dropdown" style={{
                                                                    marginLeft: 40
                                                                }}>
                                                                    <InputLabel>Controller</InputLabel>
                                                                    <Select
                                                                        onChange={e => handleChangeActionController(e, index, subIndex)}
                                                                        value={subItem.controller}
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
                                                                        }}>
                                                                        {
                                                                            stepActionList && stepActionList.length > 0
                                                                            && stepActionList.map((item, index) => (
                                                                                <MenuItem key={index} value={item}>{item}</MenuItem>
                                                                            ))
                                                                        }

                                                                    </Select>
                                                                </FormGroup>
                                                            </div>
                                                            <div className={classes.stepField}>

                                                                <div></div>
                                                            </div>
                                                        </div>
                                                        <div style={{
                                                            width: '40%',
                                                        }}>
                                                            <FormGroup className="input-base dropdown">
                                                                <InputLabel>Action description</InputLabel>
                                                                <TextareaAutosize
                                                                    onChange={e => handleChangeActionDescription(e, index, subIndex)}
                                                                    rowsMax={4}
                                                                    variant="outlined"
                                                                    margin="normal"
                                                                    required
                                                                    fullWidth
                                                                    type="text"
                                                                    name="name"
                                                                    value={subItem.description}
                                                                />
                                                            </FormGroup>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <div className={classes.stepOptions}>
                                            <div className={classes.stepHeader}>
                                                <p className={classes.stepTitle}>Assignees</p>
                                                {<Icon
                                                    onClick={() => {
                                                        setSelectedStep(item)
                                                        setAddUserPopup(true)
                                                    }}
                                                    className={classes.stepIconButton}
                                                    style={{
                                                        color: 'blue'
                                                    }}
                                                >person_add_icon</Icon>
                                                }
                                            </div>
                                            <ul style={{
                                                marginTop: 15
                                            }}>
                                                {
                                                    item && item.processors && item.processors.map((pro, proIndex) => (
                                                        <li key={proIndex}>{users.find(u => u._id === pro).email}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    <div style={{
                                        paddingTop: 187
                                    }}>
                                        <p style={{
                                            margin: 0,
                                            color: '#333',
                                            fontSize: 18,
                                            fontWeight: 700,
                                            marginLeft: 30
                                        }}>Preview</p>
                                        <ProcessForm currentStep={item} isPreview={true} step={item._id} />
                                    </div>

                                </li>
                            </React.Fragment>
                        })
                    }
                </ul>
                <div className={classes.leftBtnContainer}>
                    <Button onClick={handleEditSteps} className="btn-base btn-base--success" >Save</Button>
                </div>
            </div>
            <Dialog
                open={addUserPopup}
                keepMounted
                maxWidth="md"
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                initialValues={{
                                }}
                                validate={values => {
                                    const errors = {};
                                    return errors;
                                }}
                                onSubmit={handleAsign}
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
                                            <FormGroup variant="outlined" className="checkbox">
                                                <InputLabel
                                                    style={{
                                                        textAlign: 'left'
                                                    }}
                                                >Users</InputLabel>
                                                <ul style={{
                                                    textAlign: 'left',
                                                    padding: 0,
                                                    listStyle: 'none',
                                                    marginTop: 10,
                                                    maxHeight: 350,
                                                    overflow: 'auto'
                                                }}>

                                                    {addUserPopup && users && users.length > 0 && users.map((item, index) => (
                                                        <li key={index}><FormControlLabel
                                                            style={{
                                                                margin: '5px 0'
                                                            }}
                                                            control={
                                                                <Checkbox
                                                                    name={item._id}
                                                                    id={item._id}
                                                                    color="primary"
                                                                    onChange={e => handleSelectUser(e, item._id)}
                                                                    checked={
                                                                        selectedStep &&
                                                                        selectedStep.processor &&
                                                                        selectedStep.processor.length > 0 &&
                                                                        selectedStep.processor.some(pro => pro === item._id)}
                                                                    style={{
                                                                        marginRight: 5
                                                                    }}
                                                                />
                                                            }
                                                            label={_.get(item, 'email')}
                                                        /></li>
                                                    ))}
                                                </ul>
                                            </FormGroup>
                                            {/* <Button style={{
                                                width: '100%',
                                                marginTop: 15
                                            }}
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                                    {
                                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                                                    }
                                                )}`}>Submit</Button> */}
                                            <Link style={{
                                                color: '#6B6C6F',
                                                marginTop: 15,
                                                display: 'inline-block'
                                            }}
                                                onClick={() => {
                                                    resetForm()
                                                    setAddUserPopup(false)
                                                }}>Close</Link>
                                        </form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                </DialogContent>

            </Dialog>
            <Dialog
                open={createStepPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setcreateStepPopup(false)}
            >
                <DialogContent>
                    <div className={classes.form}>
                        <div className={classes.formContainer}>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    name: '',
                                    slug: '',
                                    description: ''
                                }}
                                validate={values => {
                                    const errors = {};
                                    if (!values.name) {
                                        errors.name = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }

                                    if (!values.slug) {
                                        errors.slug = intl.formatMessage({
                                            id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                        });
                                    }
                                    else if (values.slug.indexOf(' ') >= 0) {
                                        errors.slug = 'Please remove spaces'
                                    }

                                    else if (values.slug.toLowerCase() !== values.slug) {
                                        errors.slug = 'This field only accepts lowercase letters'
                                    }

                                    return errors;
                                }}
                                onSubmit={handleCreateStep}
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
                                    resetForm,
                                    setFieldValue
                                }) => (
                                        <form onSubmit={handleSubmit} noValidate>
                                            {status && <div role="alert" className="alert alert-danger">
                                                <div className="alert-text">{status}</div>
                                            </div>}
                                            <div style={{
                                                textAlign: 'left'
                                            }}>
                                                <FormGroup className="input-base">
                                                    <InputLabel>Step name</InputLabel>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="text"
                                                        name="name"
                                                        onBlur={handleBlur}
                                                        onChange={e => {
                                                            handleChange(e)
                                                            setFieldValue('slug', e.target.value.split(' ').join('_').toLowerCase())
                                                        }}
                                                        value={values.name}
                                                        helperText={touched.name && errors.name}
                                                        error={Boolean(touched.name && errors.name)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="input-base">
                                                    <InputLabel style={{
                                                        marginTop: 15
                                                    }}>Step slug</InputLabel>
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="text"
                                                        name="slug"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.slug}
                                                        helperText={touched.slug && errors.slug}
                                                        error={Boolean(touched.slug && errors.slug)}
                                                    />
                                                </FormGroup>
                                                <FormGroup className="input-base dropdown">
                                                    <InputLabel style={{
                                                        margin: '15px 0'
                                                    }}>Description</InputLabel>
                                                    <TextareaAutosize
                                                        rowsMax={4}
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        value={values.description}
                                                        type="text"
                                                        name="description"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                    />
                                                </FormGroup>
                                            </div>
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
                                                    setcreateStepPopup(false)
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
    process: store.process
});

export default injectIntl(
    connect(mapStateToProps)(CreateProcess)
);
