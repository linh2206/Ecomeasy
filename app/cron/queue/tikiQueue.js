const database = require('../../database/database')
const tiki = require('../../integration/tiki/tiki')
const timeout = require('./utils').timeout
const chunkDateRange = require('./utils').chunkDateRange

let limit = 50
let from_ = new Date(2018, 1, 1, 0, 0, 0).getTime()
let to_ = new Date().getTime()
let step = 14;
let sampleShop = {"_id":{"$oid":"5f01bf16905b911b83d0f5fe"},"marketplace":"lazada","brandId":"5efef0e73b104373d95e964b","connectedShop":"50000700401xg14040e4dVacpKiQgmoPZvQ9C2iuElRCWqdWkfQCrVzGrovhAt","50000700401xg14040e4dVacpKiQgmoPZvQ9C2iuElRCWqdWkfQCrVzGrovhAt":{"name_company":"CÔNG TY TNHH THỜI TRANG MAKE UP","name":"FLORMAR","location":"Hồ Chí Minh","seller_id":{"$numberInt":"100001457"},"email":"tam@ecomeasy.asia","short_code":"VN10ERO","cb":false}}

//handler(sampleShop, from_, to_)
async function handler(shop, from, to, cb){
  let params = null
  let page = 1

  let offset = 0
  let listTimeWindow = chunkDateRange(from, to, step)
  await timeout(5)

  var listOrder = []
  

  nextTimeWindow()
  function nextTimeWindow(){
    listOrder.length = 0
    offset = 0
    params = listTimeWindow.pop()

    if(params === undefined){
      if(cb){cb(true)}
      return console.log('FINISH')
    }

    console.log(params)
    return tiki.getListOrders(shop.connectedShop.access_token, params.from, params.to, page, limit, getListOrderCb);

  }

  var order = null
  async function getListOrderCb(result){
    console.log('getListOrderCb', result.length)

    listOrder = listOrder.concat(result)
    console.log('listOrder.length', listOrder.length)

    if(result.length >= limit){
      page = (page + 1)
      return tiki.getListOrders(shop.connectedShop.access_token, params.from, params.to, page, limit, getListOrderCb);
    }

    if(listOrder.length == 0){
      return nextTimeWindow()
    }

    storage()
    
    //order = listOrder.shift()

    //lazada_sdk.getOrderItems(order.order_id, getOrderDetailCb)

  }

  let values = []
  async function getOrderDetailCb(orderItems){

    let filter = {
      'order_id': order.order_id,
    }

    Object.assign(order, {
      items: orderItems,
      brandId: shop.brandId,
      marketplace: shop.marketplace,
      eceOrderDate: new Date(order.created_at).toISOString(),
      ecePrice: parseFloat(order.price.replace(/[^\d\.\-]/g, ""))
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

    
    if(values.length == 0){
      return
    }

    var options = {}

    try{
      let result = await database.tikiOrderCol().bulkWrite(values, options, callback)
      console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)
    }catch(e){
      return console.log(err)
    }

    values.length = 0
    nextTimeWindow()
  }

  async function storage(){
    listOrder.map(function(order){
      let filter = {
        'code': order.code,
      }

      Object.assign(order, {
        brandId: shop.brandId,
        shopId: shop._id.toString(),
        marketplace: shop.marketplace,
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

    var options = {}

    try{
      let result = await database.tikiOrderCol().bulkWrite(values, options)
      console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)
    }catch(e){
      return console.log(err)
    }

    values.length = 0
    nextTimeWindow()
  }
}

module.exports = {
  handler: handler
}
