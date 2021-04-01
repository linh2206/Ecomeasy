const database = require('../../database/database')
const shopCol = require('../../database/shopCol')

const sendo = require('../../integration/sendo/sendo')
const timeout = require('./utils').timeout
const chunkDateRange = require('./utils').chunkDateRange

let step = 14;

let from_ = new Date(2019, 5, 5, 0, 0, 0).getTime()
let to_ = new Date(2020, 10, 20, 0, 0, 0).getTime()

let shop_ = {
  name: undefined,
  connectedShop: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTdG9yZUlkIjoiNDc0MDI3IiwiVXNlck5hbWUiOiIiLCJTdG9yZVN0YXR1cyI6IjIiLCJTaG9wVHlwZSI6IjIiLCJTdG9yZUxldmVsIjoiMCIsImV4cCI6MTYwMzgwMDg4MiwiaXNzIjoiNDc0MDI3IiwiYXVkIjoiNDc0MDI3In0.kh6FerBzV-3TT5vM5tvedkz2UqPT8u8RF7JPXHHD3OE',
    expires: '2020-10-27T19:14:42.1684341+07:00'
  },
  sourceDetail: {
    shop_key: '19f77b33d2854e918332bb6bf3c3235d',
    secret_key: '37c6b8a1e9fd4b0aacd30c618874359b'
  },
  spreadSheet: undefined,
  marketplace: 'sendo',
  brandId: '5f3a4c811bf696064c60b8d8',
  created: "2020-10-27T04:14:42.180Z",
  _id: "5f979eb236a93d3e20e3a8c5"
}

let params = null


//handler(shop_, from_, to_)
async function handler(shop, from, to, cb){

	console.log(shop)

	let listTimeWindow = chunkDateRange(from, to, step)
	await timeout(5)
	
	let listOrder = []
	let paging = 0
	nextTimeWindow()

	function nextTimeWindow(){
		paging = 0
		listOrder.length = 0

		params = listTimeWindow.pop()

		if(params){
			return sendo.getListOrder(params, shop.connectedShop.token, '', getListOrderCb);
		}

		console.log('FINISH SENDO')

		if(cb){cb(true)}
	}

	async function getListOrderCb(error, result){

		if(error){
			let filter = {
        _id: shop._id
      }
      let staticField = {
        error: error
      }
      shopCol.findOneAndUpdate(filter, null, staticField, null)
      if(cb){cb(true)}
      return
		}

		if(result.data.length == 0){
			return nextTimeWindow()
		}

		listOrder = listOrder.concat(result.data)

		if(result.next_token){
			paging ++
			console.log("paging", paging)
			await timeout(5)
			return sendo.getListOrder(params, shop.connectedShop.token, result.next_token, getListOrderCb);
		}

		getOrderDetailCb()
		
		//var order = listOrder.shift()

		//sendo.getOrderDetail(token, order.salesOrder.orderNumber, getOrderDetailCb)

	}

	let values = []
	async function getOrderDetailCb(){

		// console.log(order)

		listOrder.map(function(order){
			let filter = {
	      'sales_order.order_number': order.sales_order.order_number,
	    }

	    Object.assign(order, {
	      brandId: shop.brandId,
	      shopId: shop._id.toString(),
	      marketplace: shop.marketplace,
	      eceOrderDate: new Date(order.sales_order.order_date_time_stamp * 1000),
	      ecePrice: parseInt(order.sales_order.total_amount_buyer),
	      syncDate: new Date()
	    })

	    values.push({
	      'replaceOne': {
	        'filter': filter,
	        'replacement': order,
	        'upsert': true
	      }
	    })
		})

		// if(listOrder.length > 0){
		// 	var order = listOrder.shift()

		// 	return sendo.getOrderDetail(token, order.salesOrder.orderNumber, getOrderDetailCb)
		// }

		var options = {}

		var callback = function(err, result){
      if(err){
        return console.log(err)
      }

      console.log('done writing POST to DB')
      console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)
      values.length = 0
      nextTimeWindow()

    }
    
    if(values.length == 0){
      return
    }

    database.sendoOrderCol().bulkWrite(values, options, callback)

	}
}

module.exports = {
	handler: handler
}



