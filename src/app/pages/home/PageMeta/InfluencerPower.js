import React, { useEffect, useState } from 'react'
import {
  Grid,
  makeStyles,
  TextField,
  Typography,
  FormControl,
  Button
} from '@material-ui/core'
import _ from 'lodash'
import { Alert } from 'react-bootstrap'

const useStyles = makeStyles({
  root: {
    padding: 30
  },
  section: {
    marginBottom: 30
  },
  fullWidth: {
    width: '100%'
  },
  baseFont: {
    fontSize: 15,
  },
  formLabel: {
    background: '#FFFFFF',
    padding: '5px 5px',
    marginTop: '-5px',
    marginBottom: '-5px',
  },
  button: {
    fontSize: 14,
    marginRight: 10
  },
  buttonSync: {
    fontSize: 14,
  },
  alert: {
    fontSize: 14,
    marginTop: 10,
  }
})

const initialFields = {
  totalPost: '',
  brandedPostPerTotalPost: '',
  avgEngagementBrandedPost: '',
  avgInteractionBrandedPost: '',
  avgBuzzBrandedPost: '',
  positiveSentimentBrandedPost: '',
  unbrandedPostPerTotalPost: '',
  avgEngagementUnbrandedPost: '',
  avgInteractionUnbrandedPost: '',
  avgBuzzUnbrandedPost: '',
  positiveSentimentUnbrandedPost: '',
  videoPostPerTotalPost: '',
  avgEngagementVideoPost: '',
  avgInteractionVideoPost: '',
  photoPostPerTotalPost: '',
  avgEngagementPhotoPost: '',
  avgInteractionPhotoPost: '',
  top10BrandedPost: '',
  top10UnbrandedPost: '',
}

const InfluencerPower = ({ pageData, onSavePageMetaData, onSyncPageInfluencerPower }) => {
  const classes = useStyles()

  // states
  const [isModified, setIsModified] = useState(false)
  const [storedFields, setStoredFields] = useState(initialFields)
  const [fields, setFields] = useState(initialFields)
  const [syncResponseMsg, setSyncResponseMsg] = useState({
    mood: null,
    text: null
  })
  const [syncDisabled, setSyncDisabled] = useState(false)

  // effects
  useEffect(() => {
    let fields = {}
    if (pageData && pageData.meta) {
      for (let key in initialFields) {
        if (initialFields.hasOwnProperty(key)) {
          fields[key] = pageData.meta[key] !== null && pageData.meta[key] !== undefined ? pageData.meta[key] : ''
        }
      }
    } else {
      fields = _.cloneDeep(initialFields)
    }
    setFields(fields)
    setStoredFields(fields)
    setIsModified(false)
  }, [pageData])

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

  const submitForm = () => {
    if (isModified) {
      console.log('states', fields)
      onSavePageMetaData({ fields })
    }
  }
  const resetForm = () => {
    if (isModified) {
      setFields(storedFields)
      setIsModified(false)
    }
  }

  let timeoutInstance = null
  const syncInfluencerPower = async () => {
    setSyncDisabled(true)
    try {
      await onSyncPageInfluencerPower()
      setSyncDisabled(false)
      setSyncResponseMsg({
        mood: 'success',
        text: 'Sync page influencer power successfully.'
      })
    } catch (error) {
      setSyncResponseMsg({
        mood: 'danger',
        text: error && error.response && error.response.data && error.response.data.error ? error.response.data.error : error.toString()
      })
    } finally {
      setSyncDisabled(false)
      if (timeoutInstance) clearTimeout(timeoutInstance)
      timeoutInstance = setTimeout(() => setSyncResponseMsg({ mood: null, text: null }), 3000)
    }
  }

  const passInputProps = {
    classes,
    fields,
    onFieldChange
  }

  // render
  return (
    <div className={classes.root}>
      <div className={classes.section}>
        <Grid container alignItems="flex-end" justify="flex-end" direction="row">
          <Grid item xs={12} md={6}>
            <Typography align="right">
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonSync}
                disabled={syncDisabled}
                onClick={syncInfluencerPower}
              >
                {syncDisabled ? 'Syncing' : 'Sync'}
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
      <InputSection
        idx="1"
        title="Total Posts (Branded + Unbranded)"
        subtitle="T???ng s??? l?????ng b??i ????ng tr??n trang trong v??ng 6 th??ng g???n nh???t"
        placeholder="L???y total posts"
        name="totalPost"
        {...passInputProps}
      />
      <InputSection
        idx="2"
        title="% Branded Posts/ Total Posts (Last 6 months) (%)"
        subtitle="T??? l??? b??i ????ng branded/ T???ng s??? b??i ????ng trong v??ng 6 th??ng g???n nh???t"
        placeholder="T???ng s??? post c?? brand / t???ng post"
        name="brandedPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="3"
        title="Avg.Engagement - Branded Posts (Last 6 months)"
        subtitle="L?????ng Engagements trung b??nh tr??n c??c b??i ????ng branded trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total branded posts"
        name="avgEngagementBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="4"
        title="Avg.Interaction - Branded Posts (Last 6 months)"
        subtitle="L?????ng Interactions trung b??nh tr??n c??c b??i ????ng branded trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares)/ Total branded posts"
        name="avgInteractionBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="5"
        title="Avg.Buzz - Branded Posts (Last 6 months)"
        subtitle="L?????ng buzz trung b??nh tr??n c??c b??i ????ng branded trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Post + Comments + Shares)/ Total branded posts"
        name="avgBuzzBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="6"
        title="% Positive Sentiment of Branded Posts"
        subtitle="T??? l??? % c???a b??nh lu???n t??ch c???c tr??n b??i ????ng branded"
        placeholder="Total Positive Comments/ Total Relevant Comments on total branded posts"
        name="positiveSentimentBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="7"
        title="% Unbranded Posts/ Total Posts (Last 6 months)"
        subtitle="T??? l??? b??i ????ng unbranded/ T???ng s??? b??i ????ng trong v??ng 6 th??ng g???n nh???t"
        placeholder="T???ng s??? post kh??ng brand / t???ng post"
        name="unbrandedPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="8"
        title="Avg.Engagement - Unbranded Posts (Last 6 months)"
        subtitle="L?????ng Engagements trung b??nh tr??n c??c b??i ????ng unbranded trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total unbranded posts"
        name="avgEngagementUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="9"
        title="Avg.Interaction - Unbranded Posts (Last 6 months)"
        subtitle="L?????ng Interactions trung b??nh tr??n c??c b??i ????ng unbranded trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares)/ Total unbranded posts"
        name="avgInteractionUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="10"
        title="Avg.Buzz - Unbranded Posts (Last 6 months)"
        subtitle="L?????ng buzz trung b??nh tr??n c??c b??i ????ng unbranded trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Post + Comments + Shares)/ Total unbranded posts"
        name="avgBuzzUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="11"
        title="% Positive Sentiment of Unbranded Posts"
        subtitle="T??? l??? % c???a b??nh lu???n t??ch c???c tr??n b??i ????ng unbranded"
        placeholder="Total Positive Comments/ Total Relevant Comments on total unbranded posts"
        name="positiveSentimentUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="12"
        title="% Video Posts/ Total Posts (Last 6 months)"
        subtitle="T??? l??? b??i ????ng video/ T???ng s??? b??i ????ng trong v??ng 6 th??ng g???n nh???t"
        placeholder="T???ng s??? video post / t???ng post"
        name="videoPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="13"
        title="Avg.Engagement - Video Posts (Last 6 months)"
        subtitle="L?????ng Engagements trung b??nh tr??n c??c b??i ????ng video trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total video posts"
        name="avgEngagementVideoPost"
        {...passInputProps}
      />
      <InputSection
        idx="14"
        title="Avg.Interaction - Video Posts (Last 6 months)"
        subtitle="L?????ng Interactions trung b??nh tr??n c??c b??i ????ng video trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares)/ Total video posts"
        name="avgInteractionVideoPost"
        {...passInputProps}
      />
      <InputSection
        idx="15"
        title="% Photo Posts/ Total Posts (Last 6 months)"
        subtitle="T??? l??? b??i ????ng photo/ T???ng s??? b??i ????ng trong v??ng 6 th??ng g???n nh???t"
        placeholder="T???ng s??? photo post / t???ng post"
        name="photoPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="16"
        title="Avg.Engagement - Photo Posts (Last 6 months)"
        subtitle="L?????ng Engagements trung b??nh tr??n c??c b??i ????ng photo trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total photo posts"
        name="avgEngagementPhotoPost"
        {...passInputProps}
      />
      <InputSection
        idx="17"
        title="Avg.Interaction - Photo Posts (Last 6 months)"
        subtitle="L?????ng Interactions trung b??nh tr??n c??c b??i ????ng photo trong v??ng 6 th??ng g???n nh???t"
        placeholder="Total (Reactions + Comments + Shares)/ Total photo posts"
        name="avgInteractionPhotoPost"
        {...passInputProps}
      />
      <InputSection
        idx="18"
        title="Top 10 branded posts"
        subtitle={
          <>
            Danh s??ch 10 braded posts c?? l?????ng t????ng t??c cao nh???t trong v??ng 6 th??ng qua. <br />
            Total Interations<br />
            Reactions<br />
            Comments<br />
            Shares
          </>
        }
        name="top10BrandedPost"
        multiline
        {...passInputProps}
      />
      <InputSection
        idx="19"
        title="Top 10 unbranded posts"
        subtitle={
          <>
            Danh s??ch 10 unbraded posts c?? l?????ng t????ng t??c cao nh???t trong v??ng 6 th??ng qua.<br />
            Total Interations<br />
            Reactions<br />
            Comments<br />
            Shares
          </>
        }
        name="top10UnbrandedPost"
        multiline
        {...passInputProps}
      />

      <div className={classes.section}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isModified}
          className={classes.button}
          onClick={submitForm}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={!isModified}
          className={classes.button}
          onClick={resetForm}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

const InputSection = ({ idx, title, placeholder, subtitle, name, fields, onFieldChange, classes, multiline = false }) => {
  let multilineProps = {}
  if (multiline) {
    multilineProps = {
      rows: 6,
      rowsMax: 10,
      multiline: true
    }
  }
  return (
    <div className={classes.section}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">
            {idx}. {title}
          </Typography>
          <Typography>
            {subtitle}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl className={classes.fullWidth}>
            <TextField
              label={placeholder || title}
              name={name}
              value={fields[name]}
              onChange={onFieldChange}
              variant="outlined"
              className={classes.fullWidth}
              inputProps={{ className: classes.baseFont }}
              {...multilineProps}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  )
}

export default InfluencerPower