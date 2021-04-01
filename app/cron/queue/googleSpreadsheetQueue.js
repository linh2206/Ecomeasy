const objectId = require("mongodb").ObjectID;

const spreadSheet = require('../../integration/google/spreadSheet')
const googleOauth = require('../../integration/google/oauth')
const timeout = require('./utils').timeout

const database = require('../../database/database')
const shopCol = require('../../database/shopCol')
const brandCol = require('../../database/brandCol')
const productSheetCol = require('../../database/productSheetCol')
const jobCol = require('../../database/jobCol')

let sampleShop = {
  _id: "5f606cdcdb01f649e25da3e3",
  name: 'YES24',
  connectedShop: {
    email: 'phuong@ecomeasy.asia',
    access_token: 'ya29.a0AfH6SMDT4rVZNGXdhOYte3AcDg-L-hUD98yh0Y-dLxUXB_q6kRUpTF1qwEEBmFFPUR2RaWDRqPMvd928IZ2Q69EnCLpj5ba40GBvBLG7rvsyQjAvph_1onbe_BbQCI342NxaLSdgXp7CpERjzxPecvK7Qkedjst0O_k',
    refresh_token: '1//0gAA2UEz01VH8CgYIARAAGBASNwF-L9IrQwHRjRmkZ7ilnVIK6KHyBvUmctUMxsBgci8p4scce41leXVPD7ZXWRCEYn65rOV2wE8',
    scope: 'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/gmail.readonly',
    token_type: 'Bearer',
    expiry_date: 1600062507772
  },
  spreadSheet: '1Lt0RwShpZ0JUBQKyE-g0j5U0bhRjxLtVuJ6G2MHktCA',
  marketplace: 'googleSheet',
  brandId: '5f3e1befa0d89a6e133b38d7',
  created: "2020-09-15T07:27:24.873Z",
  disconnected: null,
  syncDate: "2020-10-05T03:10:37.870Z"
}

sampleShop._id = new objectId(sampleShop._id)
//handler(sampleShop)

async function handler(_shop, _cb) {

  let syncDate = new Date()

  let cb = _cb || function(){}
	let shop = _shop
  shop.syncDate = syncDate

  let row = 2
  let parseStep = 100
  let rowCount = 0

  let sheetProperty = []

  let listOrderDetail = null

  if(!shop.connectedShop || !shop.spreadSheet){
    console.log('no connectedShop googlesheet')
    console.log(shop)
    cb(true)
    return
  }

  await timeout(5)

  let tokenObject  = Object.assign({}, shop.connectedShop)
  delete tokenObject.email

  try{
    var auth = await googleOauth.getAuthObject(tokenObject)
  }catch(e){
    console.log('getAuthObject', e)
    cb(true)
    return
  }

  await checkSheetProperty()

  async function checkSheetProperty(){
    try{
      var result = await spreadSheet.checkSheetProperty(shop.spreadSheet, auth)
    }catch(e){
      console.log(e)

      return refeshToken()
    }

    sheetProperty = result.data.sheets
    console.log("checkSheetProperty", result.data.sheets[0].properties)
    //console.log(sheetProperty)

    rowCount = result.data.sheets[0].properties.gridProperties.rowCount

    //await deleteOldData()

    return batchProcessing(auth, row, listOrderDetail)
  }

  async function refeshToken(){
    googleOauth.refeshToken(async function(err, data){

      if(err){
        cb(true)
        updateShop(shop, err)
        return cb(true)
      }

      let email = shop.connectedShop.email
      let tokens = data.tokens
      auth = data.oAuth2Client

      let googleAccount = Object.assign(tokens, {email: email})

      await brandCol.findOneAndUpdate({"googleAccount.email": email}, {googleAccount: googleAccount})
      shop = await shopCol.findOneAndUpdate({"connectedShop.email": email}, null, {connectedShop: googleAccount})
      
      return checkSheetProperty()
    })
  }

  async function deleteOldData(){
    let filter = {
      brandId: shop.brandId,
      marketplace: shop.marketplace,
      shopId: shop._id.toString(),
      '$or': [
        {
          syncDate: null
        },
        {
          syncDate: {'$lt': syncDate}
        }
      ]

      
      
    }

    console.log("deleteOldData", filter)

    let options = {}

    let deleteResult = await database.productSheetCol().deleteMany(filter, options)
    console.log('deleteResult', deleteResult.deletedCount)
  }

  async function batchProcessing(auth, row, listOrderDetail) {

    // try{
    //   var x = await spreadSheet.checkSize(shop.spreadSheet, auth)
    // }catch(e){
    //   console.log(e)

    //   googleOauth.refeshToken(async function(err, data){

    //     if(err){
    //       cb(true)
    //       return updateShop(shop, err)
    //     }
        
    //     return batchProcessing(data.oAuth2Client, row, listOrderDetail)
    //   })
    //   return
    // }

    // console.log("checkSize", x.data.sheets[0].properties)

    // return

    let range = row + parseStep
    if(range > rowCount){
      range = rowCount
    }

    console.log('batchProcessing rowCount / row / range:', rowCount, row,  range)
    await timeout(3)

    spreadSheet.listData(shop.spreadSheet, `Query!A${row}:V${range}`, auth, function (err, spreadsheetData) {
      if(err){
        console.log('listData', err)
        return cb(true)
      }

      if(spreadsheetData == null){
        return cb(true)
      }

      listOrderDetail = spreadsheetData;

      shop.syncDate = syncDate

      parseValueByOrder(listOrderDetail, shop, function(){
        if(spreadsheetData.length < parseStep){
          console.log('FINISH spreadSheet', shop)
          cb(true)

          shopCol.findOneAndUpdate({_id: shop._id}, null, {syncDate: syncDate})
          
          let rawDataSheet = sheetProperty[1].properties
          //spreadSheet.clearOldData(auth, shop.spreadSheet, `${rawDataSheet.title}!A$2:AN${rawDataSheet.gridProperties.rowCount}`)
          //spreadSheet.clearOldData(auth, shop.spreadSheet, `Query!A$2:V${rowCount}`)
         
        }else{
          batchProcessing(auth, range + 1, listOrderDetail)
        }
      })
    })
  }
}


function updateShop(shop, err){
  let filter = {
    _id: shop._id
  }
  let staticField = {
    error: err
  }
  shopCol.findOneAndUpdate(filter, null, staticField, null)
}

var syncGoogleSpreadsheet = new productSheetCol.BulkWriteGoogleSpreadsheet();

async function parseValueByOrder(listOrderDetail, shop, cb) {
  
  syncGoogleSpreadsheet.buildNewValueFromArrayOfRow(listOrderDetail, shop)
  syncGoogleSpreadsheet.save(function (err, result) {
    if (err) {
      cb()
      return console.log(err)
    }

    console.log('done writing POST to DB', result.n)
    console.log('matchedCount/modifiedCount/upsertedCount:', result.matchedCount, '/', result.modifiedCount, '/', result.upsertedCount)

    cb()

    let newJob = {
      creatorKey: null,
      creatorDetail: null,
      
      type: 'syncGoogleSpreadsheet',
      jobDes: 'batch sync',

      status: 'done',
      statusMsg: `done writing DB ${result.n} record`,
      statusDetail: result,

      reference: {
        shop: shop
      }
    }

    jobCol.insertOne(newJob)
    
  })
}

module.exports = {
  handler: handler
}