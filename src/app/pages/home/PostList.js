import React, { useEffect, useState } from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  makeStyles,
  Tooltip 
} from "@material-ui/core";
import { listPosts, requestNewReport } from '../../crud/monitoring.crud';
import { connect } from 'react-redux';
import * as _ from 'lodash'
import numeral from 'numeral';
import moment from 'moment';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
// import { ReactComponent as SearchIcon } from "../../../_metronic/layout/assets/layout-svg-icons/Search.svg";

const columns = [
  {
    id: 'stt',
    label: 'STT',
    minWidth: 10,
    align: 'left',
  },
  {
    id: 'requestDate',
    label: 'Request Date',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'from',
    label: 'From',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'to',
    label: 'To',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'postContent',
    label: 'POST CONTENT',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'date',
    label: 'DATE',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'like',
    label: 'LIKE',
    minWidth: 40,
    align: 'left',
  },
  {
    id: 'share',
    label: 'SHARE',
    minWidth: 40,
    align: 'left',
  },
  {
    id: 'comment',
    label: 'COMMENT',
    minWidth: 40,
    align: 'left',
  },
  {
    id: 'auto',
    label: 'AUTO',
    minWidth: 90,
    align: 'left',
  },

  {
    id: 'brand',
    label: 'BRAND',
    minWidth: 80,
    align: 'left',
  },
];


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 600,
    overflow: 'auto'
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
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  toolTip: {
    lineHeight: '25px',
    fontSize: '14px',
    maxWidth: '400px',
    opacity: 1,
    padding: '20px',
    backgroundColor: '#434349'
  }
});
const useStylesSelect = makeStyles(theme => ({
  button: {
    display: 'block',
    marginTop: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));


const PostList = (props) => {
  const classes = useStyles();
  const classesSelect = useStylesSelect();
  const [page, setPage] = useState('Test');
  const [brand, setBrand] = useState('Test');
  const [marketplace, setMarketplace] = useState('Shopee');
  const [count, setCount] = useState(0);
  const [listPostsUser, setListPostsUser] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFillterName] = useState(props.location.state ? props.location.state.postName : '');
  const [dateSort, setDateSort] = useState('-1');
  const weekInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  const [selectedFromDate, handleFromDateChange] = useState('');
  const [selectedToDate, handleToDateChange] = useState('');
  const [open, setOpen] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseBrand = () => {
    setOpenBrand(false);
  };

  const handleOpenBrand = () => {
    setOpenBrand(true);
  };
  const handleCloseMan = (id) => {
    setListPostsUser(_.map(listPostsUser, post => {
      if (post.id === id) {
        post.openMan = false
      }
      return post
    }))
  };

  const handleOpenMan = (id) => {
    setListPostsUser(_.map(listPostsUser, post => {
      if (post.id === id) {
        post.openMan = true
      }
      return post
    }))
  };

  // const clear = () => {
  //   setFillterName('')
  // };

  const handleChangePage = (event, newPage) => {
    listPosts(props.auth.authToken, newPage + 1, rowsPerPage, filterName, dateSort, 
      selectedFromDate ? moment(new Date(selectedFromDate)).format("YYYY-MM-DD") : '',
      selectedToDate ? moment(new Date(selectedToDate)).format("YYYY-MM-DD") : '')
      .then(({ data: { result } }) => {
        setListPostsUser(_.map(result.rows, row => {
          row.openMan = false
          return row
        }));
        setPage( newPage )
      });

  };

  const handleChangeRowsPerPage = event => {
    listPosts(props.auth.authToken,page + 1, +event.target.value, filterName, dateSort,
      selectedFromDate ? moment(new Date(selectedFromDate)).format("YYYY-MM-DD") : '',
      selectedToDate ? moment(new Date(selectedToDate)).format("YYYY-MM-DD") : '')
      .then(({ data: { result } }) => {
        setListPostsUser(_.map(result.rows, row => {
          row.openMan = false
          return row
        }));
        setRowsPerPage(+event.target.value)
      });
  };

  const handleClick = (data) => {
    props.history.push('/comment-list', {
      filterName: filterName || data.pageName,
      dateSort,
      selectedFromDate,
      selectedToDate,
      postId: data.id
    })
  }

  const callApi = (auth, page, rows, filter, date, from, to) => {
    listPosts(auth, page, rows, filter, date, 
      from ? moment(new Date(from)).format("YYYY-MM-DD") : '',
      to ? moment(new Date(to)).format("YYYY-MM-DD") : '')
    .then(({ data: { result } }) => {
      setListPostsUser(_.map(result.rows, row => {
        row.openMan = false
        return row
      }));
      setCount(result.count)
    });
  }
  const upsertMetaManual = (value, id) => {
    let auth = props.auth.authToken
    
  }
  const defineClass = (value) => {
    if (value === 'positive') {
      return 'brand'
    } else if (value === 'negative') {
      return 'danger'
    } else {
      return 'normal'
    }

  }
  
  const handleClickMeta = (pageId) => {
    console.log(pageId)
    props.history.push(`/page-detail/${pageId}`, {
      pageId
    })
  }

  useEffect(() => {
    loop(3000)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loop = (time) => {
    setTimeout(() => {
      console.log('call api')
      //cb()
      listPosts().then(({ data: { result } }) => {
        console.log(result)
        setListPostsUser(result)
      });
      loop(time)
    }, time)
  }

  useEffect(() => {
    requestNewReport(brand, marketplace, selectedFromDate, selectedToDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand, marketplace, selectedFromDate, selectedToDate]);
  console.log(listPostsUser)
  return (
    <div className={ classes.root }>
      <div className="sort name">
        <FormControl className={classesSelect.formControl}>
          <InputLabel id="demo-controlled-open-select-label">Select Brand</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={openBrand}
            onClose={handleCloseBrand}
            onOpen={handleOpenBrand}
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <MenuItem value='test'>Test</MenuItem>
           
          </Select>
        </FormControl>
      </div>
      <div className="sort date">
        <FormControl className={classesSelect.formControl}>
          <InputLabel id="demo-controlled-open-select-label">Select Market</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={marketplace}
            onChange={(e) => setMarketplace(e.target.value)}
          >
            <MenuItem value='Shopee'>Shopee</MenuItem>
            <MenuItem value='Sendo'>Sendo</MenuItem>
          </Select>
        </FormControl>
        <div className="date-picker">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker value={selectedFromDate || new Date(new Date().getTime() - weekInMilliseconds)} onChange={handleFromDateChange} format="yyyy-MM-dd" label="From Date"/>
            <DatePicker value={selectedToDate || new Date()} onChange={handleToDateChange} format="yyyy-MM-dd" label="To Date"/>
          </MuiPickersUtilsProvider>
        </div>
      </div>
      <Paper className={ classes.root }>
        <div className={ classes.tableWrapper }>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                { columns.map(column => (
                  <TableCell
                    className={classes.fontSize}
                    key={ column.id }
                    align={ column.align }
                    style={ { minWidth: column.minWidth, padding: '20px 10px' } }
                  >
                    { column.label }
                  </TableCell>
                )) }
              </TableRow>
            </TableHead>
            <TableBody>
              { listPostsUser && listPostsUser.map((data, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={ -1 } key={ index } >
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {index + 1}
                    </TableCell>
                     <TableCell align={ 'left' } className={`${classes.linkStyle} ellipsis list-post`} onClick={() => handleClickMeta(data.pageId)}>
                      {data[0]}
                    </TableCell>
                    <TableCell align={ 'left' } className={`${classes.linkStyle} ellipsis list-post`} onClick={() => handleClickMeta(data.pageId)}>
                      {data[1]}
                    </TableCell>
                    <TableCell align={ 'left' } className={`${classes.linkStyle} ellipsis list-post`} onClick={() => handleClickMeta(data.pageId)}>
                      {data[2]}
                    </TableCell>
                    {data.content ?
                      <Tooltip title={data.content} classes={{ tooltip: classes.toolTip }} arrow>
                        <TableCell className={`${classes.fontSize} ellipsis list-post`} align={ 'left' }>
                          {data.content}
                        </TableCell>
                      </Tooltip> :
                      <TableCell className={`${classes.fontSize} ellipsis list-post`} align={ 'left' }>
                        {data.content}
                      </TableCell>
                    } 
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {moment(data.date).format('hh:mm:ss DD-MM-YYYY')}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {numeral(parseInt(data.totalOfReaction)).format("0,0")}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {numeral(parseInt(data.totalOfShare)).format("0,0")}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.linkStyle}  onClick={() => handleClick(data)}>
                      {numeral(parseInt(data.totalOfComment)).format("0,0")}
                    </TableCell>
                    <TableCell className={`${classes.fontSize} dropdown-man-${defineClass(data.meta && data.meta.sentimentAuto ? data.meta.sentimentAuto.toLowerCase() : 'none')}`} align={ 'left' }>
                      {data.meta ? data.meta.sentimentAuto: ''}
                    </TableCell>
   
                    <TableCell align={ 'left' }>
                    {data.meta ? data.meta.brand: ''}
                    </TableCell>
                  </TableRow>
                );
              }) }
            </TableBody>
          </Table>
        </div>
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
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(PostList);




  


