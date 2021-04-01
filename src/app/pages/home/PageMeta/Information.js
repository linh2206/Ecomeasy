import React, { useEffect, useState } from 'react'
import {
  makeStyles,
  TextareaAutosize,
  Select,
  MenuItem,
  TextField,
  Typography,
  Grid,
  Button
} from '@material-ui/core'
import DateFnsUtils from '@date-io/date-fns'
import {
  MuiPickersUtilsProvider,
  DatePicker,
} from '@material-ui/pickers'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { pageMetaUpdate, pageMeta, brandfits, syncPageBrandfit } from '../../../crud/monitoring.crud'
import { Alert } from 'react-bootstrap'

const useStyles = makeStyles({
  root: {
    width: '100%',
    backgroundColor: '#fff',
    padding: '20px 50px 50px',
    fontSize: '15px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#434349',
    margin: '20px 0',
  },
  titleInGrid: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#434349',
  },
  subTitle: {
    color: '#434349',
    fontSize: '16px',
    fontWeight: '500',
    width: '150px',
  },
  subTitleMiddle: {
    color: '#434349',
    fontSize: '16px',
    fontWeight: '500',
    textAlign: 'center',
    width: '150px',
  },
  marginBottom: {
    marginBottom: '25px',
  },
  fontSize: {
    fontSize: '13px',
  },
  contentFanpage: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '15px',
  },
  contentIn: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    fontSize: '16px',
    fontWeight: '500',
    wordWrap: 'break-word',
    width: '450px',
    padding: '5px 10px',
    minHeight: '36px',
  },
  select: {
    fontSize: '16px',
    fontWeight: '500',
    wordWrap: 'break-word',
    width: '450px',
    borderRight: '1px solid #AAA',
    borderLeft: '1px solid #AAA',
    borderTop: '1px solid #AAA',
  },
  selectInput: {
    padding: '8px 10px',
  },
  selectItem: {
    fontSize: '16px',
  },
  inputSmall: {
    fontSize: '16px',
    fontWeight: '500',
    width: '150px',
  },
  btnUpdate: {
    marginTop: '15px',
  },
  separator: {
    width: '100%',
    borderBottom: '1px solid #AAA',
    margin: '40px 0 30px',
  },
  dateInput: {
    borderLeft: '1px solid #AAA',
    fontSize: '16px',
    fontWeight: '500',
    padding: '8px 10px',
  },
  dateInputWrapper: {
    width: '450px',
    borderTop: '1px solid #AAA',
    fontSize: '16px',
    borderRight: '1px solid #AAA',
    height: '36px',
    overflow: 'visible',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
    fontSize: '16px',
  },
  buttonSync: {
    fontSize: 14,
  },
  alert: {
    fontSize: 14,
    marginTop: 10,
  }
})

const menuGenders = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const menuProvinces = [
  { value: 'An Giang', label: 'An Giang' },
  { value: 'Bà Rịa - Vũng Tàu', label: 'Bà Rịa - Vũng Tàu' },
  { value: 'Bắc Giang', label: 'Bắc Giang' },
  { value: 'Bắc Kạn', label: 'Bắc Kạn' },
  { value: 'Bạc Liêu', label: 'Bạc Liêu' },
  { value: 'Bắc Ninh', label: 'Bắc Ninh' },
  { value: 'Bến Tre', label: 'Bến Tre' },
  { value: 'Bình Định', label: 'Bình Định' },
  { value: 'Bình Dương', label: 'Bình Dương' },
  { value: 'Bình Phước', label: 'Bình Phước' },
  { value: 'Bình Thuận', label: 'Bình Thuận' },
  { value: 'Cà Mau', label: 'Cà Mau' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Cao Bằng', label: 'Cao Bằng' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Đắk Lắk', label: 'Đắk Lắk' },
  { value: 'Đắk Nông', label: 'Đắk Nông' },
  { value: 'Điện Biên', label: 'Điện Biên' },
  { value: 'Đồng Nai', label: 'Đồng Nai' },
  { value: 'Đồng Tháp', label: 'Đồng Tháp' },
  { value: 'Gia Lai', label: 'Gia Lai' },
  { value: 'Hà Giang', label: 'Hà Giang' },
  { value: 'Hà Nam', label: 'Hà Nam' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Hà Tĩnh', label: 'Hà Tĩnh' },
  { value: 'Hải Dương', label: 'Hải Dương' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Hậu Giang', label: 'Hậu Giang' },
  { value: 'Hòa Bình', label: 'Hòa Bình' },
  { value: 'Hưng Yên', label: 'Hưng Yên' },
  { value: 'Khánh Hòa', label: 'Khánh Hòa' },
  { value: 'Kiên Giang', label: 'Kiên Giang' },
  { value: 'Kon Tum', label: 'Kon Tum' },
  { value: 'Lai Châu', label: 'Lai Châu' },
  { value: 'Lâm Đồng', label: 'Lâm Đồng' },
  { value: 'Lạng Sơn', label: 'Lạng Sơn' },
  { value: 'Lào Cai', label: 'Lào Cai' },
  { value: 'Long An', label: 'Long An' },
  { value: 'Nam Định', label: 'Nam Định' },
  { value: 'Nghệ An', label: 'Nghệ An' },
  { value: 'Ninh Bình', label: 'Ninh Bình' },
  { value: 'Ninh Thuận', label: 'Ninh Thuận' },
  { value: 'Phú Thọ', label: 'Phú Thọ' },
  { value: 'Phú Yên', label: 'Phú Yên' },
  { value: 'Quảng Bình', label: 'Quảng Bình' },
  { value: 'Quảng Nam', label: 'Quảng Nam' },
  { value: 'Quảng Ngãi', label: 'Quảng Ngãi' },
  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
  { value: 'Quảng Trị', label: 'Quảng Trị' },
  { value: 'Sóc Trăng', label: 'Sóc Trăng' },
  { value: 'Sơn La', label: 'Sơn La' },
  { value: 'Tây Ninh', label: 'Tây Ninh' },
  { value: 'Thái Bình', label: 'Thái Bình' },
  { value: 'Thái Nguyên', label: 'Thái Nguyên' },
  { value: 'Thanh Hóa', label: 'Thanh Hóa' },
  { value: 'Thừa Thiên - Huế', label: 'Thừa Thiên - Huế' },
  { value: 'Tiền Giang', label: 'Tiền Giang' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Trà Vinh', label: 'Trà Vinh' },
  { value: 'Tuyên Quang', label: 'Tuyên Quang' },
  { value: 'Vĩnh Long', label: 'Vĩnh Long' },
  { value: 'Vĩnh Phúc', label: 'Vĩnh Phúc' },
  { value: 'Yên Bái', label: 'Yên Bái' },
]
const menuNumbers = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
]
const arr2CommaString = (arr) => {
  if (!arr || !arr.length) return ''
  return arr.join(', ')
}

const keyword2Value = (keywords) => keywords.map((kw) => kw.name)
const value2Keywords = (values, keywords) =>
  keywords.filter((kw) => values.indexOf(kw.name) > -1)

const Information = (props) => {
  const classes = useStyles()
  const auth = props.auth.authToken
  const pageId = props.pageId
  const [fanId, setFanId] = useState('')
  const [fanPage, setFanPage] = useState('')
  const [dob, setDob] = useState(null)
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [location, setLocation] = useState('')
  const [professional, setProfessional] = useState('')
  const [brandName, setBrandName] = useState('')
  const [category, setCategory] = useState('')
  const [imageStyle, setImageStyle] = useState([])
  const [tonality, setTonality] = useState([])
  const [personality, setPersonality] = useState([])
  const [competitors, setCompetitors] = useState('')
  const [creativeQuantity, setCreativeQuantity] = useState('')
  const [authenticity, setAuthenticity] = useState('')
  const [audienceMastery, setAudienceMastery] = useState('')
  const [collaborative, setCollaborative] = useState('')
  const [collaborationProfessional, setCollaborationProfessional] = useState('')
  const [justifiableCost, setJustifiableCost] = useState('')
  const [longTermPartnership, setLongTermPartnership] = useState('')
  const [brandfitKeywords, setBrandfitKeywords] = React.useState([])
  const [syncResponseMsg, setSyncResponseMsg] = useState({
    mood: null,
    text: null
  })
  const [subCategory, setSubCategory] = useState('')
  // const [costPerPostForm, setCostPerPostForm] = useState(0)
  // const [costPerPostTo, setCostPerPostTo] = useState(0)
  // const [like, setLike] = useState(0)
  // const [follow, setFollow] = useState(0)
  const [isUpdate, setIsUpdate] = useState(false)

  const setData = (result) => {
    setFanId(result.id || '')
    setFanPage(result.userName || '')
    const { meta } = result || {}
    if (meta) {
      setDob(meta.dob || null)
      setFullName(meta.fullName || '')
      setGender(meta.gender || '')
      setLocation(meta.location || '')
      setProfessional(meta.professional || '')
      setBrandName(arr2CommaString(meta.brand))
      setCategory(arr2CommaString(meta.category))
      setSubCategory(arr2CommaString(meta.subCategory))
      setImageStyle(meta.imageStyle || [])
      setTonality(meta.tonality || [])
      setPersonality(meta.personality || [])
      setCompetitors(meta.competitors || '')
      setCreativeQuantity(meta.creativeQuantity || '')
      setAuthenticity(meta.authenticity || '')
      setAudienceMastery(meta.audienceMastery || '')
      setCollaborative(meta.collaborative || '')
      setCollaborationProfessional(meta.collaborationProfessional || '')
      setJustifiableCost(meta.justifiableCost || '')
      setLongTermPartnership(meta.longTermPartnership || '')
    }

    // setCostPerPostForm(
    //   result.meta && result.meta.costPerPostFrom
    //     ? result.meta.costPerPostFrom
    //     : 0
    // )
    // setCostPerPostTo(
    //   result.meta && result.meta.costPerPostTo ? result.meta.costPerPostTo : 0
    // )
    // setLike(
    //   result.meta && result.meta.totalOfLike ? result.meta.totalOfLike : 0
    // )
    // setFollow(
    //   result.meta && result.meta.totalOfFollow ? result.meta.totalOfFollow : 0
    // )
    setIsUpdate(false)
  }
  const updatePageMetaData = () => {
    pageMetaUpdate({
      token: auth,
      pageId,
      name: fanPage,
      dob,
      fullName,
      gender,
      location,
      professional,
      brand: brandName,
      category,
      imageStyle,
      tonality,
      personality,
      competitors,
      creativeQuantity,
      authenticity,
      audienceMastery,
      collaborative,
      collaborationProfessional,
      justifiableCost,
      longTermPartnership,
      subCategory,
      // costPerPostForm,
      // costPerPostTo,
      // like,
      // follow
    }).then(({ data: { result } }) => {
      // console.log(result)
      setData(result)
    })
  }

  useEffect(() => {
    // console.log(pageId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    pageMeta(auth, pageId).then(({ data: { result } }) => {
      // console.log('result', result)
      setData(result)
    })
    brandfits(auth).then(({ data: { result } }) => {
      // console.log('result', result)
      setBrandfitKeywords(result)
    })
  }, [auth, pageId])

  let timeoutInstance = null
  const syncBrandfit = async () => {
    try {
      const { data: { result } } = await syncPageBrandfit(auth, fanId)
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

  return (
    <div className={classes.root}>
      <div className={classes.title}>PAGE INFORMATION</div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>FanPage ID:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder=""
          value={fanId}
          disabled
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>FanPage Name:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder=""
          value={fanPage}
          onChange={(e) => {
            setFanPage(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>DOB:</div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DatePicker
            format="dd/MM/yyyy"
            margin="normal"
            className={classes.dateInputWrapper}
            inputProps={{
              className: classes.dateInput,
            }}
            value={dob}
            onChange={(date) => {
              setDob(date)
              setIsUpdate(true)
            }}
          />
        </MuiPickersUtilsProvider>
        {/* <TextareaAutosize */}
        {/*  rowsMax={10} */}
        {/*  className={classes.input} */}
        {/*  aria-label="maximum height" */}
        {/*  placeholder="" */}
        {/*  value={dob} */}
        {/*  onChange={(e) => { */}
        {/*    setDob(e.target.value) */}
        {/*    setIsUpdate(true) */}
        {/*  }} */}
        {/* /> */}
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Full Name:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder=""
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Gender:</div>
        <Select
          className={classes.select}
          value={gender}
          onChange={(e) => {
            setGender(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuGenders.map((gd) => (
            <MenuItem
              className={classes.selectItem}
              value={gd.value}
              key={gd.value}
            >
              {gd.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Location:</div>
        <Select
          className={classes.select}
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuProvinces.map((gd) => (
            <MenuItem
              className={classes.selectItem}
              value={gd.value}
              key={gd.value}
            >
              {gd.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Professional:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder=""
          value={professional}
          onChange={(e) => {
            setProfessional(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.separator}/>
      <Grid container alignItems="center" justify="space-around" direction="row">
        <Grid item xs={6}>
          <div className={classes.titleInGrid}>BRANDFIT</div>
        </Grid>
        <Grid item xs={6}>
          <Typography align="right">
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonSync}
              onClick={syncBrandfit}
            >
              Sync
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
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Image/Style:</div>
        <Autocomplete
          multiple
          options={brandfitKeywords}
          getOptionLabel={(option) => option.name}
          value={value2Keywords(imageStyle, brandfitKeywords)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              className={classes.select}
            />
          )}
          onChange={(event, value) => {
            setImageStyle(keyword2Value(value))
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Tonality:</div>
        <Autocomplete
          multiple
          options={brandfitKeywords}
          getOptionLabel={(option) => option.name}
          value={value2Keywords(tonality, brandfitKeywords)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              className={classes.select}
            />
          )}
          onChange={(event, value) => {
            setTonality(keyword2Value(value))
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Personality:</div>
        <Autocomplete
          multiple
          options={brandfitKeywords}
          getOptionLabel={(option) => option.name}
          value={value2Keywords(personality, brandfitKeywords)}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              className={classes.select}
            />
          )}
          onChange={(event, value) => {
            setPersonality(keyword2Value(value))
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Brand Name:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder="keyword 1, keyword 2"
          value={brandName}
          onChange={(e) => {
            setBrandName(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Category:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder="keyword 1, keyword 2"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Sub Category:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder=""
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Competitors:</div>
        <TextareaAutosize
          rowsMax={10}
          className={classes.input}
          aria-label="maximum height"
          placeholder=""
          value={competitors}
          onChange={(e) => {
            setCompetitors(e.target.value)
            setIsUpdate(true)
          }}
        />
      </div>
      <div className={classes.separator}/>
      <div className={classes.title}>CREATIVITY</div>

      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Creative Quantity:</div>
        <Select
          className={classes.select}
          value={creativeQuantity}
          onChange={(e) => {
            setCreativeQuantity(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Authenticity (Unique Works):</div>
        <Select
          className={classes.select}
          value={authenticity}
          onChange={(e) => {
            setAuthenticity(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Audience Mastery:</div>
        <Select
          className={classes.select}
          value={audienceMastery}
          onChange={(e) => {
            setAudienceMastery(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className={classes.separator}/>
      <div className={classes.title}>COLLABORATION</div>

      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Collaborative:</div>
        <Select
          className={classes.select}
          value={collaborative}
          onChange={(e) => {
            setCollaborative(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Professional:</div>
        <Select
          className={classes.select}
          value={collaborationProfessional}
          onChange={(e) => {
            setCollaborationProfessional(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>
          Justifiable Cost (Reasonable Fee/Package):
        </div>
        <Select
          className={classes.select}
          value={justifiableCost}
          onChange={(e) => {
            setJustifiableCost(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.contentFanpage}>
        <div className={classes.subTitle}>Long-term Partnership:</div>
        <Select
          className={classes.select}
          value={longTermPartnership}
          onChange={(e) => {
            setLongTermPartnership(e.target.value)
            setIsUpdate(true)
          }}
          inputProps={{
            className: classes.selectInput,
          }}
        >
          {menuNumbers.map((item) => (
            <MenuItem
              className={classes.selectItem}
              value={item.value}
              key={item.value}
            >
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </div>


      {/* <div className={classes.contentFanpage}> */}
      {/*  <div className={classes.subTitle}>Cost Per Post:</div> */}
      {/*  <div className={classes.contentIn}> */}
      {/*    <TextField */}
      {/*      className={`${classes.inputSmall} small`} */}
      {/*      value={numeral(costPerPostForm).format('0,0')} */}
      {/*      onChange={(e) => { */}
      {/*        setCostPerPostForm(numeral(e.target.value).value()) */}
      {/*        setIsUpdate(true) */}
      {/*      }} */}
      {/*      label="" */}
      {/*    /> */}
      {/*    <div className={classes.subTitleMiddle}>-</div> */}
      {/*    <TextField */}
      {/*      className={`${classes.inputSmall} small`} */}
      {/*      value={numeral(costPerPostTo).format('0,0')} */}
      {/*      onChange={(e) => { */}
      {/*        setCostPerPostTo(numeral(e.target.value).value()) */}
      {/*        setIsUpdate(true) */}
      {/*      }} */}
      {/*      label="" */}
      {/*    /> */}
      {/*  </div> */}
      {/* </div> */}

      {/* <div className={classes.contentFanpage}> */}
      {/*  <div className={classes.subTitle}>LIKE:</div> */}
      {/*  <div className={classes.contentIn}> */}
      {/*    <TextField */}
      {/*      className={`${classes.inputSmall} small`} */}
      {/*      value={numeral(like).format('0,0')} */}
      {/*      onChange={(e) => { */}
      {/*        setLike(numeral(e.target.value).value()) */}
      {/*        setIsUpdate(true) */}
      {/*      }} */}
      {/*      label="" */}
      {/*    /> */}
      {/*    <div className={classes.subTitleMiddle}>FOLLOW</div> */}
      {/*    <TextField */}
      {/*      className={`${classes.inputSmall} small`} */}
      {/*      value={numeral(follow).format('0,0')} */}
      {/*      onChange={(e) => { */}
      {/*        setFollow(numeral(e.target.value).value()) */}
      {/*        setIsUpdate(true) */}
      {/*      }} */}
      {/*      label="" */}
      {/*    /> */}
      {/*  </div> */}
      {/* </div> */}
      <div className={classes.btnUpdate}>
        <button
          disabled={!isUpdate}
          className="btn btn-primary btn-elevate kt-login__btn-primary"
          onClick={updatePageMetaData}
        >
          Update
        </button>
      </div>
    </div>
  )
}

export default Information
