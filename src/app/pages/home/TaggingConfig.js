import React, { useEffect, useState } from 'react';
import { Alert } from "react-bootstrap";
import {
  TextField,
  InputLabel,
  MenuItem, FormControl, Select, makeStyles, CircularProgress, TableHead, TableRow, TableCell, TableBody, Table
} from '@material-ui/core';
import {
  brands,
  categories,
  createBrand,
  createCategory,
  syncData,
  syncCommentData, updateBrand
} from '../../crud/monitoring.crud'
import { connect } from 'react-redux';
import * as _ from 'lodash'
import DateFnsUtils from "@date-io/date-fns";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import Autocomplete from "@material-ui/lab/Autocomplete";

const value2Category = (values, keywords) => keywords.find((kw) => kw.id === values)

const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: '#fff',
    padding: '20px 50px 50px',
    fontSize: '15px'
  },
  configTagging: {
    paddingBottom: '40px',
    maxWidth: '1300px'
  },
  content: {
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentChild: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '0 30px',
    flex: 2
  },
  btnSen: {
    flex: 1
  },
  title: {
    color: '#434349',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#434349',
    fontSize: '15px',
    fontWeight: 'bold',
    marginBottom: '20px'
  },
  textArea: {
    width: '300px',
    overflow: 'auto !important',
    height: '250px !important'
  },
  contentBrand: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 30px',
    color: '#000'
  },
  addNewBrand: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1
  },
  contentCreateCat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '20px'
  },
  btnBrand: {
    marginLeft: '20px'
  },
  createCatCss: {
    width: '500px'
  },
  marginTop: {
    marginTop: '10px',
    // maxWidth: '300px'
    width: 'fit-content',
    marginLeft: 'auto'
  },
  fontSize: {
    fontSize: '15px',
    width: '50%'
  },
  formControl: {
    minWidth: 120,
    paddingBottom: '20px'
  },
  btnApply: {
    padding: '20px 0px',
    textAlign: 'right',
    
  },
  btnContainer: {
    padding: '20px 0px',
    display: 'flex',
    justifyContent: 'space-evenly',
  },

  rsContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  btnSyncData: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  circular: {
    marginRight: '2px'
  },
  syncWrapper: {
    display: "block",
    marginLeft: "auto",
    maxWidth: "250px"
  },
  dateInput: {
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 10px',
  },
  dateInputWrapper: {
    fontSize: '16px',
    height: '36px',
    overflow: 'visible',
    marginLeft: 'auto'
  },
  select: {
    width: '200px',
    fontSize: '16px',
  }
});

const TaggingConfig = (props) => {
  const classes = useStyles();
  const [listBrands, setListBrands] = useState([]);
  const [newNameBrand, setNewNameBrand] = useState('');
  const [newBrandSubCatId, setNewBrandSubCatId] = useState(null);
  const [isUpdateBrand, setIsUpdateBrand] = useState(false);
  const [listCatories, setListCatories] = useState([]);
  const [isNewCat, setIsNewCat] = useState(false);
  const [isNewSubCat, setIsNewSubCat] = useState(false);
  const [newNameCategory, setNewNameCategory] = useState('');
  const [catParent, setCatParent] = useState('');
  const [newNameSubCat, setNewNameSubCat] = useState('');
  const [open, setOpen] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [openErrorCat, setOpenErrorCat] = useState(false);
  const [openErrorSub, setOpenErrorSub] = useState(false);
  const [openMess, setOpenMess] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [syncResult, setSyncResult] = useState('danger');
  const [messSync, setMessSync] = useState('');
  const [errorSub, setErrorSub] = useState('');
  const [syncStartDate, setSyncStartDate] = useState(new Date());
  const [subCategories, setSubCategories] = useState([]);

  const handleCloseCat = () => {
    setOpenCat(false);
  };

  const handleOpenCat = () => {
    setOpenCat(true);
  };

  const apiBrands = (auth) => {
    brands(auth).then(({ data: {result} }) => {
      // let data = ''
      // _.map(result, (brand, idx) => {
      //   data += (idx+1 < result.length) ? `${brand.name}\n` : brand.name
      // })
      setListBrands(result)
    });
  }
  const apiCategories = (auth) => {
    categories(auth).then(({ data: {result} }) => {
      setListCatories(result)
      let subCategories = []
      for (let category of result) {
        if (category.children && category.children.length) {
          subCategories = [...subCategories, ...category.children]
        }
      }
      setSubCategories(subCategories)
      apiBrands(auth)
    });
  }

  const createNewBrand = () => {
    let token = props.auth.authToken
    createBrand(token, newNameBrand, newBrandSubCatId).then(({ data: {result} }) => {
      if (result) {
        apiBrands(token);
        setNewNameBrand('');
        setOpen(false);
      } else {
        setOpen(true);
      }
    }).catch(() => {
      setOpen(true);
    });
  }

  const updateBrandSubCategory = (brand, subCategoryId) => {
    let token = props.auth.authToken
    updateBrand(token, brand.id, subCategoryId).then(({ data: {result} }) => {
      if (result) {
        const newListBrands = [...listBrands]
        const oldBrand = newListBrands.find(oldBrand => oldBrand.id === brand.id)
        oldBrand.name = result.name
        oldBrand.subCategory = result.subCategory
        setListBrands(newListBrands)
      }
    })
  }
  const createNewCategory = () => {
    let token = props.auth.authToken
    createCategory(token, newNameCategory).then(({ data: {result} }) => {
      if (result) {
        apiCategories(token);
        setNewNameCategory('');
        setOpenErrorCat(false);
        setIsNewCat(false)
      } else {
        setOpenErrorCat(true);
      }
    }).catch(() => {
      setOpenErrorCat(true);
    });
  }
  const createNewSubCategory = () => {
    if (catParent) {
      let token = props.auth.authToken
      createCategory(token, newNameSubCat, catParent).then(({ data: {result} }) => {
        if (result) {
          apiCategories(token)
          setNewNameSubCat('');
          setCatParent('')
          setOpenErrorSub(false);
          setIsNewSubCat(false)
        } else {
          setOpenErrorSub(true);
          setErrorSub('Sub Category is already exist, please add another brand!')
        }
      }).catch(() => {
        setOpenErrorSub(true);
        setErrorSub('Sub Category is already exist, please add another brand!')
      });
    } else {
      setOpenErrorSub(true);
      setErrorSub('Please select a catogery!')
    }
  }
  const syncDataApi = () => {
    let token = props.auth.authToken
    setIsSync(true)
    syncData(token, syncStartDate).then(({ data: {result} }) => {
      console.log('result', result)
      if (result) {
        setSyncResult('success')
        setIsSync(false)
        setOpenMess(true)
        setMessSync(result)
      }
    }).catch(() => {
      setSyncResult('danger')
      setIsSync(false)
      setOpenMess(true)
      setMessSync('Sync post is false, please try again!')
    })
  }

  const syncCommentDataApi = () => {
    let token = props.auth.authToken
    setIsSync(true)
    syncCommentData(token, syncStartDate).then(({ data: {result} }) => {
      console.log('result', result)
      if (result) {
        setSyncResult('success')
        setIsSync(false)
        setOpenMess(true)
        setMessSync(result)
      }
    }).catch(() => {
      setSyncResult('danger')
      setIsSync(false)
      setOpenMess(true)
      setMessSync('Sync comment is false, please try again!')
    })
  }

  useEffect(() => {
    let auth = props.auth.authToken
    apiCategories(auth)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (open) {
    setTimeout(()=> {
      setOpen(false)
   }, 3000)
  }
  }, [open]);
  useEffect(() => {
    if (openErrorCat) {
    setTimeout(()=> {
      setOpenErrorCat(false)
   }, 3000)
  }
  }, [openErrorCat]);
  
  useEffect(() => {
    if (openErrorSub) {
    setTimeout(()=> {
      setOpenErrorSub(false)
      setErrorSub('')
   }, 3000)
  }
  }, [openErrorSub]);
   
  useEffect(() => {
    if (openMess) {
    setTimeout(()=> {
      setOpenMess(false)
      setMessSync('')
   }, 5000)
  }
  }, [openMess]);
  
  return (
    <div className={ classes.root }>
      <div className={classes.syncWrapper}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
              label="Start date"
              format="dd/MM/yyyy"
              margin="normal"
              maxDate={new Date()}
              className={classes.dateInputWrapper}
              inputProps={{
                className: classes.dateInput,
              }}
              value={syncStartDate}
              onChange={(date) => {
                setSyncStartDate(date)
              }}
          />
        </MuiPickersUtilsProvider>
        <div className={ classes.btnContainer}>
          <button
            className={`${classes.btnSyncData} ${isSync ? 'disabled' : ''} btn btn-primary btn-elevate kt-login__btn-primary`}
            onClick={syncDataApi}
          >
            {isSync && <CircularProgress className={classes.circular} size={15}/>}
            Apply Post
          </button>
          <button
            className={`${classes.btnSyncData} ${isSync ? 'disabled' : ''} btn btn-primary btn-elevate kt-login__btn-primary`}
            onClick={syncCommentDataApi}
          >
            {isSync && <CircularProgress className={classes.circular} size={15}/>}
            Apply Comment
          </button>
        </div>
      </div>
      <div className={ classes.rsContainer}>
        <Alert show={openMess} variant={syncResult} className={ classes.marginTop }>
          {messSync}
        </Alert>
      </div>
      <div className={ classes.configTagging}>
        <div className={ classes.title }>2. CATEGORY & SUB CATEGORY</div>
        <div className={ classes.contentBrand }>
          <div className={ classes.btnSen }>
            {_.map(listCatories, (cat, idx) => {
              return (
                <div key={idx}>
                  <div>{cat.name}</div>
                  {cat && cat.children && _.map(cat.children, (child, index) => {
                    return (
                      <div className="" key={index}>-- {child.name}</div>
                    )
                  })}
                </div>
              )
            })}
          </div>
          <div className={ classes.createCatCss }>
            <div className={ classes.contentCreateCat }>
              <div>
                Create Category
              </div>
              <div>
                <div className={ classes.addNewBrand }>
                  <TextField 
                    className="text-new-brand"
                    value={newNameCategory} 
                    onChange={(e) => {
                      setNewNameCategory(e.target.value)
                      setIsNewCat(true)
                      }}
                    label="" />
                  <div className={classes.btnBrand}>
                    <button
                      disabled={ !isNewCat }
                      className="btn btn-primary btn-elevate kt-login__btn-primary"
                      onClick={createNewCategory}
                    >
                      Create
                    </button>
                  </div>
                </div>
                <Alert show={openErrorCat} variant="danger" className={ classes.marginTop }>
                  Category is already exist, please add another brand!
                </Alert>
              </div>
            </div>
            <div  className={ classes.contentCreateCat }>
              <div>
                Create Sub Category
              </div>
              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel id="demo-controlled-open-select-label">Select Category</InputLabel>
                  <Select
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    open={openCat}
                    onClose={handleCloseCat}
                    onOpen={handleOpenCat}
                    value={catParent}
                    onChange={(e) => setCatParent(e.target.value)}
                  >
                    {_.map(listCatories, cat => {
                      return (
                        <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>
                <div className={ classes.addNewBrand }>
                  <TextField 
                    className="text-new-brand"
                    value={newNameSubCat} 
                    onChange={(e) => {
                      setNewNameSubCat(e.target.value)
                      setIsNewSubCat(true)
                      }}
                    label="" />
                  <div className={classes.btnBrand}>
                    <button
                      disabled={ !isNewSubCat }
                      className="btn btn-primary btn-elevate kt-login__btn-primary"
                      onClick={createNewSubCategory}
                    >
                      Create
                    </button>
                  </div>
                </div>
                <Alert show={openErrorSub} variant="danger" className={ classes.marginTop }>
                  {errorSub}
                </Alert>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={ classes.configTagging}>
        <div className={ classes.title }>3. BRAND NAME & VARIATIONS</div>
        <div className={ classes.contentBrand }>
          <div className={ classes.createCatCss }>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.fontSize}>
                    Brand name
                  </TableCell>
                  <TableCell className={classes.fontSize}>
                    Sub Category
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { listBrands && listBrands.map((brand, index) => {
                  return (
                      <TableRow hover role="checkbox" tabIndex={ -1 } key={ index } >
                        <TableCell align="left" className={classes.fontSize}>
                          { brand.name }
                        </TableCell>
                        <TableCell>
                          <Autocomplete
                              options={subCategories}
                              getOptionLabel={(option) => option.name}
                              value={brand.subCategory ? value2Category(brand.subCategory.id, subCategories): null}
                              renderInput={(params) => (
                                  <TextField
                                      {...params}
                                      className={classes.select}
                                  />
                              )}
                              onChange={(event, value) => {
                                updateBrandSubCategory(brand, value ? value.id : null)
                              }}
                          />
                        </TableCell>
                      </TableRow>
                  );
                }) }
              </TableBody>
            </Table>
          </div>
          <div className={classes.createCatCss }>
            <div className={ classes.addNewBrand }>
              <div>
                <TextField
                    value={newNameBrand}
                    onChange={(e) => {
                      setNewNameBrand(e.target.value)
                      setIsUpdateBrand(true)
                    }}
                    inputProps={{
                      className: classes.select
                    }}
                    label="Add New Brand" />
                <Autocomplete
                    options={subCategories}
                    getOptionLabel={(option) => option.name}
                    value={value2Category(newBrandSubCatId, subCategories)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={classes.select}
                            label="Sub Category"
                        />
                    )}
                    onChange={(event, value) => {
                      setNewBrandSubCatId(value.id)
                      setIsUpdateBrand(true)
                    }}
                />
              </div>
              <div className={classes.btnBrand}>
                <button
                  disabled={ !isUpdateBrand }
                  className="btn btn-primary btn-elevate kt-login__btn-primary"
                  onClick={createNewBrand}
                >
                  Create
                </button>
              </div>
            </div>
            <Alert show={open} variant="danger" className={ classes.marginTop }>
              Brand is already exist, please add another brand!
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps)(TaggingConfig);




  


