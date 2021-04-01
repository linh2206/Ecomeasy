const LazadaAPI = require('lazada-open-platform-sdk')
//https://github.com/branch8/lazada-open-platform-sdk

const credentials = require('../../config/config_lazada.json')
const {app_key, appSecret} = credentials;

const appKey = app_key

const code = '0_107403_iBUTprVyR2A0WwozcowYK4mX33022'
const country = 'VIETNAM'

const aLazadaAPI = new LazadaAPI(appKey, appSecret, country)

const aLazadaAPIWithToken = null
function setAccessToken(accessTokenByShop){
  aLazadaAPI.accessToken = accessTokenByShop
  //aLazadaAPIWithToken = new LazadaAPI(appKey, appSecret, country, accessTokenByShop)
}

function getAccessToken(code, cb){
  console.log('getAccessToken')
  aLazadaAPI
  .generateAccessToken({ code: code })
  .then(response => {
    const { access_token } = response // JSON data from Lazada's API
    console.log(access_token)
    cb(access_token)
  }).catch(err => console.log(err))
}

// const options = {
//   created_after: new Date(2020, 4, 1, 7, 0, 0).toISOString(),
//   created_before: new Date(2020, 5, 1, 6, 0, 0).toISOString(),
//   update_after: new Date(2020, 4, 1, 7, 0, 0).toISOString(),
//   update_before: new Date().toISOString(),
//   status: OrderStatus;
//   sort_by: "created_at" | "updated_at";
//   sort_direction?: "ASC" | "DESC";
//   offset: number;
//   limit: 100
// }

let orders = []
function getOrders(from, to, offset, cb){

  const options = {
    created_after: new Date(from).toISOString(),
    created_before: new Date(to).toISOString(),
    //update_after: new Date(from).toISOString(),
    //update_before: new Date(to).toISOString(),
    // status: OrderStatus;
    // sort_by: "created_at" | "updated_at";
    // sort_direction?: "ASC" | "DESC";
    offset: offset,
    limit: 50
  }
  console.log(options)

  aLazadaAPI.getOrders(options).then(response => {
    
    if(response.data.count){
      console.log('response.data.count', response.data.count)
      cb(null, response.data.orders)
    }else{
      console.log('response.data', response.data)
      cb(null, [])
    }
        
  }).catch(function(e){
    console.log('getOrders', e)
    cb(e, null)
  })
}

function getOrderItems(order_id, cb){
  const options = {
    order_id: order_id.toString()
  }
  
  aLazadaAPI
  .getOrderItems(options)
  .then(response => {
    cb(response.data)
  }).catch(function(e){
    console.log(e)
  })
}

function getShopInfo(cb){
  console.log('getShopInfo')
  aLazadaAPI
  .getSeller()
  .then(response => {

    console.log(response.data)
    cb(response.data)

  }).catch(function(e){
    console.log(e)
  })
}


module.exports = {
  setAccessToken: setAccessToken,
  getAccessToken: getAccessToken,
  getShopInfo: getShopInfo,
  getOrderItems: getOrderItems,
  getOrders: getOrders
  
}

// options: {
//   method: 'POST',
//   url: 'https://auth.lazada.com/rest/auth/token/create',
//   qs: {
//     code: '0_107403_W6CJ73gAIUkolaMkmpS3eFyQ37519',
//     sign: 'D44ABD45C2DDA1E8F32D09EFF18C0493402BA219FAD09BCCBFA98E056E370CEA',
//     app_key: '107403',
//     timestamp: '1593947571437',
//     sign_method: 'sha256'
//   },
//   json: true,
//   body: { code: '0_107403_W6CJ73gAIUkolaMkmpS3eFyQ37519' },
//   callback: [Function: RP$callback],
//   transform: undefined,
//   simple: true,
//   resolveWithFullResponse: false,
//   transform2xxOnly: false
// }