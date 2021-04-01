import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { FILE_COLLUMNS_CONFIG, CELL_TYPE } from './UploadPage'
import { globalStyles } from '../../styles/globalStyles'
import {
    Dialog, DialogContent, Button, Icon
} from '@material-ui/core';
import _ from "lodash"
import ReactDataGrid from "react-data-grid";
import clsx from "clsx"
import moment from "moment"
import { uploadOrder } from "../../crud/brand.crud"

FormEntry.propTypes = {

};

const useStyles = makeStyles({
    root: {

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
    },
    ...globalStyles
})

function FormEntry(props) {
    const classes = useStyles()
    const [gridRow, setGridRow] = useState([])
    const [gridCol, setGridCol] = useState([])
    const [err, setErr] = useState([])
    const [errPopup, setErrPopup] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const { brand, source } = props;

    useEffect(() => {
        initData()
    }, [])

    const initData = () => {
        const initialRow = {}
        const tempRow = []
        const tempCol = [{
            key: 'stt',
            name: '',
            editable: false,
            width: 35
        }]
        Object.keys(FILE_COLLUMNS_CONFIG).forEach(item => {
            if (item) {
                initialRow[FILE_COLLUMNS_CONFIG[item].name] = ''
                tempCol.push({
                    key: FILE_COLLUMNS_CONFIG[item].name,
                    name: FILE_COLLUMNS_CONFIG[item].name,
                    editable: true,
                    width: 120
                })
            }
        })
        for (let i = 0; i < 20; i++) {
            tempRow.push({ ...initialRow })
            tempRow[i]['stt'] = i + 1
        }
        setGridRow(tempRow)
        setGridCol(tempCol)
    }

    const validateRow = (data) => {
        const tempErr = []
        data.forEach((item, index) => {
            Object.keys(FILE_COLLUMNS_CONFIG).forEach(key => {
                if (key) {
                    //Check cell required
                    if (_.get(FILE_COLLUMNS_CONFIG[key], 'isRequired') && !item[FILE_COLLUMNS_CONFIG[key].name]) {
                        tempErr.push(`Cell is required at row ${index + 1} in '${FILE_COLLUMNS_CONFIG[key].name}' column `)
                    }

                    //Check cell value
                    switch (_.get(FILE_COLLUMNS_CONFIG[key], 'type')) {
                        case CELL_TYPE.DATE:
                            moment(item[FILE_COLLUMNS_CONFIG[key].name]).isValid() || tempErr.push(`Invalid date at row ${index + 2} in '${FILE_COLLUMNS_CONFIG[key].name}' column `)
                            break;
                        case CELL_TYPE.NUMBER:
                            typeof (Number(item[FILE_COLLUMNS_CONFIG[key].name])) === 'number' || tempErr.push(`Invalid number at row ${index + 2} in '${FILE_COLLUMNS_CONFIG[key].name}' column `)
                            break;
                        case CELL_TYPE.STRING:
                            break;
                    }
                }

            })
        })
        return tempErr
    }

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        const rows = gridRow.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        setGridRow(rows)
    }

    const isEmptyRow = (row) => {
        let count = 0
        Object.keys(row).forEach(item => {
            if (row[item]) {
                count++
            }
        })
        return count === 1
    }

    const handleSubmit = () => {
        let temp = []
        gridRow && gridRow.length > 0 && gridRow.forEach(item => {
            if (!isEmptyRow(item)) {
                temp.push(item)
            }
        })

        if (validateRow(temp).length === 0) {
            setSubmitLoading(true)
            uploadOrder(temp, source, props.brand)
                .then(res => {
                    setSubmitLoading(false)
                    const errMsg = _.get(res, 'data.errMsg')
                    if (errMsg) {
                        setErr([errMsg])
                        setErrPopup(true)
                    }
                    else {
                        props.onDone()
                        initData()
                    }
                })
                .catch(err => {
                    setErr(['Network error. Please try again'])
                    setErrPopup(true)
                    setSubmitLoading(false)
                })
        }
        else {
            setErr(validateRow(temp))
            setErrPopup(true)
        }
    }


    return (
        <div style={{
            padding: 30,
        }}>
            <div style={{
                maxWidth: '100%',
                overflow: 'auto',
                maxHeight: 500
            }}>
                <ReactDataGrid
                    columns={gridCol}
                    rowGetter={i => gridRow[i]}
                    rowsCount={gridRow.length}
                    onGridRowsUpdated={onGridRowsUpdated}
                    enableCellSelect={true}
                />
            </div>
            <div className={classes.leftBtnContainer} style={{
                marginTop: 15
            }}>
                <Button onClick={handleSubmit} className={`btn-base btn-base--success btn-base--lg ${clsx(
                    {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": submitLoading
                    }
                )}`}>Save</Button>
            </div>
            <Dialog
                open={errPopup}
                keepMounted
                fullWidth={true}
                onClose={() => setErrPopup(false)}
                maxWidth="sm"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <div style={{
                        padding: 30
                    }}>
                        <p className={classes.errorBoxLegend}>Lỗi</p>
                        <div className={classes.errorBox}>
                            {
                                err.map((e, index) => (
                                    <p key={index}>{`${index + 1} - ${e}`}</p>
                                ))
                            }
                            <Icon
                                onClick={() => setErrPopup(false)}
                                className={classes.cancelErrorBox}>highlight_off</Icon>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default FormEntry;