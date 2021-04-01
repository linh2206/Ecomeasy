import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
    Table, TableBody, TableCell, TableHead, FormGroup,
    TableRow, Button, Icon, Link, Dialog, DialogContent, TextField
} from '@material-ui/core';
import { toAbsoluteUrl } from "../../../../_metronic/utils/utils";
import { selectSpreadsheet } from "../../../crud/brand.crud"
import { useHistory } from "react-router-dom";
import _ from "lodash"
import { Formik } from "formik";
import clsx from "clsx"
import { FormattedMessage, injectIntl } from "react-intl";

GoogleDriveFilesTracking.propTypes = {

};

const useStyles = makeStyles({
    root: {
        display: 'flex',
        '& .selected': {
            background: 'rgba(0,0,0,0.05)'
        },
        '& .MuiTableCell-root': {
            fontSize: 14
        }
    },
    listFile: {
        width: 580
    },
    formAction: {
        padding: '0 10px',
        margin: '20px auto',
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: 450,
        '& button': {
            width: 'calc(50% - 7px)'
        }
    },
    tableRow: {
        cursor: 'pointer',
        '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)'
        }
    },
    listFolder: {
        maxHeight: 535,
        overflowY: 'auto',
        width: 300,
        borderRight: '1px solid rgba(51, 51, 51, 0.1)',
        '& ul': {
            listStyleType: 'none',
            padding: 0,
            '& li': {
                padding: '37px 45px 37px 30px',
                margin: 0,
                cursor: 'pointer',
                transition: 'all 0.3s linear',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                '&:hover': {
                    backgroundColor: '#F9F9F9'
                },
                '& .material-icons': {
                    fontSize: 32,
                    marginRight: 10
                },
                '& .floating-icon': {
                    fontSize: 12,
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)'
                }
            },
            '& .selected': {
                backgroundColor: 'rgba(0,0,0,0.05)'
            }
        }
    },
    main: {
        '& li': {
            color: '#014B68'
        }
    },
    table: {
        '& .MuiTableHead-root': {
            display: 'inline-table',
            width: '100%',
            backgroundColor: '#EBEBEB',
            '& th': {
                padding: '23px 16px',
            }
        },
        '& .MuiTableBody-root': {
            display: 'block',
            height: 385,
            overflowY: 'auto',
            '& tr': {
                borderBottom: '1px solid rgba(216, 216, 216, 1)',
                display: 'flex',
                alignItems: 'center'
            }
        }
    },
    setFileNameForm: {
        textAlign: 'cetner',
        padding: 30,
        width: 400,
        '& .kt-spinner--right:before': {
            right: 15
        },
    }
})

function GoogleDriveFilesTracking(props) {
    const classes = useStyles()
    const { intl, source } = props;
    const [selectedFile, setSelectedFile] = useState('')
    const [isSubmitting, setSubmitting] = useState(false)
    let rows = props.speadSheetList
    const history = useHistory()

    const handleSelectFile = () => {
        setSubmitting(true)
        selectSpreadsheet(source, selectedFile)
            .then(res => {
                setSubmitting(false)
                const errMsg = _.get(res, 'data.errMsg')
                if (errMsg) {
                }
                else {
                    history.push('/')
                }
            })
            .catch(err => {
                setSubmitting(false)
            })
    }

    const subFolders = [{
        name: 'Thư mục 1',
        icon: 'folder'
    },
    {
        name: 'Thư mục 2',
        icon: 'folder'
    },
    {
        name: 'Thư mục 3',
        icon: 'folder'
    },]

    const folders = [{
        name: 'Thư mục của tôi',
        icon: 'folder'
    }, {
        name: 'Thư mục được chia sẻ với tôi',
        icon: 'people_alt'
    }, {
        name: 'Thư mục đánh dấu',
        icon: 'star'
    }]

    return (
        <div className={classes.root}>
            {/* <div className={`${classes.listFolder} ${classes.main}`}>
                <ul>
                    {folders.map((item, index) => (
                        <li key={index}>
                            <Icon>{item.icon}</Icon>{item.name}
                            <Icon className="floating-icon">arrow_forward_ios</Icon>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={classes.listFolder}>
                <ul>
                    {subFolders.map((item, index) => (
                        <li key={index}>
                            <Icon>{item.icon}</Icon>{item.name}
                            <Icon className="floating-icon">arrow_forward_ios</Icon>
                        </li>
                    ))}
                </ul>
            </div> */}
            <div className={classes.listFile}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{
                                width: 472
                            }}>Tên file</TableCell>
                            <TableCell style={{
                                width: 100
                            }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows && rows.map((row, index) => (
                            <TableRow key={index} className={`${classes.tableRow} ${selectedFile === row.id && 'selected'}`}
                                onClick={() => setSelectedFile(row.id)}>
                                <TableCell style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    width: 472
                                }}><img
                                        style={{
                                            marginRight: 10
                                        }}
                                        src={toAbsoluteUrl('/media/logos/google-sheet.svg')} /> {row.name}</TableCell>
                                <TableCell><Link href={row.webViewLink} target="_blank">Preview</Link></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className={classes.formAction}>
                    <Button
                        onClick={() => {
                            setSelectedFile('')
                            props.onClose()
                        }}
                        className="btn-base btn-base--cancel btn-base--lg">Cancel</Button>
                    <Button
                        onClick={handleSelectFile}
                        className={`btn-base btn-base--success btn-base--lg ${!selectedFile && 'disabled'} ${clsx(
                            {
                                "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": isSubmitting
                            }
                        )}`}
                    >Connect</Button>
                </div>
            </div>
        </div>
    );
}

export default injectIntl(GoogleDriveFilesTracking);