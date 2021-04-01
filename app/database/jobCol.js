const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data) {
	let newJob = {
    creatorKey: data.creatorKey,
    creatorDetail: data.creatorDetail,

    type: data.type,
    jobDes: data.jobDes,

    status: data.status,
    statusMsg: data.statusMsg,
    statusDetail: data.statusDetail,

    reference: data.reference,
    created: new Date()
  }

  try{
    var result = await database.jobCol().insertOne(newJob)
  }catch(e){
    console.log(e)
  }

	return result.ops[0]
}

module.exports = {
	insertOne: insertOne
}