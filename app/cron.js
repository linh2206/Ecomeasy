const request = require('request');
const objectId = require("mongodb").ObjectID;


const database = require('./database/database')

const shopeeQueue = require('./cron/queue/shopeeQueue')
const tikiQueue = require('./cron/queue/tikiQueue')
const sendoQueue = require('./cron/queue/sendoQueue')
const lazadaQueue = require('./cron/queue/lazadaQueue')
const googleSpreadsheetQueue = require('./cron/queue/googleSpreadsheetQueue')

const lazadaCookieSpreedsheetId = '1p8WNllcHKD3NSACvoq1P7BeFH0WPZ-K7nR_Yeich6F4'

const timeout = require('./cron/queue/utils').timeout

var listShop = []
getShop();
async function getShop(marketplace){
  await timeout(30)
  const options = {
    sort: {created: -1}
  }

  let filter = {
    marketplace: {'$ne': 'googleSheet'},
    //marketplace: 'shopee',
    //_id: new objectId("5f51d9752c61d47d8e7a6703"),
    error: null
  }

  listShop = await database.shopCol().find(filter, options).toArray();
  console.log('getShop', listShop.length)
  sync()
}

async function sync(){
  let shop = listShop.shift()

  if(!shop){
    console.log('done first round')
    await timeout(10 * 60)
    return getShop()
  }

  // let from = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  // let to = new Date()

  let from = new Date(2020, 11, 1, 0, 0, 0)
  let to = new Date(2021, 0, 15, 0, 0, 0)

  switch(shop.marketplace){
    case 'shopee':
      shopeeQueue.processQueue(shop, from, to, done)
      break;
    case 'sendo':
      sendoQueue.handler(shop, from, to, done)
      break;
    case 'lazada':
      lazadaQueue.handler(shop, from, to, done)
      break;
    // case 'tiki':
    //   tikiQueue.handler(shop, from, to, done)
    //   break;
    // case 'googleSheet':
    //   googleSpreadsheetQueue.handler(shop, done)
    //   break;
    default:
      sync()
  }

  async function done(){
    sync()

    // let newJob = {
    //   from: from,
    //   to: to,
    //   shop: shop
    // }

    // try{
    //   await database.jobCol().insertOne(newJob)
    // }catch(e){
    //   console.log(e)
    // }
  }

}

var job = {
  created: new Date(),
  createBy: 'auto',
  state: 'new',
  from: new Date(2020, 5, 5, 0, 0, 0).getTime(),
  to: new Date(2020, 5, 20, 0, 0, 0).getTime(),
  des: [
    {
      "_id":{"$oid":"5ef558c2ed833a278b7ed8cd"},
      "marketplace":"sendo",
      "brandId":"5ef29e7526522618d875d3e8",
      "connectedShop":"a89e8ade720445d9bccb4bbd3f8c5f42"
    },
    
  ],
  logs: [
  ],

  results: [
  ]

}
