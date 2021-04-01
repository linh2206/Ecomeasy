import React, { useEffect, useState } from 'react'
import {
  makeStyles
} from '@material-ui/core'
import { connect } from 'react-redux'
import { Grid, Paper, TextField, Typography, Button } from '@material-ui/core'
import { Alert } from 'react-bootstrap'
import {
  estimateNumberOfCommentToSync,
  getSentiment,
  syncCommentSentiment,
  updateSentiment
} from '../../crud/monitoring.crud'
import _ from 'lodash'
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const useStyles = makeStyles({
  root: {
    padding: 30
  },
  syncContainer: {},
  section: {
    marginBottom: 30
  },
  textArea: {
    width: '100%'
  },
  baseFont: {
    fontSize: 15,
  },
  button: {
    fontSize: 14,
    marginRight: 10
  },
  alert: {
    fontSize: 14,
    marginTop: 10,
  }
})
const initialField = {
  brandKeywords: '',
  brandCompetitors: '',
  generalPositive: '',
  generalNeutral: '',
  generalNegative: '',
  productType: '',
  productAttributePositive: '',
  productAttributeNeutral: '',
  productAttributeNegative: '',
  specialKeywords: '',
}
const SentimentConfig = ({ auth }) => {
  const classes = useStyles()
  // states
  const [isModified, setIsModified] = useState(false)
  const [storedFields, setStoredFields] = useState(initialField)
  const [fields, setFields] = useState(initialField)
  const [syncStartDate, setSyncStartDate] = useState(new Date())
  const [syncResponseMsg, setSyncResponseMsg] = useState({
    mood: null,
    text: null
  })
  const [numberOfCommentToSync, setNumberOfCommentToSync] = useState(0)
  const [syncDisabled, setSyncDisabled] = useState(false)

  // effects
  useEffect(() => {
    getSentiment(auth.authToken)
      .then(({ data: { result } }) => {
        if (result) {
          setFields(result)
          setStoredFields(result)
        }
      })
  }, [auth])

  useEffect(() => {
    setSyncDisabled(true)
    estimateNumberOfCommentToSync(auth.authToken, syncStartDate).then(({ data: { result } }) => {
      setNumberOfCommentToSync(result)
      setSyncDisabled(false)
    })
  }, [auth, syncStartDate])

  // actions
  const onFieldChange = ({ target }) => {
    const { name, value } = target
    const newFields = {
      ...fields,
      [name]: value
    }
    setFields(newFields)
    setIsModified(!_.isEqual(newFields, storedFields))
  }

  const saveSentiment = () => {
    updateSentiment(auth.authToken, { ...fields })
      .then(({ data: { result } }) => {
        if (result) {
          setFields(result)
          setStoredFields(result)
          setIsModified(false)
        }
      }).catch(error => {
      console.log(error)
    })
  }
  const resetSentiment = () => {
    if (isModified) {
      setFields(storedFields)
      setIsModified(false)
    }
  }

  let timeoutInstance = null
  const syncComment = async () => {
    try {
      const { data: { result } } = await syncCommentSentiment(auth.authToken, syncStartDate)
      setSyncResponseMsg({
        mood: 'success',
        text: result
      })
    } catch (e) {
      setSyncResponseMsg({
        mood: 'danger',
        text: 'Something went wrong, please try again later'
      })
    } finally {
      if (timeoutInstance) clearTimeout(timeoutInstance)
      timeoutInstance = setTimeout(() => setSyncResponseMsg({ mood: null, text: null }), 3000)
    }
  }

  // render
  return (
    <Paper className={classes.root}>
      <div className={classes.syncContainer}>

      </div>
      <div className={classes.section}>
        <Grid container spacing={3} justify={'flex-end'}>
          <Grid item xs={6} sm={4} md={3} lg={3} xl={2}>
            <Typography variant="h5" align='center'>
              Synchronization
            </Typography>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                label="Sync start date"
                format="dd/MM/yyyy"
                margin="normal"
                maxDate={new Date()}
                className={classes.dateInputWrapper}
                inputVariant="outlined"
                inputProps={{
                  className: classes.baseFont
                }}
                value={syncStartDate}
                onChange={(date) => {
                  setSyncStartDate(date)
                }}
              />
            </MuiPickersUtilsProvider>
            <Typography align="center">
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                onClick={syncComment}
                disabled={syncDisabled}
              >
                {
                  syncDisabled ?
                  'Counting comments...' :
                  `Apply ${numberOfCommentToSync} Comment`
                }
              </Button>
            </Typography>
            <Alert
              show={!!syncResponseMsg.text}
              variant={syncResponseMsg.mood}
              className={classes.alert}
            >
              {syncResponseMsg.text}
            </Alert>
          </Grid>
        </Grid>
      </div>
      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              1. Brand Keyword
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Brand Keyword"
              name="brandKeywords"
              value={fields.brandKeywords}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              2. Brand Competitors
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Brand Competitors"
              name="brandCompetitors"
              value={fields.brandCompetitors}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              3. General Keyword
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Positive
            </Typography>
            <TextField
              label="Positive keyword"
              name="generalPositive"
              value={fields.generalPositive}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Neutral
            </Typography>
            <TextField
              label="Neutral keyword"
              name="generalNeutral"
              value={fields.generalNeutral}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Negative
            </Typography>
            <TextField
              label="Negative keyword"
              name="generalNegative"
              value={fields.generalNegative}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              4. Category/Product Type
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Category/Product Type"
              name="productType"
              value={fields.productType}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              5. Category/Product Attributes
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Positive
            </Typography>
            <TextField
              label="Positive attributes"
              name="productAttributePositive"
              value={fields.productAttributePositive}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Neutral
            </Typography>
            <TextField
              label="Neutral attributes"
              name="productAttributeNeutral"
              value={fields.productAttributeNeutral}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Negative
            </Typography>
            <TextField
              label="Negative attributes"
              name="productAttributeNegative"
              value={fields.productAttributeNegative}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
        </Grid>
      </div>

      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5">
              6. Specific keywords
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Special keywords"
              name="specialKeywords"
              value={fields.specialKeywords}
              onChange={onFieldChange}
              multiline
              variant="outlined"
              className={classes.textArea}
              inputProps={{ className: classes.baseFont }}
              rows={3}
              rowsMax={10}
            />
          </Grid>
        </Grid>
      </div>
      <div className={classes.section}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isModified}
          className={classes.button}
          onClick={saveSentiment}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={!isModified}
          className={classes.button}
          onClick={resetSentiment}
        >
          Reset
        </Button>
      </div>

    </Paper>
  )
}

const mapStateToProps = ({ auth }) => ({
  auth,
})

export default connect(mapStateToProps)(SentimentConfig)




  


