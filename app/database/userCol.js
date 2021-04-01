const objectId = require("mongodb").ObjectID;
const database = require('./database')

async function insertOne(data){

  const newUser = {
    _id: data.userId,
    email: data.email,
    password: data.password,
    color: data.color,
    birthdate: data.birthdate,
    emailVerified: data.emailVerified,
    activated: new Date,
    created: new Date
  };

  try{
  	var result =  await database.userCol().insertOne(newUser)
  }catch(e){
  	console.log(e)
  }

  return result.ops[0]
}

async function findOneAndUpdate(filter, staticField){

  let update = {
    '$set': {}
  }

  if(staticField.name){
    update['$set']['name'] = staticField.name
  }

  if(staticField.avatar){
    update['$set']['avatar'] = staticField.avatar
  }

  if(staticField.password){
    update['$set']['password'] = staticField.password
  }

  if(staticField.activated){
    update['$set']['activated'] = staticField.activated
  }

  let options = {
    returnOriginal: false,
  }

  try {
    var result = await database.userCol().findOneAndUpdate(filter, update, options)
  } catch (e) {
    console.log(e)
  }

  return result.value
}

module.exports = {
  insertOne: insertOne,
  findOneAndUpdate: findOneAndUpdate
}