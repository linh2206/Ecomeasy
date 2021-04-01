const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newShop = {
		name: data.name,
		connectedShop: data.connectedShop,
		sourceDetail: data.sourceDetail,
		spreadSheet: data.spreadSheet,
		marketplace: data.marketplace,
		brandId: data.brandId,
		created: new Date(),

	}

	try {
		var result = await database.shopCol().insertOne(newShop)
	} catch (e) {
		console.log(e)
	}

	return result.ops[0]
}

async function findOneAndUpdate(filter, setOnInsert, staticField, dynamicField) {
	let update = {
		'$set': {}
	}

	if(staticField.connectedShop){
		update['$set']['connectedShop'] = staticField.connectedShop
	}

	if(staticField.disconnected || staticField.disconnected == null){
		update['$set']['disconnected'] = staticField.disconnected
	}

	if(staticField.spreadSheet){
		update['$set']['spreadSheet'] = staticField.spreadSheet
	}

	if(staticField.name){
		update['$set']['name'] = staticField.name
	}

	if(staticField.error || staticField.error === null){
		update['$set']['error'] = staticField.error
	}

	if(staticField.syncDate){
		update['$set']['syncDate'] = staticField.syncDate
	}

	if(dynamicField){
		update['$set'][dynamicField.key] = dynamicField.value
	}

	if(setOnInsert){
		update['$setOnInsert'] = {}

		if(setOnInsert.marketplace){
			update['$setOnInsert']['marketplace'] = setOnInsert.marketplace
		}

		if(setOnInsert.brandId){
			update['$setOnInsert']['brandId'] = setOnInsert.brandId
		}

		if(setOnInsert.created){
			update['$setOnInsert']['created'] = setOnInsert.created
		}
	}

	let options = {
		returnOriginal: false,
	}

	try {
		var result = await database.shopCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}

	return result.value

}

module.exports = {
	findOneAndUpdate: findOneAndUpdate,
	insertOne: insertOne
}