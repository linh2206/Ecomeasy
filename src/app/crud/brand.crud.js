import axios from '../helpers/axios'
export const LISTING_BRAND_URL = "api/brands";
export const CREATE_BRAND_URL = "/api/create-brand";
export const BRAND_DETAIL_URL = (brandId) => `/api/brand/${brandId}/detail`;
export const EDIT_BRAND_URL = (brandId) => `/api/brand/${brandId}/detail`;
export const CONNECT_GOOGLE_SHEET = (brandId) => `/api/brand/${brandId}/connect-googlesheet`;
export const GET_FILES_FROM_GOOGLE_SHEET = (brandId) => `/api/source/${brandId}/drive-folder-detail`;
export const SELECT_FILE_FROM_GOOGLE_DRIVE = (brandId) => `/api/brand/${brandId}/new-spreadsheet-source`;
export const CHANGE_FILE_NAME_FROM_GOOGLE_DRIVE = (shop) => `/api/shop/${shop}/update-source-name`;
export const DISCONNECT = (shopid) => `/api/shop/${shopid}/disconnect`
export const UPLOAD_EXTERNAL_DATA = (brandId) => `/brand/${brandId}/upload-excel`
export const DELETE_BRAND = (brandId) => `/api/brand/${brandId}/delete`
export const UPLOAD_ORDER = (brandId, sourceId) => `/brand/${brandId}/source/${sourceId}/add-order`
export const CONNECT_SENDO = brandId => `/api/brand/${brandId}/connect-sendo`
export const SELECT_SPREADSHEET = sourceId => `/api/source/${sourceId}/attach-spreadsheet-source`

export function selectSpreadsheet(sourceId, spreadSheet) {
    let data = new FormData();
    data.append('spreadSheet', spreadSheet)
    return axios({
        method: 'post',
        url: SELECT_SPREADSHEET(sourceId),
        data: data
    })
}

export function connectSendo(shopKey, secretKey, brandId) {
    let data = new FormData();
    data.append('shop_key', shopKey)
    data.append('secret_key', secretKey)
    return axios({
        method: 'post',
        url: CONNECT_SENDO(brandId),
        data: data
    })
}

export function createBrand(brand) {
    let data = new FormData();
    data.append('name', brand)
    return axios({
        method: 'post',
        url: CREATE_BRAND_URL,
        data: data
    })
}

export function editBrand(brandId, name, avatar) {
    let data = new FormData();
    name && data.append('name', name)
    avatar && data.append('avatar', avatar)
    return axios({
        method: 'post',
        url: EDIT_BRAND_URL(brandId),
        data: data
    })
}

export function getBrandList() {
    return axios({
        method: 'get',
        url: LISTING_BRAND_URL,
    })
}

export function getBrandDetail(brandId) {
    return axios({
        method: 'get',
        url: BRAND_DETAIL_URL(brandId),
    })
}

export function connectGoogleDrive(brandId) {
    return axios({
        method: 'post',
        url: CONNECT_GOOGLE_SHEET(brandId)
    })
}

export function getGoogleSheetFiles(brandId) {
    return axios({
        method: 'get',
        url: GET_FILES_FROM_GOOGLE_SHEET(brandId)
    })
}

export function selectGoogleDriveFile(name, brandId) {
    let data = new FormData()
    data.append('name', name)
    return axios({
        method: 'post',
        url: SELECT_FILE_FROM_GOOGLE_DRIVE(brandId),
        data: data
    })
}

export function updateGoogleFileName(name, shop) {
    let data = new FormData()
    data.append('name', name)
    return axios({
        method: 'post',
        url: CHANGE_FILE_NAME_FROM_GOOGLE_DRIVE(shop),
        data: data
    })
}

export function disconnect(shopid) {
    return axios({
        method: 'post',
        url: DISCONNECT(shopid)
    })
}

export function uploadExternalData(name, brandId) {
    let formdata = new FormData()
    formdata.append('name', name)
    return axios({
        method: 'post',
        url: UPLOAD_EXTERNAL_DATA(brandId),
        data: formdata
    })
}

export function uploadOrder(data, sourceId, brandId) {
    let formdata = new FormData()
    formdata.append('data', JSON.stringify(data))
    return axios({
        method: 'post',
        url: UPLOAD_ORDER(brandId, sourceId),
        data: formdata
    })
}

export function deleteBrand(brandId) {
    return axios({
        method: 'post',
        url: DELETE_BRAND(brandId),
    })
}
