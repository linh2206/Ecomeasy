import { ErrorOutlined } from '@material-ui/icons'
import axios from '../helpers/axios'
import _ from "lodash"

export const CREATE_PROCESS = '/api/create-process'
export const CREATE_STEP = processId => `/api/process/${processId}/add-step`
export const GET_PROCESS_LIST = '/api/process'
export const EDIT_STEP = (processId, stepSlug) => `/api/process/${processId}/step/${stepSlug}/modify-step`
export const REQUEST_LIST = '/api/request'
export const STEP_ACTION_LIST = '/api/actions'
export const CREATE_REQUEST = (processId, stepSlug) => `/api/process/${processId}/step/${stepSlug}/`
export const GET_REQUEST_DETAIL = requestId => `/api/request/${requestId}`
export const REQUEST_SELECT = '/api/request/create'

export function selectRequest(requestName, processId, stepSlug) {
    let formData = new FormData()
    formData.append('requestName', requestName)
    formData.append('processId', processId)
    formData.append('stepSlug', stepSlug)
    return axios({
        method: 'POST',
        url: REQUEST_SELECT,
        data: formData
    })

}

export function getRequestDetail(requestId) {
    return axios({
        method: 'GET',
        url: GET_REQUEST_DETAIL(requestId)
    })
}

export function editStep(processId, stepSlug, data, actions) {
    let formData = new FormData()
    formData.append('data', typeof (data) === 'object' ? JSON.stringify(data) : '[]')
    formData.append('actions', typeof (actions) === 'object' ? JSON.stringify(actions) : '[]')
    return axios({
        method: 'POST',
        url: EDIT_STEP(processId, stepSlug),
        data: formData
    })
}

export function createProcess(name) {
    let data = new FormData()
    data.append('name', name)
    return axios({
        method: 'POST',
        url: CREATE_PROCESS,
        data: data
    })
}

export function getProcessList() {
    return axios({
        method: 'GET',
        url: GET_PROCESS_LIST,
    })
}

export function createStep(processId, stepName, stepSlug, stepDes) {
    let data = new FormData()
    try {
        data.append('stepName', stepName)
        data.append('stepSlug', stepSlug)
        data.append('stepDes', stepDes)
    }
    catch (err) {
        console.log(err)
    }
    return axios({
        method: 'POST',
        url: CREATE_STEP(processId),
        data: data
    })
}

export function getRequestList() {
    return axios({
        method: 'GET',
        url: REQUEST_LIST
    })
}

export function getStepActionList() {
    return axios({
        method: 'GET',
        url: STEP_ACTION_LIST
    })
}

export function createRequest(processId, step, stepSlug, action, requestId) {
    let data = new FormData()
    data.append('action', action)
    data.append('requestId', requestId)
    Object.keys(step).forEach(key => {
        data.append(`${key}`, step[key])
    })
    _.get(step, 'inputData') && _.get(step, 'inputData').forEach(item => {
    })
    return axios({
        method: 'POST',
        url: CREATE_REQUEST(processId, stepSlug),
        data: data
    })
}
