const request = require('request');
const querystring = require('querystring');
const zlib = require("zlib");
const fs = require('fs');

const lazadaCookieSpreedsheetId = '1p8WNllcHKD3NSACvoq1P7BeFH0WPZ-K7nR_Yeich6F4'


function requestOrderReport(requestHeader, params, cb){
  let from = new Date(params.from).getTime()
  let to = new Date(params.to).getTime()

  const form = {
  	exportKey: "order.list.export",
		input: {"status":"filter","tab":"all","dateRange":["1589475600486-1590771599678"]}
  }

  // from = 1589475600486
  // to = 1590771599678

  // var formData = querystring.stringify(form);
  // console.log(formData)
  // return

  //requestHeader['Content-Length'] = formData.length
  const formUrlencoded = `exportKey=order.list.export&input=%7B%22status%22%3A%22filter%22%2C%22tab%22%3A%22all%22%2C%22dateRange%22%3A%5B%22${from}-${to}%22%5D%7D`
  //console.log('exportKey=order.list.export&input=%7B%22status%22%3A%22filter%22%2C%22tab%22%3A%22all%22%2C%22dateRange%22%3A%5B%221589475600486-1590771599678%22%5D%7D')


  console.log(requestHeader)

	var req = request.post({
		url: 'https://sellercenter.lazada.vn/files/export', 
		headers: requestHeader,
		body: formUrlencoded
	});

	req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
        	console.log(err)
          let _decoded = decoded.toString()
        	console.log(_decoded)
          let requestOrderId = JSON.parse(_decoded).exportId
          cb(requestOrderId)
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          //callback(err, decoded && decoded.toString());
        })
      } else {
        //callback(null, buffer.toString());
      }
    });
  });

  req.on('error', function(err) {
    console.log(err)
  });
}

async function exportHitOrder(requestHeader, cb){

  await timeout(10)

  const form = {
  	exportKeys: "order.list.export",
		searchCondition: '',
		pageSize: 5,
		pageIndex: 1,
  }

  var formData = querystring.stringify(form);

	var req = request.post({
		url: 'https://sellercenter.lazada.vn/files/exportHis',
		headers: requestHeader,
		body: formData,
	});

	req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
        	if(err){
            console.log(err)
          }

        	let _decoded = decoded.toString()
          
          let listReport =  JSON.parse(_decoded).dataList
          console.log(listReport[0])

          cb(listReport)
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          //callback(err, decoded && decoded.toString());
        })
      } else {
        //callback(null, buffer.toString());
      }
    });
  });

  req.on('error', function(err) {
    console.log(err)
  });
}

function downloadReportOrder(requestHeader, exportId, cb){

	var options = {
	  url: `https://sellercenter.lazada.vn/files/downloadExport?spm=a2o7f.10605556.0.0.62cb1e13LUwv1X&exportId=${exportId}`,
	  headers: requestHeader
	}

	// Dummy write stream. Substitute with any other writeable stream
	var outStream = fs.createWriteStream('./sample.csv')
	compressedRequest()

	function compressedRequest() {
	  var req = request(options)

	  req.on('response', function (res) {
	    if (res.statusCode !== 200) throw new Error('Status not 200')

      var contentDisposition = res.headers['content-disposition'];
      var match = contentDisposition && contentDisposition.match(/(filename=|filename\*='')(.*)$/);
      var filename = match && match[2] || 'default-filename.out';
      filename = filename.replace(/['"]+/g, '')

      outStream = fs.createWriteStream(filename);

	    var encoding = res.headers['content-encoding']
	    if (encoding == 'gzip') {
	      res.pipe(zlib.createGunzip()).pipe(outStream)
	    } else if (encoding == 'deflate') {
	      res.pipe(zlib.createInflate()).pipe(outStream)
	    } else {

	      res.pipe(outStream)
	    }

      cb(filename)
	  })

	  req.on('error', function(err) {
	    throw err;
	  })
	}
}

function requestRevenueReport(requestHeader, params, cb){

  const form = {
    exportKey: "finance.export.transaction",
    input: {"transactionDataRange":"2020-05-05,2020-06-04","channel":"Lazada","version":"2.0","transactionFiter":"transactionDateFilter","orderNumber":""},
    exportName: "finance.export.transaction"
  }

  var formData = querystring.stringify(form);

  var req = request.post({
    url: 'https://sellercenter.lazada.vn/files/export', 
    headers: requestHeader,
    body: formData, 
  });

  req.on('response', function(res) {
    console.log('response')
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
          if(err){
            console.log(err)
          }
          let _decoded = decoded.toString()
          console.log(_decoded)
          let requestRevenueId = JSON.parse(_decoded).exportId
          cb(requestRevenueId)
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          //callback(err, decoded && decoded.toString());
        })
      } else {
        //callback(null, buffer.toString());
      }
    });
  });

  req.on('error', function(err) {
    console.log(err)
  });
}

async function exportHitRevenue(requestHeader, cb){
  await timeout(3)

  const form = {
    "exportKeys": "finance.export.transaction",
    "searchCondition": '',
    "pageSize": 5,
    "pageIndex": 1,
    "input": {"transactionDataRange":"2020-05-05,2020-06-04","channel":"Lazada","version":"2.0","transactionFiter":"transactionDateFilter","orderNumber":""}
  }

  var formData = querystring.stringify(form);

  var req = request.post({
    url: 'https://sellercenter.lazada.vn/files/exportHis',
    headers: requestHeader,
    body: formData,
  });

  req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
      var encoding = res.headers['content-encoding'];
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
          console.log(err)
          let _decoded = decoded.toString()
          
          let requestedRevenueExport =  JSON.parse(_decoded).dataList[0]
          console.log(requestedRevenueExport)
          // if(requestedOrder.status == "Processing" ){
          //   exportHitOrder(headersOpt)
          // }else{
          //   downloadOrder(requestedOrder.id)
          // }
          cb(requestedRevenueExport)
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
          //callback(err, decoded && decoded.toString());
        })
      } else {
        //callback(null, buffer.toString());
      }
    });
  });

  req.on('error', function(err) {
    console.log(err)
  });
}

function combine(){

}

module.exports = {
  requestOrderReport: requestOrderReport,
  exportHitOrder: exportHitOrder,
  downloadReportOrder: downloadReportOrder, 

  requestRevenueReport: requestRevenueReport,
  exportHitRevenue: exportHitRevenue,

  combine: combine

}

async function timeout(timeInSecond){
  return new Promise( ( resolve, reject ) => {

    setTimeout( function(){
      resolve()
    }, timeInSecond * 1000 );

  });
}

