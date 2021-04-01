const request = require('request');
const crypto = require('crypto');

const credentials = require('../../config/config_shopee.json')
const config = require('../../config/config_app.json')
const {partner_id, secretKey} = credentials;

const hmac = crypto.createHmac('sha256', secretKey);

const shopid = 118940443 
const endpoint = 'https://partner.shopeemobile.com/api/v1/orders/basics'

function authentication(shopid){
  const timestamp = Date.now();
  //https://open.shopee.com/documents?module=63&type=2&id=53
  const signatureBaseString = `${endpoint}|{"shopid": ${shopid}, "partner_id": ${partner_id}, "timestamp": ${timestamp}} `
  const data = hmac.update(signatureBaseString);
  const gen_hmac = data.digest('hex');

  console.log("hmac : " + gen_hmac);

  //Custom Header pass
  var headersOpt = {  
    "content-type": "application/json",
    "Authorization": gen_hmac
  };

  request({
    method:'post',
    url: endpoint, 
    form: {
      partner_id: partner_id,
      shopid: shopid,
      timestamp: timestamp
    }, 
    headers: headersOpt,
    json: true,
  },function (error, response, body) {  
    //Print the Response
    console.log(body);  
  });
}

//84962785790 / Hangchinhhang100
function getTokenFromShop(brandId){
  let redirect = `${config.webServer.host}/oauth2/shopee-redirect?brand_id=${brandId}`
  let baseString = secretKey + redirect
  var token = crypto.createHash('sha256').update(baseString).digest('hex');
  const link = `https://partner.shopeemobile.com/api/v1/shop/auth_partner?id=${partner_id}&token=${token}&redirect=${redirect}`

  return link
}

module.exports = {
  authentication: authentication,
  getTokenFromShop: getTokenFromShop
}