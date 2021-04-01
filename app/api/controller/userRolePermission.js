const objectId = require("mongodb").ObjectID;

const database = require('../../database/database')
const roleCol = require('../../database/roleCol')

const cacheManager = require("../services/cacheManager");

const tokenUtil = require("../utils/tokenUtil");

async function userRole(req, res){

  let rolePermission = req.user.role.permissions

  if(rolePermission.length == 0) {
    
  }else{
    return res.json({
      err: 1,
      errMsg: 'not authorize',
      result: null
    })
  }

  let pipeline = [
    {
      $sort: { created: -1 }
    },
    {
      $group: {
        _id: "$email",
        max: { $max: "$created" },
        users: { $addToSet: '$$ROOT' },
      }
    },
    {
      $sort: { max: -1 }
    }
  ]

  try{
    var roles = await database.roleCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  res.json({
    err: null,
    errMsg: null,
    result: roles
  })
}

async function addUserPersmission(req, res){

  let email = req.body.email
  let roleName = req.body.roleName
  let permissions = JSON.parse(req.body.permissions)

  let user = await database.userCol().findOne({'email': email})

  const _roleId = new objectId()
  const tokenPayload = {
    id: user._id.toString(),
    email: email,
    roleId: _roleId.toString()
  };

  const token = tokenUtil.createToken(tokenPayload)
  

  let activeRole = await roleCol.createRole(_roleId, email, token, roleName, permissions, req.user)


  let timePeriod = new Date()

  await roleCol.deactiveRole(email, timePeriod, activeRole)

  cacheManager.removeUserFromCache(user._id.toString())

  res.json({
    err: null,
    errMsg: null,
    result: activeRole
  })
}

module.exports = {
  userRole: userRole,
  addUserPersmission: addUserPersmission,
}