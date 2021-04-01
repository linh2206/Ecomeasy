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
					product.variation_quantity_purchased, //Số lượng
					'', //Product Subtotal
					'',  //Tiền đơn hàng (VND)
					product.promotion_id, //Mã giảm giá của Shop
					'', //Hoàn Xu
					'', //Shopee Voucher
					'', //Chỉ tiêu combo khuyến mãi
					'', //Giảm giá từ combo Shopee
					'', //Giảm giá từ Combo của Shop
					'', //Shopee Xu được hoàn
					'', //Số tiền được giảm khi thanh toán bằng thẻ Ghi nợ
					'', //Phí vận chuyển (dự kiến)
					'', //Phí vận chuyển mà người mua trả
					'', //Tổng số tiền
					'', //Thời gian hoàn thành đơn hàng
					'', //Thời gian đơn hàng được thanh toán
					'', //Phương thức thanh toán
					'', //Phí cố định
					'', //Phí Dịch Vụ	
					'', //Phí giao dịch	
					'', //Tiền ký quỹ	
					'', //Username (Buyer)	
					'', //Tên Người nhận	
					'', //Số điện thoại	
					'', //Tỉnh/Thành phố	
					'', //TP / Quận / Huyện	
					'', //District	
					'', //Địa chỉ nhận hàng	
					'', //Quốc gia	
					'', //Ghi chú


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