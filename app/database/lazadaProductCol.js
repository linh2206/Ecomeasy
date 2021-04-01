const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function findOneAndUpdate(filter, staticField, setOnInsert){

	let update = {
		'$set': {
		}
	}

	if(staticField.versions){

		switch(staticField.versions.action){
			case '$set':
				update['$set']['versions'] = staticField.versions.data
				break;
			case '$push':
				update['$push'] = {}
				update['$push']['versions'] = staticField.versions.data
				break;
		}
	}

	if(setOnInsert){
		update['$setOnInsert'] = {
		}

		if(setOnInsert.lazadaSku){
			update['$setOnInsert']['lazadaSku'] = setOnInsert.lazadaSku
		}

		if(setOnInsert.link){
			update['$setOnInsert']['link'] = setOnInsert.link
		}

		if(setOnInsert.creator){
			update['$setOnInsert']['creator'] = setOnInsert.creator
		}

		if(setOnInsert.created){
			update['$setOnInsert']['created'] = setOnInsert.created
		}
	}

	if(isEmpty(update['$set'])){
		delete update['$set']
	}

	let options = {
		returnOriginal: false,
		upsert: true
	}

	try {
		var result = await database.lazadaProductCol().findOneAndUpdate(filter, update, options)
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
	findOneAndUpdate: findOneAndUpdate
}