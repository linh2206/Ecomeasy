const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newBrand = {
		name: data.name,
		avatarUrl: data.avatarUrl,
		
		createBy: data.createBy,
		created: new Date(),

		invitations: [],
		admins: data.admins
	}

	try {
		var result = await database.brandCol().insertOne(newBrand)
	} catch (e) {
		console.log(e)
	}

	return result.ops[0]
}

async function findOneAndUpdate(filter, staticField){

	let update = {
		'$set': {
			'updated': staticField.updated ? staticField.updated : new Date()
		}
	}

	if(staticField.name){
		update['$set']['name'] = staticField.name
	}

	if(staticField.googleAccount){
		update['$set']['googleAccount'] = staticField.googleAccount
	}

	if(staticField.avatarUrl){
		update['$set']['avatarUrl'] = staticField.avatarUrl
	}

	if(staticField.invitations){

		switch(staticField.invitations.action){
			case '$set':
				update['$set']['invitations'] = staticField.invitations.data
				break;
			case '$pull':
				update['$pull'] = {}
				update['$pull']['invitations'] = staticField.invitations.data
				break;
			case '$push':
				update['$push'] = {}
				update['$push']['invitations'] = staticField.invitations.data
				break;
		}
	}

	if(staticField.admins){

		switch(staticField.admins.action){
			case '$set':
				update['$set']['admins'] = staticField.admins.data
				break;
			case '$pull':
				update['$pull'] = {}
				update['$pull']['admins'] = staticField.admins.data
				break;
			case '$push':
				update['$push'] = {}
				update['$push']['admins'] = staticField.admins.data
				break;
		}
	}

	if(isEmpty(update['$set'])){
		delete update['$set']
	}

	let options = {
		returnOriginal: false,
	}

	try {
		var result = await database.brandCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}

	return result.value
}

function isEmpty(obj) { 
  for (var x in obj) { return false; }
  return true;
}

module.exports = {
	insertOne: insertOne,
	findOneAndUpdate: findOneAndUpdate
}