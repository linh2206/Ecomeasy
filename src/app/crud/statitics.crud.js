import axios from '../helpers/axios'

export const REVENUE_BY_BRAND = (brandId) => `/api/brand/${brandId}/revenue-by-market`
export const PRODUCT_HIGHLIGHT_BY_BRAND = (brandId) => `/api/brand/${brandId}/product-highlight`
export const GET_ORDER_LIST = (shop, source, page, limit, from, to, mode) => {
    let endpoint = ''
    switch (source) {
        case 'shopee':
            endpoint = 'shopee-source'
            break;
        case 'lazada':
            endpoint = 'lazada-source'
            break;
        case 'tiki':
            endpoint = 'tiki-source'
            break;
        case 'sendo':
            endpoint = 'sendo-source'
            break;
        default:
            endpoint = 'other-source'
            break;
    }
    return `/api/shop/${shop}/orders/${endpoint}?page=${page}&limit=${limit}${mode === 'all' ? '' : `&from=${from}&to=${to}`}`
}
export const GET_SHOPS = '/api/shops'
export const GET_USERS = '/api/v1/user/role'
export const GET_USERS_LIST = '/api/v1/users/listing'
export const INTERNAL_REPORT = (from, to, groupBy) => `/api/brand/all-brand-report?from=${from}&to=${to}&groupby=${groupBy}`
export const GET_DEPARMENTS = '/api/departs'
export const CREATE_DEPARMENTS = '/api/create-depart'
export const ADD_USER_TO_DEPARTMENTS = departId => `/api/depart/${departId}/add-user`

export function addUserToDepartment(departId, users) {
    let data = new FormData()
    data.append('users', JSON.stringify(users))
    return axios({
        method: 'POST',
        url: ADD_USER_TO_DEPARTMENTS(departId),
        data: data
    })
}

export function createDepartments(name) {
    let data = new FormData()
    data.append('name', name)
    return axios({
        method: 'POST',
        url: CREATE_DEPARMENTS,
        data: data
    })
}

export function getDepartments() {
    return axios({
        method: 'GET',
        url: GET_DEPARMENTS
    })
}

export function getBrandReport(from, to, groupBy) {
    return axios({
        method: 'GET',
        url: INTERNAL_REPORT(from, to, groupBy)
    })
}

export function getRevenueByBrand(brandId, from, to, groupBy) {
    return axios({
        method: 'GET',
        url: `${REVENUE_BY_BRAND(brandId)}?from=${from}&to=${to}&groupby=${groupBy}`
    })
}

export function getProductHighlightByBrand(brandId, from, to) {
    return axios({
        method: 'GET',
        url: `${PRODUCT_HIGHLIGHT_BY_BRAND(brandId)}?from=${from}&to=${to}`
    })
}

export function getOrders(shop, source, page, limit, from, to, mode) {
    return axios({
        method: 'GET',
        url: GET_ORDER_LIST(shop, source, page + 1, limit, from, to, mode)
    })
}

export function getShops() {
    return axios({
        method: 'GET',
        url: GET_SHOPS
    })
}

export function getUsers() {
    return axios({
        method: 'GET',
        url: GET_USERS
    })
}

export function getUserList() {
    return axios({
        method: 'GET',
        url: GET_USERS_LIST
    })
}
