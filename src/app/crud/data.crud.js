import axios from '../helpers/axios'

export const CRAWL_DATA_GET_JOB = (keyword, market, isLink) => `/api/v1/crawl-with-keyword?${isLink ? 'shopid' : 'keyword'}=${keyword}&market=${market}`
export const CRAWL_DATA_GET_DATA = (job) => `/api/v1/data-with-job?job=${job}`
export const CRAWL_HISROTY = '/api/v1/crawl-history'

export const getCrawlHistory = () => axios.get(CRAWL_HISROTY)
export const getJob = (keyword, market, isLink) => axios.get(CRAWL_DATA_GET_JOB(keyword, market, isLink))
export const getData = (job) => axios.get(CRAWL_DATA_GET_DATA(job))