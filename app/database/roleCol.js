const objectId = require("mongodb").ObjectID;
const database = require('./database')

const roles = require('./roles.json')
const permissions = require('./permissions.json')

async function assignRole(_id, email, token, roleName, createBy) {
	let newRole = {
		_id: _id,
		email: email,
		token: token,

		start: new Date(),
		end: null,

    created: new Date(),
		createBy: createBy,

	}

	Object.assign(newRole, roles[roleName]);

	try {
		var result = await database.roleCol().insertOne(newRole)
	} catch (e) {
		console.log(e)
	}

	return result.ops[0]
}

async function createRole(_id, email, token, roleName, permissions, createBy) {
	let newRole = {
		_id: _id,
		email: email,
		token: token,

		start: new Date(),
		end: null,

    created: new Date(),
		createBy: createBy,

		"name": roleName,
		"lang": {
      "en": null,
      "vn": null
    },
		"scope": "system",
		"permissions": permissions

	}

	try {
		var result = await database.roleCol().insertOne(newRole)
	} catch (e) {
		console.log(e)
	}

	return result.ops[0]
}

async function deactiveRole(email, timePeriod, activeRole){
	let filter = {
		email: email,
		_id: {
			'$ne': activeRole._id
		}
	}

	let update = {
		'$set': {
			end: timePeriod
		}
	}

	let options = {
    'sort' : {
      'created' : -1
    }
  }

	try {
		var result = await database.roleCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}
}

module.exports = {
	assignRole: assignRole,
	createRole: createRole,
	deactiveRole: deactiveRole
}