const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newBrand = {
		name: data.name,
		description: data.description,
		approved: data.approved,
		approveBy: data.approveBy,
		createBy: data.createBy,
		created: new Date(),
	}

	try {
		var result = await database.processCol().insertOne(newBrand)
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