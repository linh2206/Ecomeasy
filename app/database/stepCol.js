const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newBrand = {
		stepName: data.stepName,
		stepSlug: data.stepSlug,
		stepDes: data.stepDes,
		processId: data.processId,
		_processId: data._processId,
		inputData: data.inputData,
		actions: data.actions,
		createBy: data.createBy,
		created: new Date(),
	}

	try {
		var result = await database.stepCol().insertOne(newBrand)
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