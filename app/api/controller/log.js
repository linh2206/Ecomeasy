const database = require('../../database/database')


async function listing(req, res){
	let rolePermission = req.user.role.permissions

	let query, projection, paging, recordPerPage, sortBy;
	if(rolePermission.includes('readAllBrand')){
		query = {}
		projection = {}
	}else if(rolePermission.includes('readAdminBrand')){
		query = {
			"admins.email" : req.user.email,
			"admins.role": 'brandAdmin'
		}
		projection = {}
	}else if(rolePermission.includes('readOwnerBrand')){
		query = {
			"admins.email" : req.user.email,
			"admins.role": 'brandOwner'
		}
		projection = {}
	}

	let filter = {
		$match: query
	}

	let addField = {
		$addFields: {
      convertedId: { $toString: "$_id" }
   	}
	}

	const lookupShop = {
    $lookup: {
      from: 'shop',
      localField: 'convertedId',
      foreignField: 'brandId',
      as: 'shops'
    }
  }

  const sort = { $sort: { created: -1 } }

  const pipeline = [filter, addField, lookupShop]

  try{
    var brands = await database.brandCol().aggregate(pipeline).toArray()
  }catch(e){
    console.log(e)
  }

  let _shopIds = []
  brands.map(function(brand){
  	brand.shops.map(function(shop){
  		_shopIds.push(shop._id)
  	})
  })

  console.log(_shopIds)

  try{
    var logs = await database.jobCol().find({"reference.shop._id": {'$in': _shopIds}}).toArray()
  }catch(e){
    console.log(e)
  }

  res.json({
  	err: null,
  	errMsg: null,
  	result: logs
  })

}

module.exports = {
  listing: listing
}