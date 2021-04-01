const crawl = require('../../../crawl/crawlShopee')
const database = require('../../database/database')


let jobs = {}

async function createNewJob(req, res){

	var offset = 7;
	let date = new Date()
	let singaporeTime = new Date(date.getTime() + offset * 60 * 60 * 1000)
	const interval = 1000 * 60 * 60 * 24; 
	let startOfDay = Math.floor(singaporeTime.getTime() / interval) * interval;
	let from = new Date(startOfDay - offset * 60 * 60 * 1000)
	
	let created = new Date().getTime()

	let newJob = {
		job: created,
		keyword: req.query.keyword,
		shopid: req.query.shopid ? req.query.shopid : null,
		status: 'processing',
		market: req.query.market,
		products: [],
		shops: []
	}

	jobs[created] = newJob

	let limitFilter = {
		"user" : req.user.email,
		"created": {'$gte': from}
	}
	let counter = await database.crawlQuotaCol().find(limitFilter).toArray()

	if(counter.length > 4){
		return res.json({
			err: 1,
			errMsg: 'quota limit',
			result: null
		})
	}

	delete req.user.role

	let newCrawl = {
		keyword: req.query.keyword ? req.query.keyword : null,
		shopid: req.query.shopid ? req.query.shopid : null,
		user: req.user.email,
		created: new Date()
	}

	let quota = await database.crawlQuotaCol().insertOne(newCrawl)
	newJob['quotaRef'] = quota.ops[0]._id

	res.json({
		err: null,
		errMsg: null,
		result: newJob
	})

	return crawl.crawlShopee(newJob, crawlCb)


	function crawlCb(jobDone, products, shops, err){
		console.log('crawlShopeeCb', products.length)

		if(err){
			let filter = {_id: jobDone.quotaRef}
			let update = {'$set': {err : err}}
			let options = {returnOriginal: false}
			database.crawlQuotaCol().finOneAndUpdate(filter, update, options)
		}

		jobs[jobDone.job].products = products
		jobs[jobDone.job].shops = shops
		jobs[jobDone.job].status = 'done'

	}
}

function getJobResult(req, res){

	console.log(req.query.job)
	console.log(jobs)

	let job = jobs[req.query.job]

	res.json({
		err: null,
		errMsg: null,
		result: job
	})

	if(job && job.status == 'done'){
		delete jobs[req.query.job]
	}
}

async function crawlHistoryByUser(req, res){

	var offset = 7;
	let date = new Date()
	let singaporeTime = new Date(date.getTime() + offset * 60 * 60 * 1000)
	const interval = 1000 * 60 * 60 * 24; 
	let startOfDay = Math.floor(singaporeTime.getTime() / interval) * interval;
	let from = new Date(startOfDay - offset * 60 * 60 * 1000) 

	let todayCrawl = {
		"created": {'$gte': from}
	}

	let groupByUser = {
		_id: '$user',
		count: {'$sum': 1},
		history: {'$push': '$$ROOT'}
	}

	let pipeline = [
		{'$match': todayCrawl},
		{'$group': groupByUser}
	]

	let data = await database.crawlQuotaCol().aggregate(pipeline).toArray()

	res.json({
		err: null,
		errMsg: null,
		result: data
	})
}

module.exports = {
	createNewJob: createNewJob,
	getJobResult: getJobResult,
	crawlHistoryByUser: crawlHistoryByUser
}