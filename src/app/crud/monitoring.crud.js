// http://localhost:3001/api/monitor/pages?page=1&limit=10&filterUserName=pnj
// http://localhost:3001/api/monitor/posts?page=1&limit=10&filterPageName=pnj&dateSort=-1&from=2020-01-31&to=2020-01-32
// http://localhost:3001/api/monitor/comments?page=1&limit=10&filterPageName=pnj&filterPostContent=BST&filterCommentContent=quá&dateSort=-1&from=2010-01-09&to=2010-01-10&filterPostId=1684459738350575
// http://localhost:3001/api/monitor/tag-config/brands
// http://localhost:3001/api/monitor/tag-config/brands/create
// http://localhost:3001/api/monitor/tag-config/categories/create
// http://localhost:3001/api/monitor/tag-config/categories
// http://localhost:3001/api/monitor/tag-config/sentiments/update-all
// http://localhost:3001/api/monitor/tag-config/sentiments
// http://localhost:3001/api/monitor/posts/1804841366312411/upsertMeta
// http://localhost:3001/api/monitor/comments/Y29tbWVudDoxNDQ1MzcxNzUyMzA2NzMwXzE5MDIwOTcxOTA2MjcwMg==/upsertMeta
// http://localhost:3001/api/dashboard/monitor-summary
// http://localhost:3001/api/monitor/tag-config/sync-post-comment-metas
// http://localhost:3001/api/monitor/pages/190710220940651/update-meta
// http://localhost:3001/api/monitor/pages/190710220940651
import axios from '../helpers/axios'

const SENTIMENTS_URL = 'api/monitor/tag-config/sentiments'
const SENTIMENTS_UPDATE_URL = 'api/monitor/tag-config/sentiments/update-all'
const CATEGORIES_URL = 'api/monitor/tag-config/categories'
const CATEGORIES_CREATE_URL = 'api/monitor/tag-config/categories/create'
const BRANDS_URL = 'api/monitor/tag-config/brands'
const BRANDS_CREATE_URL = 'api/monitor/tag-config/brands/create'
const BRANDFITS_URL = 'api/monitor/page-config/brandfits'
const BRANDFITS_CREATE_URL = 'api/monitor/page-config/brandfits/create'
const DASHBOARD_URL = 'api/dashboard/monitor-summary'
const SYNC_DATA_URL = 'api/monitor/tag-config/sync-post-metas'
const SYNC_COMMENT_DATA_URL = 'api/monitor/tag-config/sync-comment-metas'
const SYNC_COMMENT_SENTIMENT_URL = 'api/monitor/tag-config/sync-comment-sentiments'
const ESTIMATE_NUMBER_COMMENT_SYNC_URL = 'api/monitor/tag-config/estimate-number-comment-to-sync'

export function getDashboard(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(DASHBOARD_URL, config)
}

export function listPages(token, currentPage, limit, filterUserName) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(
    `api/monitor/pages?page=${currentPage}&limit=${limit}&filterUserName=${filterUserName}`,
    config
  )
}

export function listPosts(
  token,
  currentPage,
  limit,
  filterPageName,
  dateSort,
  from,
  to
) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(
    `/api/export-history`,
    config
  )
}

export function requestNewReport(
  brand,
  marketplace,
  from,
  to
) {
  const config = {
    headers: { Authorization: `Bearer xxxxx` },
  }
  return axios.get(
    `/api/export-new?brand=${brand}&marketplace=${marketplace}&from=${from}&to=${to}`,
    config
  )
}

export function getSentiment(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(SENTIMENTS_URL, config)
}

export function updateSentiment(token, { ...sentiment }) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  }
  return axios.post(SENTIMENTS_UPDATE_URL, { ...sentiment }, config)
}

export function categories(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(CATEGORIES_URL, config)
}

export function createCategory(token, name, parentId = null) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  let params
  if (parentId) {
    params = { name, parentId }
  } else {
    params = { name }
  }
  return axios.post(CATEGORIES_CREATE_URL, params, config)
}

export function brands(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(BRANDS_URL, config)
}

export function createBrand(token, name, subCategoryId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.post(BRANDS_CREATE_URL, { name, subCategoryId}, config)
}

export function updateBrand(token, brandId, subCategoryId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.post(`api/monitor/tag-config/brands/${brandId}/update`, { subCategoryId }, config)
}

export function brandfits(token) {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  }
  return axios.get(BRANDFITS_URL, config)
}

export function createBrandfits(token, name) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.post(BRANDFITS_CREATE_URL, { name }, config)
}

export function upsertMetaSenManual(token, sentimentManual, id) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.post(
    `api/monitor/posts/${id}/upsertMeta`,
    { sentimentManual },
    config
  )
}

export function upsertMetaCommentManual(token, sentimentManual, id) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.post(
    `api/monitor/comments/${id}/upsertMeta`,
    { sentimentManual },
    config
  )
}

export function syncData(token, syncStartDate = new Date()) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const startAt = syncStartDate.getTime()
  return axios.get(`${SYNC_DATA_URL}/?startAt=${startAt}`, config)
}

export function syncCommentData(token, syncStartDate = new Date()) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const startAt = syncStartDate.getTime()
  return axios.get(`${SYNC_COMMENT_DATA_URL}/?startAt=${startAt}`, config)
}

export function syncCommentSentiment(token, syncStartDate = new Date()) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const startAt = syncStartDate.getTime()
  return axios.get(`${SYNC_COMMENT_SENTIMENT_URL}/?startAt=${startAt}`, config)
}

export function syncPagePopularity(token, pageId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`api/monitor/pages/${pageId}/sync-popularity`, config)
}

export function syncPageInfluencerPower(token, pageId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`api/monitor/pages/${pageId}/sync-influencer-power`, config)
}

export function syncPageBrandfit(token, pageId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`api/monitor/pages/${pageId}/sync-brandfit`, config)
}

export function estimateNumberOfCommentToSync(token, syncStartDate = new Date()) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const startAt = syncStartDate.getTime()
  return axios.get(`${ESTIMATE_NUMBER_COMMENT_SYNC_URL}/?startAt=${startAt}`, config)
}

export function pageMetaUpdate({ token, pageId, ...data }) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.post(`api/monitor/pages/${pageId}/update-meta`, data, config)
}

export function pageMeta(token, pageId) {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  return axios.get(`api/monitor/pages/${pageId}`, config)
}
