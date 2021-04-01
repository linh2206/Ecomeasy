const objectId = require("mongodb").ObjectID;
const fs = require('fs')
const multer = require('multer');
const path = require('path');

const config = require('../../config/config_app')

const database = require('../../database/database')
const brandCol = require('../../database/brandCol')
const shopCol = require('../../database/shopCol')


const googleOauth = require('../../integration/google/oauth')
const drive = require('../../integration/google/drive')
const gmail = require('../../integration/google/gmail')
const spreadSheet = require('../../integration/google/spreadSheet')


const amazonS3 = require('../../integration/aws/amazonS3')

const googleSpreadsheetQueue = require('../../cron/queue/googleSpreadsheetQueue')

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

async function googleOauth2Link(req, res) {
	let state = `${req.params.brandId}_${req.user._id.toString()}`
	googleOauth.getAuthUrl(state, function (url) {
		res.json({
			err: null,
			errMsg: null,
			result: url
		})
	})
}

async function newSpreadsheetSource(req, res) {
	// try {
	// 	var brand = await database.brandCol().findOne({_id: new objectId(req.params.brandId)})
	// } catch (e) {
	// 	console.log(e)
	// }

	let data = {
		brandId: req.params.brandId,
		connectedShop: null,
		spreadSheet: null,
		name: req.body.name,
		marketplace: 'googleSheet',
		created: new Date()
	}

	try {
		var shop = await shopCol.insertOne(data)
	} catch (e) {
		console.log(e)
	}

	let state = `${shop._id.toString()}_${req.user._id.toString()}`
	googleOauth.getAuthUrl(state, function (url) {
		res.json({
			err: null,
			errMsg: null,
			result: {
				source: shop,
				googleOauth: url
			}
		})
	})
}

async function googleGetTokenFromCode(req, res) {
	console.log('googleGetTokenFromCode', req.query)

	if (!req.query || !req.query.state || !req.query.code) {
		return res.status(400).send('Remove ECE app on Google dashboard then try again')
	}

	let state = req.query.state.split('_');

	let sourceId = state[0]

	let sourceFilter = {
		_id: new objectId(sourceId)
	}

	let token = null

	googleOauth.googleGetTokenFromCode(req.query.code, getTokenCb)

	async function getTokenCb(err, _token) {

		if (err) {
			return res.status(400).send(err)
		}

		token = _token

		let auth = null
		try {
			auth = await googleOauth.getAuthObject(token)
		} catch (e) {
			console.log(e)

			return res.json({
				err: 1,
				errMsg: 'google authenticate fail',
				result: e
			})
		}

		gmail.getProfile(auth, getEmailCb)
	}

	async function getEmailCb(data) {

		if (!data.emailAddress) {
			return res.status(400).send('email not found')
		}

		let googleAccount = {
			email: data.emailAddress
		}

		Object.assign(googleAccount, token)

		let currentSourceFilter = {
			"googleAccount.email": googleAccount.email
		}

		if (!googleAccount.refresh_token) {
			let source = await database.shopCol().findOne(currentSourceFilter)

			if (source == null) {
				return res.status(400).send('Remove ECE app on Google dashboard then try again')
			}

			googleAccount['refresh_token'] = source.connectedShop.refresh_token
		}

		let currentShopFilter = {
			"connectedShop.email": googleAccount.email
		}

		let staticField = {
			connectedShop: googleAccount
		}

		await shopCol.findOneAndUpdate(currentShopFilter, null, staticField)
		await shopCol.findOneAndUpdate(sourceFilter, null, staticField)

		res.status(200).send('connecting...')
	}
}

async function listDriveFolder(req, res) {
	console.log(req.query)
	let q = null
	if (req.query.q) {
		q = req.query.q
	}

	let filter = {
		_id: new objectId(req.params.sourceId)
	}

	try {
		var source = await database.shopCol().findOne(filter)
	} catch (e) {
		console.log(e)
	}

	if (!source.connectedShop) {
		return res.json({
			err: null,
			errMsg: null,
			result: 'connecting'
		})
	}

	let googleAccount = Object.assign({}, source.connectedShop)
	delete googleAccount.email

	try {
		var auth = await googleOauth.getAuthObject(googleAccount)
	} catch (e) {
		console.log(e)

		return res.json({
			err: 1,
			errMsg: 'google drive authenticate fail',
			result: e
		})
	}

	drive.listFiles(auth, q, function (err, spreadSheetList) {
		if (err) {
			return res.json({
				err: 1,
				errMsg: err,
				result: {
					spreadSheetList: [],
					source: source
				}
			})
		}

		res.json({
			err: null,
			errMsg: null,
			result: {
				spreadSheetList: spreadSheetList,
				source: source
			}
		})
	})
}

async function attachSpreadsheetSource(req, res) {

	let shopFilter = {
		_id: new objectId(req.params.sourceId)
	}

	let staticField = {
		spreadSheet: req.body.spreadSheet
	}

	let source = await shopCol.findOneAndUpdate(shopFilter, null, staticField)

	res.json({
		err: null,
		errMsg: null,
		result: source
	})

	googleSpreadsheetQueue.handler(source)
}

module.exports = {
	googleOauth2Link: googleOauth2Link,
	googleGetTokenFromCode: googleGetTokenFromCode,
	listDriveFolder: listDriveFolder,
	newSpreadsheetSource: newSpreadsheetSource,
	attachSpreadsheetSource: attachSpreadsheetSource
}