
const {MongoClient} = require("mongodb");
const config = require('../config/config_app')

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

let _userCol = null;
let _roleCol = null

let _shopCol = null
let _brandCol = null

let _bankCol = null
let _balanceCol = null

let _departCol = null
let _processCol = null
let _stepCol = null
let _requestCol = null

let _shopeeOrderCol = null
let _shopeeProductCol = null
let _sendoOrderCol = null
let _lazadaOrderCol = null
let _tikiOrderCol = null
let _productSheetCol = null

let _lazadaProductCol = null

let _jobCol = null;

let _crawlQuotaCol = null

let _pricingListCol = null
let _pricingProductCol = null
let _pricingDataCol = null

let _postCol = null
let _campaignCol = null

let dbClient = null

async function connectDatabase(cb) {
  const client = new MongoClient(config.dbServer.uri, connectOptions);
  try {
  	await client.connect();
  	let db = await client.db(config.dbServer.dbName);
  	console.log("connected to DB", config.dbServer.uri);
  	cb();

    db.collection("shopee_order").createIndex( { 
      create_time: -1,
      shopId: 1,
      brandId: 1
    })

    db.collection("lazada_order").createIndex( { 
      created_at: -1,
      shopId: 1,
      brandId: 1
    })

    db.collection("product_sheet").createIndex( { 
      Date_Request: -1,
      shopId: 1,
      brandId: 1
    })

  	_userCol = db.collection("user");
    _roleCol = db.collection("role");

    _shopeeOrderCol = db.collection("shopee_order");
    _sendoOrderCol = db.collection("sendo_order");
    _lazadaOrderCol = db.collection("lazada_order");
    _tikiOrderCol = db.collection("tiki_order");
    
    _shopeeProductCol = db.collection("shopee_product");
    _productSheetCol = db.collection("product_sheet");

    _lazadaProductCol = db.collection("lazada_product");

    _shopCol = db.collection("shop");
    _brandCol = db.collection("brand");
    _bankCol = db.collection("bank");
    _balanceCol = db.collection("balance");

    _departCol = db.collection("department");
    _processCol = db.collection("process");
    _stepCol = db.collection("process_step");
    _requestCol = db.collection("request");

    _jobCol = db.collection("job");
    _crawlQuotaCol = db.collection("crawl_quota");

    _pricingListCol = db.collection("pricing_list")
    _pricingProductCol = db.collection("pricing_product")
    _pricingDataCol = db.collection('pricing_data')

    _postCol = db.collection("post");
    _campaignCol = db.collection("campaign");

    dbClient = client

  } catch (e) {
	  console.error(e);
  } 
}

if(!_userCol){
  console.log("this should be printed one time");
  connectDatabase(function(){});
}

const userCol = function(){
  if (_userCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _userCol;
  }
};

const roleCol = function(){
  if (_roleCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _roleCol;
  }
};

const shopeeOrderCol = function(){
  if (_shopeeOrderCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _shopeeOrderCol;
  }
};

const sendoOrderCol = function(){
  if (_sendoOrderCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _sendoOrderCol;
  }
};

const lazadaOrderCol = function(){
  if (_lazadaOrderCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _lazadaOrderCol;
  }
};

const tikiOrderCol = function(){
  if (_tikiOrderCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _tikiOrderCol;
  }
};

const shopeeProductCol = function(){
  if (_shopeeProductCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _shopeeProductCol;
  }
};

const lazadaProductCol = function(){
  if (_lazadaProductCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _lazadaProductCol;
  }
};

const productSheetCol = function(){
  if (_productSheetCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _productSheetCol;
  }
};

const shopCol = function(){
  if (_shopCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _shopCol;
  }
};

const brandCol = function(){
  if (_brandCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _brandCol;
  }
};

const bankCol = function(){
  if (_bankCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _bankCol;
  }
};

const balanceCol = function(){
  if (_balanceCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _balanceCol;
  }
};

const departCol = function(){
  if (_departCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _departCol;
  }
};

const processCol = function(){
  if (_processCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _processCol;
  }
};

const stepCol = function(){
  if (_stepCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _stepCol;
  }
};

const requestCol = function(){
  if (_requestCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _requestCol;
  }
};

const jobCol = function(){
  if (_jobCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _jobCol;
  }
};

const crawlQuotaCol = function(){
  if (_crawlQuotaCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _crawlQuotaCol;
  }
};

const pricingListCol = function(){
  if (_pricingListCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _pricingListCol;
  }
};

const pricingProductCol = function(){
  if (_pricingProductCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _pricingProductCol;
  }
};

const pricingDataCol = function(){
  if (_pricingDataCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _pricingDataCol;
  }
};

const postCol = function(){
  if (_postCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _postCol;
  }
};

const campaignCol = function(){
  if (_campaignCol == null) {
    console.log("Instance is null or undefined");
  } else {
    return _campaignCol;
  }
};

const getDbClient = function(){
  return dbClient
};

module.exports = {
  brandCol: brandCol,
  bankCol: bankCol,
  balanceCol: balanceCol,
  shopCol: shopCol,
  shopeeOrderCol: shopeeOrderCol,
  shopeeProductCol: shopeeProductCol,
  sendoOrderCol: sendoOrderCol,
  lazadaOrderCol: lazadaOrderCol,
  productSheetCol: productSheetCol,
  roleCol: roleCol,
  userCol: userCol,
  jobCol: jobCol,
  lazadaProductCol: lazadaProductCol,
  tikiOrderCol: tikiOrderCol,
  crawlQuotaCol: crawlQuotaCol,

  departCol: departCol,
  processCol: processCol,
  stepCol: stepCol,
  requestCol: requestCol,

  pricingListCol: pricingListCol,
  pricingProductCol: pricingProductCol,
  pricingDataCol: pricingDataCol,

  postCol: postCol,
  campaignCol: campaignCol
}
