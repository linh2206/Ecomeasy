const request = require('request');
const crypto = require('crypto');

const host = "https://api.lazada.vn/rest"

const credentials = require('../../config/config_lazada.json')
const config = require('../../config/config_app.json')
const {app_key, appSecret} = credentials;

const sign_method = "sha256"

//open lazada platform
//myphamtotkissa@gmail.com / aaa@1234

function getAccessToken(_code, cb){
	var headersOpt = {  
	  "content-type": "application/json",
	  "appKey": app_key,
	  "appSecret": appSecret
	};

	request({
	  method:'post',
	  url: 'https://auth.lazada.com/rest/auth/token/create', 
	  payload: {
	    code: _code,
	    appKey: app_key
	  }, 
	  headers: headersOpt,
	  json: true,
	},function (error, response, body) {  
	  console.log("getAccessToken")
	  console.log(body);  
	  cb(body)

	  //getListOrder()
	}); 
}

function getListOrder(accessTokenByShop){
	//https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.724138e4oAj2Y0#?nodeId=10451&docId=108069
	const timestamp = Date.now();
	const endpoint = "/orders/get"
	const concatenatedString = `${endpoint}access_token${accessTokenByShop}app_key${app_key}sign_method${sign_method}timestamp${timestamp}`
	const data = hmac.update(concatenatedString);
	const gen_hmac = data.digest('hex');

	console.log(gen_hmac)

	const url = `${host}${endpoint}?app_key=${app_key}&access_token=${accessTokenByShop}&timestamp=${timestamp}&sign_method=sha256&sign=${gen_hmac}`
	console.log(url)
	request(url, function (error, response, body) {
	  console.error('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  console.log('body:', body); // Print the HTML for the Google homepage.
	});
}

function getTransactionDetails(accessTokenByShop){
	console.log(accessTokenByShop)
	const timestamp = Date.now();
	const endpoint = '/finance/transaction/detail/get'
	const start_time = '2018-01-01'
	const end_time =  "2018-01-24"
	//https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.724138e4oAj2Y0#?nodeId=10451&docId=108069
	const concatenatedString = `${endpoint}access_token${accessTokenByShop}app_key${app_key}end_time${end_time}sign_method${sign_method}start_time${start_time}timestamp${timestamp}`

	console.log(concatenatedString)

	const gen_hmac = hmac.update(concatenatedString).digest('hex').toUpperCase();

	const url = `${host}${endpoint}?access_token=${accessTokenByShop}&app_key=${app_key}&end_time=${end_time}&sign_method=${sign_method}&start_time=${start_time}&timestamp=${timestamp}&sign=${gen_hmac}`

	console.log(url)
	request(url, function (error, response, _body) {
	  console.error('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  const body = JSON.parse(_body)
	  console.log(body); // Print the HTML for the Google homepage.
	});
}

function getSeller(accessTokenByShop, cb){

	console.log(accessTokenByShop)
	const timestamp = Date.now();
	const endpoint = '/seller/get'

	//https://open.lazada.com/doc/doc.htm?spm=a2o9m.11193535.0.0.724138e4oAj2Y0#?nodeId=10451&docId=108069
	const concatenatedString = `${endpoint}access_token${accessTokenByShop}app_key${app_key}sign_method${sign_method}timestamp${timestamp}`

	console.log(concatenatedString)

	const hmac = crypto.createHmac('sha256', appSecret);
	const gen_hmac = hmac.update(concatenatedString).digest('hex').toUpperCase();

	const url = `${host}${endpoint}?access_token=${accessTokenByShop}&app_key=${app_key}&sign_method=${sign_method}&timestamp=${timestamp}&sign=${gen_hmac}`

	console.log(url)
	request(url, function (error, response, _body) {
	  console.error('error:', error); // Print the error if one occurred
	  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	  const body = JSON.parse(_body)
	  console.log(body); // Print the HTML for the Google homepage.
	  cb(body.data)
	});
}

function genLazadaAuthLink(brandId){
	var redirect_uri = `${config.webServer.host}/oauth2/lazada-redirect`
	return `https://auth.lazada.com/oauth/authorize?response_type=code&force_auth=true&state=${brandId}&client_id=${app_key}&redirect_uri=${redirect_uri}`
}

module.exports = {
  getTransactionDetails: getTransactionDetails,
  getListOrder: getListOrder,
  getSeller: getSeller,
  genLazadaAuthLink: genLazadaAuthLink
}