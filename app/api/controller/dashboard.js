const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')


async function _revenueByMarket(req, res){

	let rolePermission = req.user.role.permissions

	// if(!rolePermission.includes('revenueStat')){
	// 	return res.json({
	// 		err: 1,
	// 		errMsg: 'not authorize',
	// 		result: null
	// 	})
	// }

	let groupBy = {
  	year: {
      $year: '$tempDate'
    }
  }
  switch(req.query.groupby){
  	case 'month':
  		groupBy['month'] = {$month: '$tempDate' }
  		break;
  	case 'day':
  		groupBy['month'] = {$month: '$tempDate' }
  		groupBy['dayOfMonth'] = {$dayOfMonth: '$tempDate' }
  		break;
  	case 'hour':
  		groupBy['month'] = {$month: '$tempDate' }
  		groupBy['dayOfMonth'] = {$dayOfMonth: '$tempDate' }
  		groupBy['hour'] = {$hour: '$tempDate' }
  		break;
  }

  let shopee = null
  async function shopeeRevenue(){
  	let filterOrder_shopee = {
			$match: {
				'create_time': {
					'$gte': req.query.from, 
					'$lte': req.query.to,
				},
				'brandId': req.params.brandId,
				'order_status': {"$ne": 'UNPAID'}
			}
		}

		let gmv_order_shopee = {
			$match: {
				order_status: {"$nin": ['CANCELLED', 'TO_RETURN']}
			}
		}

		let CANCELLED_order_shopee = {
			$match: {
				order_status: 'CANCELLED'
			}
		}

		let escrow_amount_order_shopee = {
			$match: {
				escrow_amount: '0'
			}
		}

		let newFieldForGrouping_shopee = {
	 		$addFields: {
	      tempDate: { 
	      	$dateFromString: {
	  		    dateString: "$create_time" 
	  			}
	  		}
	    }
	  }

	  let revenue_shopee = 
	  	{
		    $group: {
	        _id: groupBy,
	        totalAmount: { $sum: '$total_amount' },
	        count: { $sum: 1 }
		    }
		  }
	  

	  let group_order_by_status_shopee = {
	    $group: {
      	_id: '$order_status',
      	totalAmount: { $sum: '$total_amount' },
      	count: { $sum: 1 }
	    }
	  }
	  
		let pipeline_shopee = [ 
			filterOrder_shopee
			,newFieldForGrouping_shopee
	 		,{ 
	 			$facet: {
		      grantTotal: [revenue_shopee],
		      lostRevenue: [CANCELLED_order_shopee, revenue_shopee],
		      gmv: [gmv_order_shopee, revenue_shopee],
		      status: [group_order_by_status_shopee],
		      escrowAmount: [escrow_amount_order_shopee, group_order_by_status_shopee]
		   	}
			}
	  ]

	  try{
			shopee = await database.shopeeOrderCol().aggregate(pipeline_shopee).toArray()
		}catch(e){
			console.log(e)
		}
  }

  let sendo = null
  async function sendoRevenue(){

  	let filterOrder_sendo = {
			$match: {
				'eceOrderDate': {
	 				'$gte': new Date(req.query.from), 
	 				'$lte': new Date(req.query.to),
				},
				'brandId': req.params.brandId
			}
		}

		let newFieldForGrouping_sendo = {
	 		$addFields: {
	      tempDate: '$eceOrderDate'
	  		
	    }
	  }

	  let gmv_order_sendo = {
			$match: {
				'sales_order.order_status': {"$nin": [13]}
			}
		}

	  let revenue_sendo = {
	    $group: {
        _id: groupBy,
        totalAmount: { $sum: '$sales_order.total_amount' },
        count: { $sum: 1 }
	    }
	  }


	  let orderState_sendo =  {
	    $group: {
       _id: '$sales_order.order_status',
       totalAmount: { $sum: '$sales_order.total_amount' },
       count: { $sum: 1 }
	    }
	  }
	  

		let pipelineSendo = [ 
			filterOrder_sendo,
			newFieldForGrouping_sendo
	 		,{ 
	 			$facet: {
		      grantTotal: [revenue_sendo],
		      gmv: [gmv_order_sendo, revenue_sendo],
		      status: [orderState_sendo]
		    }
			}
	  ]

	  try{
		  sendo = await database.sendoOrderCol().aggregate(pipelineSendo).toArray()
		}catch(e){
			console.log(e)
		}

		
  }

  let lazada = null
	async function lazadaRevenue(){

		let grantTotal_lazada_order = {
	 		$match: {
	 			'created_at': {
	 				'$gte': req.query.from, 
	 				'$lte': req.query.to,
				},
	 			'brandId': req.params.brandId
	 		}
	 	}

	 	let gmv_lazada_order = {
	 		$match: {
	 			"statuses": { "$nin": ['canceled', 'returned', 'failed'] }
	 		}
	 	}

	 	let canceled_lazada_order = {
	 		$match: {
	 			"statuses": 'canceled'
	 		}
	 	}

	 	let newFieldForGrouping_lazada = {
	 		$addFields: {
	      tempDate: { 
	      	$dateFromString: {
	  		    dateString: "$created_at" 
	  			}
	  		},

	  		// convertedPrice: { 
	  		// 	$reduce: {
	    //       input: "$items",
	    //       initialValue: {sum: 0},
	    //       in: { sum: {$sum: [ "$$value.sum", "$$this.paid_price" ] }}
	    //     } 
	  		// }
	    }
	  }

	  let revenueGroupByTime = 
	  	{
		    $group: {
		      _id: groupBy,
		      totalAmount: { $sum: '$ecePrice' },
		      count: { $sum: 1 }
		    }
		  }
	  

	  // let gmv = [ 
	  // 	{
		 //    $group: {
		 //      _id: groupBy,
		 //      totalAmount: { $sum: '$convertedPrice.sum' },
		 //      count: { $sum: 1 }
		 //    }
		 //  }
	  // ]

	  let status_lazada = {
	    $group: {
      	_id: '$statuses',
      	totalAmount: { $sum: '$ecePrice' },
      	count: { $sum: 1 }
	    }
	  }
	  

		let pipelineLazada = [ 
			grantTotal_lazada_order,
	 		newFieldForGrouping_lazada,

	 		{ 
	 			$facet: {
		      grantTotal: [revenueGroupByTime],
		      gmv: [gmv_lazada_order, revenueGroupByTime],
		      lostRevenue: [canceled_lazada_order, revenueGroupByTime],
		      status: [status_lazada]
		    }
			}
	  ]

	  try{
			lazada = await database.lazadaOrderCol().aggregate(pipelineLazada).toArray()
		}catch(e){
			console.log(e)
		}
	}

	let tiki = null
	async function tikiRevenue(){

		let grantTotal_tiki_order = {
	 		$match: {
	 			'created_at': {
	 				'$gte': req.query.from, 
	 				'$lte': req.query.to,
				},
	 			'brandId': req.params.brandId
	 		}
	 	}

	 	let gmv_tiki_order = {
	 		$match: {
	 			"statuses": { "$nin": ['canceled', 'returned', 'failed'] }
	 		}
	 	}

	 	let canceled_tiki_order = {
	 		$match: {
	 			"statuses": 'canceled'
	 		}
	 	}

	 	let newFieldForGrouping_tiki = {
	 		$addFields: {
	      tempDate: { 
	      	$dateFromString: {
	  		    dateString: "$created_at" 
	  			}
	  		},

	  		// convertedPrice: { 
	  		// 	$reduce: {
	    //       input: "$items",
	    //       initialValue: {sum: 0},
	    //       in: { sum: {$sum: [ "$$value.sum", "$$this.paid_price" ] }}
	    //     } 
	  		// }
	    }
	  }

	  let revenueGroupByTime = 
	  	{
		    $group: {
		      _id: groupBy,
		      totalAmount: { $sum: '$invoice.total_seller_income' },
		      count: { $sum: 1 }
		    }
		  }
	  

	  // let gmv = [ 
	  // 	{
		 //    $group: {
		 //      _id: groupBy,
		 //      totalAmount: { $sum: '$convertedPrice.sum' },
		 //      count: { $sum: 1 }
		 //    }
		 //  }
	  // ]

	  let status_tiki = {
	    $group: {
      	_id: '$status',
      	totalAmount: { $sum: '$invoice.total_seller_income' },
      	count: { $sum: 1 }
	    }
	  }
	  

		let pipelineTiki = [ 
			grantTotal_tiki_order,
	 		newFieldForGrouping_tiki,

	 		{ 
	 			$facet: {
		      grantTotal: [revenueGroupByTime],
		      gmv: [gmv_tiki_order, revenueGroupByTime],
		      lostRevenue: [canceled_tiki_order, revenueGroupByTime],
		      status: [status_tiki]
		    }
			}
	  ]

	  try{
			tiki = await database.tikiOrderCol().aggregate(pipelineTiki).toArray()
		}catch(e){
			console.log(e)
		}
	}

	let googleSheet = [
		{
			grantTotal: [],
			lostRevenue: [],
			gmv: [],
			status: []
		}
	]
	async function googleSheetRevenue(){

		let brandFilter = {
			'brandId': req.params.brandId
		}
		
	 	let newFieldForGrouping_googleSheet = {
	 		tempDate: { 
      	$dateFromString: {
  		    dateString: "$Date_Request" 
  			}
  		}
	  }

	  let from = new Date(req.query.from)
	  let to = new Date(req.query.to)

	  let timeFilter = {
 			'tempDate': {
 				'$gte': new Date(from.getTime() + 7 * 60 * 60 * 1000), 
 				'$lte': new Date(to.getTime() + 7 * 60 * 60 * 1000), 
			}
	 	}

	 	let remove_canceled_status = {
	 		$match: {
	 			"Status": { "$ne": 'canceled' }
	 		}
	 	}

	 	let canceled_googleSheet = {
	 		$match: {
	 			"Status": 'canceled'
	 		}
	 	}

	  let group_time_source = {
	    $group: {
	      _id: {time: groupBy, source: '$shopId'},
	      totalAmount: { $sum: '$Paid_Price' },
	      count: { $sum: 1 }
	    }
	  }
	  

	  let status_googleSheet = {
	    $group: {
      	_id: {status: '$Status', source: '$shopId'},
      	totalAmount: { $sum: '$Paid_Price' },
      	count: { $sum: 1 }
	    }
	  }
	  

		let pipelineGoogleSheet = [ 
			{"$match": brandFilter},
			{"$addFields": newFieldForGrouping_googleSheet},
			{"$match": timeFilter},
	 		{ 
	 			"$facet": {
		      grantTotal: [group_time_source],
		      lostRevenue: [canceled_googleSheet, group_time_source],
		      gmv: [remove_canceled_status, group_time_source],
		      status: [status_googleSheet]
		    }
			}
	  ]

	  try{
			googleSheet = await database.productSheetCol().aggregate(pipelineGoogleSheet).toArray()
		}catch(e){
			console.log(e)
		}
	}

	await shopeeRevenue()
	await sendoRevenue()
	await lazadaRevenue()
	await tikiRevenue()
	await googleSheetRevenue()

	let temp = {

	}

	googleSheet[0].grantTotal.map(function(e){
		if(temp[e._id.source]){
			temp[e._id.source]['grantTotal'].push({
				_id : e._id.time,
				totalAmount: e.totalAmount,
				count: e.count
			})

		}else{
			temp[e._id.source] = {
				'grantTotal': [{
					_id : e._id.time,
					totalAmount: e.totalAmount,
					count: e.count
				}],
				'gmv': [],
				'lostRevenue': [],
				'status': []
			}
		}
	})

	googleSheet[0].gmv.map(function(e){
		temp[e._id.source]['gmv'].push({
			_id : e._id.time,
			totalAmount: e.totalAmount,
			count: e.count
		})
	})

	googleSheet[0].lostRevenue.map(function(e){
		temp[e._id.source]['lostRevenue'].push({
			_id : e._id.time,
			totalAmount: e.totalAmount,
			count: e.count
		})
	})

	googleSheet[0].status.map(function(e){
		if(temp[e._id.source]){

			temp[e._id.source]['status'].push({
				_id : e._id.status,
				totalAmount: e.totalAmount,
				count: e.count
			})
			
		}
	})

	let result = Object.assign(temp, {
		lazada: lazada[0],
		shopee: shopee[0],
		tiki: tiki[0],
		sendo: sendo[0]
	})

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

module.exports = {
	revenueByMarket: _revenueByMarket
}