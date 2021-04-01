const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')

async function createProduct(req, res) {

	const { permissions } = req.user.role

	delete req.user.role

	if (permissions.length == 0) {

	}else if(permissions.includes('createProduct')){
		
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
		var result = await database.productCol().insertOne(data)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result.ops[0]
	})
}

async function listProduct(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('listProduct') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	try {
		var result = await database.productCol().find({}).toArray()
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

module.exports = {
	createProduct: createProduct,
	listProduct: listProduct
}