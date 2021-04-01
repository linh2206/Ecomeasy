import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Button from '@material-ui/core/Button';
import { listClient } from '../../crud/client.crud';
import { connect } from 'react-redux';
import * as _ from 'lodash'
import ClientInfo from "./ClientInfo";
import CreateClient from './CreateClient'
import EditClient from './EditClient'


const columns = [
  {
    id: 'stt',
    label: 'STT',
    minWidth: 50,
    align: 'center',
  },
  {
    id: 'name',
    label: 'Client\u00a0Name',
    minWidth: 250,
    align: 'center',
  },
  {
    id: 'email',
    label: 'Email',
    minWidth: 250,
    align: 'center',
  },
  {
    id: 'username',
    label: 'User Name',
    minWidth: 250,
    align: 'center',
  },
  {
    id: 'ip',
    label: 'IP',
    minWidth: 250,
    align: 'center',
  },
  {
    id: 'edit',
    label: 'Action',
    minWidth: 100,
    align: 'right',
  },
];


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 600,
    overflow: 'auto',
  },
  marginBottom: {
    marginBottom: '25px'
  },
  linkStyle: {
    fontWeight: 'bold',
    color: '#5d78ff',
    cursor: 'pointer',
  },
  editButton: {
    padding: '0',
    minWidth: '10px',
    '&:hover': {
      backgroundColor: 'transparent',
      color: 'red'
    },
  }
});


const Clients = (props) => {

  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [count, setCount] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [clientList, setClientList] = React.useState([]);
  const [clientDetail, setClientDetail] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showClientInfo, setShowClientInfo] = React.useState(false)


  const handleChangePage = (event, newPage) => {
    listClient(props.auth.authToken, newPage + 1, rowsPerPage)
      .then(({ data: { result } }) => {
        setClientList(result.rows);
        setPage( newPage )
      });

  };

  const handleChangeRowsPerPage = event => {
    listClient(props.auth.authToken,page + 1, +event.target.value)
      .then(({ data: { result } }) => {
        setClientList(result.rows);
        setRowsPerPage(+event.target.value)
      });
  };

  const handleClick = (data) => {
    console.log(data);
    setClientDetail(data)
    setShowClientInfo(true)
  }

  const handleEdit = (client) => {
    setClientDetail(client)
    setOpenEdit(true)
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
  };

  useEffect(() => {
    listClient(props.auth.authToken,page + 1, rowsPerPage)
      .then(({ data: { result } }) => {
        setClientList(result.rows);
        setCount(result.count)
      });
  }, []);

  return (
    <div className={ classes.root }>
      <Button variant="contained" color="secondary" className={ classes.marginBottom } onClick={() => setOpen(true)}>
        Create Client
      </Button>

      { showClientInfo ?
        <div>
          <div className="back-clients" onClick={() => setShowClientInfo(false)}>Back to Clients</div>
          <ClientInfo dataClient={clientDetail}/>
        </div>
        :
        <Paper className={ classes.root }>
          <div className={ classes.tableWrapper }>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  { columns.map(column => (
                    <TableCell
                      key={ column.id }
                      align={ column.align }
                      style={ { minWidth: column.minWidth } }
                    >
                      { column.label }
                    </TableCell>
                  )) }
                </TableRow>
              </TableHead>
              <TableBody>
                { clientList && clientList.map((client, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={ -1 } key={ index } >
                      <TableCell align={ 'center' }>
                        {index + 1}
                      </TableCell>
                      <TableCell align={ 'center' } className={ classes.linkStyle } onClick={() => handleClick(client)}>
                        {client.user.name}
                      </TableCell>
                      <TableCell align={ 'center' }>
                        {client.user.email}
                      </TableCell>
                      <TableCell align={ 'center' }>
                        {client.user.username}
                      </TableCell>
                      <TableCell align={ 'center' }>
                        {client.whitelistIp}
                      </TableCell>
                      <TableCell align={ 'right' }>
                        <Button className={ classes.editButton } onClick={() => handleEdit(client)}>
                          <i className="flaticon-edit"></i>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </div>
          <CreateClient onClose={handleClose} open={open} clientList={clientList} setClientList={setClientList} />
          {
            openEdit ?
              <EditClient onEditClose={handleEditClose} openEdit={openEdit} dataClient={clientDetail} clientList={clientList} setClientList={setClientList} />
            : null
          }
          <TablePagination
            rowsPerPageOptions={ [5, 10, 15] }
            component="div"
            count={ count }
            rowsPerPage={ rowsPerPage }
            page={ page }
            onChangePage={ handleChangePage }
            onChangeRowsPerPage={ handleChangeRowsPerPage }
          />
        </Paper>
      }
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(Clients);




  


