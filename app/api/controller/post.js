const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')

async function createPost(req, res) {

	const { permissions } = req.user.role

	delete req.user.role

	if (permissions.length == 0) {

	}else if(permissions.includes('createPost')){
		
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
			role: 'admin'
		}],
		createBy: req.user
	}

	try {
		var result = await database.postCol().insertOne(data)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result.ops[0]
	})
}

async function listPost(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('listPost') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	try {
		var result = await database.postCol().find({}).toArray()
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
	createPost: createPost,
	listPost: listPost
}

