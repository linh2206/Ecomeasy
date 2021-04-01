import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button, Icon, Table, TableHead, TableRow, TableCell, TextField, FormGroup,
  CircularProgress, TableBody, MenuItem, Select, FormControl, Dialog, DialogActions, DialogContent
} from '@material-ui/core';
import { getJob, getData } from "../../crud/data.crud"
import _ from "lodash"
import { parseLocaleString } from "../../helpers/helper"
import XLSX from "xlsx"
import { saveAs } from 'file-saver';
import { Formik } from "formik";
import { FormattedMessage, injectIntl } from "react-intl";

CrawlData.propTypes = {

};

export const TRICKS = ['price', 'price_max', 'price_min', 'price_before_discount']

export const CELL_FORMAT = {
  IMAGE: 'image',
  NUMBER: 'number',
  STRING: 'string'
}

export const MARKET = {
  shopee: {
    label: 'SHOPEE',
    value: 'shopee',
    fields: {
      image: 'image',
      name: 'name',
      price: 'price',
      price_before_discount: 'price_before_discount',
      discount: 'discount',
      historical_sold: 'historical_sold',
      sold: 'sold',
      stock: 'stock',
      view_count: 'view_count',
      liked_count: 'liked_count',
      cmt_count: 'cmt_count',
      rating_star: 'rating_star',
      ratings_count: 'ratings_count',
      shop_location: 'shop_location'
    }
  },
  lazada: {
    label: 'LAZADA',
    value: 'lazada',
    fields: {
      name: 'name',
      price: 'price',
      discount: 'discount',
      rating_star: 'ratingScore',
    }
  }
}

const useStyles = makeStyles({
  root: {
    padding: 30,
    '& tr': {
      '&:nth-child(even)': {
        background: 'rgba(140, 160, 179, 0.1)'
      }
    },
  },
  filterSection: {
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  searchBlock: {
    marginRight: '15px'
  },
  datatable: {
    border: '1px solid #e0e0e0'
  },
})

function CrawlData(props) {
  const classes = useStyles()
  const [products, setProducts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [timer, setTimer] = useState()
  const [shops, setShops] = useState([])
  const [market, setMarket] = useState(MARKET.shopee.value)
  const [marketList, setMarketList] = useState([MARKET.shopee])
  const [searchBy, setSearchBy] = useState('keyword')
  const [errPopup, setErrPopup] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  const { intl } = props;

  const columns = {
    image: {
      label: 'Hình sản phẩm',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.IMAGE,
      defaultValue: ''
    },
    name: {
      label: 'Tên sản phẩm',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.STRING,
      defaultValue: ''
    },
    price: {
      label: 'Giá',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    discount: {
      label: 'Giảm giá',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.STRING,
      defaultValue: 0
    },
    price_before_discount: {
      label: 'Giá chưa giảm',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    historical_sold: {
      label: 'Đã bán',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    sold: {
      label: 'Lượt bán trong 30 ngày',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    stock: {
      label: 'Tồn kho',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    view_count: {
      label: 'Lượt xem',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    liked_count: {
      label: 'Lượt thích',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    cmt_count: {
      label: 'Lượt comment',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    rating_star: {
      label: 'Đánh giá',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    ratings_count: {
      label: 'Lượt đánh giá',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.NUMBER,
      defaultValue: 0
    },
    shop_location: {
      label: 'Địa chỉ shop',
      horizontalAlign: 'left',
      cellFormat: CELL_FORMAT.STRING,
      defaultValue: ''
    }
  }

  // useEffect(() => {
  //   search()
  // }, [market])

  const getCellFormatTemplate = (format, content, key, link) => {
    switch (format) {
      case CELL_FORMAT.NUMBER:
        return `${parseLocaleString(TRICKS.includes(key) ? Number(content) / 100000 : content)}`
        break;
      case CELL_FORMAT.STRING:
        if (key === 'name')
          return <React.Fragment><a href={link} target="_blank">{content}</a></React.Fragment>
        return content
        break;
      case CELL_FORMAT.IMAGE:
        return <React.Fragment><img style={{
          width: 55
        }} src={content} /></React.Fragment>
        break;
    }
  }

  const exportExcel = () => {
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "Shopee",
      Subject: "Shopee",
      Author: "user",
      CreatedDate: new Date(2017, 12, 19)
    };
    wb.SheetNames.push("Shopee");
    var col = []
    Object.keys(columns).forEach(c => {
      col.push(columns[c].label)
    })
    var ws_data = [];
    ws_data.push(col)
    products && products.length > 0 && products.forEach(p => {
      var row = []
      Object.keys(columns).map(c => {
        row.push(TRICKS.includes(c) ? Number(p[MARKET[market].fields[c]]) / 100000 : p[MARKET[market].fields[c]])

      })
      ws_data.push(row)
    })
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["Shopee"] = ws;
    var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    function s2ab(s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf);  //create uint8array as viewer
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
      return buf;
    }
    saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), `shopee-${new Date().getTime()}.xlsx`);

  }

  const search = (values, { setStatus, setSubmitting }) => {
    setLoading(true)
    setProducts([])
    setShops([])
    setErrMessage('')
    if (timer) {
      clearInterval(timer);
      setTimer()
    }
    getJob(searchBy === 'link' ? getShopId(values.keyword) : values.keyword, market, searchBy === 'link')
      .then(res => {
        const job = _.get(res, 'data.result.job')
        let errMsg = _.get(res, 'data.errMsg')
        if (errMsg) {
          setErrMessage(errMsg)
          setErrPopup(true)
          setLoading(false)
        }
        else {
          if (job) {
            let localTimer = setInterval(() => {
              getData(job)
                .then(res => {
                  const status = _.get(res, 'data.result.status')
                  errMsg = _.get(res, 'data.errMsg')
                  if (errMsg) {
                    setErrMessage(errMsg)
                    setErrPopup(true)
                  }
                  else {
                    if (status !== 'processing') {
                      const shop = _.get(res, 'data.result.shops')
                      let products = _.get(res, 'data.result.products')
                      products.forEach(item => {
                        if (market === MARKET.shopee.value) {
                          item['rating_star'] = _.get(item, 'item_rating.rating_star')
                          item['image'] = _.get(item, 'images[0]')
                          item['ratings_count'] = _.sum(_.get(item, 'item_rating.rating_count'));
                        }
                      })
                      setShops(shop)
                      setProducts(products)
                      setLoading(false)
                      clearInterval(localTimer)
                    }
                  }
                })
                .catch(err => {
                  setLoading(false)
                  clearInterval(localTimer)
                })
            }, 5000)
            setTimer(localTimer)
          }

          else {
            setLoading(false)
          }
        }
      })
      .catch(err => setLoading(false))
  }

  const handleSearchByChange = e => {
    setSearchBy(e.target.value)
  }

  const getShopId = txt => {
    let link = ''
    try {
      link = txt.split('shop/')[1].split('/')[0]
    }
    catch (err) {
      link = ''
    }
    return link
  }

  return (
    <div className={classes.root}>
      <Formik
        initialValues={{
          keyword
        }}
        validate={values => {
          const errors = {};

          if (!values.keyword) {
            errors.keyword = intl.formatMessage({
              id: "AUTH.VALIDATION.REQUIRED_FIELD"
            });
          }
          else if (searchBy === 'link' && !getShopId(values.keyword)) {
            errors.keyword = 'Invalid link. Ex: https://shopee.vn/shop/xxxxxxxx'
          }

          return errors;
        }}
        onSubmit={search}
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
            <form
              style={{
                display: 'flex',
                alignItems: 'flex-start'
              }}
              onSubmit={handleSubmit}
              className={classes.filterSection}>
              <FormControl variant="outlined" className="dropdown" style={{
                marginRight: 15
              }}>
                <Select
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
                  }}
                  className="btn-base btn-base--success"
                  id="searchBy"
                  label="Search By"
                  value={searchBy}
                  onChange={handleSearchByChange}
                >
                  <MenuItem value="keyword">Keyword</MenuItem>
                  <MenuItem value="link">Link</MenuItem>
                </Select>
              </FormControl>
              <div className={`${classes.searchBlock} search`}>
                <FormGroup className="input-base input-base--sm">
                  <TextField
                    value={values.keyword}
                    name="keyword"
                    id="keyword"
                    variant="outlined"
                    helperText={touched.keyword && errors.keyword}
                    error={Boolean(touched.keyword && errors.keyword)}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={searchBy === 'keyword' ? 'Type keyword' : 'Input link'} />
                </FormGroup>
              </div>
              <Button
                style={{
                  marginRight: 15
                }}
                disabled={loading}
                type="submit"
                className="btn-base btn-base--success" >Search</Button>
              <Button
                disabled={products && products.length === 0}
                onClick={exportExcel}
              ><Icon>get_app</Icon></Button>
            </form>
          )}
      </Formik>

      <FormControl variant="outlined" className="dropdown" style={{
        marginBottom: 30
      }}>
        <Select
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
          }}
          className="btn-base btn-base--success"
          labelId="market"
          id="market"
          label="Market"
          value={market}
          onChange={e => setMarket(e.target.value)}
        >
          {marketList.map(item => (
            <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.datatable}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              {Object.keys(columns).map((col, index) => (
                <TableCell className={`${classes.tableHeader} ${classes.tableCell}`}
                  align="left" key={index}>{columns[col].label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {products && products.map((row, index) => (
              <TableRow key={index}>
                {
                  Object.keys(columns).map(col => {
                    const isNoDiscount = col === 'price_before_discount' && row[MARKET[market].fields['price_before_discount']] === 0
                    return (isNoDiscount ? <TableCell>{getCellFormatTemplate(columns[col].cellFormat, row[MARKET[market].fields['price']], col, row.link)}</TableCell> :
                      <TableCell>{getCellFormatTemplate(columns[col].cellFormat, row[MARKET[market].fields[col]], col, row.link)}</TableCell>
                    )
                  })
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {
        loading && <div className="spinner-container">
          <CircularProgress />
        </div>
      }
      <Dialog
        open={errPopup}
        keepMounted
        maxWidth="sm"
        onClose={() => setErrPopup(false)}
      >
        <DialogContent>
          <div className="popup-message">
            <Icon>warning</Icon>
            <p>{errMessage}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setErrPopup(false)}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div >
  );
}

export default injectIntl(CrawlData);