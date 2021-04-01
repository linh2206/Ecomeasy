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
        subtitle="Tổng số lượng bài đăng trên trang trong vòng 6 tháng gần nhất"
        placeholder="Lấy total posts"
        name="totalPost"
        {...passInputProps}
      />
      <InputSection
        idx="2"
        title="% Branded Posts/ Total Posts (Last 6 months) (%)"
        subtitle="Tỷ lệ bài đăng branded/ Tổng số bài đăng trong vòng 6 tháng gần nhất"
        placeholder="Tổng số post có brand / tổng post"
        name="brandedPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="3"
        title="Avg.Engagement - Branded Posts (Last 6 months)"
        subtitle="Lượng Engagements trung bình trên các bài đăng branded trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total branded posts"
        name="avgEngagementBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="4"
        title="Avg.Interaction - Branded Posts (Last 6 months)"
        subtitle="Lượng Interactions trung bình trên các bài đăng branded trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares)/ Total branded posts"
        name="avgInteractionBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="5"
        title="Avg.Buzz - Branded Posts (Last 6 months)"
        subtitle="Lượng buzz trung bình trên các bài đăng branded trong vòng 6 tháng gần nhất"
        placeholder="Total (Post + Comments + Shares)/ Total branded posts"
        name="avgBuzzBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="6"
        title="% Positive Sentiment of Branded Posts"
        subtitle="Tỷ lệ % của bình luận tích cực trên bài đăng branded"
        placeholder="Total Positive Comments/ Total Relevant Comments on total branded posts"
        name="positiveSentimentBrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="7"
        title="% Unbranded Posts/ Total Posts (Last 6 months)"
        subtitle="Tỷ lệ bài đăng unbranded/ Tổng số bài đăng trong vòng 6 tháng gần nhất"
        placeholder="Tổng số post không brand / tổng post"
        name="unbrandedPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="8"
        title="Avg.Engagement - Unbranded Posts (Last 6 months)"
        subtitle="Lượng Engagements trung bình trên các bài đăng unbranded trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total unbranded posts"
        name="avgEngagementUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="9"
        title="Avg.Interaction - Unbranded Posts (Last 6 months)"
        subtitle="Lượng Interactions trung bình trên các bài đăng unbranded trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares)/ Total unbranded posts"
        name="avgInteractionUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="10"
        title="Avg.Buzz - Unbranded Posts (Last 6 months)"
        subtitle="Lượng buzz trung bình trên các bài đăng unbranded trong vòng 6 tháng gần nhất"
        placeholder="Total (Post + Comments + Shares)/ Total unbranded posts"
        name="avgBuzzUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="11"
        title="% Positive Sentiment of Unbranded Posts"
        subtitle="Tỷ lệ % của bình luận tích cực trên bài đăng unbranded"
        placeholder="Total Positive Comments/ Total Relevant Comments on total unbranded posts"
        name="positiveSentimentUnbrandedPost"
        {...passInputProps}
      />
      <InputSection
        idx="12"
        title="% Video Posts/ Total Posts (Last 6 months)"
        subtitle="Tỷ lệ bài đăng video/ Tổng số bài đăng trong vòng 6 tháng gần nhất"
        placeholder="Tổng số video post / tổng post"
        name="videoPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="13"
        title="Avg.Engagement - Video Posts (Last 6 months)"
        subtitle="Lượng Engagements trung bình trên các bài đăng video trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total video posts"
        name="avgEngagementVideoPost"
        {...passInputProps}
      />
      <InputSection
        idx="14"
        title="Avg.Interaction - Video Posts (Last 6 months)"
        subtitle="Lượng Interactions trung bình trên các bài đăng video trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares)/ Total video posts"
        name="avgInteractionVideoPost"
        {...passInputProps}
      />
      <InputSection
        idx="15"
        title="% Photo Posts/ Total Posts (Last 6 months)"
        subtitle="Tỷ lệ bài đăng photo/ Tổng số bài đăng trong vòng 6 tháng gần nhất"
        placeholder="Tổng số photo post / tổng post"
        name="photoPostPerTotalPost"
        {...passInputProps}
      />
      <InputSection
        idx="16"
        title="Avg.Engagement - Photo Posts (Last 6 months)"
        subtitle="Lượng Engagements trung bình trên các bài đăng photo trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares + Clicks + Views)/ Total photo posts"
        name="avgEngagementPhotoPost"
        {...passInputProps}
      />
      <InputSection
        idx="17"
        title="Avg.Interaction - Photo Posts (Last 6 months)"
        subtitle="Lượng Interactions trung bình trên các bài đăng photo trong vòng 6 tháng gần nhất"
        placeholder="Total (Reactions + Comments + Shares)/ Total photo posts"
        name="avgInteractionPhotoPost"
        {...passInputProps}
      />
      <InputSection
        idx="18"
        title="Top 10 branded posts"
        subtitle={
          <>
            Danh sách 10 braded posts có lượng tương tác cao nhất trong vòng 6 tháng qua. <br />
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
            Danh sách 10 unbraded posts có lượng tương tác cao nhất trong vòng 6 tháng qua.<br />
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