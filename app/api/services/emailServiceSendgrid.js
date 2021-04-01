const fs = require('fs');
const handlebars = require("handlebars")

const config = require('../../config/config_app')
const sendgrid  = require('@sendgrid/mail')
sendgrid.setApiKey(config.sendGridAuth.apiKey);

const loginTemplate = fs.readFileSync(__dirname + '/mailTemplates/emailAccess.html', "utf8");
const inviteTemplate = fs.readFileSync(__dirname + '/mailTemplates/inviteUser.html', "utf8");
const inviteManageBrand = fs.readFileSync(__dirname + '/mailTemplates/inviteManageBrand_vn.html', "utf8");
const newAdSetTemplate = fs.readFileSync(__dirname + '/mailTemplates/newAdSet.html', "utf8");

const inviteBrandOwner = fs.readFileSync(__dirname + '/mailTemplates/inviteBrandOwner.html', "utf8");
const template = handlebars.compile(inviteManageBrand)
 
const host = config.webServer.host ? config.webServer.host : `${config.webServer.ip}:${config.webServer.port}`


function invitePeople(user, email, cb) {

	var name = ''
	if(user.username){
		name = user.username
	}else if(user.email){
		name = user.email
	}else if(user.facebook.displayName){
		name = user.facebook.displayName
	}

	var subject = name + ' has invited you to join Kiwi'

	var newEmail   = new sendgrid.Email({
	 	to      : email,
	 	from    : 'no-reply@kiwi.life',
	 	fromname: name + '-Kiwi',
	 	subject : subject
	})

	var tokenLink = '<a href="' + 'http://www.kiwi.life' + '/?ref=' + user.shortId + '"> Click here </a>'

	newEmail.setHtml(inviteTemplate);
	newEmail.addSubstitution("%username%", name);
	newEmail.addSubstitution("%token%", tokenLink);
	

	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	});
}

function loginTokenEmail(user, token, redirectTo, cb) {

	var newEmail   = new sendgrid.Email({
	 	to      : user.email,
	 	from    : `no-reply@${config.webServer.domain}`,
	 	fromname: config.webServer.domain,
	 	subject : 'Login Request - ' + new Date()
	})

	var href = `${config.webServer.domain}/shield?token=${token}`
	if(redirectTo){
		href = `${href}&redirect_to=${redirectTo}`
	}
	const tokenLink = `<a href=${href}> Click here </a>`

	newEmail.setHtml(loginTemplate);
	newEmail.addSubstitution("%username%", user.username);
	newEmail.addSubstitution("%email%", user.email);
	newEmail.addSubstitution("%token%", tokenLink);
	
	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	 	cb(null, 'ok')
	});
}

function newOrder(user, buyer, cb) {
	var stringTemplate = fs.readFileSync(__dirname + '/mailTemplates/newOrder.html', "utf8");

	var newEmail   = new sendgrid.Email({
	 	to      : user.email,
	 	from    : 'no-reply@kiwi.life',
	 	fromname: 'Kiwi',
	 	subject : 'Kiwi - New Order - ' + buyer.username
	})

	var linkToOrder = '<a href="' + config.webServer.domain + '/customer-orders"> View order detail </a>'

	newEmail.setHtml(stringTemplate);
	newEmail.addSubstitution("%username%", user.username);
	newEmail.addSubstitution("%linkToOrder%", linkToOrder);
	

	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	 	cb(null, 'ok')
	});
}

function reportJobSubmit(user, job, cb){

	var newEmail   = new sendgrid.Email({
	 	to      : user.email,
	 	from    : 'no-reply@marketinggroup.io',
	 	fromname: 'MarketingGroup',
	 	subject : 'Job Report - ' + job.name
	})

	var linkToOrder = `<a href=${config.webServer.domain}/jobs/${job._id}/?token=${user.token}> View report </a>`

	newEmail.setHtml(linkToOrder);
	// newEmail.addSubstitution("%username%", user.username);
	// newEmail.addSubstitution("%linkToOrder%", linkToOrder);
	

	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	 	cb(null, 'ok')
	});
}

function inviteToManageBrand(user, brand, cb){

	var newEmail   = new sendgrid.Email({
	 	to      : user.email,
	 	from    : 'no-reply@marketinggroup.io',
	 	fromname: 'MarketingGroup',
	 	subject : 'Invite managing a brand - ' + brand.name
	})

	var link = `<a href=${config.webServer.domain}/brand/${brand._id}/?token=${user.token}> View brand </a>`

	newEmail.setHtml(link);
	// newEmail.addSubstitution("%username%", user.username);
	// newEmail.addSubstitution("%linkToOrder%", linkToOrder);
	

	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	 	cb(null, 'ok')
	});
}

function channelViewNotification(host, user, channel, cb){
	const newEmail   = new sendgrid.Email({
	 	to      : user.email,
	 	from    : `no-reply@${config.webServer.domain}`,
	 	fromname: config.webServer.domain,
	 	subject : 'Profile has new view - ' + new Date()
	})

	const _linkToChannel = `${host}/aud/${channel._id.toString()}?token=${user.token}`
	const _linkShareChannel = `${host}/channel/${channel._id.toString()}`

	const linkToChannel = `<a href=${_linkToChannel}> Click here </a>`
	const linkShareChannel = `<a href=${_linkShareChannel}> ${_linkShareChannel} </a>`

	newEmail.setHtml(channelViewNotificationTemplate);

	newEmail.addSubstitution("%channelName%", channel.name);
	newEmail.addSubstitution("%linkToChannel%", linkToChannel);
	newEmail.addSubstitution("%linkShareChannel%", linkShareChannel);
	
	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	 	cb(null, 'ok')
	})
}

function newAdSet(user, recordId, channel, cb){
	const newEmail   = new sendgrid.Email({
	 	to      : user.email,
	 	from    : `no-reply@${config.webServer.domain}`,
	 	fromname: config.webServer.domain,
	 	subject : 'New Job created - ' + new Date()
	})

	const _linkToAdset = `${host}/ad-set/${recordId.toString()}`

	const linkToAdset = `<a href=${_linkToAdset}> Click here </a>`

	newEmail.setHtml(newAdSetTemplate);

	newEmail.addSubstitution("%channelName%", channel.name);
	newEmail.addSubstitution("%linkToAdset%", linkToAdset);
	
	sendgrid.send(newEmail, function(err, json) {
	 	if (err) { return console.error(err); }
	 	console.log(json);
	 	cb(null, 'ok')
	})
}

async function sendResetLink(user, link){
	console.log(config)

	const linkToAdset = `<a href=${link}> Click here </a>`

	const htmlToSend = template({linkToAdset: link})

	const newEmail   = {
	 	to      : user.email,
	 	from    : `no-reply@${config.webServer.domain}`,
	 	fromname: config.webServer.domain,
	 	subject : 'Reset password - ' + new Date(),
	 	html: htmlToSend,
	 	// substitutions: {
	  //   "-linkToAdset-": [
	  //    	linkToAdset
	  //   ],
	  // }
	}
	
	try {
    await sendgrid.send(newEmail);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body)
    }
  }
}

async function sendInviteManageBrand(email, link){

	const linkToAdset = `<a href=${link}> Click here </a>`

	const htmlToSend = template({linkToAdset: link})

	const newEmail   = {
	 	to      : email,
	 	from    : `no-reply@${config.webServer.domain}`,
	 	fromname: config.webServer.domain,
	 	subject : `Ecom Easy - Thư Mời Đối Tác Tham Gia Hệ Thống Báo Cáo`,
	 	html: htmlToSend,
	}
	
	try {
    var result = await sendgrid.send(newEmail);
  } catch (error) {

    if (error.response) {
      console.error(error.response.body)
    }else{
    	console.error(error);
    }
  }

  console.log(result)
}

async function sendReportEmail(email, html, subject){


	const newEmail   = {
	 	to      : email,
	 	from    : `no-reply@${config.webServer.domain}`,
	 	fromname: config.webServer.domain,
	 	subject : subject,
	 	html    : html
	}
	
	try {
    var result = await sendgrid.send(newEmail);
  } catch (error) {

    if (error.response) {
      console.error(error.response.body)
    }else{
    	console.error(error);
    }
  }

  console.log(result)
}

module.exports = {
	invitePeople: invitePeople,
	loginTokenEmail: loginTokenEmail,
	newOrder: newOrder,
	reportJobSubmit: reportJobSubmit,
	inviteToManageBrand: inviteToManageBrand,
	channelViewNotification: channelViewNotification,
	newAdSet: newAdSet,
	sendResetLink: sendResetLink,
	sendInviteManageBrand: sendInviteManageBrand,
	sendReportEmail: sendReportEmail
}