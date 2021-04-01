const objectId = require("mongodb").ObjectID;

const userCol = require('../../database/userCol')
const database = require('../../database/database')

const departCol = require('../../database/departCol')
const processCol = require('../../database/processCol')
const stepCol = require('../../database/stepCol')
const requestCol = require('../../database/requestCol')


async function createDepart(req, res) {

	let rolePermission = req.user.role.permissions

	let data = {
		name: req.body.name,
		createBy: req.user,
		created: new Date()
	}

	try {
		var result = await departCol.insertOne(data, req.user)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function listDepart(req, res) {
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
    var departs = await database.departCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  

	res.json({
		err: null,
		errMsg: null,
		result: departs
	})
}

async function addUserToDepart(req, res){

	let depart = await database.departCol().findOne({_id: new objectId(req.params.departId)})

	let user = JSON.parse(req.body.users)

	let query = {
		email: {
			'$in': user
		}
	}

	let update = {
		'$set': {
			departs: depart.name
		}
	}

	try{
		var result  = await database.update(query, update)
	}catch(e){
		return console.log(e)
	}

	console.log(result)

	res.json({
		err: 1,
		errMsg: null,
		result: 'ok'
	})
}

var process = [
	{
		processId: '123456',
		stepName: 'xxxxxx',
		stepDes: 'qazwsx',
		inputData: [
			{
				key: 'username',
				label: 'User Name',
				type: 'string',
				hint: 'type your username',
				required: true
			},
			{
				key: 'date',
				label: 'Date',
				type: 'string',
				hint: 'start date',
				required: false
			}
		],
		processors: [
			
				'departmentAId',
				'departmentBId',
				'userXId'
			
		],
		nextStep: [
			{
		 		stepId:'yyyyy',
				condition: 'bla bla bla'
			}
		]
	},
	{
		stepName: 'yyyyy',
		data: [
			{
				key: 'username',
				label: 'User Name',
				type: 'string',
				hint: 'type your username',
				required: true
			},
			{
				key: 'date',
				label: 'Date',
				type: 'string',
				hint: 'start date',
				required: false
			}
		],
		processors: [
			
				'departmentAId',
				'departmentBId',
				'userXId'
			
		],
		nextStep: [
			{
		 		stepName:'mua',
				condition: 'bla bla bla'
			},
			{
		 		stepName:'zzzzzzzz',
				condition: 'bla bla bla'
			}
		]
	}
]

async function addStep(req, res){
	let rolePermission = req.user.role.permissions

	let data = {
		processId: req.params.processId,
		_processId: new objectId(req.params.processId),
		stepName: req.body.stepName,
		stepDes: req.body.stepDes,
		stepType: req.body.stepType,
		stepSlug: req.body.stepSlug,
		inputData: [],
		processors: [],
		actions: [],
		settings: {}
	}

	try {
		var result = await stepCol.insertOne(data, req.user)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function modifyStep(req, res){
	console.log(req.body.data)

	let filter = {
		processId: req.params.processId,
		stepSlug: req.params.stepSlug
	}

	let update = {
		'$set' : {
			inputData: req.body.data ? JSON.parse(req.body.data): [],
			actions: req.body.actions ? JSON.parse(req.body.actions) : [],
			settings: req.body.settings ? JSON.parse(req.body.settings): [],
			actionsGroups: req.body.actionsGroups ? JSON.parse(req.body.actionsGroups) : []
		}
	}

	let options = {
		returnOriginal: false,
	}

	let step = await database.stepCol().findOneAndUpdate(filter, update, options)

	res.json({
		err: null,
		errMsg: null,
		result: step.value
	})
}

async function dataCollector(req, res){
	res.json({
		err: null,
		errMsg: null,
		result: ['getSomething']
	})
}

async function listProcess(req, res) {
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

	const lookupStep = {
    $lookup: {
      from: 'process_step',
      localField: 'convertedId',
      foreignField: 'processId',
      as: 'steps'
    }
  }

  const sort = { $sort: { created: -1 } }

  const pipeline = [filter, addField, lookupStep]

  try{
    var companyProcess = await database.processCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  

	res.json({
		err: null,
		errMsg: null,
		result: companyProcess
	})
}

async function loadRequest(req, res){
	function loadStepConcernToMe(){

	}

	function loadRequestConcernToStep(){

	}


	try {
		var result = await database.requestCol().find({}).toArray()
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function loadRequestById(req, res){

	try {
		var request = await database.requestCol().findOne({_id: new objectId(req.params.requestId)})
	} catch (e) {
		console.log(e)
	}

	let stepSlug = request.stepSlug

	try {
		var step = await database.stepCol().findOne({stepSlug: stepSlug})
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: {
			request: request,
			step: step
		}
	})

}


module.exports = {
	createDepart: createDepart,
	listDepart: listDepart,
	addUserToDepart: addUserToDepart,

	addStep: addStep,
	modifyStep: modifyStep,
	listProcess: listProcess,
	dataCollector: dataCollector,

	loadRequest: loadRequest,
	loadRequestById: loadRequestById
}