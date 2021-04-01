const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')

async function createCampaign(req, res) {

	const { permissions } = req.user.role

	delete req.user.role

	if (permissions.length == 0) {

	}else if(permissions.includes('createCampaign')){
		
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
		var result = await database.campaignCol().insertOne(data)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result.ops[0]
	})
}

async function listCampaign(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('listCampaign') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	try {
		var result = await database.campaignCol().find({}).toArray()
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function editCampaign(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('editCampaign') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	let filter = {_id: new objectId(req.params.campaignId)}
	let update = {
		'$set': {
			outputStream: req.body.outputStream,
			slug: req.body.slug,
		}
	}

	let options = {
		returnOriginal: false
	}

	try {
		var result = await database.campaignCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result.value
	})
}

async function getCampaign(req, res) {

	// let rolePermission = req.user.role.permissions

	// if (rolePermission.length == 0) {
		
	// }else if(rolePermission.includes('getCampaign') ){

	// }else{
	// 	return res.json({
	// 		err: 1,
	// 		errMsg: 'not authorize',
	// 		result: rolePermission
	// 	})
	// }

	let query = {_id: new objectId(req.params.campaignId)}

	try {
		var result = await database.campaignCol(query).findOne()
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
	createCampaign: createCampaign,
	listCampaign: listCampaign,
	editCampaign: editCampaign,
	getCampaign: getCampaign
}