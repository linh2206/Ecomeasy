import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { globalStyles } from '../../styles/globalStyles'
import { getRequestDetail } from '../../crud/process.crud'
import { useParams } from "react-router-dom"
import _ from "lodash"
import { Link } from "react-router-dom";
import { Icon } from '@material-ui/core';
import ProcessForm from '../home/components/ProcessForm'

RequestDetail.propTypes = {

};

const useStyles = makeStyles({
    root: {

    },
    ...globalStyles
})

function RequestDetail(props) {
    const classes = useStyles()
    const { requestId } = useParams()
    const [selectedRequest, setSelectedRequest] = useState(false)

    useEffect(() => {
        getRequestDetail(requestId)
            .then(res => {
                const errMsg = _.get(res, 'data.errMsg')
                if (!errMsg) {
                    setSelectedRequest(_.get(res, 'data.result'))
                }
            })
    }, [])
    return (
        <div className={classes.root}>
            <Link to="/requests"><Icon>arrow_back</Icon></Link>
            <div>
                <p className={classes.headerTitle}>{_.get(selectedRequest, 'step.stepName')}</p>
            </div>
            <div>
                {selectedRequest &&
                    <ProcessForm request={selectedRequest.request} currentStep={selectedRequest.step} step={_.get(selectedRequest, 'step._id')} />}
            </div>
        </div>
    );
}

export default RequestDetail;