import React, { useEffect, useState } from 'react'
import { Alert } from 'react-bootstrap'
import { TextField, TextareaAutosize, makeStyles } from '@material-ui/core'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { createBrandfits, brandfits } from '../../crud/monitoring.crud'

const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: '#fff',
    padding: '50px 50px 50px',
    fontSize: '15px',
  },
  configTagging: {
    paddingBottom: '40px',
    maxWidth: '1300px',
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
    flex: 2,
  },
  btnSen: {
    flex: 1,
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
    marginBottom: '20px',
  },
  textArea: {
    width: '300px',
    overflow: 'auto !important',
    height: '250px !important',
  },
  contentBrand: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '20px 30px',
    color: '#000',
  },
  addNewBrand: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flex: 1,
  },
  contentCreateCat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '20px',
  },
  btnBrand: {
    marginLeft: '20px',
  },
  createCatCss: {
    width: '500px',
  },
  marginTop: {
    marginTop: '10px',
    // maxWidth: '300px'
    width: 'fit-content',
    marginLeft: 'auto',
  },
  fontSize: {
    fontSize: '13px',
  },
  formControl: {
    minWidth: 120,
    paddingBottom: '20px',
  },
  btnApply: {
    padding: '20px 0px',
    textAlign: 'right',
  },
  btnSyncData: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 0,
    marginLeft: 'auto',
  },
  circular: {
    marginRight: '2px',
  },
})

const TaggingConfig = (props) => {
  const classes = useStyles()
  const [listBrandfits, setListBrandfits] = useState([])
  const [newNameBrandfit, setNewNameBrandfit] = useState('')
  const [isUpdateBrand, setIsUpdateBrand] = useState(false)
  const [open, setOpen] = useState(false)

  const apiBrandfits = (auth) => {
    brandfits(auth).then(({ data: { result } }) => {
      let data = ''
      _.map(result, (brand, idx) => {
        data += idx + 1 < result.length ? `${brand.name}\n` : brand.name
      })
      setListBrandfits(data)
    })
  }
  const callApi = () => {
    const auth = props.auth.authToken
    apiBrandfits(auth)
  }

  const createNewBrand = () => {
    const token = props.auth.authToken
    createBrandfits(token, newNameBrandfit)
      .then(({ data: { result } }) => {
        if (result) {
          apiBrandfits(token)
          setNewNameBrandfit('')
          setOpen(false)
        } else {
          setOpen(true)
        }
      })
      .catch(() => {
        setOpen(true)
      })
  }
  useEffect(() => {
    callApi()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false)
      }, 3000)
    }
  }, [open])

  return (
    <div className={classes.root}>
      <div className={classes.configTagging}>
        <div className={classes.title}>PAGE - BRANDFIT KEYWORD</div>
        <div className={classes.contentBrand}>
          <div className={classes.createCatCss}>
            <TextareaAutosize
              rowsMax={10}
              disabled
              className={classes.textArea}
              aria-label="maximum height"
              placeholder="List Brandfits name"
              value={listBrandfits}
            />
          </div>
          <div className={classes.createCatCss}>
            <div className={classes.addNewBrand}>
              <TextField
                className="text-new-brand"
                value={newNameBrandfit}
                onChange={(e) => {
                  setNewNameBrandfit(e.target.value)
                  setIsUpdateBrand(true)
                }}
                label="Add keyword Brandfit"
              />
              <div className={classes.btnBrand}>
                <button
                  disabled={!isUpdateBrand}
                  className="btn btn-primary btn-elevate kt-login__btn-primary"
                  onClick={createNewBrand}
                >
                  Add
                </button>
              </div>
            </div>
            <Alert show={open} variant="danger" className={classes.marginTop}>
              Brandfit keyword already exist, please add another one!
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = ({ auth }) => ({
  auth,
})

export default connect(mapStateToProps)(TaggingConfig)
