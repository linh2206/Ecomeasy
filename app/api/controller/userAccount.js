const objectId = require("mongodb").ObjectID;
const fs = require('fs')
const multer  = require('multer');
const path = require('path');
const bcrypt = require("bcrypt");
const saltRounds = 10;

const config = require('../../config/config_app')

const database = require('../../database/database')
const userCol = require('../../database/userCol')
const roleCol = require('../../database/roleCol')

const amazonS3 = require('../../integration/aws/amazonS3')

const cacheManager = require("../services/cacheManager");
const tokenUtil = require("../utils/tokenUtil");

const publicAccessFolder = path.resolve(process.cwd(), config.userFileStorage.publicAccess.folderPath)
const userAvatarFolder = `${publicAccessFolder}/${config.userFileStorage.publicAccess.user_avatar}`

const userAvatarStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, userAvatarFolder)
  },
  filename: function (req, file, cb) {
    console.log(req.user._id)
    cb(null, `${req.user._id.toString()}_${Date.now()}_${file.originalname}`)
  }
})

const avatarUploadSetting = multer({ 
  storage: userAvatarStorage,
  limits: { fieldSize: 25 * 1024 * 1024 } 
}).single('avatar')

async function update(req, res) {
	let filter = {
		_id: req.user._id,
	}

	let staticField = {
		updated: new Date()
	}

	avatarUploadSetting(req, res, async function (err) {
    if(err){
      console.log(err)
      return res.json({
        err: 1,
        errMsg: "So sorry!, please try again",
        result: null
      });
    }

    if(req.body && req.body.name){
			staticField['name'] = req.body.name
		}

		if(req.file){

			amazonS3.upload(req.file.path, req.file.filename, function(result){
				staticField['avatar'] = result
				updateUser()
			})
			
		}else{
			updateUser()
		}
		
  })


  async function updateUser(){
  	try{
			var result = await userCol.findOneAndUpdate(filter, staticField)
		}catch(e){
			console.log(e)
		}

		res.json({
			err: null,
			errMsg: null,
			result: result
		})
  }
}

async function changePassword(req, res){

	let user = await database.userCol().findOne({_id: req.user._id});
	const match = await bcrypt.compare(req.body.password, user.password)

	if(!match){
		return res.json({
	    err: 1,
	    errMsg: 'password not match',
	    result: null
	  })
	}

  let hash = null;
  try {
    hash = await bcrypt.hash(req.body.newPassword, saltRounds);
  } catch (e) {
    return console.log(e);
  }

  const filter = { _id: req.user._id};

  const staticField =  {
  	password : hash
  }

  let result = await userCol.findOneAndUpdate(filter, staticField);

  res.json({
    err: null,
    errMsg: null,
    result: 'ok'
  })
}

function verifyEmail(req, res, next) {
  const token = req.query.token
  const payload = tokenUtil.syncDecodeToken(token)

  console.log("updateUserActiveTime");

  const filter = { _id: new objectId(payload.userId) };
  const update = {
    "$set": {
      emailVerified: true
    }
  };
  const options = { "returnOriginal": false };

  function cb(err, result) {
    next()
  }
  database.userCol().findOneAndUpdate(filter, update, options, cb);
}

async function listingUser(req, res) {
  let users = await database.userCol().find({}).toArray()
  res.json({
    err: null,
    errMsg: null,
    result: users
  })
}


async function getProfile(req, res){
  res.json({
    err: null,
    errMsg: null,
    result: req.user
  })
}

module.exports = {
	update: update,
	changePassword: changePassword,
  listingUser: listingUser,
  getProfile: getProfile
}