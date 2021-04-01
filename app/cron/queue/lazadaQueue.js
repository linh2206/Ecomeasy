const database = require('../../database/database')
const shopCol = require('../../database/shopCol')
const lazada_sdk = require('../../integration/lazada/lazada_sdk')
const timeout = require('./utils').timeout
const chunkDateRange = require('./utils').chunkDateRange


let from_ = new Date(2018, 1, 1, 0, 0, 0).getTime()
let to_ = new Date(2020, 8, 20, 0, 0, 0).getTime()
let step = 14;
let sampleShop = {
  "50000501005p9Uqbc1e2cf0f3co2emxcUwcXEfq5rr0lfiJlvgUUjd0kTQfzgKr": {name_company: "CÔNG TY TNHH ZINUS VIỆT NAM", name: "Zinus Official Store", location: "Hồ Chí Minh"},
  brandId: "5f3e1befa0d89a6e133b38d7",
  connectedShop: "50000501005p9Uqbc1e2cf0f3co2emxcUwcXEfq5rr0lfiJlvgUUjd0kTQfzgKr",
  created: "2020-08-20T06:52:49.788Z",
  marketplace: "lazada",
  _id: "5f3e1dc1d0994df83bf22380"
}

//handler(sampleShop, from_, to_)
async function handler(shop, from, to, cb){

  console.log(shop)

  let params = null

  let offset = 0
  let listTimeWindow = chunkDateRange(from, to, step)
  await timeout(5)
  lazada_sdk.setAccessToken(shop.connectedShop)

  var listOrder = []
  

  nextTimeWindow()
  function nextTimeWindow(){
    listOrder.length = 0
    offset = 0
    params = listTimeWindow.pop()

    if(params === undefined){
      shopCol.findOneAndUpdate({_id: shop._id}, null, {syncDate: new Date()})
      if(cb){cb(true)}
      return console.log('FINISH LAZADA')
    }

    return lazada_sdk.getOrders(params.from, params.to, offset, getListOrderCb);

  }

  var order = null
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

    listOrder = listOrder.concat(result)
    console.log('listOrder.length', listOrder.length)

    if(result.length >= 50){
      offset = (offset + 50)
      return lazada_sdk.getOrders(params.from, params.to, offset, getListOrderCb);
    }

    if(listOrder.length == 0){
      return nextTimeWindow()
    }
    
    order = listOrder.shift()
    console.log("order.order_id", order.order_id)
    lazada_sdk.getOrderItems(order.order_id, getOrderDetailCb)

  }

  let values = []
  async function getOrderDetailCb(orderItems){

    let filter = {
      'order_id': order.order_id,
    }

    Object.assign(order, {
      items: orderItems,
      brandId: shop.brandId,
      shopId: shop._id.toString(),
      marketplace: shop.marketplace,
      eceOrderDate: new Date(order.created_at).toISOString(),
      ecePrice: parseFloat(order.price.replace(/[^\d\.\-]/g, "")),
      syncDate: new Date()
    })

    values.push({
      'replaceOne': {
        'filter': filter,
        'replacement': order,
        'upsert': true
      }
    })

    if(listOrder.length > 0){
      order = listOrder.shift()

      return lazada_sdk.getOrderItems(order.order_id, getOrderDetailCb)
    }

    var options = {}

    var callback = function(err, result){
      if(err){
        return console.log(err)
      }

      // if(shop.brandId == '5f3e1befa0d89a6e133b38d7'){
      //   console.log(values[0])
      // }

      console.log('done writing POST to DB', shop.brandId, shop.marketplace)
      console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)
      values.length = 0
      nextTimeWindow()

    }
    
    if(values.length == 0){
      return
    }

    database.lazadaOrderCol().bulkWrite(values, options, callback)

  }
}

module.exports = {
  handler: handler
}
