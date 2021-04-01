const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newBrand = {
		bankName: data.bankName,
		bankId: data.bankId,
		accountName: data.accountName,
		accountNumber: data.accountNumber,
		balance: data.balance,
		date: data.date,
		createBy: data.createBy,
		created: new Date(),
	}

	try {
		var result = await database.balanceCol().insertOne(newBrand)
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