const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')

async function revenueByMarket(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {

	}else if(rolePermission.includes('internalReport')){
		
	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: null
		})
	}

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
  async function shopeeCollections(){
  	let filterOrder_shopee = {
			$match: {
				'create_time': {
					'$gte': req.query.from, 
					'$lte': req.query.to,
				},
				'order_status': {"$ne": 'UNPAID'}
			}
		}

		let gmv_order_shopee = {
			$match: {
				order_status: {"$nin": ['CANCELLED', 'TO_RETURN']}
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

	  let revenue_shopee_group_time_brand = {
	    $group: {
        _id: {time: groupBy, brandId: '$brandId'},
        totalAmount: { $sum: '$total_amount' },
        count: { $sum: 1 }
	    }
	  }

	  let revenue_shopee_group_brand = {
	    $group: {
        _id: '$brandId',
        totalAmount: { $sum: '$total_amount' },
        count: { $sum: 1 }
	    }
	  }

	  let revenue_shopee_group_source = {
	    $group: {
        _id: '$shopId',
        marketplace: { $first: '$marketplace' },
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

	  let revenue_shopee_group_status_brand = {
	    $group: {
        _id: {status: '$order_status', brandId: '$brandId'},
        totalAmount: { $sum: '$total_amount' },
        count: { $sum: 1 }
	    }
	  }
	  
		let pipeline_shopee = [ 
			filterOrder_shopee
			,newFieldForGrouping_shopee
	 		,{ 
	 			$facet: {
		      revenueGroupByTimeBrand: [revenue_shopee_group_time_brand],
		      revenueGroupByStatusBrand: [revenue_shopee_group_status_brand],
		      revenueGroupBrand: [revenue_shopee_group_brand],
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
  async function sendoCollections(){

  	let filterOrder_sendo = {
			$match: {
				'eceOrderDate': {
	 				'$gte': new Date(req.query.from), 
	 				'$lte': new Date(req.query.to),
				},
			}
		}

		let newFieldForGrouping_sendo = {
	 		$addFields: {
	      'tempDate': "$eceOrderDate"
	    }
	  }

	  let revenueGroupByTimeBrand = {
	    $group: {
        _id: {time: groupBy, brandId: '$brandId'},
        totalAmount: { $sum: '$sales_order.total_amount' },
        count: { $sum: 1 }
	    }
	  }

	  let revenueGroupByStatusBrand =  {
	    $group: {
       _id: {status: '$sales_order.order_status', brandId: '$brandId' },
       totalAmount: { $sum: '$sales_order.total_amount' },
       count: { $sum: 1 }
	    }
	  }

	  let revenueGroupBrand = {
	    $group: {
	      _id: '$brandId',
	      totalAmount: { $sum: '$sales_order.total_amount' },
	      count: { $sum: 1 }
	    }
	  }
	  

		let pipelineSendo = [ 
			filterOrder_sendo
	 		,newFieldForGrouping_sendo
	 		,{ 
	 			$facet: {
		      revenueGroupByTimeBrand: [revenueGroupByTimeBrand],
		      revenueGroupByStatusBrand: [revenueGroupByStatusBrand],
		      revenueGroupBrand: [revenueGroupBrand],
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
	async function lazadaCollections(){

		let lazada_order_by_time = {
	 		$match: {
	 			'created_at': {
	 				'$gte': req.query.from, 
	 				'$lte': req.query.to,
				},
	 		}
	 	}

	 	let gmv_lazada_order = {
	 		$match: {
	 			"statuses": { "$nin": ['canceled', 'returned', 'failed'] }
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

	  let revenueGroupByTimeBrand = {
	    $group: {
	      _id: {time: groupBy, brandId: '$brandId'},
	      totalAmount: { $sum: '$ecePrice' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupByStatusBrand = {
	    $group: {
	      _id: {status: '$statuses', brandId: '$brandId'},
	      totalAmount: { $sum: '$ecePrice' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupBrand = {
	    $group: {
	      _id: '$brandId',
	      totalAmount: { $sum: '$ecePrice' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupShop = {
	    $group: {
	      _id: '$shopId',
	      marketplace: { $first: '$marketplace' },
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
			lazada_order_by_time,
	 		newFieldForGrouping_lazada,

	 		{ 
	 			$facet: {
		      revenueGroupByTimeBrand: [revenueGroupByTimeBrand],
		      revenueGroupByStatusBrand: [revenueGroupByStatusBrand],
		      revenueGroupBrand: [revenueGroupBrand],
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
	async function tikiCollections(){

		let tiki_order_by_time = {
	 		$match: {
	 			'created_at': {
	 				'$gte': req.query.from, 
	 				'$lte': req.query.to,
				},
	 		}
	 	}

	 	let gmv_tiki_order = {
	 		$match: {
	 			"statuses": { "$nin": ['canceled', 'returned', 'failed'] }
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

	  let revenueGroupByTimeBrand = {
	    $group: {
	      _id: {time: groupBy, brandId: '$brandId'},
	      totalAmount: { $sum: '$invoice.total_seller_income' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupByStatusBrand = {
	    $group: {
	      _id: {status: '$statuses', brandId: '$brandId'},
	      totalAmount: { $sum: '$invoice.total_seller_income' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupBrand = {
	    $group: {
	      _id: '$brandId',
	      totalAmount: { $sum: '$invoice.total_seller_income' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupShop = {
	    $group: {
	      _id: '$shopId',
	      marketplace: { $first: '$marketplace' },
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
      	_id: '$statuses',
      	totalAmount: { $sum: '$invoice.total_seller_income' },
      	count: { $sum: 1 }
	    }
	  }
	  

		let pipelineTiki = [ 
			tiki_order_by_time,
	 		newFieldForGrouping_tiki,

	 		{ 
	 			$facet: {
		      revenueGroupByTimeBrand: [revenueGroupByTimeBrand],
		      revenueGroupByStatusBrand: [revenueGroupByStatusBrand],
		      revenueGroupBrand: [revenueGroupBrand],
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
	async function productSheetCollections(){
		
	 	let newFieldForGrouping_googleSheet = {
	 		$addFields: {
	      tempDate: { 
	      	$dateFromString: {
	  		    dateString: "$Date_Request" 
	  			}
	  		},
	    }
	  }

	  let itemQueryByTime = {
	 		$match: {
	 			'tempDate': {
	 				'$gte': new Date(req.query.from), 
	 				'$lte': new Date(req.query.to),
				},
	 		}
	 	}

	 	let gmv_googleSheet = {
	 		$match: {
	 			"Status": { "$ne": 'canceled' }
	 		}
	 	}

	  let revenue_googleSheet_time_brand = {
	    $group: {
	      _id: {time: groupBy, brandId: '$brandId'},
	      totalAmount: { $sum: '$Paid_Price' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupBrand = {
	    $group: {
	      _id: '$brandId',
	      totalAmount: { $sum: '$Paid_Price' },
	      count: { $sum: 1 }
	    }
	  }

	  let revenueGroupShop = {
	    $group: {
	      _id: '$shopId',
	      marketplace: { $first: '$marketplace' },
	      totalAmount: { $sum: '$Paid_Price' },
	      count: { $sum: 1 }
	    }
	  }
	  

	  let status_googleSheet = {
	    $group: {
      	_id: '$Status',
      	totalAmount: { $sum: '$Paid_Price' },
      	count: { $sum: 1 }
	    }
	  }

	  let revenueItemStatusBrand = {
	    $group: {
	      _id: {status: '$Status', brandId: '$brandId'},
	      totalAmount: { $sum: '$Paid_Price' },
	      count: { $sum: 1 }
	    }
	  }
	  

		let pipelineGoogleSheet = [ 
			newFieldForGrouping_googleSheet,
			itemQueryByTime,
	 		{ 
	 			$facet: {
		      revenueGroupByTimeBrand: [revenue_googleSheet_time_brand],
		      revenueGroupByStatusBrand: [revenueItemStatusBrand],
		      revenueGroupBrand: [revenueGroupBrand],
		    }
			}
	  ]

	  try{
			googleSheet = await database.productSheetCol().aggregate(pipelineGoogleSheet).toArray()
		}catch(e){
			console.log(e)
		}
	}

	await lazadaCollections()
	await shopeeCollections()
	await sendoCollections()
	await productSheetCollections()
	//await tikiCollections()


	res.json({
		err: null,
		errMsg: null,
		result: {
			lazada: lazada,
			shopee: shopee,
			sendo: sendo,
			others: googleSheet
		}
	})
}

module.exports = {
	revenueByMarket: revenueByMarket
}