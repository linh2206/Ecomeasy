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

const lazadaQueue = require('../../cron/queue/lazadaQueue')
const shopeeQueue = require('../../cron/queue/shopeeQueue')
const tikiQueue = require('../../cron/queue/tikiQueue')
const googleSpreadsheetQueue = require('../../cron/queue/googleSpreadsheetQueue')

const googleOauth = require('../../integration/google/oauth')
const spreadSheet = require('../../integration/google/spreadSheet')

const config = require('../../config/config_app.json')
const redirect_uri = `${config.webServer.host}/tiki-oauth2-redirect`


async function disconnectToSource(req, res) {

	let rolePermission = req.user.role.permissions

	if (req.user.role.name == 'systemAdmin') {
		
	}else if(rolePermission.includes('readAdminBrand')){

	}else if(rolePermission.includes('disconnectSource')){
		
	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	let filter = {
		$match: {
			'_id': new objectId(req.params.shopId)
		}
	}

	let addField = {
		$addFields: {
      _brandId: { $toObjectId: "$brandId" }
   	}
	}

	const lookupBrand = {
    $lookup: {
      from: 'brand',
      localField: '_brandId',
      foreignField: '_id',
      as: 'brands'
    }
  }

  const pipeline = [filter, addField, lookupBrand]

  try{
    var shops = await database.shopCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

	if(shops.length == 0){
		return res.json({
			err: 1,
			errMsg: 'source not found',
			result: {
				query: filter
			}
		})
	}

	if(shops[0].brands.length == 0){
		return res.json({
			err: 1,
			errMsg: 'brand not found',
			result: {
				query: filter
			}
		})
	}

	let isAdmin = shops[0].brands[0].admins.find(function(e){
		return e.email == req.user.email
	})

	if(req.user.role.name == 'systemAdmin'){

	}else if(!isAdmin){
		return res.json({
			err: 1,
			errMsg: 'admin role is required',
			result: null
		})
	}

	let shop = shops[0]
	let marketplace = shop.marketplace

	try {
		var result = await database.shopCol().deleteMany({_id: new objectId(req.params.shopId)})
	} catch (e) {
		console.log(e)
	}

	if(marketplace == "shopee"){
		try {
			var data = await database.shopeeOrderCol().deleteMany({brandId: shop.brandId})
		} catch (e) {
			console.log(e)
		}

	}else if(marketplace == "lazada"){
		try {
			var data = await database.lazadaOrderCol().deleteMany({brandId: shop.brandId})
		} catch (e) {
			console.log(e)
		}

	}else if(marketplace == "tiki"){
		try {
			var data = await database.tikiOrderCol().deleteMany({brandId: shop.brandId})
		} catch (e) {
			console.log(e)
		}
	}else if(marketplace == "sendo"){
		try {
			var data = await database.sendoOrderCol().deleteMany({brandId: shop.brandId})
		} catch (e) {
			console.log(e)
		}

	}else if (marketplace == "googleSheet"){
		let query = {
			shopId: shop._id.toString()
		}

		try {
			var data = await database.productSheetCol().deleteMany(query)
		} catch (e) {
			console.log(e)
		}
	}else if (marketplace == "uploadSource"){
		let query = {
			shopId: shop._id.toString()
		}

		try {
			var data = await database.productSheetCol().deleteMany(query)
		} catch (e) {
			console.log(e)
		}
	}

	res.json({
		err: null,
		errMsg: null,
		result: 'ok'
	})
}

module.exports = {
	disconnectToSource: disconnectToSource,
}