import axios from '../helpers/axios'
export const GET_MARKET_URL = (brandId) => `/api/brands/${brandId}`

export function getMarketURL(brandId) {
    return axios({
        method: 'GET',
        url: GET_MARKET_URL(brandId)
    })
}