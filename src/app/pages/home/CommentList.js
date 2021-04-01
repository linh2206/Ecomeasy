import React, { useEffect, useState } from 'react';
import {
  Paper, TextField, Table, 
  TableBody, TableCell, TableHead, 
  TablePagination, TableRow, InputLabel, 
  MenuItem, FormControl, Select, makeStyles, Tooltip
} from '@material-ui/core';
import { upsertMetaCommentManual } from '../../crud/monitoring.crud';
import { connect } from 'react-redux';
import * as _ from 'lodash'
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
  DatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';

const columns = [
  {
    id: 'stt',
    label: 'STT',
    minWidth: 50,
    align: 'left',
  },
  {
    id: 'postContent',
    label: 'POST CONTENT',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'commentContent',
    label: 'COMMENT CONTENT',
    minWidth: 200,
    align: 'left',
  },
  {
    id: 'commentDate',
    label: 'COMMENT DATE',
    minWidth: 150,
    align: 'left',
  },
  {
    id: 'commentUser',
    label: 'COMMENT USER',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'auto',
    label: 'AUTO',
    minWidth: 90,
    align: 'left',
  },
  {
    id: 'manual',
    label: 'MANUAL',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'category',
    label: 'CATEGORY',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'sub',
    label: 'SUB',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'brand',
    label: 'BRAND',
    minWidth: 80,
    align: 'left',
  },
  {
    id: 'brandKeywords',
    label: 'BRAND KEYWORDS',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'brandCompetitors',
    label: 'BRAND COMPETITORS',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'generalPositive',
    label: 'GENERAL POSITIVE',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'generalNeutral',
    label: 'GENERAL NEUTRAL',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'generalNegative',
    label: 'GENERAL NEGATIVE',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'productType',
    label: 'PRODUCT TYPE',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'productAttributePositive',
    label: 'PRODUCT ATTRIBUTE POSITIVE',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'productAttributeNeutral',
    label: 'PRODUCT ATTRIBUTE NEUTRAL',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'productAttributeNegative',
    label: 'PRODUCT ATTRIBUTE NEGATIVE',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'specialKeywords',
    label: 'SPECIAL KEYWORDS',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'syncedDate',
    label: 'SYNCED DATE',
    minWidth: 120,
    align: 'left',
  },
  {
    id: 'syncedContent',
    label: 'SYNCED CONTENT',
    minWidth: 120,
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
  },
  toolTip: {
    lineHeight: '25px',
    fontSize: '14px',
    maxWidth: '350px',
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

let timeOutInstance = null
let listComments = []

const CommentList = (props) => {
  const stateComment = props.location.state
  const classes = useStyles();
  const classesSelect = useStylesSelect();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);
  const [listCommentsUser, setListCommentsUser] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterName, setFilterName] = useState(stateComment ? stateComment.filterName : '');
  const [dateSort, setDateSort] = useState(stateComment ? stateComment.dateSort : '-1');
  const [filterPostContent /*, setFilterPostContent */] = useState('');
  const [filterPostId, setFilterPostId] = useState(stateComment ? stateComment.postId : '');
  const [filterCommentContent, setFilterCommentContent] = useState('');
  // const weekInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  const [selectedFromDate, handleFromDateChange] = useState(
    stateComment ? stateComment.selectedFromDate : null
  );
  const [selectedToDate, handleToDateChange] = useState(stateComment ? stateComment.selectedToDate : null);
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleCloseMan = (id) => {
    setListCommentsUser(_.map(listCommentsUser, cmt => {
      if (cmt.id === id) {
        cmt.openMan = false
      }
      return cmt
    }))
  };

  const handleOpenMan = (id) => {
    setListCommentsUser(_.map(listCommentsUser, cmt => {
      if (cmt.id === id) {
        cmt.openMan = true
      }
      return cmt
    }))
  };

  const handleChangePage = (event, newPage) => {
    listComments(props.auth.authToken, newPage + 1, rowsPerPage, filterName, dateSort,
      selectedFromDate ? moment(new Date(selectedFromDate)).format("YYYY-MM-DD") : '',
      selectedToDate ? moment(new Date(selectedToDate)).format("YYYY-MM-DD") : '',
      filterPostContent, filterCommentContent, filterPostId)
      .then(({ data: { result } }) => {
        setListCommentsUser(_.map(result.rows, row => {
          row.openMan = false
          return row
        }));
        setPage( newPage )
      });

  };

  const handleChangeRowsPerPage = event => {
    listComments(props.auth.authToken,page + 1, +event.target.value, filterName, dateSort, 
      selectedFromDate ? moment(new Date(selectedFromDate)).format("YYYY-MM-DD") : '',
      selectedToDate ? moment(new Date(selectedToDate)).format("YYYY-MM-DD") : '',
      filterPostContent, filterCommentContent, filterPostId)
      .then(({ data: { result } }) => {
        setListCommentsUser(_.map(result.rows, row => {
          row.openMan = false
          return row
        }));
        setRowsPerPage(+event.target.value)
      });
  };
  const callApi = (auth, page, rows, name, date, from, to, post, comment, postId) => {
    listComments(auth, page, rows, name, date, 
      from ? moment(new Date(from)).format("YYYY-MM-DD") : '',
      to ? moment(new Date(to)).format("YYYY-MM-DD") : '',
      post, comment, postId)
    .then(({ data: { result } }) => {
      console.log('result', result)
      setListCommentsUser(_.map(result.rows, row => {
        row.openMan = false
        return row
      }));
      setCount(result.count)
    });
  }
  const upsertMetaManual = (value, id) => {
    let auth = props.auth.authToken
    upsertMetaCommentManual(auth, value, id).then(({ data: { result } }) => {
      result.openMan = false
      setListCommentsUser(_.map(listCommentsUser, cmt => {
        if (cmt.id === result.id) {
          return result
        }
        return cmt
      }))
    });
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

  useEffect(() => {
    if (timeOutInstance) clearTimeout(timeOutInstance)
    timeOutInstance = setTimeout(() => {
    callApi(props.auth.authToken,page + 1, rowsPerPage, 
      filterName, dateSort, selectedFromDate, selectedToDate, 
      filterPostContent, filterCommentContent, filterPostId)
    }, 1000)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterName, dateSort, selectedFromDate, selectedToDate, filterPostContent, filterCommentContent, filterPostId]);

  return (
    <div className={ classes.root }>
      <div className="sort name">
        <TextField className="box-search" value={filterName} onChange={(e) => setFilterName(e.target.value)} label="Search Page Name" />
        <TextField className="box-search" value={filterPostId} onChange={(e) => setFilterPostId(e.target.value)} label="Search Post ID" />
      </div>
      <div className="sort date">
        <FormControl className={classesSelect.formControl}>
          <InputLabel id="demo-controlled-open-select-label">Sort By Date</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value='1'>Ascending</MenuItem>
            <MenuItem value='-1'>Descending</MenuItem>
          </Select>
        </FormControl>
        <div className="date-picker">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker value={selectedFromDate} onChange={handleFromDateChange} format="yyyy-MM-dd" label="From Date"/>
            <DatePicker value={selectedToDate} onChange={handleToDateChange} format="yyyy-MM-dd" label="To Date"/>
          </MuiPickersUtilsProvider>
        </div>
        <TextField className="box-search" value={filterCommentContent} onChange={(e) => setFilterCommentContent(e.target.value)} label="Search Keyword on Comment" />
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
                    style={ { minWidth: column.minWidth } }
                  >
                    { column.label }
                  </TableCell>
                )) }
              </TableRow>
            </TableHead>
            <TableBody>
              { listCommentsUser && listCommentsUser.map((data, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={ -1 } key={ data.id } >
                    <TableCell align={ 'left' }>
                      {index + 1}
                    </TableCell>
                    <Tooltip title={data.post.content} classes={{ tooltip: classes.toolTip }} arrow>
                      <TableCell className={`${classes.fontSize} ellipsis list-post`} align={ 'left' }>
                        {data.post.content}
                      </TableCell>
                    </Tooltip>
                    <Tooltip title={data.content} classes={{ tooltip: classes.toolTip }} arrow>
                      <TableCell className={`${classes.fontSize} ellipsis list-post`} align={ 'left' }>
                        {data.content}
                      </TableCell>
                    </Tooltip>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {moment(data.date).format('hh:mm:ss DD-MM-YYYY')}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {data.userName}
                    </TableCell>
                    <TableCell className={`${classes.fontSize} dropdown-man-${defineClass(data.meta && data.meta.sentimentAuto ? data.meta.sentimentAuto.toLowerCase() : 'none')}`} align={ 'left' }>
                      {data.meta ? data.meta.sentimentAuto: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      <FormControl>
                        <Select
                          className={`dropdown-man-${defineClass(data.meta && data.meta.sentimentManual ? data.meta.sentimentManual.toLowerCase() : 'none')}`}
                          labelId="demo-controlled-open-select-label"
                          id="demo-controlled-open-select"
                          open={data.openMan}
                          onClose={() => handleCloseMan(data.id)}
                          onOpen={() => handleOpenMan(data.id)}
                          value={data.meta && data.meta.sentimentManual ? data.meta.sentimentManual.toLowerCase() : 'none'}
                          onChange={(e) => {
                            upsertMetaManual(e.target.value, data.id)
                          }}
                        >
                          <MenuItem className={`dropdown-man-${defineClass('none')}`} value="none">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem className={`dropdown-man-${defineClass('positive')}`} value='positive'>Positive</MenuItem>
                          <MenuItem className={`dropdown-man-${defineClass('neutral')}`} value='neutral'>Neutral</MenuItem>
                          <MenuItem className={`dropdown-man-${defineClass('negative')}`} value='negative'>Negative</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {data.meta ? data.meta.category: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                      {data.meta ? data.meta.subCategory: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.brand: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.brandKeywords: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.brandCompetitors: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.generalPositive: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.generalNeutral: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.generalNegative: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.productType: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.productAttributePositive: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.productAttributeNeutral: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.productAttributeNegative: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? data.meta.specialKeywords: ''}
                    </TableCell>
                    <TableCell align={ 'left' } className={classes.fontSize}>
                    {data.meta ? moment(data.meta.syncedDate).format('hh:mm:ss DD-MM-YYYY'): ''}
                    </TableCell>
                    <Tooltip title={data.meta ? data.meta.syncedContent: ''} classes={{ tooltip: classes.toolTip }} arrow>
                      <TableCell className={`${classes.fontSize} ellipsis list-post`} align={ 'left' }>
                        {data.meta ? data.meta.syncedContent: ''}
                      </TableCell>
                    </Tooltip>
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

export default connect(mapStateToProps)(CommentList);