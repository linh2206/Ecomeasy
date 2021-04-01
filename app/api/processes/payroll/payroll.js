const objectId = require("mongodb").ObjectID;
const database = require('../../../database/database')

async function createPayroll(processCb, exceptionCb){

	console.log('createPayroll')

	try{
		let payrolls = await database.payrollCol().insertOne({name: 'name'})
	}catch(e){
		console.log(e)
	}

	processCb('salary_approve')

}

module.exports = {
	createPayroll: createPayroll
	
}