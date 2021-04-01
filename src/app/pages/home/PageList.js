import React, { useEffect, useState } from 'react';
import {
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles
} from "@material-ui/core";
import { listPages } from '../../crud/monitoring.crud';
import { connect } from 'react-redux';
// import * as _ from 'lodash'
import numeral from 'numeral';

const columns = [
  {
    id: 'stt',
    label: 'STT',
    minWidth: 50,
    align: 'left',
  },
  {
    id: 'pageName',
    label: 'PAGE NAME',
    minWidth: 250,
    align: 'left',
  },
  {
    id: 'pageId',
    label: 'ID FANPAGE',
    minWidth: 250,
    align: 'left',
  },
  {
    id: 'totalPost',
    label: 'TOTAL POST',
    minWidth: 250,
    align: 'left',
  },
  {
    id: 'like',
    label: 'LIKE',
    minWidth: 250,
    align: 'left',
  },
  {
    id: 'share',
    label: 'SHARE',
    minWidth: 250,
    align: 'left',
  },
  {
    id: 'comment',
    label: 'COMMENT',
    minWidth: 100,
    align: 'left',
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
  fontSize: {
    fontSize: '13px'
  },
  linkStyle: {
    fontWeight: 'bold',
    color: '#5d78ff',
    cursor: 'pointer',
    fontSize: '13px'
  }
});


const PageList = (props) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [listPagesUser, setListPagesUser] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterUserName, setFillterUserName] = useState('');

  // const clear = () => {
  //   setFillterUserName('')
  // };

  const handleChangePage = (event, newPage) => {
    listPages(props.auth.authToken, newPage + 1, rowsPerPage, filterUserName)
      .then(({ data: { result } }) => {
        setListPagesUser(result.rows);
        setPage(newPage)
      });

  };

  const handleChangeRowsPerPage = event => {
    listPages(props.auth.authToken, page + 1, +event.target.value, filterUserName)
      .then(({ data: { result } }) => {
        setListPagesUser(result.rows);
        setRowsPerPage(+event.target.value)
      });
  };

  const handleClickMeta = (pageId) => {
    props.history.push(`/page-detail/${pageId}`, {
      pageId
    })
  }
  const handleClickPost = (postName) => {
    props.history.push('/post-list', {
      postName
    })
  }

  const handleSearchChange = e => {
    setFillterUserName(e.target.value)
    callApi(props.auth.authToken, page + 1, rowsPerPage, e.target.value)
  }

  const callApi = (auth, page, rows, filter) => {
    listPages(auth, page, rows, filter)
      .then(({ data: { result } }) => {
        console.log('result', result)
        setListPagesUser(result.rows);
        setCount(result.count)
      });
  }

  useEffect(() => {
    callApi(props.auth.authToken, page + 1, rowsPerPage, filterUserName)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.root}>
      <div className="sort name">
        <TextField className="box-search" value={filterUserName} onChange={handleSearchChange} label="Search Page Name" />
      </div>
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    className={classes.fontSize}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {listPagesUser && listPagesUser.map((page, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={page.id} >
                    <TableCell align={'left'} className={classes.fontSize}>
                      {index + 1}
                    </TableCell>
                    <TableCell align={'left'} className={classes.linkStyle} onClick={() => handleClickMeta(page.id)}>
                      {page.userName}
                    </TableCell>
                    <TableCell align={'left'} className={classes.linkStyle}>
                      <a href={`https://www.facebook.com/${page.id}/`} target="_blank">{page.id}</a>
                    </TableCell>
                    <TableCell align={'left'} className={classes.linkStyle} onClick={() => handleClickPost(page.userName)}>
                      {numeral(parseInt(page.totalOfPost)).format("0,0")}
                    </TableCell>
                    <TableCell align={'left'} className={classes.fontSize}>
                      {numeral(parseInt(page.totalOfComment)).format("0,0")}
                    </TableCell>
                    <TableCell align={'left'} className={classes.fontSize}>
                      {numeral(parseInt(page.totalOfShare)).format("0,0")}
                    </TableCell>
                    <TableCell align={'left'} className={classes.fontSize}>
                      {numeral(parseInt(page.totalOfReaction)).format("0,0")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(PageList);







