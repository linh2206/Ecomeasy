import axios from '../helpers/axios'

export const GET_PRICING_CATEGORIES = '/api/pricing/categories'
export const ADD_LINK = '/api/create-pricing-target'
export const PRICING_LIST = groupId => `/api/pricing/product-group/${groupId}`
export const DELETE_TARGET_DATA = targetId => `/api/target/${targetId}/delete-data`
export const PRODUCT_POOL = '/api/pricing/product-target'
export const ADD_PRODUCT = '/api/pricing/product-target'
export const GET_PRODUCT_GROUP = '/api/pricing/product-group'
export const ADD_GROUP = '/api/pricing/product-group'
export const EDIT_GROUP = groupId => `/api/pricing/product-group/${groupId}`

export function editGroup(groupName, groupDes, products, groupId) {
    const data = new FormData()
    data.append('groupName', groupName)
    data.append('groupDes', groupDes)
    data.append('products', typeof (products) === 'object' ? JSON.stringify(products) : [])
    return axios({
        url: EDIT_GROUP(groupId),
        method: 'POST',
        data: data
    })
}


export function addGroup(groupName, groupDes, products) {
    const data = new FormData()
    data.append('groupName', groupName)
    data.append('groupDes', groupDes)
    data.append('products', typeof (products) === 'object' ? JSON.stringify(products) : [])
    return axios({
        url: ADD_GROUP,
        method: 'POST',
        data: data
    })
}

export function getProductGroup(category) {
    return axios({
        url: GET_PRODUCT_GROUP,
        method: 'GET'
    })
}

export function addProduct(productName, productOriginId, link) {
    const data = new FormData()
    data.append('productName', productName)
    data.append('productOriginId', productOriginId)
    data.append('link', link)
    return axios({
        url: ADD_PRODUCT,
        method: 'POST',
        data: data
    })
}

export function getProductPool(category) {
    return axios({
        url: PRODUCT_POOL,
        method: 'GET'
    })
}

export function deleteTargetData(targetId, dataId) {
    const data = new FormData()
    data.append('dataId', dataId)
    return axios({
        url: DELETE_TARGET_DATA(targetId),
        method: 'POST',
        data: data
    })
}

export function getPricingList(category) {
    return axios({
        url: PRICING_LIST(category),
        method: 'GET'
    })
}

export function addLink(category, link, productName) {
    const data = new FormData()
    data.append('category', category)
    data.append('link', link)
    data.append('productName', productName)
    return axios({
        url: ADD_LINK,
        data: data,
        method: 'POST'
    })
}

export function getPricingCategories() {
    return axios({
        url: GET_PRICING_CATEGORIES,
        method: 'GET'
    })
}