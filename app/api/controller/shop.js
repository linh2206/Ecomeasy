const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')
const shopCol = require('../../database/shopCol')
const userCol = require('../../database/userCol')
const brandCol = require('../../database/brandCol')
const productSheetCol = require('../../database/productSheetCol')

const lazada = require('../../integration/lazada/lazada')
const lazada_sdk = require('../../integration/lazada/lazada_sdk')

const shopee = require('../../integration/shopee/shopee')
const shopee_client = require('../../integration/shopee/shopee_client')

const tiki = require('../../integration/tiki/tiki')

const sendo = require('../../integration/sendo/sendo')

const lazadaQueue = require('../../cron/queue/lazadaQueue')
const shopeeQueue = require('../../cron/queue/shopeeQueue')
const tikiQueue = require('../../cron/queue/tikiQueue')
const sendoQueue = require('../../cron/queue/sendoQueue')

const config = require('../../config/config_app.json')
const redirect_uri = `${config.webServer.host}/tiki-oauth2-redirect`

async function createShop_shopee(req, res) {

	let shop_id = req.query.shop_id

	let check = await database.shopCol().findOne({ connectedShop: shop_id })
	if (check) {
		return res.send(`this source is connected to brand ${check.brandId}`)
	}

	await shopee_client.authenticateShop(shop_id)
	var shop = await shopee_client.getShopInfo(shop_id)

	let insert = {
		marketplace: "shopee",
		brandId: req.query.brand_id,
		connectedShop: shop_id,
		sourceDetail: shop,
		disconnected: null,
		created: new Date()
	}

	try {
		var result = await shopCol.insertOne(insert)
	} catch (e) {
		console.log(e)
	}

	console.log(result)
	let from = new Date(2018, 0, 1, 0, 0, 0).getTime()
	let to = new Date().getTime()
	shopeeQueue.processQueue(result, from, to)

	res.redirect(`/brand-detail/${req.query.brand_id}`)
}

async function createShop_lazada(req, res) {
	console.log(req.query)
	let brandId = req.query.state
	let token = null
	let shop = null
	lazada_sdk.getAccessToken(req.query.code, getAccessTokenCb)

	async function getAccessTokenCb(_token) {
		token = _token
		lazada.getSeller(token, getShopInfoCb)
	}

	async function getShopInfoCb(sourceInfo) {

		shop = await database.shopCol().findOne({ 'sourceDetail.seller_id': sourceInfo.seller_id })
		
		if(shop && shop.brandId != brandId){
			return res.send(`this shop is connected to ${shop.brandId}`)
		}

		let from = new Date(2018, 0, 1, 0, 0, 0).getTime()
		let to = new Date().getTime()

		if(shop){
			console.log('update old shop')

			let filter = {
				_id: shop._id
			}

			let staticField = {
				connectedShop: token,
				error: null
			}

			shop = await shopCol.findOneAndUpdate(filter, null, staticField, null)

			from = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime()
  		to = new Date().getTime()

		}else{
			console.log('create new shop')

			let insert = {
				marketplace: "lazada",
				brandId: brandId,
				connectedShop: token,
				sourceDetail: sourceInfo,
				disconnected: null,
				created: new Date()
			}

			try {
				shop = await shopCol.insertOne(insert)
			} catch (e) {
				console.log(e)
			}
		}

		console.log(shop)

		lazadaQueue.handler(shop, from, to)

		res.redirect(`/brand-detail/${req.query.state}`)
	}
}

async function createShop_tiki(req, res) {

	const state = JSON.parse(req.query.state)
	let brandId = state.brandId

	const tokenParams = {
    code: req.query.code,
    redirect_uri: redirect_uri,
    scope: "offline all",
  };

  let client = tiki.getClient()

  try {
    var result = await client.getToken(tokenParams);
  } catch (error) {
    console.log('Access Token Error', error);
    console.log(req.query.code)
    return res.send(error)
  }
  console.log('getToken result', result)

  tiki.sellerDetail(result.token.access_token, async function(sourceInfo){

  	console.log("sourceInfo", sourceInfo)

  	let shop = await database.shopCol().findOne({ 'sourceDetail.sid': sourceInfo.sid })

  	if(shop && shop.brandId != brandId){
			return res.send(`this source is connected to brand ${shop.brandId}`)
		}

		let from = new Date(2019, 0, 1, 0, 0, 0).getTime()
		let to = new Date().getTime()

		if(shop){
			console.log('update old shop')

			let filter = {
				_id: shop._id
			}

			let staticField = {
				connectedShop: result.token,
				error: null
			}

			shop = await shopCol.findOneAndUpdate(filter, null, staticField, null)

			from = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime()
  		to = new Date().getTime()

		}else{
			console.log('create new shop')

			let insert = {
		    marketplace: "tiki",
		    brandId: state.brandId,
		    connectedShop: result.token,
		    sourceDetail: sourceInfo,
		    disconnected: null,
		    created: new Date()
		  }

		  try {
		    shop = await shopCol.insertOne(insert)
		  } catch (e) {
		    console.log(e)
		  }
		}

	  tikiQueue.handler(shop, from, to)

		res.redirect(`/brand-detail/${brandId}`)
  })
}

async function createShop_sendo(req, res) {
	let shop = null
	let from = new Date(2019, 0, 1, 0, 0, 0).getTime()
	let to = new Date().getTime()

	sendo.authentication(req.body.shop_key, req.body.secret_key, async function(err, token){
		
		if(err){
			return res.json({
				err: 1,
				errMsg: err,
				result:  null
			})
		}

		let filter = {
			'sourceDetail.shop_key': req.body.shop_key,
			'sourceDetail.secret_key': req.body.secret_key
		}

		shop = await database.shopCol().findOne(filter)

		if(!shop){
			let insert = {
		    marketplace: "sendo",
		    brandId: req.params.brandId,
		    connectedShop: token,
		    sourceDetail: {
		    	shop_key: req.body.shop_key,
		    	secret_key: req.body.secret_key
		    },
		    disconnected: null,
		    created: new Date()
		  }

		  try {
		    shop = await shopCol.insertOne(insert)
		  } catch (e) {
		    console.log(e)
		  }

		}else {
			console.log('update old shop')

			let staticField = {
				connectedShop: token,
				error: null
			}

			shop = await shopCol.findOneAndUpdate(filter, null, staticField, null)

			from = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).getTime()
  		to = new Date().getTime()
		}

	  res.json({
			err: null,
			errMsg: null,
			result:  shop
		})

	  sendoQueue.handler(shop, from, to)

	})
}

var uploadedExcel = new productSheetCol.BulkWriteUploadedExcel();
async function uploadSource(req, res) {

	let newShop = {
		marketplace: "uploadSource",
		name: req.body.name,
		brandId: req.params.brandId,
		created: new Date()
	}

	try {
		var shop = await shopCol.insertOne(newShop)
	} catch (e) {
		console.log(e)
	}

	// let data = JSON.parse(req.body.data)

	// await uploadedExcel.deleteOldValue(filter)
	// uploadedExcel.buildNewValueFromArrayOfObject(data, shop)
	// uploadedExcel.save(function (err, result) {
	// 	if (err) {
	// 		return console.log(err)
	// 	}

	// 	console.log('done writing POST to DB')
	// 	console.log(result.n)
	// })

	res.json({
		err: null,
		errMsg: null,
		result: shop
	})
}

async function addOrderToSource(req, res) {

	let query = {
		_id: new objectId(req.params.sourceId)
	}

	try {
		var shop = await database.shopCol().findOne(query)
	} catch (e) {
		console.log(e)
	}

	if(!shop){
		return res.json({
			err: 1,
			errMsg: `source not found ${req.params.sourceId}`,
			result: req.params.sourceId
		})
	}

	let data = JSON.parse(req.body.data)

	shop.syncDate = new Date()

	//await uploadedExcel.deleteOldValue(filter)
	uploadedExcel.buildNewValueFromArrayOfObject(data, shop)
	uploadedExcel.save(function (err, result) {
		if (err) {
			return console.log(err)
		}

		console.log('done writing POST to DB', result.n)

	})

	res.json({
		err: null,
		errMsg: null,
		result: shop
	})
}

async function sourceListing(req, res){

  const options = {
    sort: {created: -1}
  }

  try{
    var shops = await database.shopCol().find({}, options).toArray()
  }catch(e){
    console.log(e)
  }

  res.json({
    err: null,
    errMsg: null,
    result: shops
  })
}

module.exports = {
	createShop_shopee: createShop_shopee,
	createShop_lazada: createShop_lazada,
	createShop_tiki: createShop_tiki,
	createShop_sendo: createShop_sendo,
	uploadSource: uploadSource,
	addOrderToSource: addOrderToSource, 
	sourceListing: sourceListing,
}