const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')
const shopCol = require('../../database/shopCol')

const shopee_client = require('../../integration/shopee/shopee_client')
const timeout = require('./utils').timeout
const chunkDateRange = require('./utils').chunkDateRange

var shopeeQueue = []

var sampleShop = {"_id":"5f61d6ceb56302629e3253f4","name":null,"connectedShop":"286183405","spreadSheet":null,"marketplace":"shopee","brandId":"5f3e1befa0d89a6e133b38d7","created":{"$date":{"$numberLong":"1600247502114"}},"disconnected":null,"syncDate":{"$date":{"$numberLong":"1602475512220"}}}
sampleShop._id = new objectId(sampleShop._id)

let from_ = new Date(2020, 8, 1, 0, 0, 0).getTime()
let to_ = new Date(2020, 10, 1, 0, 0, 0).getTime()

let step = 14;


//processQueue(sampleShop, from_, to_)

async function processQueue(shop, _from, _to, cb){

  console.log(shop)

  await timeout(5)
  await shopee_client.authenticateShop(shop.connectedShop)
  let listTimeWindow = chunkDateRange(_from, _to, step)
  let params = null

  let from = null
  let to = null
  let page = 1
  let listOrderInfo = []
  let listOrderDetail = []
  let chunkOrders = []

  nextTimeWindow()
  function nextTimeWindow(){
    console.log('nextTimeWindow')
    params = listTimeWindow.pop()

    if(params === undefined){
      shopCol.findOneAndUpdate({_id: shop._id}, null, {syncDate: new Date()})
      if(cb){cb(true)}
      return console.log('FINISH SHOPEE')
    }

    console.log(params)

    from = Math.floor((new Date(params.from).getTime())/1000)
    to = Math.floor((new Date(params.to).getTime())/1000)
    page = 0

    listOrderInfo.length = 0
    listOrderDetail.length = 0
    getOrderPaging()
    
  }

  async function getOrderPaging(){
    try{
      var shopee_client_listOrder = await shopee_client.listOrder(from, to, 50, page * 50)
    }catch(e){
      console.log('getOrderPaging', page, e)
      console.log(shop)
      if(cb){cb(true)}
    }

    listOrderInfo = listOrderInfo.concat(shopee_client_listOrder.orders)
    console.log('page', page, listOrderInfo.length)

    if(shopee_client_listOrder.orders.length >= 50){
      page ++
      return getOrderPaging()
    }

    if(listOrderInfo.length == 0){
      return nextTimeWindow()
    }

    return chunk()
  }


  function chunk() {

    while(listOrderInfo.length > 0 && chunkOrders.length < 50){
      chunkOrders.push(listOrderInfo.shift())
    }

    return getDetail()
  }

  async function getDetail() {

    let ids = chunkOrders.map(function(el) {
      return el.ordersn
    })

    try{
      var data = await shopee_client.orderDetail(ids)
    }catch(e){
      console.log(e)
    }

    if(!data){
      return chunk()
    }

    console.log('getDetail', data.orders.length)
    listOrderDetail = listOrderDetail.concat(data.orders)
    chunkOrders.length = 0

    if(listOrderInfo.length > 0){
      return chunk()
    }

    parseValueByOrder()
    //getEscrowDetail()
    //getItemDetail()
  }

  async function getEscrowDetail() {
    console.log('getEscrowDetail', i)
    let ordersn = listOrderDetail[i].ordersn
    let data = await shopee_client.getEscrowDetail(ordersn)
    listOrderDetail[i]['escrow'] = data
    if(i == (listOrderDetail.length - 1)){
      parseValue()
    }else{
      i += 1
      getEscrowDetail()
    }
  }

  async function getItemDetail(){

    products = [];

    listOrderDetail.map(function(_order){
      _order.items.map(function(item){
        if(item && item.item_id){
          let data = shopee_client.getItemDetail(item.item_id)
          products.push(data)
        }else{
          console.log('getItemDetail', item)
          console.log('getItemDetail', _order)
        }
        
      })
    })

    const finalResult = await Promise.all(products)


    listOrderDetail.map(function(_order){
      _order.items.map(function(item){
        let temp = finalResult.find(function(detail){
          return item.item_id == detail.item_id
        })

        item['images'] = temp.images
      })

      //console.log(_order)
    }) 
  }

  var values = []
  async function parseValueByOrder() {
    listOrderDetail.map(function(order){

      let filter = {
        'ordersn': order.ordersn,
      }

      Object.assign(order, {
        brandId: shop.brandId,
        shopId: shop._id.toString(),
        marketplace: shop.marketplace,
        create_time: new Date(order.create_time * 1000).toISOString(),
        total_amount: parseInt(order.total_amount)
      })

      values.push({
        'replaceOne': {
          'filter': filter,
          'replacement': order,
          'upsert': true
        }
      })
    })

  
    const options = {}
    const callback = function(err, result){
      if(err){
        return console.log('writing shopee order', err)
      }

      console.log('done writing shopee order', shop.brandId, shop.marketplace)
      console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)
      values.length = 0
      nextTimeWindow()

    }

    if(values.length == 0){
      return
    }

    database.shopeeOrderCol().bulkWrite(values, options, callback)
  }

  async function updateShop(_id){
    let query = {
      _id: _id
    }

    let update = {
      '$set': {
        lastSync: new Date()
      }
    }

    let options = {}

    try{
      await database.shopCol().findOneAndUpdate(query, update, options)
    }catch(e){
      console.log(e)
    }
  }

}

async function parseValueByProduct() {
  listOrderDetail.map(function(order){
    console.log('order', order.ordersn)
    order.items.map(function(product){
      console.log('product', product.item_id, product.variation_sku, product.variation_id, product.item_name)
      
      let el = {
        ordersn: order.ordersn,

        create_time: new Date(order.create_time * 1000),
        order_status: order.order_status,

        tracking_no: order.tracking_no,
        shipping_carrier: order.shipping_carrier,

        ship_by_date: order.ship_by_date,
        item_id: product.item_id,
        item_sku: product.item_sku,
        item_name: product.item_name,
        weight: product.weight,

        weight: product.weight,
        item_id: product.item_id,
        variation_sku: product.variation_sku,
        variation_original_price: parseInt(product.variation_original_price),
        variation_discounted_price: product.variation_discounted_price,

        variation_quantity_purchased: parseInt(product.variation_quantity_purchased), //Số lượng

        promotion_id: product.promotion_id, //Mã giảm giá của Shop
      }

      let filter = {
        'ordersn': order.ordersn,
        'item_id': product.item_id,
        'variation_sku': product.variation_sku
      }

      Object.assign(el, {
        brandId: shop.brandId,
        shopId: shop._id.toString(),
        marketplace: shop.marketplace,
      })

      values.push({
        'replaceOne': {
          'filter': filter,
          'replacement': el,
          'upsert': true
        }
      })
    })
  })


  var options = {}
  var callback = function(err, result){
    if(err){
      return console.log(err)
    }

    console.log('done writing POST to DB', shop.brandId, shop.marketplace)
    console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)

  }

  if(values.length == 0){
    return
  }

  database.shopeeOrderCol().bulkWrite(values, options, callback)
}

module.exports = {
  processQueue: processQueue
}
