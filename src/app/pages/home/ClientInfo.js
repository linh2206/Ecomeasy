import React, { useState, useEffect } from "react";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { connect } from 'react-redux';
import { clientDetail, clientUsage } from "../../crud/client.crud";
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment'
import ClientInfoTable from "./ClientInfoTable";

const ClientInfo = (props) => {
  console.log('props Client Info', props)
  const { dataClient } = props
  const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const [selectedFromDate, handleFromDateChange] = useState(
    new Date(new Date().getTime() - weekInMilliseconds)
  );
  const [selectedToDate, handleToDateChange] = useState(new Date());
  const [listUsage, setlistUsage] = useState([]);
  useEffect(() => {
    console.log(new Date(selectedFromDate));
    clientUsage(
      props.auth.authToken,
      dataClient.id,
      moment(new Date(selectedFromDate)).format("YYYY-MM-DD"),
      moment(new Date(selectedToDate)).format("YYYY-MM-DD")
    ).then(({ data: { result } }) => {
      setlistUsage(result);
    });
  }, [dataClient.id, props.auth.authToken, selectedFromDate, selectedToDate]);
  return (
    <div className="client-info">
      <div className="row box-header-client-info">
        <div className="col-xl-6 col-md-6">
          <div className="">
            Client Name: {dataClient.user ? dataClient.user.name : 'None'}
          </div>
          <div>
            Phone: {dataClient.phone} - {dataClient.user ? dataClient.user.email : 'None'}
          </div>
          <div>
            Token: {dataClient.user ? dataClient.user.token : 'None'}
          </div>
        </div>
        <div className="col-xl-6 col-md-6 content-right">
          <div>
            Username: {dataClient.user.username}
          </div>
          <div>
            Package: {dataClient.package} - Start date: {moment(dataClient.createdAt).format('L')}
          </div>
          <div>
            Company Name: {dataClient.company}
          </div>
        </div>
      </div>
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker value={selectedFromDate} onChange={handleFromDateChange} format="yyyy-MM-dd" label="From Date"/>
          <DatePicker value={selectedToDate} onChange={handleToDateChange} format="yyyy-MM-dd" label="To Date"/>
        </MuiPickersUtilsProvider>
      </div>
      <ClientInfoTable usages={listUsage}  />
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({
  auth,
});
export default connect(mapStateToProps)(ClientInfo);