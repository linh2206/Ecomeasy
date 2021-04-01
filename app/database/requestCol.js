const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newBrand = {

		requestName: data.requestName,

		processId: data.processId,
		stepSlug: data.stepSlug,
		
		createBy: data.createBy,
		created: new Date(),
	}

	try {
		var result = await database.requestCol().insertOne(newBrand)
	} catch (e) {
		console.log(e)
	}

	return result.ops[0]
}

function isEmpty(obj) { 
  for (var x in obj) { return false; }
  return true;
}

module.exports = {
	insertOne: insertOne,
}