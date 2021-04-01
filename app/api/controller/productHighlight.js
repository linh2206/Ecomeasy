const objectId = require("mongodb").ObjectID;
const database = require('../../database/database')

async function productHighlight(req, res){
	console.log(req.query)
	let pipelineShopee = [ 
		{
 			$match: {
 				create_time: {
   				'$gte': req.query.from, 
   				'$lte': req.query.to,
 				},
 				'brandId': req.params.brandId
 			}
 		},
 		{

    	$unwind: { 
    		path: "$items", preserveNullAndEmptyArrays: true 
    	}
  
 		},
 		{
		   $addFields: {
		      convertedPrice: { $toDecimal: "$items.variation_original_price" },
		      convertedQty: { $toInt: "$items.variation_quantity_purchased" },
		   }
		},
   	{
     	$group: {
        _id: '$items.item_id',
        item_name: { $first: '$items.item_name' },
        images: { $first: '$items.images' },
        marketplace: { $first: '$marketplace' },
        totalAmount: { $sum: { $multiply: [ "$convertedPrice", "$convertedQty" ] } },
        count: { $sum: 1 }
      }
   }
  ]
	let shopee = await database.shopeeOrderCol().aggregate(pipelineShopee).toArray()

	
	let pipelineLazada = [ 
		{
 			$match: {
 				created_at: {
   				'$gte': req.query.from, 
   				'$lte': req.query.to,
 				},
 				'brandId': req.params.brandId
 			}

 		},
 		{

    	$unwind: { 
    		path: "$items", preserveNullAndEmptyArrays: true 
    	}
  
 		},
   	{
    	$group:
      	{
        _id: '$items.sku',
        item_name: { $first: '$items.name' },
        images: { $first: '$items.product_main_image' },
        marketplace: { $first: '$marketplace' },
        totalAmount: { $sum: '$items.item_price' },
        count: { $sum: 1 }
      }
   	}
  ]
	let lazada = await database.lazadaOrderCol().aggregate(pipelineLazada).toArray()
   
  let pipelineGoogle = [ 
    {
      $addFields: {
        tempDate: { 
          $dateFromString: {
            dateString: "$Date_Request" 
          }
        },
      }
    },
		{
      $match: {
       'tempDate': {
         '$gte': new Date(req.query.from), 
         '$lte': new Date(req.query.to),
        },
       'brandId': req.params.brandId
      }
    },
 	
   	{
     $group:
       {
         _id: '$Seller_SKU',
         item_name: { $first: '$Item_Name' },
         marketplace: { $first: '$marketplace' },
         totalAmount: { $sum: '$Total' },
         count: { $sum: 1 }
       }
   }
  ]
	let googleSheet = await database.productSheetCol().aggregate(pipelineGoogle).toArray()


	res.json({
		err: null,
		errMsg: null,
		result: {
			googleSheet: googleSheet,
			shopee: shopee,
			lazada: lazada
		}
	})
}

module.exports = {
  productHighlight: productHighlight
}