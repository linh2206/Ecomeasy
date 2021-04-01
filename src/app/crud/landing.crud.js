import axios from '../helpers/axios'

export const CREATE_POST = '/api/create-post'
export const POST_LIST = '/api/posts'
export const CREATE_CAMPAIGN = '/api/create-campaign'
export const CAMPAIGN_LIST = '/api/campaigns'
export const EDIT_CAMPAIGN = campaignId => `/api/campaign/${campaignId}`
export const GET_CAMPAIGN_DETAIL = campaignId => `/api/campaign/${campaignId}`

export function getCampaignDetail(campaignId) {
    return axios({
        url: GET_CAMPAIGN_DETAIL(campaignId),
        method: 'GET',
    })
}

export function editCampaign(campaignId, outputStream, slug) {
    const data = new FormData()
    data.append('outputStream', outputStream)
    data.append('slug', slug)
    return axios({
        url: EDIT_CAMPAIGN(campaignId),
        method: 'POST',
        data: data
    })
}

export function getCampaignList() {
    return axios({
        url: CAMPAIGN_LIST,
        method: 'GET',
    })
}

export function getPostList() {
    return axios({
        url: POST_LIST,
        method: 'GET',
    })
}

export function createCampaign(name) {
    const data = new FormData()
    data.append('name', name)
    return axios({
        url: CREATE_CAMPAIGN,
        method: 'POST',
        data: data
    })
}

export function createPost(name) {
    const data = new FormData()
    data.append('name', name)
    return axios({
        url: CREATE_POST,
        method: 'POST',
        data: data
    })
}