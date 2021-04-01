import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, Icon, Avatar, FormGroup, TextField } from '@material-ui/core';
import { toAbsoluteUrl } from '../../../_metronic/utils/utils';
import LinearProgress from '@material-ui/core/LinearProgress';
import _ from 'lodash';
import { readExcelFile, getFileExtension } from "../../helpers/helper"
import { uploadExternalData, uploadOrder } from "../../crud/brand.crud"
import moment from "moment"
import { Formik } from "formik";
import clsx from "clsx"
import { FormattedMessage, injectIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import { parseLocaleString } from "../../helpers/helper"


UploadPage.propTypes = {

};

export const CELL_TYPE = {
    DATE: 'date',
    NUMBER: 'number',
    STRING: 'string'
}

export const VALID_FILES = ['xls', 'xlsx', 'csv']

export const FILE_COLLUMNS_CONFIG = {
    date_request: {
        isRequired: true,
        type: CELL_TYPE.DATE,
        name: 'Date_Request'
    },
    marketplace: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'Marketplace'
    },
    brand: {
        isRequired: true,
        type: CELL_TYPE.STRING,
        name: 'Brand'
    },
    order_number: {
        isRequired: true,
        type: CELL_TYPE.STRING,
        name: 'Order_Number'
    },
    shipping_code: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'Shipping_Code'
    },
    seller_sku: {
        isRequired: true,
        type: CELL_TYPE.STRING,
        name: 'Seller_SKU'
    },
    item_name: {
        isRequired: true,
        type: CELL_TYPE.STRING,
        name: 'Item_Name'
    },
    unit_price: {
        isRequired: true,
        type: CELL_TYPE.NUMBER,
        name: 'Unit_Price'
    },
    paid_price: {
        isRequired: true,
        type: CELL_TYPE.NUMBER,
        name: 'Paid_Price'
    },
    total: {
        isRequired: false,
        type: CELL_TYPE.NUMBER,
        name: 'Total'
    },
    created_at: {
        isRequired: false,
        type: CELL_TYPE.DATE,
        name: 'Created'
    },
    quality_confirm: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'quality_confirm'
    },
    confirm_time: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'confirm_time'
    },
    pakaging_time: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'pakaging_time'
    },
    deliver_time: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'Deliver_Time'
    },
    status: {
        isRequired: true,
        type: CELL_TYPE.STRING,
        name: 'Status'
    },
    year: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'year'
    },
    month: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'month'
    },
    day: {
        isRequired: false,
        type: CELL_TYPE.STRING,
        name: 'day'
    },
    unique: {
        isRequired: false,
        type: CELL_TYPE.NUMBER,
        name: 'Unique'
    },
    '': {

    }
}

const useStyles = makeStyles({
    root: {
        padding: '0px 50px',
        borderRadius: '5px',
        textAlign: 'center',
        maxWidth: '700px',
        margin: '30px auto 50px auto',
        color: '#43434A',
    },
    uploadFormTitle: {
        fontSize: '32px',
        fontWeight: 800,
        color: '#014B68',
        marginBottom: 30
    },
    dragAndDropBox: {
        fontSize: '18px',
        padding: 30,
        backgroundColor: '#F1FFFA',
        border: '1px dashed #98D25C',
        borderRadius: '7.5px',
        marginBottom: '15px',
    },
    uploadFormAction: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    uploadIcon: {
        marginTop: 15,
        color: '#014B68',
        fontSize: 72
    },
    uploadFormProgress: {
        marginTop: 30,
        borderTop: '1px solid rgba(216, 216, 216, 1)',
        paddingTop: 30,
        color: '#34495E',
        fontSize: 14,
        textAlign: 'left',
        display: 'flex',
    },
    progressBar: {
        height: '10px',
        borderRadius: '10px',
        backgroundColor: '#D8D8D8',
        '& .MuiLinearProgress-bar': {
            backgroundColor: '#014B68',
        }
    },
    uploadedFile: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottom: '1px solid #2C3E50',
        marginBottom: 15,
        paddingBottom: 10,
        '& p': {
            fontSize: 16,
            color: '#34495E',
            margin: 0,
            width: '100%',
            textAlign: 'left',
            padding: '0 15px'
        }
    },
    connectForm: {
        width: 300,
        margin: '0 auto',
    },
    errorBox: {
        border: '1px dashed red',
        padding: 15,
        borderRadius: 15,
        color: 'red',
        textAlign: 'left',
        position: 'relative'
    },
    errorBoxLegend: {
        color: 'red',
        fontWeight: 800,
        fontSize: 32
    },
    cancelErrorBox: {
        position: 'absolute',
        right: -15,
        top: -15,
        cursor: 'pointer',
        fontSize: 36,
        background: 'white'
    }
})

function UploadPage(props) {
    const classes = useStyles()
    const [progress, setProgress] = useState(0);
    const [err, setErr] = useState([])
    const fileInput = useRef('')
    const [file, setFile] = useState('')
    const [data, setData] = useState([])
    const [completedRecords, setCompletedRecords] = useState(0)
    const { intl, source } = props;
    const history = useHistory()

    useEffect(() => {
        handleCloseErrPopup()
    }, [props.flag])

    const handleCloseErrPopup = () => {
        setErr([])
        setData([])
    }

    const uploadFile = file => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    setTimeout(() => {
                        validateFile(file)
                            .then(res => {
                                setData(res)
                            })
                            .catch(err => {
                                setErr(err)
                            })
                    }, 1000)
                    clearInterval(timer)
                    return 100
                }
                else {
                    return oldProgress + 5
                }
            });
        }, 50);
    }

    const validateFile = (file) => {
        let tempErr = []
        let data = []
        setFile(file)

        return new Promise((resolve, reject) => {

            //Check file type
            if (VALID_FILES.includes(getFileExtension(_.get(file, 'name')))) {
                readExcelFile(file, 'Query')
                    .then(res => {
                        setProgress(0)
                        if (res && res.length > 0) {
                            let col = res.shift()
                            let keyCol = []

                            //Get columns
                            _.forEach(col, c => {
                                keyCol.push(!c ? '' : c.toLowerCase().trim().replace(' ', '_'))
                            })

                            //Check missing columns
                            _.forEach(Object.keys(FILE_COLLUMNS_CONFIG), key => {
                                if (FILE_COLLUMNS_CONFIG[key] && FILE_COLLUMNS_CONFIG[key].isRequired && !keyCol.includes(key)) {
                                    tempErr.push(`Missing "${key.replace('_', ' ')}" column`)
                                }
                            })

                            _.forEach(res, (item, index) => {
                                let row = {}
                                if (item && item.length > 0) {
                                    _.forEach(item, (sItem, sIndex) => {
                                        let value

                                        //Check cell required
                                        if (_.get(FILE_COLLUMNS_CONFIG[keyCol[sIndex]], 'isRequired') && !sItem) {
                                            tempErr.push(`Cell is required at row ${index + 2} in '${col[sIndex]}' column `)
                                        }

                                        //Check cell value
                                        switch (_.get(FILE_COLLUMNS_CONFIG[keyCol[sIndex]], 'type')) {
                                            case CELL_TYPE.DATE:
                                                moment(sItem).isValid() || tempErr.push(`Invalid date at row ${index + 2} in '${col[sIndex]}' column `)
                                                value = sItem
                                                break;
                                            case CELL_TYPE.NUMBER:
                                                typeof (Number(sItem)) === 'number' || tempErr.push(`Invalid number at row ${index + 2} in '${col[sIndex]}' column `)
                                                value = Number(sItem) || 0
                                                break;
                                            case CELL_TYPE.STRING:
                                                value = sItem || ''
                                                break;
                                        }
                                        row[_.get(FILE_COLLUMNS_CONFIG[keyCol[sIndex]], 'name')] = value
                                    })
                                    data.push(row)
                                }
                                row = {}
                            })
                            tempErr.length > 0 ? reject(tempErr) : resolve(data)
                        }
                        else {
                            tempErr.push('Empty file')
                            reject(tempErr)
                        }
                    })
            }
            else {
                tempErr.push('Wrong file format. We only accept xls, xlsx, csv file')
                setProgress(0)
                reject(tempErr)
            }
        })
    }

    const dragFile = e => {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
    }

    const dropFile = e => {
        e.stopPropagation();
        e.preventDefault();
        const files = _.get(e, 'dataTransfer.files');
        uploadFile(files && files[0])
    }

    const selectFile = (values, { setStatus, setSubmitting }) => {
        setSubmitting(true)
        const chunk = _.chunk(data, 100)
        const promiseArr = []
        chunk && chunk.length > 0 && chunk.forEach(item => {
            promiseArr.push(source ? uploadOrder(item, source, props.brand) : uploadExternalData(data, values.fileName, props.brand))
        })

        executePromise(promiseArr)

        function executePromise(array) {
            let tempArray
            if (array.length > 0) {
                tempArray = array.splice(0, 10)
                Promise.all(tempArray)
                    .then(res => {
                        setCompletedRecords(completedRecords => {
                            let temp = completedRecords + tempArray.length * 100
                            return temp > data.length ? data.length : temp
                        })
                        executePromise(array)
                    })
            }
            else {
                setSubmitting(false)
                setTimeout(() => {
                    props.onDone()
                    setCompletedRecords(0)
                }, 1500)
            }

        }

    }

    return (
        <div className={classes.root}>
            <div className={classes.uploadFormContainer}>
                {(data.length === 0 && err.length === 0) ? <div className={classes.uploadBox}>
                    <div className={classes.uploadFormTitle}>
                        <p>Upload Data</p>
                    </div>
                    <div
                        onDragOver={dragFile}
                        onDrop={dropFile}
                        className={classes.dragAndDropBox}>
                        <Icon className={classes.uploadIcon}>backup</Icon>
                        <p>Drag and drop here</p>
                        <p>Chỉ được tải tập tin có định dạng .xls, .xlsx, .csv</p>
                    </div>
                    <p >or</p>
                    <div className={classes.uploadFormAction}>
                        <label htmlFor="external-data" className="btn-base btn-base--success btn-base--lg">BROWSE</label>
                        <input ref={fileInput} onChange={(e) => uploadFile(_.get(e, 'target.files[0]'))} id="external-data" type="file" style={{
                            display: 'none'
                        }} />
                    </div>
                    {progress > 0 && <div className={classes.uploadFormProgress}>
                        <div style={{
                            marginRight: '15px'
                        }}>
                            <Avatar variant="square" src={toAbsoluteUrl('/media/logos/google-sheet.svg')} style={{
                                width: "32px",
                                height: "32px"
                            }}></Avatar>
                        </div>
                        <div style={{
                            width: 'calc(100% - 70px)'
                        }}>
                            <p>Wait, we are still uploading...</p>
                            <LinearProgress className={classes.progressBar} variant="determinate" value={progress} />
                        </div>
                    </div>}
                </div>
                    :
                    <div className={classes.resultBox}>
                        {err.length === 0 ? <div className={classes.connectForm}>
                            <div className={classes.connectForm}>
                                <div className={classes.uploadedFile}>
                                    <Avatar
                                        src={toAbsoluteUrl('/media/logos/google-sheet.svg')}
                                        variant="square"
                                        style={{
                                            width: "32px",
                                            height: "32px"
                                        }}></Avatar>
                                    <p>{_.get(file, 'name')}</p>
                                    <Icon
                                        onClick={handleCloseErrPopup}
                                        style={{
                                            color: '#34495E',
                                            fontSize: 24,
                                            cursor: 'pointer'
                                        }}>delete</Icon>
                                </div>
                                <div style={{
                                    marginTop: 30,
                                    marginBottom: 30
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between'
                                    }}>
                                        <p>{`${parseLocaleString(completedRecords)} / ${parseLocaleString(data.length)} records`}</p>
                                        <p>{`${parseLocaleString(completedRecords * 100 / data.length)}%`}</p>
                                    </div>
                                    <LinearProgress className={classes.progressBar} variant="determinate" value={completedRecords * 100 / data.length} />
                                </div>
                                <Formik
                                    initialValues={{
                                        fileName: '',
                                    }}
                                    validate={values => {
                                        const errors = {};

                                        if (!source && !values.fileName) {
                                            errors.fileName = intl.formatMessage({
                                                id: "AUTH.VALIDATION.REQUIRED_FIELD"
                                            });
                                        }

                                        return errors;
                                    }}
                                    onSubmit={selectFile}
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
                                            <form onSubmit={handleSubmit} className={classes.form} noValidate>
                                                {status && <div role="alert" className="alert alert-danger">
                                                    <div className="alert-text">{status}</div>
                                                </div>}
                                                {!source && <FormGroup className="input-base">
                                                    <TextField
                                                        variant="outlined"
                                                        margin="normal"
                                                        required
                                                        fullWidth
                                                        type="text"
                                                        placeholder="Sale channel name"
                                                        name="fileName"
                                                        onBlur={handleBlur}
                                                        onChange={handleChange}
                                                        value={values.fileName}
                                                        helperText={touched.fileName && errors.fileName}
                                                        error={Boolean(touched.fileName && errors.fileName)}
                                                    /></FormGroup>
                                                }
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
                                            </form>
                                        )}
                                </Formik>
                            </div>
                        </div>
                            :
                            <div>
                                <p className={classes.errorBoxLegend}>Lỗi</p>
                                <div className={classes.errorBox}>
                                    {
                                        err.map((e, index) => (
                                            <p key={index}>{`${index + 1} - ${e}`}</p>
                                        ))
                                    }
                                    <Icon
                                        onClick={handleCloseErrPopup}
                                        className={classes.cancelErrorBox}>highlight_off</Icon>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}

export default injectIntl(UploadPage);