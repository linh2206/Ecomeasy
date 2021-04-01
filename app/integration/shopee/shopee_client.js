const ShopeeClient = require('shopee-client').default;

const credentials = require('../../config/config_shopee.json')
const {partner_id, secretKey} = credentials;

let partner_key = secretKey
let client = null

//authenticateShop(118940443)
async function authenticateShop(shop_id){
	client = new ShopeeClient({
	  is_uat: false,
	  shop_id: shop_id,
	  partner_id: partner_id,
	  partner_key: partner_key
	})

	return
}

async function getItems(from, to){

	let query = {
		pagination_offset: 0,
		pagination_entries_per_page: 3
	}
	
	try{
		var list = await client.item.getItemsList(query)
	}catch(e){
		console.log(e)
	}

	try{
		var detail = await client.item.getItemDetail(list.items[0].item_id)
	}catch(e){
		console.log(e)
	}

	return detail

	// try{
	// 	var response = await client.toppick.getTopPick();
	// 	console.log(response)
	// }catch(e){
	// 	console.log(e)
	// }
}

async function getItemDetail(item_id){

	try{
		var detail = await client.item.getItemDetail(item_id)
	}catch(e){
		console.log(e)
	}

	return detail.item

	// try{
	// 	var response = await client.toppick.getTopPick();
	// 	console.log(response)
	// }catch(e){
	// 	console.log(e)
	// }
}

async function listOrder(from, to, pagination_entries_per_page, pagination_offset){
	return client.order.getOrderList({
			create_time_from: from,
			create_time_to: to,
			pagination_entries_per_page: pagination_entries_per_page,
			pagination_offset: pagination_offset
		});
	
	// try{
	// 	var response = await client.order.getOrderList({
	// 		create_time_from: from,
	// 		create_time_to: to
	// 	});
	// }catch(e){
	// 	console.log('listOrder', e)
	// 	return []
	// }

	// return response.orders
}

async function orderDetail(ordersn_list) {
	return client.order.getOrderDetail(ordersn_list);


	//return response.orders
}

async function getEscrowDetail(ordersn){
	try{
		var response = await client.order.getEscrowDetail(ordersn);
	}catch(e){
		console.log(e)
	}

	return response.orders
}

async function getShopInfo(shop_id){
	try{
		var shop = await client.shop.getShop(shop_id)
	}catch(e){
		console.log(e)
	}

	return shop
}

module.exports = {
	authenticateShop: authenticateShop,
	listOrder: listOrder,
	orderDetail: orderDetail,
	getEscrowDetail: getEscrowDetail,
	getItems: getItems,
	getItemDetail: getItemDetail,
	getShopInfo: getShopInfo
}

