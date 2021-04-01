const objectId = require("mongodb").ObjectID;
const config = require('../../config/config_app')

const database = require('../../database/database')
const brandCol = require('../../database/brandCol')
const roles = require('../../database/roles.json')
const permissions = require('../../database/permissions.json')

const emailService = require("../services/emailServiceSendgrid");

const tokenUtil = require("../utils/tokenUtil");

async function inviteTobeAdmin(req, res) {
	let rolePermission = req.user.role.permissions

	if (req.user.role.name == 'systemAdmin') {

	} else if (rolePermission.includes('inviteTobeAdmin')) {

	} else {
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

	try {
		var brand = await database.brandCol().findOne({ _id: new objectId(req.params.brandId) })
	} catch (e) {
		console.log(e)
	}

	if (brand == null) {
		return res.json({
			err: 1,
			errMsg: 'target not found',
			result: null
		})
	}

	let checkBelongToAdmin = brand.admins.find(function (e) {
		return (e.email == req.user.email && e.role == 'brandAdmin')
	})

	if (req.user.role.name != 'systemAdmin' && !checkBelongToAdmin) {
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: brand
		})
	}

	if (brand.invitations) {
		let el = brand.invitations.find(function (e) {
			return e.email == req.body.email
		})

		if (el) {
			return sendMail()
		}
	}

	let checkUserAlreadyAdmin = {
		email: req.body.email,
		name: 'brandAdmin'
	}

	try {
		var roleResult = await database.roleCol().findOne(checkUserAlreadyAdmin)
	} catch (e) {
		console.log(e)
	}


	if (roleResult && req.body.role == 'owner') {
		return res.json({
			err: 1,
			errMsg: `this user is admin role already`,
			result: roleResult
		})
	}

	let filter = {
		_id: new objectId(req.params.brandId)
	}

	let staticField = {
		invitations: {}
	}

	if (brand.invitations) {
		brand.invitations.push({
			email: req.body.email,
			role: req.body.role
		})

		staticField.invitations = {
			action: '$set',
			data: brand.invitations
		}
	} else {
		staticField.invitations = {
			action: '$set',
			data: [{
				email: req.body.email,
				role: req.body.role
			}]
		}
	}

	try {
		var updateResult = await brandCol.findOneAndUpdate(filter, staticField)
	} catch (e) {
		console.log(e)
	}

	sendMail()

	function sendMail() {
		let tokenPayload = {
			email: req.body.email,
			brandId: req.params.brandId,
			role: req.body.role
		}

		const token = tokenUtil.createToken(tokenPayload)
		const link = `${config.webServer.host}/invite-manage-brand?token=${token}`

		try {
			emailService.sendInviteManageBrand(tokenPayload.email, link)
		} catch (e) {
			console.log(e)
		}

		res.json({
			err: null,
			errMsg: null,
			result: link
		})
	}
}

async function rejectAccept(req, res) {
	const token = req.query.token
	const payload = tokenUtil.syncDecodeToken(token)
	console.log(payload)
	console.log(req.body)

	if (req.body.action == 'reject') {
		let filter = {
			_id: new objectId(req.params.brandId)
		}

		let staticField = {
			invitations: {
				action: '$pull',
				data: {
					email: payload.email,
					role: payload.role
				}
			}
		}

		try {
			var readResult = await brandCol.findOneAndUpdate(filter, staticField)
		} catch (e) {
			console.log(e)
		}

		return res.json({
			err: null,
			errMsg: null,
			result: readResult
		})
	}

	try {
		var user = await database.userCol().findOne({ email: payload.email })
	} catch (e) {
		console.log(e)
	}

	if (!user) {
		return res.json({
			err: 1,
			errMsg: 'user not found',
			result: null
		})
	}

	let filter = {
		_id: new objectId(req.params.brandId)
	}

	let staticField = {
		invitations: {
			action: '$pull',
			data: {
				email: payload.email,
				role: payload.role
			}
		},
		admins: {
			action: '$push',
			data: {
				email: payload.email,
				role: payload.role
			}
		}
	}

	try {
		var updatedBrand = await brandCol.findOneAndUpdate(filter, staticField)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: updatedBrand
	})
}

async function invitationDetail(req, res) {
	const token = req.query.token
	const payload = tokenUtil.syncDecodeToken(token)
	console.log(payload)

	const brandQuery = {
		_id: new objectId(payload.brandId),
		'invitations.email': payload.email
	}

	try {
		var brand = await database.brandCol().findOne(brandQuery)
	} catch (e) {
		console.log(e)
	}

	if (brand == null) {
		return res.json({
			err: 1,
			errMsg: 'invalid link',
			result: null
		})
	}

	try {
		var user = await database.userCol().findOne({ email: payload.email })
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: {
			brand: brand,
			user: user,
			email: payload.email,
			role: payload.role
		}
	})
}

async function addAdminToBrand(req, res) {
	try {
		var brand = await database.brandCol().findOne({ _id: new objectId(req.params.brandId) })
	} catch (e) {
		console.log(e)
	}

	let filter = {
		_id: new objectId(req.params.brandId)
	}

	let staticField = {
		admins: {}
	}

	if (brand.admins) {
		brand.admins.push({
			email: req.body.email,
			role: req.body.role
		})

		staticField.admins = {
			action: '$set',
			data: brand.admins
		}
	} else {
		staticField.admins = {
			action: '$set',
			data: [{
				email: req.body.email,
				role: req.body.role
			}]
		}
	}

	try {
		var updateResult = await brandCol.findOneAndUpdate(filter, staticField)
	} catch (e) {
		console.log(e)
	}

	return res.json({
		err: null,
		errMsg: null,
		result: updateResult
	})
}

async function removeAdmin(req, res) {

	let rolePermission = req.user.role.permissions

	let filter = {
		_id: new objectId(req.params.brandId)
	}

	if (rolePermission.length == 0) {

	} else if (rolePermission.includes('updateAdminBrand')) {
		filter["admins.email"] = req.user.email

	} else {
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	let update = {
		'$pull': {
			'admins': {
				'email': req.body.email
			},
			'invitations': {
				'email': req.body.email
			},
		}
	}

	let options = {
		returnOriginal: false,
	}

	let brand = await database.brandCol().findOneAndUpdate(filter, update, options)

	if(!brand){
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: req.params.brandId
		})
	}

	return res.json({
		err: null,
		errMsg: null,
		result: brand
	})
}

function getRolePermission(req, res) {
	var clone = Object.assign({}, roles)
	delete clone.systemAdmin
	res.json({
		err: null,
		errMsg: null,
		result: {
			roles: clone,
			permissions: permissions
		}

	})
}



module.exports = {
	inviteTobeAdmin: inviteTobeAdmin,
	getRolePermission: getRolePermission,
	rejectAccept: rejectAccept,
	invitationDetail: invitationDetail,
	addAdminToBrand: addAdminToBrand,
	removeAdmin: removeAdmin,
}