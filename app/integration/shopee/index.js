const shopee = require('./shopee_client')
const google = require('../google/google.js')

const shopeeSrcDes = {
	shop_id: '118940443',
	spreadsheet: "17h7nAaZdQOXWU43dxe5FF-Q5ZFfGwGjMdqcHS2K08b0",
	spreadsheetName: "Copy of Shopee Order",
  sheet: "test",
  range: "N2:BZ100",
  gid: 1411254108
}

async function shopeeHandler(params, res){
	shopee.authenticateShop(params.brand)

	console.log(new Date(2020, 2, 1, 0, 0, 0).getTime())

	let from = new Date(2020, 4, 1, 0, 0, 0).getTime()/1000
	let to = (new Date(2020, 4, 15, 0, 0, 0).getTime()/1000)

	const listOrderInfo = await shopee.listOrder(from, to)
	var chunkOrders = []

	var listOrderDetail = []
	var i = 0
	var values = []

	return chunk()

	function chunk() {

		while(listOrderInfo.length > 0 && chunkOrders.length < 50){
			chunkOrders.push(listOrderInfo.shift())
		}

		return getDetail()
	}

	async function getDetail() {
		console.log('getDetail')
		let ids = chunkOrders.map(function(el) {
			return el.ordersn
		})

		let data = await shopee.orderDetail(ids)

		listOrderDetail = listOrderDetail.concat(data)

		chunkOrders.length = 0

		if(listOrderInfo.length > 0){
			return chunk()
		}

		getEscrowDetail()
	}

	async function getEscrowDetail() {
		console.log('getEscrowDetail', i)
		let ordersn = listOrderDetail[i].ordersn
		let data = await shopee.getEscrowDetail(ordersn)
		listOrderDetail[i]['escrow'] = data
		if(i == (listOrderDetail.length - 1)){
			parseValue()
		}else{
			i += 1
			getEscrowDetail()
		}
	}

	
	async function parseValue() {
		listOrderDetail.map(function(order){
			order.items.map(function(product){
				values.push([
					order.ordersn,
					'',
					order.create_time,
					order.order_status,
					'',
					order.tracking_no,
					order.shipping_carrier,
					'',
					'',
					order.ship_by_date,
					'',
					'',
					'',
					product.item_sku,
					product.item_name,
					product.weight,
					'',
					product.weight,
					product.item_id,
					product.variation_sku,
					product.variation_original_price,
					product.variation_discounted_price,
					'',
					'',
					'',
					product.variation_quantity_purchased, //S??? l?????ng
					'', //Product Subtotal
					'',  //Ti???n ????n h??ng (VND)
					product.promotion_id, //M?? gi???m gi?? c???a Shop
					'', //Ho??n Xu
					'', //Shopee Voucher
					'', //Ch??? ti??u combo khuy???n m??i
					'', //Gi???m gi?? t??? combo Shopee
					'', //Gi???m gi?? t??? Combo c???a Shop
					'', //Shopee Xu ????????c hoa??n
					'', //S???? ti????n ????????c gia??m khi thanh toa??n b????ng the?? Ghi n????
					'', //Phi?? v????n chuy????n (d???? ki????n)
					'', //Phi?? v????n chuy????n ma?? ng??????i mua tra??
					'', //T????ng s???? ti????n
					'', //Th???i gian ho??n th??nh ????n h??ng
					'', //Th???i gian ????n h??ng ???????c thanh to??n
					'', //Ph????ng th???c thanh to??n
					'', //Ph?? c??? ?????nh
					'', //Ph?? D???ch V???	
					'', //Ph?? giao d???ch	
					'', //Ti???n k?? qu???	
					'', //Username (Buyer)	
					'', //T??n Ng?????i nh???n	
					'', //S??? ??i???n tho???i	
					'', //T???nh/Th??nh ph???	
					'', //TP / Qu???n / Huy???n	
					'', //District	
					'', //?????a ch??? nh???n h??ng	
					'', //Qu???c gia	
					'', //Ghi ch??


				])
			})
		})

		await google.clearOldData(shopeeSrcDes);

		console.log(values)

		await google.updateDataToCurrentSheet(values, shopeeSrcDes);

		res.redirect(`https://docs.google.com/spreadsheets/d/${shopeeSrcDes.spreadsheet}/edit#gid=${shopeeSrcDes.gid}`)
	}  
}

module.exports = {
	shopeeHandler: shopeeHandler
}