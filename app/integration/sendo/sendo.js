//https://sendovn.atlassian.net/wiki/spaces/SSA/overview
//0906390010/Yvessendo1119
const moment =  require('moment')
const request = require('request');
const querystring = require('querystring');

let limit = 100

//curl -L -X POST 'https://open.sendo.vn/login' -H 'Content-Type: application/json' --data-raw '{"shop_key":"19f77b33d2854e918332bb6bf3c3235d","secret_key":"37c6b8a1e9fd4b0aacd30c618874359b"}'
// var form = {
//   shop_key: '19f77b33d2854e918332bb6bf3c3235d', //tokenByShop
//   secret_key: '37c6b8a1e9fd4b0aacd30c618874359b'
// }

//authentication()
function authentication(shop_key, secret_key, cb){
  const headersOpt = {  
    "content-type": "application/json",
  };

  const form = {
    shop_key: shop_key,
    secret_key: secret_key,
  }

  var formData = JSON.stringify(form);

  request({
    headers: headersOpt,
    url: 'https://open.sendo.vn/login', 
    body: formData, 
    method:'post',

  },function (error, response, body) {  
    if(error){
      console.log(error) 
      return cb(error)  
    }

    console.log(body)

    const _body = JSON.parse(body)

    if(_body.result == null){
      return cb(_body.error)
    }
    
    cb(null, _body.result)

    //getListOrder(null, _body.result.token, null, null)

  })
}

//getListOrder()
function getListOrder(params, token, next_token, cb){
  const headersOpt = {  
    "Authorization": `Bearer ${token}`,
    "Content-Type": `application/json`,
    "cache-control": `no-cache`
  };

  // var dateTime = new Date("2015-06-17 14:24:36");
  // dateTime = moment(dateTime).format("YYYY-MM-DD");

  console.log("getListOrder")
  console.log(params)

  let frDate = moment(params.from).format("YYYY-MM-DD")
  let ttDate = moment(params.to).format("YYYY-MM-DD")

  // console.log(frDate)
  // console.log(ttDate)

  var requestData = {
    "page_size": limit,
    "order_date_from": frDate,
    "order_date_to": ttDate,
    "token" : next_token
  }
  
	request({
		headers: headersOpt,
	  url: `https://open.sendo.vn/api/partner/salesorder/search`, 
	  method:'post',
    json: requestData

	},function (error, response, body) {  
	  if(error){
      console.log('error', error)
      return cb(error, null)
    }


    if(!body.result ){
      console.log('body', body)
      return cb(body, null)
    }

	  //console.log(body.result.data);
    //getOrderDetail(your_access_token, _body.result.data[0].salesOrder.orderNumber)
    cb(null, body.result)

	})
}

function getOrderDetail(your_access_token, orderNumber, cb){
  const headersOpt = {  
    "Authorization": `Bearer ${your_access_token}`
  };
  
  request({
    headers: headersOpt,
    url: `http://sapi.sendo.vn/shop/salesorder?orderNumber=${orderNumber}`, 
    method:'get',

  },function (error, response, body) {
    if(error){
      console.log(error)  
    }
    
    const _body = JSON.parse(body)
    //console.log(_body.result);
    cb(_body.result)

  });
}

function parsePaymentMethod(code){
  switch(code){
    case 1: 
      return "COD"
      break;
    case 2:
      return "Senpay"
      break;
    case 3:
      return "COD, Senpay"
      break;
    default:
      return code
  }
}

function parsePaymentStatus(code){
  switch(code){
    case 1:
      return "Ch??a thanh to??n"
      break;
    case 2:
      return "???? thanh to??n COD"
      break;
    case 3:
      return "???? thanh to??n"
      break;
    case 4: 
      return "Ho??n t???t"
      break;
    case 5: 
      return "???? ho??n ti???n"
      break;
    case 6:
      return "?????i x??c nh???n"
      break;
    case 7:
      return "T??? ch???i"
      break
    default:
      return code

  }
}

function parseOrderStatus(code){
  switch(code){
    case 2:
      return "M???i"
      break;
    case 3:
      return "??ang x??? l??"
      break;
    case 6:
      return "??ang v???n chuy???n"
      break;
    case 7:
      return "???? giao h??ng"
      break;
    case 8:
      return "???? ho??n t???t"
      break;
    case 10:
      return "????ng"
      break;
    case 11:
      return "Y??u c???u ho??n"
      break;
    case 12: 
      return "??ang ho??n"
      break;
    case 13:
      return "H???y"
      break;
    case 14: 
      return "Y??u c???u t??ch"
      break;
    case 15:
      return "Ch??? t??ch"
      break;
    case 19:
      return "Ch??? g???p"
      break;
    case 23:
      return "Ch??? sendo x??? l??"
      break;
    case 21:
      return "??ang ?????i tr???"
      break;
    case 22:
      return "?????i tr??? th??nh c??ng"
    default:
      return code

  }
}

module.exports = {
  authentication: authentication,
  getListOrder: getListOrder,
  getOrderDetail: getOrderDetail,
  parsePaymentMethod: parsePaymentMethod,
  parsePaymentStatus: parsePaymentStatus,
  parseOrderStatus: parseOrderStatus
}