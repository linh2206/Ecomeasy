import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Button, Table, TableHead, TableCell, Icon, FormGroup, TextField, InputLabel, MenuItem, Select,
    TableBody, TableRow, CircularProgress, Dialog, DialogContent, Step, Stepper, StepLabel, Typography
} from '@material-ui/core';
import { globalStyles } from "../../styles/globalStyles"
import _ from "lodash"
import { Link } from "react-router-dom";
import clsx from "clsx"
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";
import { connect, useDispatch } from "react-redux";
import { actionTypes } from '../../store/ducks/process.duck'
import { selectRequest, getProcessList, getRequestList, getRequestDetail } from '../../crud/process.crud'
import ProcessForm from './components/ProcessForm'
import { useHistory, useLocation } from "react-router-dom";

export const exceptProperty = ["_id", "processId", "stepId", "createBy", "created"]

RequestPage.propTypes = {

};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        fontSize: 16
    },
    button: {
        marginRight: theme.spacing(1),
    },
    legend: {
        marginTop: 15,
        fontSize: 22,
        fontWeight: 800
    },
    instructions: {
        marginTop: 15,
        fontSize: 18,
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
    currentForm: {
        maxWidth: 600,
        margin: '0 auto',
        textAlign: 'center'
    },
    ...globalStyles
}));

function getSteps() {
    return ['Leader gửi form cho nhân viên', 'Nhân viên hoàn thành đơn', 'Leader gửi đơn lên ban giám đốc', 'Ban giám đốc duyệt'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Leader gửi form cho nhân viên';
        case 1:
            return 'Nhân viên hoàn thành đơn';
        case 2:
            return 'Leader gửi đơn lên ban giám đốc';
        case 3:
            return 'Ban giám đốc duyệt';
        default:
            return 'Unknown step';
    }
}

function RequestPage(props) {
    const { intl } = props;
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [selectProcessPopup, setSelectProcessPopup] = useState(false)
    const [initialValues, setInitialValues] = useState({})
    const [process, setProcess] = useState('')
    const [isShowStep, setIsShowStep] = useState(false)
    const dispatch = useDispatch();
    const [processes, setProcesses] = useState([])
    const [processObj, setProcessObj] = useState([])
    const [selectedStep, setSelectedStep] = useState('')
    const [requestList, setRequestList] = useState([])
    const [fetchRequestListLoading, setFetchRequestListLoading] = useState(false)
    const [requestDetailPopup, setRequestDetailPopup] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(false)
    const [selectedRequestId, setSelectedRequestId] = useState(false)
    let history = useHistory()

    const columns = [
        {
            label: 'Request',
            property: 'name',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Process ID',
            property: 'processId',
            horizontalAlign: 'left',
            cellFormat: 'string'
        },
        {
            label: 'Ngày tạo',
            property: 'created',
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

    const steps = getSteps();

    const handleNext = () => {

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSelectProcess = (values, { setStatus, setSubmitting }) => {
        setSubmitting(true)
        selectRequest(processObj.name, processObj._id, selectedStep.stepSlug)
            .then(res => {
                setSubmitting(false)
                setSelectProcessPopup(false)
                setIsShowStep(true)
                setSubmitting(false)
                const id = _.get(res, 'data.result._id')
                id && history.push(`/request/${id}`)
            })
    }

    const fetchProcessList = () => {
        getProcessList()
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    dispatch({
                        type: actionTypes.SetProcessList,
                        payload: _.get(res, 'data.result') || []
                    })
                    setProcesses(_.get(res, 'data.result') || [])
                }
            })
    }

    useEffect(() => {
        fetchProcessList()
        fetchRequestList()
    }, [])

    const fetchRequestList = () => {
        setFetchRequestListLoading(true)
        getRequestList()
            .then(res => {
                setFetchRequestListLoading(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setRequestList(_.get(res, 'data.result') || [])
                }
            })
            .catch(err => {
                setFetchRequestListLoading(false)
            })
    }

    return (
        <div className={classes.root}>
            <div className={classes.header}>
                <p className={classes.headerTitle}>{isShowStep ? processObj.name : 'Gửi yêu cầu'}</p>
            </div>
            <div className={classes.leftBtnContainer}>
                <Button onClick={() => setSelectProcessPopup(true)} className="btn-base btn-base--success" >New request</Button>
            </div>
            {
                isShowStep &&
                <div>
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            const stepProps = {};
                            const labelProps = {};
                            return (
                                <Step key={label} {...stepProps}>
                                    <StepLabel {...labelProps}>{label}</StepLabel>
                                </Step>
                            );
                        })}
                    </Stepper>
                    <div className={classes.currentForm}>
                        {activeStep === steps.length ? (
                            <div>
                                <Typography className={classes.instructions}>
                                    Hoàn tất qui trình
            </Typography>
                            </div>
                        ) : (
                                <div>
                                    <Typography className={classes.legend}>{processObj.name}</Typography>
                                    <Typography className={classes.instructions}>{selectedStep.stepName}</Typography>
                                    <ProcessForm process={processObj} step={selectedStep._id} />
                                    {/* <div>
                                        <Button style={{
                                            width: 150
                                        }} disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                                            Back
                                 </Button>
                                        <Button
                                            className="btn-base btn-base--success btn-base--lg"
                                            variant="contained"
                                            color="primary"
                                            onClick={handleNext}
                                        >
                                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                        </Button>
                                    </div> */}
                                </div>
                            )}
                    </div>
                </div>
            }
            {
                !isShowStep &&
                <div className={`${classes.datatable} brand-list`} style={{
                    marginTop: 30
                }}>
                    <Table aria-label="simple table">
                        <TableHead>
                            {columns.map((col, index) => (
                                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                                    align="left" key={index}>{col.label}</TableCell>
                            ))}
                        </TableHead>
                        <TableBody>
                            {
                                requestList.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            {row.requestName}
                                        </TableCell>
                                        <TableCell>
                                            {row.processId}
                                        </TableCell>
                                        <TableCell>
                                            {row.created}
                                        </TableCell>
                                        <TableCell style={{
                                            width: 100
                                        }}>
                                            <Link to={`/request/${row._id}`}><Icon>edit</Icon></Link>
                                            <Icon style={{
                                                marginLeft: '15px',
                                                cursor: 'pointer'
                                            }}>delete</Icon>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    {
                        (fetchRequestListLoading || requestList.length === 0) &&
                        <div className="spinner-container">
                            {fetchRequestListLoading && <CircularProgress />}
                            {!fetchRequestListLoading && requestList.length === 0 && <p className="table-error-message">Dữ liệu trống</p>}
                        </div>
                    }
                </div>
            }
            <Dialog
                open={selectProcessPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setSelectProcessPopup(false)}
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
                                onSubmit={handleSelectProcess}
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
                                            <FormGroup variant="outlined" className="dropdown" style={{
                                                margin: '10px 0'
                                            }}>
                                                <InputLabel
                                                    style={{
                                                        textAlign: 'left'
                                                    }}
                                                >Process</InputLabel>
                                                <Select
                                                    value={process}
                                                    onChange={(e) => {
                                                        setProcess(e.target.value)
                                                        setProcessObj(processes.find(i => i._id === e.target.value))
                                                        setSelectedStep(processes.find(i => i._id === e.target.value).steps[0])
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
                                                    }} >
                                                    {processes && processes.map((item, index) => (
                                                        <MenuItem value={item._id} key={index}>
                                                            {item.name}
                                                        </MenuItem>
                                                    ))}

                                                </Select>
                                            </FormGroup>
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
                                                    setSelectProcessPopup(false)
                                                }}>Cancel</Link>
                                        </form>
                                    )}
                            </Formik>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog
                open={requestDetailPopup}
                keepMounted
                maxWidth="md"
                onClose={() => setRequestDetailPopup(false)}
            >
                <DialogContent>
                    <div style={{
                        width: 400,
                        padding: 30
                    }}>
                        {
                            Object.keys(selectedRequest).map((item, index) => (
                                exceptProperty.includes(item) ||
                                <FormGroup style={{
                                    marginBottom: 15
                                }} key={index} className="input-base">
                                    <InputLabel>{item}</InputLabel>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="text"
                                        placeholder={item}
                                        name={item}
                                        value={selectedRequest[item]}
                                    /></FormGroup>
                            ))
                        }
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default injectIntl(RequestPage);