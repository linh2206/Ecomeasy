const objectId = require("mongodb").ObjectID;
const _ = require("lodash");

const tokenUtil = require("../utils/tokenUtil");
const database = require('../../database/database')
const userCol = require('../../database/userCol')

console.log("keeper import cacheManager");
const cacheManager = require("../services/cacheManager");

var start = 0;
function requireUser(req, res, next){

  var token = getToken(req);
  if(!token){
    return res.json({
      err: 401,
      errMsg: "token is required",
      result: null
    });
  }

  var userId = null;
  try {
    var payload = tokenUtil.syncDecodeToken(token);
  } catch(err) {
    console.log(err);
    return res.json({
      err: 1,
      errMsg: err,
      result: null
    });
  }

  userId = payload.id;

  var user = cacheManager.getUserFromCache(userId);

  if(user){
    var lastActivateFromNow = Date.now() - new Date(user.activated).getTime();
    if(lastActivateFromNow > 1 * 60 * 60 * 1000){
      const activeTime = new Date();
      user.activated = activeTime;
      updateUserActiveTime(userId, activeTime);
    }

    appendUserToRequest(user, token, req, res, next);

    return;
  }

  console.log("get user from DB");

  getUserRoleFromDatabase(payload, new Date(), callback);

  function callback(err, user) {
    if(err){
      return res.json({
        err: 1,
        errMsg: "err when getting user",
        result: payload
      });

    }

    if(!user){
      return res.json({
        err: 401,
        errMsg: "this user is not existed",
        result: payload
      });
    }

    if(user.role == null || user.role.token != token){
      return res.json({
        err: 401,
        errMsg: "required login",
        result: payload
      });		
    }

    user.verified = true;
    user.activated = new Date();
    appendUserToRequest(user, token, req, res, next);
  }
}

function appendUserToRequest(user, token, req, res, next){

  console.log("time to get user: " + (Date.now() - start));
  if(token != user.role.token){
    return res.json({
      err: 401,
      errMsg: "token not match",
      result: null
    });		
  }

  req.user = _.pick(user, ["_id", "email", "username", "avatar", "color", "role"]);
  req.fullUserObject = user;

  cacheManager.updateUserToCache(user);

  next();
}

function trackUser(req, res, next){
  var token = getToken(req);
  if(!token){
    req.user = null;
    return next();
  }

  try {
    var payload = tokenUtil.syncDecodeToken(token);
  } catch(err) {
    console.log(err);
    req.user = null;
    return next();
  }

  const userId = payload.id;

  var user = cacheManager.getUserFromCache(userId);

  if(user){
    var lastActivateFromNow = Date.now() - new Date(user.activated).getTime();
    if(lastActivateFromNow > 1 * 60 * 60 * 1000){
      const activeTime = new Date();
      user.activated = activeTime;
      cacheManager.updateUserToCache(user);
      updateUserActiveTime(userId, activeTime);
    }

    req.user = _.pick(user, ["_id", "email", "username", "avatar", "color", "role"]);
    req.fullUserObject = user;

    return next();
  }

  console.log("get user from DB");

  getUserRoleFromDatabase(payload, new Date(), callback);

  function getUserCb(err, user) {
    if(err){
      req.user = null;
      return next();
    }

    if(!user){
      req.user = null;
      return next();
    }

    cacheManager.updateUserToCache(user);

    req.user = _.pick(user, ["_id", "email", "username", "avatar", "color", "role"]);
    req.fullUserObject = user;

    return next();
  }
}



module.exports = {
  requireUser: requireUser,
  trackUser: trackUser,
};

function getToken (req) {
    
  start = Date.now();
  var token = req.cookies.token;

  return token;
}

async function updateUserActiveTime(userId, activeTime, cb){
  console.log("updateUserToDB");

  const filter = {_id: new objectId(userId)};
  const staticField = {
    activated: activeTime
  }

  var _cb = cb || function(){};

  var user = await userCol.findOneAndUpdate(filter, staticField);

  _cb(null, user)
}

async function getUserRoleFromDatabase(tokenPayload, activeTime, cb){

  console.log('getUserRoleFromDatabase')

  const filter = {_id: new objectId(tokenPayload.id)};
  
  const staticField = {
    activated: activeTime
  }

  var user = await userCol.findOneAndUpdate(filter, staticField);

  if(!user){
    return cb(null, null)
  }

  let activeRole = {
    email: user.email,
    '$or': [
      {'end': null},
      {'end': {'$gt': new Date()}}
    ]
  }

  let options = {
    'sort' : {
      'created' : -1
    }
  }

  var roles = await database.roleCol().find(activeRole, options).toArray();

  let requestRole = null
  roles.map(function(role){
    if(tokenPayload.roleId && tokenPayload.roleId == role._id.toString()){
      requestRole = role
    }
  })

  if(requestRole == null){
    requestRole = roles[0]
  }

  user['role'] = requestRole

  cb(null, user)
}


