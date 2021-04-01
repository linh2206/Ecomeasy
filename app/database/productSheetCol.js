const database = require('./database')

function BulkWriteGoogleSpreadsheet() {
	let values = []

	return {
		deleteOldValue: async function (filter) {
			let options = {}
			await database.productSheetCol().deleteMany(filter, options)
		},

		buildNewValueFromArrayOfRow: function (orders, shop) {
			orders.map(function(row){
		    try{
		      var Date_Request = new Date(row[0]).toISOString()
		    }catch(e){
		      console.log(e)
		      console.log(row)
		      console.log(shop)
		    }

		    if(Date_Request){
		      try {
		        var order = {
		          "Date_Request": row[0], //A
		          "Marketplace": row[1], //B
		          "Brand": row[2], //C
		          "Order_Number": row[3], //D
		          "Shipping_Code": row[4], //E
		          "Seller_SKU": row[5], //F
		          "Item_Name": row[6], //G
		          "Unit_Price": parseInt(row[8]), //I
		          "Paid_Price": parseInt(row[9]), //J
		          "Total": parseInt(row[11]), //L
		          "Created": row[12], //M
		          "Deliver_Time": row[16], //Q
		          "Status": row[17], //R
		          "Unique": row[21], //V
		        }
		      }catch(e){
		        console.log(row)
		        console.log(e)
		      }

		      let filter = {
		      	shopId: shop._id.toString(),
		      	Order_Number: order['Order_Number'],
		      	Date_Request: order['Date_Request'],
		      	Seller_SKU: order['Seller_SKU'],
		      	'$or': [
			        {
			          syncDate: null
			        },
			        {
			          syncDate: {'$lt': shop.syncDate}
			        }
			      ]
		      }
		      
		      Object.assign(order, {
		        brandId: shop.brandId,
		        marketplace: shop.marketplace,
		        shopId: shop._id.toString(),
		        syncDate: shop.syncDate
		      })

		      values.push({
		        // 'insertOne': {
		   
		        //   'document': order,
		        
		        // },
		        'replaceOne': {
			        'filter': filter,
			        'replacement': order,
			        'upsert': true
			      }
		      })
		    }
		  })
		},

		save: async function (callback) {
			let options = {}
			if(values.length == 0){
				return callback('no operations specified', null)
			}

			//console.log(values[0].insertOne.document)
			database.productSheetCol().bulkWrite(values, options, callback)
			values = []
		}
	}
}

function BulkWriteUploadedExcel() {
	let values = []

	return {
		deleteOldValue: async function (filter) {
			let options = {}
			await database.productSheetCol().deleteMany(filter, options)
		},

		buildNewValueFromArrayOfObject: function (orders, shop) {
			orders.map(function (data) {

				let order = {
          "Date_Request": data["Date_Request"], //A
          "Marketplace": data["Marketplace"], //B
          "Brand": data["Brand"], //C
          "Order_Number": data["Order_Number"], //D
          "Shipping_Code": data["Shipping_Code"], //E
          "Seller_SKU": data["Seller_SKU"], //F
          "Item_Name": data["Item_Name"], //G
          "Unit_Price": parseInt(data["Unit_Price"]), //I
          "Paid_Price": parseInt(data["Paid_Price"]), //J
          "Total": parseInt(data["Total"]), //L
          "Created": data["Created"], //M
          "Deliver_Time": data["Deliver_Time"], //Q
          "Status": data["Status"], //R
          "Unique": data["Unique"], //V
        }

        let filter = {
        	shopId: shop._id.toString(),
	      	Order_Number: order['Order_Number'],
	      	Date_Request: order['Date_Request'],
	      	Seller_SKU: order['Seller_SKU'],
	      	'$or': [
		        {
		          syncDate: null
		        },
		        {
		          syncDate: {'$lt': shop.syncDate}
		        }
		      ]
	      }

        Object.assign(order, {
					brandId: shop.brandId,
					marketplace: shop.marketplace,
					shopId: shop._id.toString(),
					syncDate: shop.syncDate
				})

				values.push({

	        'replaceOne': {
		        'filter': filter,
		        'replacement': order,
		        'upsert': true
		      }
	      })
			})
		},

		save: async function (callback) {
			if(values.length == 0){
				return callback('no operations specified', null)
			}

			let options = {}
			database.productSheetCol().bulkWrite(values, options, callback)
			values = []
		}
	}
}

module.exports = {
	BulkWriteGoogleSpreadsheet: BulkWriteGoogleSpreadsheet,
	BulkWriteUploadedExcel: BulkWriteUploadedExcel
}