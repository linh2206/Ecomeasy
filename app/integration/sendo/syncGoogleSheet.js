const sendo = require('./sendo')
const google = require('../google/google.js')

const _src_des = {
  YvesRocher_Sendo: {
    tokenByShop: "a89e8ade720445d9bccb4bbd3f8c5f42",
    //spreadsheet: "1v5dy6qPKsWqKYM17IBuiKutXY4fZacP1TRfcxCyXAbY",
    spreadsheet: '1zMOv5WU9eqULUKycLB7lALYJBMZS5M_jTpWozpHDb7k',
    spreadsheetName: "Copy of Sendo Order",
    sheet: "YvesRocher",
    range: "P2:BZ100",
    //gid: 1763106554
    gid: 1763106554
  },

	Adiva_Sendo: {
    tokenByShop: "bmk32b8d5jvoki085a7g",
    //spreadsheet: "1v5dy6qPKsWqKYM17IBuiKutXY4fZacP1TRfcxCyXAbY",
    spreadsheet: '1zMOv5WU9eqULUKycLB7lALYJBMZS5M_jTpWozpHDb7k',
    spreadsheetName: "Copy of Sendo Order",
    sheet: "ADIVA",
    range: "P2:BZ100",
    //gid: 1693762615
    gid: 1693762615
  },

  Vcn_Sendo: {
    tokenByShop: "bnecma8d5jvp6iovb990",
    //spreadsheet: "1v5dy6qPKsWqKYM17IBuiKutXY4fZacP1TRfcxCyXAbY",
    spreadsheet: '1zMOv5WU9eqULUKycLB7lALYJBMZS5M_jTpWozpHDb7k',
    spreadsheetName: "Copy of Sendo Order",
    sheet: "VCN",
    range: "P2:BZ100",
    //gid: 1411254108
    gid: 1411254108
  },
}


async function sendoHandler(params, res){
	sendo.authentication(_src_des, params, authenticationCb)

	let token = null
	let listOrder = []
	function authenticationCb(_token){
		token = _token
		sendo.getListOrder(params, token, getListOrderCb);
	}

	async function getListOrderCb(_listOrder){
		listOrder = _listOrder

		if(listOrder.length == 0){
			return res.redirect(`https://docs.google.com/spreadsheets/d/${_src_des[params.key].spreadsheet}/edit#gid=${_src_des[params.key].gid}`)

		}
		
		var order = listOrder.shift()

		sendo.getOrderDetail(token, order.salesOrder.orderNumber, getOrderDetailCb)

	}

	let values = []
	async function getOrderDetailCb(orderDetail){
		orderDetail.salesOrderDetails.map(function(product){
			values.push([
				orderDetail.salesOrder.orderNumber,
				product.productVariantId,
				product.productName,
				orderDetail.salesOrder.receiverAddress,
				orderDetail.salesOrder.orderDate,
				product.quantity,
				product.price,
				sendo.parseOrderStatus(orderDetail.salesOrder.orderStatus),
				sendo.parsePaymentMethod(orderDetail.salesOrder.paymentMethod),
				sendo.parsePaymentStatus(orderDetail.salesOrder.paymentStatus),
				orderDetail.salesOrder.paymentStatusDate,
				product.subTotal,
				'',
				orderDetail.salesOrder.senpayFreeShipping,
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				'',
				orderDetail.salesOrder.canceledDate,
				orderDetail.salesOrder.reasonCancelCode

			])
		})


		if(listOrder.length > 0){
			var order = listOrder.shift()

			return sendo.getOrderDetail(token, order.salesOrder.orderNumber, getOrderDetailCb)
		}

		await google.clearOldData(_src_des[params.key]);

		console.log(values)

  	await google.updateDataToCurrentSheet(values, _src_des[params.key]);

  	res.redirect(`https://docs.google.com/spreadsheets/d/${_src_des[params.key].spreadsheet}/edit#gid=${_src_des[params.key].gid}`)
	}
}

module.exports = {
	sendoHandler: sendoHandler
}