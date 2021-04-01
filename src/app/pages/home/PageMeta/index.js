import React, { useEffect } from 'react'
import Information from './Information'
import { shallowEqual, useSelector } from 'react-redux'
import { Paper, Tabs, Tab, Box, makeStyles } from '@material-ui/core'
import Popularity from './Popularity'
import { pageMeta, pageMetaUpdate, syncPageInfluencerPower, syncPagePopularity } from '../../../crud/monitoring.crud'
import InfluencerPower from './InfluencerPower'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  tabHeader: {
    fontSize: '15px',
  },
});

const PageMeta = ({ location, match }) => {
  const classes = useStyles();
  const auth = useSelector(state => state.auth, shallowEqual)
  const pageId = location.state && location.state.pageId
    ? location.state.pageId
    : match.params && match.params.id
      ? match.params.id
      : ''

  // states
  const [activeTab, setActiveTab] = React.useState(0);
  const [pageData, setPageData] = React.useState({});


  // effects
  useEffect(() => {
    pageMeta(auth.authToken, pageId).then(({ data: { result } }) => {
      setPageData(result)
    })
  },[auth, pageId])

  // actions
  const handleChange = (event, newTab) => {
    setActiveTab(newTab);
  };

  const onSavePageMetaData = ({ fields }) => {
    pageMetaUpdate({
      token: auth.authToken,
      pageId: pageId,
      ...fields
    }).then(({ data: { result } }) => {
      // console.log(result)
      setPageData(result)
    })
  }

  const onSyncPagePopularity = async () => {
    try {
      let { data: { result } } = await syncPagePopularity(auth.authToken, pageId)
      setPageData(result)
    } catch (e) {
      throw e
    }
  }

  const onSyncPageInfluencerPower = async () => {
    try {
      let { data: { result } } = await syncPageInfluencerPower(auth.authToken, pageId)
      setPageData(result)
    } catch (e) {
      throw e
    }
  }

  return (
    <Paper className={classes.root}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Information" className={classes.tabHeader} />
        <Tab label="Popularity" className={classes.tabHeader} />
        <Tab label="Influencer Power" className={classes.tabHeader} />
      </Tabs>
      <TabPanel value={activeTab} index={0}>
        <Information auth={auth} pageId={pageId} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Popularity pageData={pageData} onSavePageMetaData={onSavePageMetaData} onSyncPagePopularity={onSyncPagePopularity}/>
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <InfluencerPower pageData={pageData} onSavePageMetaData={onSavePageMetaData} onSyncPageInfluencerPower={onSyncPageInfluencerPower}/>
      </TabPanel>
    </Paper>
  )
}

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default PageMeta