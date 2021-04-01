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

const rageAgeKeys = [
  { value: 'rageAge_13_17', label: 'From 13 to 17' },
  { value: 'rageAge_18_24', label: 'From 18 to 24' },
  { value: 'rageAge_25_34', label: 'From 25 to 34' },
  { value: 'rageAge_35_44', label: 'From 35 to 44' },
  { value: 'rageAge_45_54', label: 'From 45 to 54' },
  { value: 'rageAge_55_64', label: 'From 55 to 64' },
  { value: 'rageAge_65', label: 'Over 65+' },
]

let rageAgeValueOnly = {}
rageAgeKeys.forEach(key => rageAgeValueOnly[key.value] = '')

const initialFields = {
  totalFollower: '',
  activeFollower: '',
  realUser: '',
  audienceMale: '',
  audienceFemale: '',
  audienceHN: '',
  audienceHCM: '',
  audienceOther: '',
  ...rageAgeValueOnly
}

const Popularity = ({ pageData, onSavePageMetaData, onSyncPagePopularity }) => {
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
          fields[key] = pageData.meta[key]
        }
      }
      if (pageData.meta.rageAge) {
        for (let key in pageData.meta.rageAge) {
          if (pageData.meta.rageAge.hasOwnProperty(key)) {
            fields[`rageAge_${key}`] = pageData.meta.rageAge[key]
          }
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
      let submittingFields = _.cloneDeep(fields)
      const rageAge = {}
      rageAgeKeys.forEach(key => {
        const keyCleanedUp = key.value.replace('rageAge_', '')
        rageAge[keyCleanedUp] = parseInt(submittingFields[key.value]) || 0
      })
      submittingFields.rageAge = JSON.stringify(rageAge)
      onSavePageMetaData({ fields: submittingFields })
    }
  }
  const resetForm = () => {
    if (isModified) {
      setFields(storedFields)
      setIsModified(false)
    }
  }

  let timeoutInstance = null
  const syncPopularity = async () => {
    setSyncDisabled(true)
    try {
      await onSyncPagePopularity()
      setSyncDisabled(false)
      setSyncResponseMsg({
        mood: 'success',
        text: 'Sync page popularity successfully.'
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
                onClick={syncPopularity}
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
        title="Total follower"
        subtitle="Tỷ lệ người theo dõi có tương tác với trang trong 6 tháng gần đây/ Tổng số người theo dõi trang"
        name="totalFollower"
        {...passInputProps}
      />
      <InputSection
        idx="2"
        title="Active follower (%)"
        subtitle="Tỷ lệ người theo dõi có tương tác với trang trong 6 tháng gần đây/ Tổng số người theo dõi trang"
        name="activeFollower"
        {...passInputProps}
      />
      <InputSection
        idx="3"
        title="Real User"
        subtitle="Tỷ lệ người theo dõi thật theo dữ liệu từ hệ thống. Chỉ áp dụng cho internal (agency), không show ra cho khách hàng"
        name="realUser"
        {...passInputProps}
      />
      <InputSection
        idx="4"
        title="Audience Male (%)"
        subtitle="Tỷ lệ người theo dõi trang là nam giới/ Tổng số người theo dõi trang"
        name="audienceMale"
        {...passInputProps}
      />
      <InputSection
        idx="5"
        title="Audience Female (%)"
        subtitle="Tỷ lệ người theo dõi trang là nữ giới/ Tổng số người theo dõi trang"
        name="audienceFemale"
        {...passInputProps}
      />
      <InputSection
        idx="6"
        title="Audience HN (%)"
        subtitle="Tỷ lệ người theo dõi trang ở Hà Nội/ Tổng số người theo dõi trang"
        name="audienceHN"
        {...passInputProps}
      />
      <InputSection
        idx="7"
        title="Audience HCM (%)"
        subtitle="Tỷ lệ người theo dõi trang ở Hồ Chí Minh/ Tổng số người theo dõi trang"
        name="audienceHCM"
        {...passInputProps}
      />
      <InputSection
        idx="8"
        title="Audience Other (%)"
        subtitle="Tỷ lệ người theo dõi trang ở các tỉnh khác/ Tổng số người theo dõi trang"
        name="audienceOther"
        {...passInputProps}
      />
      <div className={classes.section}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">
              9.Rage Age
            </Typography>
            <Typography>
              Tỷ lệ % của nhóm tuổi chiếm tỷ trọng cao nhất trong tổng số người theo dõi
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={3}>
              {rageAgeKeys.map(rageAge => (
                <Grid item xs={12} key={rageAge.value}>
                  <FormControl variant="outlined" className={classes.fullWidth}>
                    <TextField
                      label={rageAge.label}
                      name={rageAge.value}
                      value={fields[rageAge.value]}
                      onChange={onFieldChange}
                      variant="outlined"
                      className={classes.fullWidth}
                      inputProps={{ className: classes.baseFont }}
                      type="number"
                    />
                  </FormControl>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </div>
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

const InputSection = ({ idx, title, subtitle, name, fields, onFieldChange, classes }) => (
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
            label={title}
            name={name}
            value={fields[name]}
            onChange={onFieldChange}
            variant="outlined"
            className={classes.fullWidth}
            inputProps={{ className: classes.baseFont }}
            type="number"
          />
        </FormControl>
      </Grid>
    </Grid>
  </div>
)

export default Popularity