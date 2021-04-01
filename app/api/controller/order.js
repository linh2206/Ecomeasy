const database = require('../../database/database')

const defaultRecordPerPage = 20
const defaultPage = 1

async function shopeeOrder(req, res){

	let page = defaultPage
  let recordPerPage = defaultRecordPerPage

  if(req.query.page){
    page = parseInt(req.query.page)
  }
  if(req.query.limit){
    recordPerPage = parseInt(req.query.limit)
  }

  var sort = { 
    '$sort' : { 'create_time' : -1 } 
  }

	let filterOrder_shopee = {
		$match: {
			'shopId': req.params.shopId
		}
	}

  if(req.query.from){
    if(filterOrder_shopee['$match'].create_time){
      filterOrder_shopee['$match'].create_time['$gte'] = req.query.from
    }else{
      filterOrder_shopee['$match']['create_time']= {
          '$gte': req.query.from
        
      }
    }
  }

  if(req.query.to){
    if(filterOrder_shopee['$match'].create_time){
      filterOrder_shopee['$match'].create_time['$lte'] = req.query.to
    }else{
      filterOrder_shopee['$match']['create_time']= {
          '$lte': req.query.to
        
      }
    }
  }

	let queryPipeline = []

  if(page > 1 && req.query.limit){
    let skip = (page - 1) * recordPerPage
    queryPipeline.push({ "$skip": skip })
  }
  queryPipeline.push({ "$limit": recordPerPage })

  let facet = { 
    '$facet': {
      metadata: [ 
        { $count: "total" }, { $addFields: { page: page } } 
      ],
      data: queryPipeline
    } 
  }

  const pipeline = [ 
    filterOrder_shopee, 
    sort, 
    facet
  ]

	try{
		var shopee = await database.shopeeOrderCol().aggregate(pipeline).toArray()
	}catch(e){
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: shopee
	})
}

async function tikiOrder(req, res){

  let page = defaultPage
  let recordPerPage = defaultRecordPerPage

  if(req.query.page){
    page = parseInt(req.query.page)
  }
  if(req.query.limit){
    recordPerPage = parseInt(req.query.limit)
  }

  var sort = { 
    '$sort' : { 'created_at' : -1 } 
  }

  let filterOrder_tiki = {
    $match: {
      'shopId': req.params.shopId
    }
  }

  if(req.query.from){
    if(filterOrder_tiki['$match'].created_at){
      filterOrder_tiki['$match'].created_at['$gte'] = req.query.from
    }else{
      filterOrder_tiki['$match'] = {
        created_at: {
          '$gte': req.query.from
        }
      }
    }
  }

  if(req.query.to){
    if(filterOrder_tiki['$match'].created_at){
      filterOrder_tiki['$match'].created_at['$lte'] = req.query.to
    }else{
      filterOrder_tiki['$match'] = {
        created_at: {
          '$lte': req.query.to
        }
      }
    }
  }

  let queryPipeline = []

  if(page > 1 && req.query.limit){
    let skip = (page - 1) * recordPerPage
    queryPipeline.push({ "$skip": skip })
  }
  queryPipeline.push({ "$limit": recordPerPage })

  let facet = { 
    '$facet': {
      metadata: [ 
        { $count: "total" }, { $addFields: { page: page } } 
      ],
      data: queryPipeline
    } 
  }

  const pipeline = [ 
    filterOrder_tiki, 
    sort, 
    facet
  ]

  try{
    var orders = await database.tikiOrderCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  res.json({
    err: null,
    errMsg: null,
    result: orders
  })
}

async function sendoOrder(req, res){

  let page = defaultPage
  let recordPerPage = defaultRecordPerPage

  if(req.query.page){
    page = parseInt(req.query.page)
  }
  if(req.query.limit){
    recordPerPage = parseInt(req.query.limit)
  }

  var sort = { 
    '$sort' : { 'created_at' : -1 } 
  }

  let filterOrder_tiki = {
    $match: {
      'shopId': req.params.shopId
    }
  }

  if(req.query.from){
    if(filterOrder_tiki['$match'].created_at){
      filterOrder_tiki['$match'].created_at['$gte'] = req.query.from
    }else{
      filterOrder_tiki['$match']['created_at'] = {
          '$gte': req.query.from
        
      }
    }
  }

  if(req.query.to){
    if(filterOrder_tiki['$match'].created_at){
      filterOrder_tiki['$match'].created_at['$lte'] = req.query.to
    }else{
      filterOrder_tiki['$match']['created_at'] = {
          '$lte': req.query.to
        
      }
    }
  }

  let queryPipeline = []

  if(page > 1 && req.query.limit){
    let skip = (page - 1) * recordPerPage
    queryPipeline.push({ "$skip": skip })
  }
  queryPipeline.push({ "$limit": recordPerPage })

  let facet = { 
    '$facet': {
      metadata: [ 
        { $count: "total" }, { $addFields: { page: page } } 
      ],
      data: queryPipeline
    } 
  }

  const pipeline = [ 
    filterOrder_tiki, 
    sort, 
    facet
  ]

  try{
    var orders = await database.sendoOrderCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  res.json({
    err: null,
    errMsg: null,
    result: orders
  })
}

async function lazadaOrder(req, res){

	let page = defaultPage
  let recordPerPage = defaultRecordPerPage

  if(req.query.page){
    page = parseInt(req.query.page)
  }
  if(req.query.limit){
    recordPerPage = parseInt(req.query.limit)
  }

  var sort = { 
    '$sort' : { 'created_at' : -1 } 
  }

	let filterOrder = {
		$match: {
			'shopId': req.params.shopId
		}
	}

  if(req.query.from){
    if(filterOrder['$match'].created_at){
      filterOrder['$match'].created_at['$gte'] = req.query.from
    }else{
      filterOrder['$match']['created_at'] = {
          '$gte': req.query.from
        
      }
    }
  }

  if(req.query.to){
    if(filterOrder['$match'].created_at){
      filterOrder['$match'].created_at['$lte'] = req.query.to
    }else{
      filterOrder['$match']['created_at'] = {
        '$lte': req.query.to
        
      }
    }
  }

	let data = []

  if(page > 1 && req.query.limit){
    let skip = (page - 1) * recordPerPage
    data.push({ "$skip": skip })
  }
  data.push({ "$limit": recordPerPage })

  let facet = { 
    '$facet': {
      metadata: [ 
        { $count: "total" }, { $addFields: { page: page } } 
      ],
      data: data
    } 
  }

  const pipeline = [ 
    filterOrder, 
    sort, 
    facet
  ]

	try{
		var lazada = await database.lazadaOrderCol().aggregate(pipeline).toArray()
	}catch(e){
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: lazada
	})
}

async function otherSource(req, res){

	let page = defaultPage
  let recordPerPage = defaultRecordPerPage

  if(req.query.page){
    page = parseInt(req.query.page)
  }
  if(req.query.limit){
    recordPerPage = parseInt(req.query.limit)
  }

	let filterOrder = {
		'shopId': req.params.shopId
	}

  let newFieldForGrouping_googleSheet = {
    tempDate: { 
      $dateFromString: {
        dateString: "$Date_Request" 
      }
    }
  }

  const pipeline = [
    {"$match": filterOrder}, 
    {"$addFields": newFieldForGrouping_googleSheet}
  ]

  if(req.query.from){
    let from = new Date(req.query.from)
    let gte = from.getTime() + 7 * 60 * 60 * 1000
    pipeline.push({"$match": {tempDate: {'$gte': new Date(gte)}}})
  }

  if(req.query.to){
    let to = new Date(req.query.to)
    let lte = to.getTime() + 7 * 60 * 60 * 1000
    pipeline.push({"$match": {tempDate: {'$lte': new Date(lte)}}})
  }

  const sort = { 
    'tempDate' : -1
  }

  pipeline.push({'$sort': sort})

	let data = []

  if(page > 1 && req.query.limit){
    let skip = (page - 1) * recordPerPage
    data.push({ "$skip": skip })
  }
  data.push({ "$limit": recordPerPage })

  let facet = { 
    metadata: [ 
      { $count: "total" }, 
      { $addFields: { page: page } } 
    ],
    data: data
  }

  pipeline.push({'$facet': facet})

	try{
		var orders = await database.productSheetCol().aggregate(pipeline).toArray()
	}catch(e){
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: orders
	})
}

module.exports = {
	shopeeOrder: shopeeOrder,
	lazadaOrder: lazadaOrder,
	otherSource: otherSource,
  tikiOrder: tikiOrder,
  sendoOrder: sendoOrder
}