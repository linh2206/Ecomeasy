const objectId = require("mongodb").ObjectID;
const _ = require("lodash");
const bcrypt = require("bcrypt");

const COLOR = ["#5B97F7", "#F6BF24", "#9375CB", "#A0887E", "#B56AC3"];
const saltRounds = 10;
const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const tokenUtil = require("../utils/tokenUtil");
const cacheManager = require("../services/cacheManager");
const emailService = require("../services/emailServiceSendgrid");

const database = require('../../database/database')
const userCol = require('../../database/userCol')
const roleCol = require('../../database/roleCol')
const config = require('../../config/config_app')

/*
	params = {
		email: 
		userWithCurrentTokenCb: -> general callback
		userWithNewTokenCb: -> callback when user exist already with token is updated
		newUserCb: -> callback when creating new user
	}

	cbObject = {
		err: //value in [1, null]
		errMsg: // error object | string
		result: //user object
  }
*/
async function _getTokenByEmail(params) {

  if (!params.email) {
    params.cb({
      err: 1,
      errMsg: "email is required",
      result: null
    });
    return null
  }

  if (!re.test(params.email)) {
    params.cb({
      err: 1,
      errMsg: params.email + " is not valid",
      result: null
    });
    return null
  }

  try {
    var _email = params.email.toLowerCase();
  } catch (err) {
    params.cb({
      err: 1,
      errMsg: err,
      result: null
    });
    return null
  }

  try{
    var user = await database.userCol().findOne({ email: _email });
  }catch(e){
    params.cb({
      err: 1,
      errMsg: "So sorry!, please try again",
      result: null
    });
    return null
  }

  return {
    user: user,
    email: _email
  }
}

async function createUserByEmail(params) {

  let hash = null;
  try {
    hash = await bcrypt.hash(params.password, saltRounds);
  } catch (e) {
    return console.log(e);
  }

  const userId = objectId();
  const emailVerified = false;
  const data = {
    _id: userId,
    email: params.email,
    password: hash,
    color: COLOR[Math.floor((Math.random() * 5) + 0)],
    visit: new Date,
    created: new Date,
    emailVerified: emailVerified
  };

  try {
    var user = await userCol.insertOne(data)
  } catch (e) {
    console.log(e)
    return params.cb({
      err: 1,
      errMsg: "So sorry!, please try again",
      result: e
    });
  }

  const _roleId = new objectId()
  const tokenPayload = {
    id: user._id.toString(),
    emailVerified: emailVerified,
    email: params.email,
    roleId: _roleId.toString()
  };

  const token = tokenUtil.createToken(tokenPayload)

  let roleName = params.role ? params.role : 'brandAdmin'
  let result = await roleCol.assignRole(_roleId, params.email, token, roleName, 'register')

  user['role'] = result

  return params.newUserCb({
    err: null,
    errMsg: null,
    result: user
  });
}

function generateNewToken(user, cb) {
  const payload = _.pick(user, ["_id", "email"]);
  const token = tokenUtil.createToken(payload);
  const filter = { "_id": user._id };
  const update = {
    "$set": { "token": token }
  };
  const options = { "returnOriginal": false };

  database.userCol().findOneAndUpdate(filter, update, options, generateNewTokenCb);

  function generateNewTokenCb(err, result) {
    if (err) {
      return cb({
        err: 1,
        errMsg: err,
        result: null
      });
    }

    cacheManager.updateUserToCache(result.value);

    return cb({
      err: null,
      errMsg: null,
      result: result.value
    });
  }
}

async function register(req, res) {

  function errorCb(result) {
    console.log(result);
    res.json(result);
  }

  var params = {
    email: req.body.email,
    cb: errorCb
  }

  let result = await _getTokenByEmail(params);

  if(result == null){
    return
  }

  if(result.user){
    return res.json({
      err: 1,
      errMsg: "email exist already, please login or try another email",
      result: null
    })
  }

  params = {
    email: result.email,
    password: req.body.password,
    username: req.body.username,
    role: req.body.role,
    cb: errorCb,
    newUserCb: newUserCb
  }

  createUserByEmail(params);

  function newUserCb(result) {
    // try{
    //   emailService.register(result.result)
    // }catch(e){
    //   console.log(e)
    // }

    res.cookie("token", result.result.role.token, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
    res.json(result);
  }
}

async function login(req, res) {

  function errorCb(result) {
    console.log(result);
    res.json(result);
  }

  const params = {
    email: req.body.email,
    password: req.body.password,
    cb: errorCb
  };

  let result = await _getTokenByEmail(params);

  if(result.user == null){
    return res.json({
      err: 1,
      errMsg: `found no user with email ${params.email}`,
      result: null
    })
  }

  let user = result.user

  const match = await bcrypt.compare(req.body.password, user.password)

  if (!match) {
    return res.json({
      err: 1,
      errMsg: 'wrong password',
      result: null
    })
  }

  let activeRole = {
    email: user.email,
    '$or': [
      { 'end': null },
      { 'end': { '$gt': new Date() } }
    ]
  }

  let options = {
    'sort' : {
      'created' : -1
    }
  }

  var roles = await database.roleCol().find(activeRole, options).toArray();

  if (roles.length == 0) {
    const _roleId = new objectId()
    const tokenPayload = {
      id: user._id.toString(),
      emailVerified: user.emailVerified,
      email: user.email,
      roleId: _roleId.toString()
    };

    const token = tokenUtil.createToken(tokenPayload)

    let newRole = await roleCol.assignRole(_roleId, user.email, token, 'brandAdmin', 'login')
    roles = [newRole]
  }

  user['role'] = roles[0]

  res.cookie("token", user.role.token, { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
  
  return res.json({
    err: 0,
    errMsg: null,
    result: user
  });
}

function logout(req, res, next) {
}

async function sendResetLink(req, res) {
  let query = {
    email: req.body.email,
  }

  var user = await database.userCol().findOne(query)

  if(user == null){
    return res.json({
      err: 1,
      errMsg: 'email not found',
      result: null
    })
  }

  const tokenPayload = {
    id: user._id.toString(),
    email: user.email
  };

  var token = tokenUtil.createToken(tokenPayload)

  var link = `${config.webServer.host}/auth/set-password?token=${token}`

  try {
    emailService.sendResetLink(user, link)
  } catch (e) {
    console.log(e)
  }

  res.json({
    err: null,
    errMsg: null,
    result: 'ok'
  })
}

function getResetForm(req, res) {
  console.log(req.query.token)
}

async function newPassword(req, res) {
  const token = req.query.token
  const payload = tokenUtil.syncDecodeToken(token)

  let hash = null;
  try {
    hash = await bcrypt.hash(req.body.password, saltRounds);
  } catch (e) {
    return console.log(e);
  }

  const filter = { _id: new objectId(payload.id) };
  const staticField = {
    password: hash
  }
  const options = { "returnOriginal": false };

  let user = await userCol.findOneAndUpdate(filter, staticField);

  res.json({
    err: null,
    errMsg: null,
    result: 'ok'
  })
}

module.exports = {
  register: register,
  login: login,
  sendResetLink: sendResetLink,
  newPassword: newPassword
}
