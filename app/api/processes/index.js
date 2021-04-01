const objectId = require("mongodb").ObjectID;

const database = require('../../database/database')
const requestCol = require('../../database/requestCol')
const processCol = require('../../database/processCol')

const payroll = require('./payroll/payroll')

const scripts = {
	createPayroll: payroll.createPayroll
}

function actionsList(req, res){
	res.json({
		err: null,
		errMsg: null,
		result: [
		 'createPayroll',
		 'createTicket',
		 'createPurchase'
		]
	})
}

async function createRequest(req, res){
	let data = {
		requestName: req.body.requestName,
		processId: req.body.processId,
		stepSlug: req.body.stepSlug,
		createBy: req.user
	}

	let request = await requestCol.insertOne(data)
	
	res.json({
		err: null,
		errMsg: null,
		result: request
	})
}

async function processRequest(req, res){
	let rolePermission = req.user.role.permissions

	console.log(req.body.action)
	console.log(req.body.requestId)

	if(!req.body.requestId){
		return res.json({
			err: 1,
			errMsg: `requestId is required`,
			result: null
		})
	}

	let thisProcessStep = await database.stepCol().findOne({stepSlug: req.params.stepSlug})

	let data = {}

	if(thisProcessStep.inputData && thisProcessStep.inputData.length > 0){
		thisProcessStep.inputData.map(function(field){
			data[field.key] = req.body[field.key]
		})
	}

	let filter = {
		_id: new objectId(req.body.requestId)
	}

	let update = {
		'$set': data
	}

	let options = {
		returnOriginal: false,
	}

	let request = await database.requestCol().findOneAndUpdate(filter, update, options)
	
	res.json({
		err: null,
		errMsg: null,
		result: request
	})

	let controllerName = req.body.action

	if(thisProcessStep.autoExecute){
		scripts[thisProcessStep.autoExecute](processCb, exceptionCb)
	}else if(scripts[controllerName]){
		scripts[controllerName](processCb, exceptionCb)
	}

	async function processCb(nextStepSlug){
		let request = await database.requestCol().findOneAndUpdate(filter, {'$set': {stepSlug: nextStepSlug}}, options)
		let thisProcessStep = await database.stepCol().findOne({stepSlug: nextStepSlug})
		if(thisProcessStep.autoExecute){
			scripts[thisProcessStep.autoExecute](processCb, exceptionCb)
		}
	}

	function exceptionCb(err){
		return console.log('exceptionCb')
	}

}

async function createProcess(req, res){
	let rolePermission = req.user.role.permissions

	let data = {
		name: req.body.name,
		description: req.body.description,
		createBy: req.user,
		approved: null,
		approveBy: null,
		created: new Date()
	}

	try {
		var result = await processCol.insertOne(data, req.user)
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
	actionsList: actionsList,
	scripts: scripts,
	createRequest: createRequest,
	processRequest: processRequest,
	createProcess: createProcess
}