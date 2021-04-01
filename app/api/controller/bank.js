const objectId = require("mongodb").ObjectID;

const database = require('../../database/database')
const bankCol = require('../../database/bankCol')
const balanceCol = require('../../database/balanceCol')

async function createBank(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	let data = {
		name: req.body.name,
		accounts: [],
		createBy: req.user,
		created: new Date()
	}

	try {
		var result = await bankCol.insertOne(data, req.user)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function listBank(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('readFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	try {
		var result = await database.bankCol().find({}).toArray()
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function addAccount(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	let account = {
		accountName: req.body.accountName,
		accountNumber: req.body.accountNumber,
		created: new Date()
	}

	let filter = {
		_id: new objectId(req.params.bankId)
	}

	let update = {
		'$push' : {
			accounts: account
		}
	}

	let options = {
		returnOriginal: false,
	}

	try {
		var result = await database.bankCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result.value
	})
}

async function deleteAccount(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	// try {
	// 	var result = await database.balanceCol().deleteMany({accountNumber: req.body.accountNumber})
	// } catch (e) {
	// 	console.log(e)
	// }

	let account = {
		accountName: req.body.accountName,
		accountNumber: req.body.accountNumber
	}

	let filter = {
		_id: new objectId(req.params.bankId)
	}

	let update = {
		'$pull' : {
			accounts: account
		}
	}

	let options = {
		returnOriginal: false,
	}

	try {
		var bank = await database.bankCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: bank.value
	})
}

async function deleteBank(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	// try {
	// 	let result = await database.balanceCol().deleteMany({bankId: req.params.bankId})
	// } catch (e) {
	// 	console.log(e)
	// }

	try {
		let result = await database.bankCol().deleteMany({_id: new objectId(req.params.bankId)})
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
	createBank: createBank,
	listBank: listBank,
	deleteBank: deleteBank,

	addAccount: addAccount,
	deleteAccount: deleteAccount,

}