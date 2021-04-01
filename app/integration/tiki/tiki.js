// cs@zinusinc.com / zinus@123?

const request = require('request');
const credentials = require('../../config/config_tiki.json')
const config = require('../../config/config_app.json')
const {id, secret} = credentials;

const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');
const clientConfig = {
  client: {
    id: id,
    secret: secret
  },
  auth: {
    tokenHost: 'https://api.tiki.vn',
    authorizePath: '/sc/oauth2/auth',
    tokenPath: '/sc/oauth2/token'
  }
};

const tikiApi = 'cb16364f-4908-47e7-b038-a479d17dceaf'

const redirect_uri = `${config.webServer.host}/tiki-oauth2-redirect`

const client = new AuthorizationCode(clientConfig);

function auth(state) {
	// Redirect example using Express (see http://expressjs.com/api.html#res.redirect)
  const authorizationUri = client.authorizeURL({
    redirect_uri: redirect_uri,
    scope: "offline all",
    state: state
  });
  return authorizationUri
}

function getClient(){
  return client
}

let orderListingUrl = `https://api.tiki.vn/integration/v2/orders`
async function getListOrders(access_token, from, to, page, limit, cb) {
  let headers = {
    "Authorization": access_token,
    "tiki-api": tikiApi
  }

  let created_from_date = new Date(from).toISOString().replace(/T/, ' ').replace(/\..+/, '')
  let created_to_date = new Date(to).toISOString().replace(/T/, ' ').replace(/\..+/, '')
  let url = `${orderListingUrl}?created_from_date=${created_from_date}&created_to_date=${created_to_date}&page=${page}&limit=${limit}`
  console.log(url)
  request({
    headers: headers,
    url: url, 
    method:'get',

  },function (error, response, _body) {  
    if(error){
      console.log('callService error')
      return console.log(error)  
    }
    
    let body = JSON.parse(_body)

    console.log(body)

    cb(body.data)

  })
}

//curl -i  -H "tiki-api: cb16364f-4908-47e7-b038-a479d17dceaf" https://api.tiki.vn/integration/v2/sellers/me
async function sellerDetail(accessToken, cb){
  let headers = {
    "Authorization": accessToken,
    "tiki-api": tikiApi
  }

  let url = `https://api.tiki.vn/integration/v1/sellers/me`

  request({
    headers: headers,
    url: url, 
    method:'get',

  },function (error, response, _body) {  
    if(error){
      console.log('callService error')
      return console.log(error)  
    }
    
    let body = JSON.parse(_body)

    cb(body)

  })
}

module.exports = {
  getClient: getClient,
	auth: auth,
  getListOrders: getListOrders,
  sellerDetail: sellerDetail
}