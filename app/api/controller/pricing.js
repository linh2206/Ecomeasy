const objectId = require("mongodb").ObjectID;

const database = require('../../database/database')


async function loadListProduct(req, res){
	let data = await database.pricingProductCol().find({}).toArray()
	res.json({
		err: null, 
		errMsg: null,
		result: data
	})
}

async function addNewProduct(req, res) {

	const { permissions } = req.user.role

	delete req.user.role

	let data = {
		productName: req.body.productName,
		productOriginId: req.body.productOriginId,
		link: req.body.link,
		err: null,
		created: new Date(),
		user: req.user
	}
	let newTarget =  await database.pricingProductCol().insertOne(data)
	res.json({
		err: null, 
		errMsg: null,
		result: newTarget.ops[0]
	})
}

async function addNewGroup(req, res){
	const { permissions } = req.user.role

	delete req.user.role

	let data = {
		groupName: req.body.groupName,
		groupDes: req.body.groupDes,
		products: JSON.parse(req.body.products),
		created: new Date(),
		user: req.user
	}
	let result =  await database.pricingListCol().insertOne(data)
	res.json({
		err: null, 
		errMsg: null,
		result: result.ops[0]
	})
}

async function loadListGroup(req, res){
	let data = await database.pricingListCol().find({}).toArray()
	res.json({
		err: null, 
		errMsg: null,
		result: data
	})
}

async function editGroup(req, res){
	let filter = {
		_id: new objectId(req.params.groupId)
	}

	let data = {}

	if(req.body.products){
		data['products'] = JSON.parse(req.body.products)
	}

	if(req.body.groupName){
		data['groupName'] = req.body.groupName
	}

	if(req.body.groupDes){
		data['groupDes'] = req.body.groupDes
	}

	let update = {
		'$set': data
	}

	let options = {
		returnOriginal: false
	}

	let result = await database.pricingListCol().findOneAndUpdate(filter, update, options)
	res.json({
		err: null, 
		errMsg: null,
		result: result.value
	})
}

async function updateTargetData(req, res) {
	let record = {
		_targetId: new objectId(req.params.targetId),
		stock: req.body.stock,
		sold: req.body.sold,
		originPrice: parseInt(req.body.originPrice),
		currentPrice: parseInt(req.body.currentPrice),
		created: new Date()
	}

	let newData =  await database.pricingDataCol().insertOne(record)
	res.json({
		err: null, 
		errMsg: null,
		result: newData.ops[0]
	})
}

async function deleteData(req, res){
	try {
		await database.pricingDataCol().deleteMany({_id: new objectId(req.body.dataId)})
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null, 
		errMsg: null,
		result: 'ok'
	})
}

async function loadTargetData(req, res) {
	let list = await database.pricingListCol().findOne({_id: new objectId(req.params.groupId)})

	let _productIds = list.products.map(function(e){
		return new objectId(e)
	})

	let match = {
		_targetId: {'$in': _productIds}
	}

	let group = {
		_id: '$_targetId',
		data: {'$push': '$$ROOT'}
	}

	let lookup = {
		from: 'pricing_product',
    localField: '_id',
    foreignField: '_id',
    as: 'productDetail'
	}

	let pipeline = [
		{'$match': match}, 
		{'$group': group},
		{'$lookup': lookup}
	]

	let data = await database.pricingDataCol().aggregate(pipeline).toArray()
	res.json({
		err: null, 
		errMsg: null,
		result: data
	})
}


module.exports = {
	addNewProduct: addNewProduct,
	loadListProduct: loadListProduct,
	
	addNewGroup: addNewGroup,
	editGroup: editGroup,
	loadListGroup: loadListGroup,

	deleteData: deleteData,
	updateTargetData: updateTargetData,
	loadTargetData: loadTargetData
}