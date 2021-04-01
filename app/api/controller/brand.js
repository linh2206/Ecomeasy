const objectId = require("mongodb").ObjectID;
const fs = require('fs')
const multer  = require('multer');
const path = require('path');

const config = require('../../config/config_app')

const database = require('../../database/database')
const brandCol = require('../../database/brandCol')
const shopCol = require('../../database/shopCol')


const lazada = require('../../integration/lazada/lazada')
const shopee = require('../../integration/shopee/shopee')
const tiki = require('../../integration/tiki/tiki')
const googleOauth = require('../../integration/google/oauth')
const drive = require('../../integration/google/drive')
const gmail = require('../../integration/google/gmail')

const amazonS3 = require('../../integration/aws/amazonS3')

const publicAccessFolder = path.resolve(process.cwd(), config.userFileStorage.publicAccess.folderPath)
const userAvatarFolder = `${publicAccessFolder}/${config.userFileStorage.publicAccess.user_avatar}`

const userAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userAvatarFolder)
  },
  filename: function (req, file, cb) {
    console.log(req.user._id)
    cb(null, `${req.user._id.toString()}_${Date.now()}_${file.originalname}`)
  }
})

const avatarUploadSetting = multer({ 
  storage: userAvatarStorage,
  limits: { fieldSize: 25 * 1024 * 1024 } 
}).single('avatar')

async function createBrand(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {

	}else if(rolePermission.includes('createBrand')){
		
	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	let data = {
		name: req.body.name,
		admins: [{
			email: req.user.email,
			role: 'brandAdmin'
		}],
		createBy: req.user
	}

	try {
		var result = await brandCol.insertOne(data, req.user)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function listBrand(req, res) {
	let rolePermission = req.user.role.permissions

	let query, projection, paging, recordPerPage, sortBy;
	if(rolePermission.includes('readAllBrand')){
		query = {}
		projection = {}
	}else if(rolePermission.includes('readAdminBrand')){
		query = {
			"admins.email" : req.user.email,
			"admins.role": 'brandAdmin'
		}
		projection = {}
	}else if(rolePermission.includes('readOwnerBrand')){
		query = {
			"admins.email" : req.user.email,
			"admins.role": 'brandOwner'
		}
		projection = {}
	}else if(rolePermission.length == 0){
		query = {}
		projection = {}
	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	let filter = {
		$match: query
	}

	let addField = {
		$addFields: {
      convertedId: { $toString: "$_id" }
   	}
	}

	const lookupShop = {
    $lookup: {
      from: 'shop',
      localField: 'convertedId',
      foreignField: 'brandId',
      as: 'shops'
    }
  }

  const sort = { $sort: { created: -1 } }

  const pipeline = [filter, addField, lookupShop]

  try{
    var brands = await database.brandCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  let emailForCollectAvatar = []
  brands.map(function(brand){
  	brand.admins.map(function(admin){
  		emailForCollectAvatar.push(admin.email)
  	}) 
  })

  let userQuery = {
  	email: {
  		'$in': emailForCollectAvatar
  	},
  	avatar: {
  		'$ne': null
  	}
  }
  let options = {
  	projection: {
  		email: 1,
  		avatar: 1
  	}
  }

  try{
    var avatarByEmail = await database.userCol().find(userQuery, options).toArray()
  }catch(e){
    console.log(e)
  }

	res.json({
		err: null,
		errMsg: null,
		result: {
			avatarByEmail: avatarByEmail,
			brands: brands
		}
	})
}

async function brandDetail(req, res) {

	let rolePermission = req.user.role.permissions

	console.log('brandDetail', 'rolePermission', rolePermission)

	let filter = {
		$match: {
			'_id': new objectId(req.params.brandId)
		}
	}

	if (req.user.role.name == 'systemAdmin') {

	}else if(rolePermission.includes('readAllBrand')){
		
	}else if(rolePermission.includes('readAdminBrand') || rolePermission.includes('readOwnerBrand')){
		filter['$match']["admins.email"] = req.user.email

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	let addField = {
		$addFields: {
      convertedId: { $toString: "$_id" }
   	}
	}

	const lookupShop = {
    $lookup: {
      from: 'shop',
      localField: 'convertedId',
      foreignField: 'brandId',
      as: 'shops'
    }
  }

  const sort = { $sort: { created: -1 } }

  const pipeline = [filter, addField, lookupShop]

  try{
    var result = await database.brandCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  let state = {
  	brandId: req.params.brandId,
  	userId: req.user._id.toString()
  }

	res.json({
		err: null,
		errMsg: null,
		result: {
			brand: result[0],
			lazadaAuth: lazada.genLazadaAuthLink(req.params.brandId),
			shopeeAuth: shopee.getTokenFromShop(req.params.brandId),
			tiki: tiki.auth(JSON.stringify(state))
		}
	})
}

async function updateBrandDetail(req, res){

	let rolePermission = req.user.role.permissions

	let filter = {
		_id: new objectId(req.params.brandId)
	}

	if (req.user.role.name == 'systemAdmin') {
		
	}else if(rolePermission.includes('readAdminBrand')){
		filter["admins.email"] = req.user.email

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	let staticField = {
		updated: new Date()
	}

	avatarUploadSetting(req, res, async function (err) {
    if(err){
      console.log(err)
      return res.json({
        err: 1,
        errMsg: "So sorry!, please try again",
        result: null
      });
    }

    if(req.body && req.body.name){
			staticField['name'] = req.body.name
		}

		if(req.file){

			amazonS3.upload(req.file.path, req.file.filename, function(result){
				staticField['avatarUrl'] = result
				updateBrand()
			})
			
		}else{
			updateBrand()
		}
  })

  async function updateBrand(){
  	try{
			var result = await brandCol.findOneAndUpdate(filter, staticField)
		}catch(e){
			console.log(e)
		}

		res.json({
			err: null,
			errMsg: null,
			result: result
		})
  }
}

async function listing(req, res) {
  let brands = await database.brandCol().find({}).toArray()
  res.json({
    err: null,
    errMsg: null,
    result: brands
  })
}

async function deleteBrand(req, res) {
	let rolePermission = req.user.role.permissions

	if (req.user.role.name == 'systemAdmin') {
		
	}else if(rolePermission.includes('deleteAdminBrand')){
		
	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	try {
		var readResult = await database.brandCol().deleteMany({ _id: new objectId(req.params.brandId) })
	} catch (e) {
		console.log(e)
	}

	try {
		await database.shopCol().deleteMany({brandId: req.params.brandId})
	} catch (e) {
		console.log(e)
	}

	try {
		await database.shopeeOrderCol().deleteMany({brandId: req.params.brandId})
	} catch (e) {
		console.log(e)
	}

	try {
		await database.lazadaOrderCol().deleteMany({brandId: req.params.brandId})
	} catch (e) {
		console.log(e)
	}

	try {
		await database.tikiOrderCol().deleteMany({brandId: req.params.brandId})
	} catch (e) {
		console.log(e)
	}

	try {
		await database.sendoOrderCol().deleteMany({brandId: req.params.brandId})
	} catch (e) {
		console.log(e)
	}

	try {
		await database.productSheetCol().deleteMany({brandId: req.params.brandId})
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: 'ok'
	})
}

module.exports = {
	createBrand: createBrand,
	listBrand: listBrand,
	brandDetail: brandDetail,
	updateBrandDetail: updateBrandDetail,
	listing: listing,
	deleteBrand: deleteBrand,
}