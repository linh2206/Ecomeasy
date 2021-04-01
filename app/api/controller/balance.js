const objectId = require("mongodb").ObjectID;
const _ = require('lodash');

const database = require('../../database/database')
const bankCol = require('../../database/bankCol')
const balanceCol = require('../../database/balanceCol')

const emailService = require("../services/emailServiceSendgrid");


async function addBalance(req, res) {

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	delete req.user.role

	let data = {
		bankName: req.body.bankName,
		bankId: req.params.bankId,
		accountName: req.body.accountName,
		accountNumber: req.body.accountNumber,
		balance: parseInt(req.body.balance),
		date: new Date(req.body.date),
		createBy: req.user,
		created: new Date()
	}

	try {
		var result = await balanceCol.insertOne(data, req.user)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function editBalance(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	let filter = {
		_id: new objectId(req.params.balanceId)
	}

	let update = {
		'$set' : {
			balance: parseInt(req.body.balance)
		}
	}

	let options = {
		returnOriginal: false,
	}

	try {
		var balance = await database.balanceCol().findOneAndUpdate(filter, update, options)
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: balance.value
	})
}

async function removeBalance(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('writeFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	try {
		let result = await database.balanceCol().deleteMany({_id: new objectId(req.params.balanceId)})
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: 'ok'
	})
}

async function getBalance(req, res){
	// try {
	// 	var result = await database.balanceCol().find({}).toArray()
	// } catch (e) {
	// 	console.log(e)
	// }

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('readFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}


	let query = {
		$match: {
			date: {
				'$gte': new Date(req.query.from), 
				'$lte': new Date(req.query.to),
			}
		}
	}

	console.log(query)

	let group_by_account = {
    $group: {
    	_id: '$accountNumber',
    	balances: { $addToSet: '$$ROOT' },
    }
  }

  let pipeline = []

  if(req.query.from && req.query.to){
  	pipeline = [ 
			query,
			group_by_account
	  ]
  }else{
  	pipeline = [ 
			group_by_account
	  ]
  }

  console.log(pipeline)
  
  try{
		var result = await database.balanceCol().aggregate(pipeline).toArray()
	}catch(e){
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: result
	})
}

async function getBalanceByAccount(req, res){

	let rolePermission = req.user.role.permissions

	if (rolePermission.length == 0) {
		
	}else if(rolePermission.includes('readFinance') ){

	}else{
		return res.json({
			err: 1,
			errMsg: 'not authorize',
			result: rolePermission
		})
	}

	let query = {
		accountNumber: req.params.accountNumber
	}

	let options = {
		sort: {
			date: -1
		}
	}

	try {
		var balances = await database.balanceCol().find(query, options).toArray()
	} catch (e) {
		console.log(e)
	}

	res.json({
		err: null,
		errMsg: null,
		result: balances
	})
}

async function generateReport(req, res) {
	var offset = 7;
	var curr = new Date(new Date().getTime() + offset * 3600 * 1000), y = curr.getFullYear(), m = curr.getMonth();
	var previousMonth = m - 1
	var firstDayOfpreviousMonth = new Date(y, previousMonth, 1);
	var lastDayOfpreviousMonth = new Date(y, previousMonth + 1, 0);

	console.log('curr', curr)

	var temp = curr.getDate() - curr.getDay()
	console.log(temp, curr.getDate(), curr.getDay())
	var firstDayOfpreviousWeek = new Date((new Date(curr.setDate(temp)).getTime() - 6 * 24 * 3600 * 1000));
	var lastDateOfpreviousWeek = new Date((firstDayOfpreviousWeek.getTime() + 6 * 24 * 3600 * 1000));

	let reportType = 'week' // week | month
	if(req.query.reportType){
		reportType = req.query.reportType
	}

	let from = firstDayOfpreviousMonth
	let fromStart = new Date(firstDayOfpreviousMonth)
	fromStart.setHours(0, 0, 0, 0)
	let fromEnd = new Date(firstDayOfpreviousMonth)
	fromEnd.setHours(23, 59, 59, 999)
	// let fromStartOffset = new Date(fromStart.getTime() - offset * 3600 * 1000)
	// let fromEndOffset = new Date(fromEnd.getTime() - offset * 3600 * 1000)

	let to = lastDayOfpreviousMonth
	let toStart = new Date(lastDayOfpreviousMonth)
	toStart.setHours(0, 0, 0, 0)
	let toEnd = new Date(lastDayOfpreviousMonth)
	toEnd.setHours(23, 59, 59, 999)
	// let toStartOffset = new Date(toStart.getTime() - offset * 3600 * 1000)
	// let toEndOffset = new Date(toEnd.getTime() - offset * 3600 * 1000)

	if (reportType == 'week') {
		from = firstDayOfpreviousWeek
		fromStart = new Date(firstDayOfpreviousWeek)
		fromStart.setHours(0, 0, 0, 0)
		fromEnd = new Date(firstDayOfpreviousWeek)
		fromEnd.setHours(23, 59, 59, 999)
		// fromStartOffset = new Date(fromStart.getTime() - offset * 3600 * 1000)
		// fromEndOffset = new Date(fromEnd.getTime() - offset * 3600 * 1000)

		to = lastDateOfpreviousWeek
		toStart = new Date(lastDateOfpreviousWeek)
		toStart.setHours(0, 0, 0, 0)
		toEnd = new Date(lastDateOfpreviousWeek)
		toEnd.setHours(23, 59, 59, 999)
		// toStartOffset = new Date(toStart.getTime() - offset * 3600 * 1000)
		// toEndOffset = new Date(toEnd.getTime() - offset * 3600 * 1000)
	}

	console.log('previousFilter', fromStart, fromEnd)
	console.log('currentFilter', toStart, toEnd)


	let previousFilter = {
		$match: {
			'date': {
				//'$gte': fromStart,
				'$lte': fromEnd
			}
		}
	}

	let previousGroup = {
		$group: {
			_id: "$accountNumber",
			totalAmount: { $sum: '$balance' },
			balances: { $addToSet: '$$ROOT' }
		}
	}

	let currentFilter = {
		$match: {
			'date': {
				//'$gt': fromEnd,
				'$lte': toEnd
			}
		}
	}

	let currentGroup = {
		$group: {
			_id: "$accountNumber",
			totalAmount: { $sum: '$balance' },
			balances: { $addToSet: '$$ROOT' }
		}
	}

	let balancePipline = [
		{
			$facet: {
				previous: [previousFilter, previousGroup],
				current: [currentFilter, currentGroup]
			}
		}

	]

	try {
		var data = await database.balanceCol().aggregate(balancePipline).toArray()
	} catch (e) {
		console.log(e)
	}

	console.log(data[0].current)
	let _currentBalances = []
	let currentTotalAmount = 0
	data[0].current.map(function (accountNumber) {
		accountNumber.balances.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date);
		})

		_currentBalances.push(accountNumber.balances[0])
		currentTotalAmount = currentTotalAmount + accountNumber.balances[0].balance
	})

	data[0].current = [{
		totalAmount: currentTotalAmount,
		balances: _currentBalances
	}]

	let previousBalances = []
	let previousTotalAmount = 0
	data[0].previous.map(function (accountNumber) {
		accountNumber.balances.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date);
		})

		previousBalances.push(accountNumber.balances[0])
		previousTotalAmount = previousTotalAmount + accountNumber.balances[0].balance
	})

	data[0].previous = [{
		totalAmount: previousTotalAmount,
		balances: previousBalances
	}]

	let accountPipline = [
		{
			$unwind: {
				path: "$accounts"
			}
		},

		{

			$match: {
				'accounts.created': {
					'$gte': fromStart,
					'$lte': toEnd,
				}
			}
		},

	]

	try {
		var accounts = await database.bankCol().aggregate(accountPipline).toArray()
	} catch (e) {
		console.log(e)
	}

	let bankQuery = {
		created: {
			'$gte': fromStart,
			'$lte': toEnd
		}
	}

	try {
		var banks = await database.bankCol().find(bankQuery).toArray()
	} catch (e) {
		console.log(e)
	}

	console.log('accounts', accounts)
	console.log('banks', banks)

	let currentMonth = new Date().getMonth()
	let currentYear = new Date().getFullYear()

	let previousTotal = Number(_.get(data, '[0].previous[0].totalAmount') || 0)
	let currentTotal = Number(_.get(data, '[0].current[0].totalAmount') || 0)
	let diff = Number(currentTotal - previousTotal).toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0
	previousTotal = previousTotal.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0
	currentTotal = currentTotal.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0
	let currentBalances = _.get(data, '[0].current[0].balances') || []

	// Sort by bank name and account number
	currentBalances.sort((a, b) => {
		if (a.bankName === b.bankName)
			return a.accountNumber.localeCompare(b.accountNumber)
		return a.bankName.localeCompare(b.bankName)
	})

	let generateEmail = (monthlyTotal, monthlyHTML, bankTemplate, accountTemplate) => `
		<!DOCTYPE html
		  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1998/xhtml">
		
		<head>
		  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		  <title>Finance Report</title>
		  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
		</head>
		
		
		<body style="margin: 0; padding: 0 15px;">
		  <table style="max-width: 700px; width: 100%; margin: 0 auto;border-collapse:separate; 
			border-spacing: 0 1em;" width="100%" border="0" cellpadding="0" cellspacing="0">
			<tr>
			  <td>
				<table class="content" align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
				  <tr>
					<p>${`1. Chênh lệch từ ${new Date(from).getMonth() + 1}-${new Date(from).getDate()}-${currentYear} đến ${new Date(to).getMonth() + 1}-${new Date(to).getDate()}-${currentYear}`}</p>
				  </tr>
				  <tr>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Đầu kỳ</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Cuối kỳ</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Chênh lệch</th>
				  </tr>
				  <tr>
					<td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${previousTotal} VND</td>
					<td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${currentTotal} VND</td>
					<td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${diff} VND</td>
				  </tr>
				</table>
			  </td>
			</tr>
			<tr>
			  <td>
				<table class="content" align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
				  <tr>
				  <p>${`2. Chi tiết số dư ${new Date(toStart).getMonth() + 1}-${new Date(toStart).getDate()}-${currentYear}`}</p>
				  </tr>
				  <tr>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">STT</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Ngân hàng</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Số tài khoản</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Note</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">VND</th>
				  </tr>
				  <tr>
					<td colspan="4" style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">Tổng</td>
					<td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${monthlyTotal} VND</td>
				  </tr>
				  ${monthlyHTML}
				</table>
			  </td>
			</tr>
			<tr>
			  <td>
				<table class="content" align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
				  <tr>
					<p>3. Ngân hàng mới thêm từ ${new Date(from).getMonth() + 1}-${new Date(from).getDate()}-${currentYear} đến ${new Date(to).getMonth() + 1}-${new Date(to).getDate()}-${currentYear}</p>
				  </tr>
				  <tr>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">STT</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Ngân hàng</th>
				  <th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Ngày tạo</th>
				  </tr>
				  ${bankTemplate}
				</table>
			  </td>
			</tr>
			<tr>
			  <td>
				<table class="content" align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
				  <tr>
					<p>4. Tài khoản mới thêm từ ${new Date(from).getMonth() + 1}-${new Date(from).getDate()}-${currentYear} đến ${new Date(to).getMonth() + 1}-${new Date(to).getDate()}-${currentYear}</p>
				  </tr>
				  <tr>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">STT</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Số tài khoản</th>
				  <th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Tên tài khoản</th>
					<th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Ngân hàng</th>
				  <th style="background: #0086b3;border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px;">Ngày tạo</th>
				  </tr>
				  ${accountTemplate}
				</table>
			  </td>
			</tr>
		  </table>
		</body>
		</html>
		`

	//Generate monthly report

	let monthlyReport = {
		total: currentTotal,
		template: ''
	}

	let tempBankname = ''
	let tempAccountNumber = ''

	currentBalances && currentBalances.length > 0 && currentBalances.forEach((item, index) => {
		monthlyReport.template += `<tr>
			  <td style="border: 1px solid #dddddd;
					  text-align: left;
					  padding: 8px">${index + 1}</td>
					  ${tempBankname !== item.bankName ? `<td rowspan=${currentBalances.filter(x => x.bankName ==
			item.bankName).length} style="border: 1px solid #dddddd;
							text-align: left;
							padding: 8px">${item.bankName}</td>` : ''}
							${tempAccountNumber !== item.accountNumber ? `<td rowspan=${currentBalances.filter(x => x.accountNumber ==
				item.accountNumber).length} style="border: 1px solid #dddddd;
								text-align: left;
								padding: 8px">${item.accountNumber}</td>` : ''}
			  <td style="border: 1px solid #dddddd;
					  text-align: left;
					  padding: 8px">${item.note || ''}</td>
			  <td style="border: 1px solid #dddddd;
					  text-align: left;
					  padding: 8px">${Number(item.balance).toLocaleString(undefined, { maximumFractionDigits: 2 })} VND</td>
			</tr>`
		tempBankname = tempBankname === item.bankName ? tempBankname : item.bankName
		tempAccountNumber = tempAccountNumber === item.accountNumber ? tempAccountNumber : item.accountNumber
	})

	//Generate new bank account
	let newBankTemplate = ''
	let newAccountTemplate = ''

	tempBankname = ''
	banks && banks.length > 0 && banks.forEach((item, index) => {
		const created = new Date(_.get(item, 'created'))
		newBankTemplate += `<tr>
		  <td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${index + 1}</td>
		  <td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${item.name || ''}</td>
				  <td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${created.getMonth() + 1}-${created.getDate()}-${created.getFullYear()}</td>
		</tr>`
	})

	accounts.sort((a, b) => {
		return a.name.localeCompare(b.name)
	})

	accounts.forEach((item, index) => {
		const created = new Date(_.get(item, 'created'))
		newAccountTemplate += `<tr>
		  <td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${index + 1}</td>
		  <td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${_.get(item, 'accounts.accountNumber')}</td>
		<td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${_.get(item, 'accounts.accountName')}</td>
				  ${tempBankname !== item.name ? `<td rowspan=${accounts.filter(x => x.name ==
			item.name).length} style="border: 1px solid #dddddd;
						text-align: left;
						padding: 8px">${item.name}</td>` : ''}
				  <td style="border: 1px solid #dddddd;
				  text-align: left;
				  padding: 8px">${created.getMonth() + 1}-${created.getDate()}-${created.getFullYear()}</td>
		  
		</tr>`
		tempBankname = tempBankname === item.name ? tempBankname : item.name
	})

	let html = generateEmail(monthlyReport.total, monthlyReport.template, newBankTemplate, newAccountTemplate)

	if(!req.body.emails){
		return res.send(html)
	}

	let subject = `Ecom Easy | Finance Report | ${reportType == 'week' ? 'Week' : 'Month'}: ${from} - ${to}`

	var emails = JSON.parse(req.body.emails)
	emails.map(function(email){
		try {
			emailService.sendReportEmail(email, html, subject)
		} catch (e) {
			console.log(e)
		}
	})

	res.json({
		err: null,
		errMsg: null,
		result: 'ok'

	})
}


module.exports = {

	addBalance: addBalance,
	editBalance: editBalance,
	getBalance: getBalance,
	getBalanceByAccount: getBalanceByAccount,
	removeBalance: removeBalance,
	generateReport: generateReport
}