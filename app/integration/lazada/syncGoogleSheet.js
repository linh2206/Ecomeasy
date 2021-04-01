const spreadsheetTarget = {
  tokenByShop: "50000201506aCNuehu130de75fbzOjeGAw3tUTioDNhVDyXnc0GSRdwocUq805",
  spreadsheet: "1S9_51TMe-OcHWzYJuDbbW5OU8-nwgmVhKWhoz8TsZic",
  spreadsheetName: "Copy of Lazada Order",
  sheet: "YvesRocher",
  range: "M2:BZ100"
}

const fs = require('fs')

const lazadaBot = require('./lazadaBot')

function reportRequestCb(data){
  
  let created = ''
  data.map((row) => {
    console.log(`${row[0]}, ${row[1]}`);
    
  });

  google.listData(lazadaCookieSpreedsheetId, 'Sheet1!A1:F10', lazadaCookieCb)

}

const requestHeader = require('../../api/key.json')

lazadaCookieCb()
function lazadaCookieCb(_params, cb){
  
  // let header = {}
  // data.map((row) => {
  //   console.log(`${row[0]}, ${row[1]}`);
  //   header[row[1]] = row[2]
  // });

  let params = {
    from: new Date(2020, 4, 1, 7, 0, 0).toISOString(),
    to: new Date(2020, 4, 30, 7, 0, 0).toISOString()
  }

  lazadaBot.requestOrderReport(requestHeader, params, requestOrderReportCb)

  let requestOrderReportId = null
  let requestOrderReport = null
  let i = 1
  function requestOrderReportCb(_requestOrderReportId){
    requestOrderReportId = _requestOrderReportId
    lazadaBot.exportHitOrder(requestHeader, reportHitOrderCb)
  }

  function reportHitOrderCb(listReport){

    requestOrderReport = listReport.find(function(e){
      if(e.id == requestOrderReportId){
        return true
      }
    })

    if(requestOrderReport.status == "Processing" ){
      i+=1
      console.log("exportHitOrder", i, requestOrderReportId)
      return lazadaBot.exportHitOrder(requestHeader, reportHitOrderCb)
    }

    lazadaBot.downloadReportOrder(requestHeader, requestOrderReportId, dowloadReportOrdertCb)

  }

  let pathToOrderReport = null
  function dowloadReportOrdertCb(_pathToOrderReport){
    pathToOrderReport = _pathToOrderReport
    console.log('pathToOrderReport', pathToOrderReport)
    lazadaBot.requestRevenueReport(requestHeader, params, requestRevenueReportCb)
  }

  let requestRevenueReportId = null
  let requestRevenueReport = null
  let j = 1
  function requestRevenueReportCb(_requestRevenueReportId){
    requestRevenueReportId = _requestRevenueReportId
    //lazadaBot.exportHitRevenue(requestHeader, exportHitRevenueCb)
    combineFile()
  }

  function exportHitRevenueCb(listReport){
    requestRevenueReport = listReport.find(function(e){
      if(e.id == requestRevenueReportId){
        return true
      }
    })

    if(requestRevenueReport.status == "Processing" ){
      j+=1
      console.log("exportHitRevenue", j, requestRevenueReportId)
      return lazadaBot.exportHitRevenue(requestHeader, exportHitRevenueCb)
    }

    lazadaBot.downloadReportOrder(requestHeader, requestRevenueReportId, downloadRevenueReportCb)
  }

  function downloadRevenueReportCb(pathToRevenuReport){
    pushFileToGoogleDrive(pathToRevenuReport)
  }

  function pushFileToGoogleDrive(path){

    combineFile(path)
  }

  function combineFile(path){
    readCsvFile(pathToOrderReport, readCsvFileCb)
    
  }

  async function readCsvFileCb(){
    csvData.shift();
    await google.clearOldData(spreadsheetTarget);
    await google.updateDataToCurrentSheet(csvData, spreadsheetTarget)
    cb(true)
  }

}


var csvData=[];
// var pathToOrderReport = './order.list.export 2020-06-08.csv'

// function readCsvFileCb(){
//   csvData.shift()
//   google.updateDataToCurrentSheet(csvData, spreadsheetTarget)
// }


function readCsvFile(path, cb){
  fs.createReadStream(path)
    .pipe(parse({delimiter: ';'}))
    .on('data', function(csvrow) {
     
      //do something with csvrow
      csvData.push(csvrow);  
    })
    .on('end',function() {
      console.log("do something with csvData")
      cb()
    });
}

function buildData(){
  const values = _orders.map(function(el){
    return [
      el.order_id,                 //Order Item Id
      '',                          //Order Type
      '',                          //Order Flag
      el.order_id,                 //Lazada Id
      '',                          //Seller SKU
      '',                          //Lazada SKU
      el.created_at,               //Created at
      el.updated_at,               //Updated at
      '',                          //Order Number
      '',                          //Invoice 
      '',                          //Required  
      el.customer_last_name,       //Customer Name  
      '',                          //Customer Email  
      '',                          //National Registration Number  
      '',                          //Shipping Name  
      '',                          //Shipping Address  
      '',                          //Shipping Address2  
      '',                          //Shipping Address3  
      el.address_shipping.address4,//Shipping Address4  
      '',                          //Shipping Address5  
      '',                          //Shipping Phone Number  
      '',                          //Shipping Phone Number2  
      '',                          //Shipping City  
      '',                          //Shipping Postcode  
      el.address_shipping.country, //Shipping Country  
      '',                          //Shipping Region  
      '',                          //Billing Name  
      '',                          //Billing Address  
      '',                          //Billing Address2  
      '',                          //Billing Address3  
      '',                          //Billing Address4  
      '',                          //Billing Address5  
      '',                          //Billing Phone Number  
      '',                          //Billing Phone Number2  
      '',                          //Billing City  
      '',                          //Billing Postcode  
      '',                          //Billing Country  
      '',                          //Tax Code  
      '',                          //Branch Number  
      '',                          //Tax Invoice requested  
      '',                          //Payment Method  
      el.price,                    //Paid Price  
      '',                          //Unit Price  
      '',                          //Shipping Fee  
      '',                          //Wallet Credits  
      '',                          //Item Name  
      '',                          //Variation  
      '',                          //CD Shipping Provider  
      '',                          //Shipping Provider  
      '',                          //Shipment Type Name  
      '',                          //Shipping Provider Type  
      '',                          //CD Tracking Code  
      el.order_number,             //Mã vận đơn  
      '',                          //Tracking URL  
      '',                          //Shipping Provider (first mile)  
      '',                          //Tracking Code (first mile)  
      '',                          //Tracking URL (first mile)  
      '',                          //Promised shipping time  
      '',                          //Premium  Status  
      '',                          //Cancel / Return Initiator  
      '',                          //Reason  
      '',                          //Reason Detail  
      '',                          //Editor  
      '',                          //Bundle ID  
      '',                          //Bundle Discount  
      '',                          //Refund Amount

    ]
  })
}