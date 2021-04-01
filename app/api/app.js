const express = require("express");
const fs = require("fs");
// import MobileDetect from "mobile-detect";
// import fs from "fs";
const multer = require("multer");
const cookieParser = require("cookie-parser");
const multipartFormParser = multer();

const dashboard = require("./controller/dashboard");
const productHighlight = require("./controller/productHighlight");
const allBrandReport = require("./controller/revenue");

const brandController = require("./controller/brand");
const brandAccess = require("./controller/brandAccess");
const brandConnectSpreadsheet = require("./controller/brandConnectSpreadsheet");

const departController = require("./controller/department");
const processController = require("./processes/index");

const bankController = require("./controller/bank");
const balanceController = require("./controller/balance");

const shop = require("./controller/shop");
const shopManagement = require("./controller/shopManagement");
const order = require("./controller/order");

const pricingController = require("./controller/pricing");

const postController = require("./controller/post");
const campaignController = require("./controller/campaign");

const userController = require("./controller/user");
const userAccount = require("./controller/userAccount");
const userRolePermission = require("./controller/userRolePermission");

const crawler = require("./controller/crawl");
const log = require("./controller/log");


const keeper = require("./controller/userIdentification");

const app = express();

// app.set("port", process.env.PORT || 80);
const indexHtml = fs.readFileSync('./build/index.html', "utf8");
app.get("/", function (req, res) {
	console.log(req.query)
	res.send(indexHtml);
});

app.use(express.static("./build"));
app.use(cookieParser());

app.use(function (req, res, next) {
	console.log(req.url)
	res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "*");
	res.header('Access-Control-Allow-Credentials', true);
	next();
});

// app.use("/storage", homeController.getFile);

const routes = [
	{
		name: 'createPost',
		method: 'post',
		path: '/api/create-post',
		middlewares: [keeper.requireUser, multipartFormParser.none()],
		controller: postController,
		abac: []
	},
	{
		name: 'listPost',
		method: 'get',
		path: '/api/posts',
		middlewares: [keeper.requireUser, multipartFormParser.none()],
		controller: postController,
		abac: []
	},
	{
		name: 'createCampaign',
		method: 'post',
		path: '/api/create-campaign',
		middlewares: [keeper.requireUser, multipartFormParser.none()],
		controller: campaignController,
		abac: []
	},
	{
		name: 'listCampaign',
		method: 'get',
		path: '/api/campaigns',
		middlewares: [keeper.requireUser, multipartFormParser.none()],
		controller: campaignController,
		abac: []
	},
	{
		name: 'editCampaign',
		method: 'post',
		path: '/api/campaign/:campaignId',
		middlewares: [keeper.requireUser, multipartFormParser.none()],
		controller: campaignController,
		abac: []
	},
	{
		name: 'getCampaign',
		method: 'get',
		path: '/api/campaign/:campaignId',
		middlewares: [ multipartFormParser.none()],
		controller: campaignController,
		abac: []
	},
]

let permissions = []

for(let i=0; i<routes.length; i++){
	let {name, method, path, middlewares, controller} = routes[i]
	if(!name){throw new NotImplementedException()}
	permissions.push(name)
	app[method](path, ...middlewares, controller[name])
}

//console.log(app._router.stack[6].route)

app.get('/permissions', function(req, res){return res.json({err: null, errMsg: null, result: permissions})})

app.post("/api/create-brand", keeper.requireUser, multipartFormParser.none(), brandController.createBrand);
app.get("/api/brands", keeper.requireUser, brandController.listBrand);
app.get("/api/brand/:brandId/detail", keeper.requireUser, brandController.brandDetail);
app.post("/api/brand/:brandId/detail", keeper.requireUser, brandController.updateBrandDetail);
//app.post("/api/brand/:brandId/connect-googlesheet", keeper.requireUser, multipartFormParser.none(), brandConnectSpreadsheet.googleOauth2Link);
app.post("/api/brand/:brandId/invite-manage-brand", keeper.requireUser, multipartFormParser.none(), brandAccess.inviteTobeAdmin);
app.post("/api/brand/:brandId/reject-accept-manage-brand", multipartFormParser.none(), brandAccess.rejectAccept);
app.post("/api/brand/:brandId/delete", keeper.requireUser, brandController.deleteBrand);

app.post("/api/create-bank", keeper.requireUser, multipartFormParser.none(), bankController.createBank);
app.get("/api/bank", keeper.requireUser, multipartFormParser.none(), bankController.listBank);
app.post("/api/bank/:bankId/delete-bank", keeper.requireUser, multipartFormParser.none(), bankController.deleteBank);
app.post("/api/bank/:bankId/add-account", keeper.requireUser, multipartFormParser.none(), bankController.addAccount);
app.post("/api/bank/:bankId/delete-account", keeper.requireUser, multipartFormParser.none(), bankController.deleteAccount);
app.post("/api/bank/:bankId/add-balance", keeper.requireUser, multipartFormParser.none(), balanceController.addBalance);
app.post("/api/balance/:balanceId/remove-balance", keeper.requireUser, multipartFormParser.none(), balanceController.removeBalance);
app.post("/api/balance/:balanceId/edit-balance", keeper.requireUser, multipartFormParser.none(), balanceController.editBalance);
app.get("/api/balance", keeper.requireUser, balanceController.getBalance);
app.get("/api/balance/:accountNumber", keeper.requireUser, balanceController.getBalanceByAccount);

app.post("/api/create-depart", keeper.requireUser, multipartFormParser.none(), departController.createDepart);
app.get("/api/departs", keeper.requireUser, departController.listDepart);
app.post("/api/depart/:departId/add-user", keeper.requireUser, multipartFormParser.none(), departController.addUserToDepart);

app.post("/api/create-process", keeper.requireUser, multipartFormParser.none(), processController.createProcess);
app.get("/api/process", keeper.requireUser, departController.listProcess);
app.get("/api/actions", keeper.requireUser, processController.actionsList);
app.post("/api/process/:processId/add-step", keeper.requireUser, multipartFormParser.none(), departController.addStep);
app.post("/api/process/:processId/step/:stepSlug/modify-step", keeper.requireUser, multipartFormParser.none(), departController.modifyStep);

app.get("/api/process/data-collector", keeper.requireUser, departController.dataCollector)

//app.post("/api/process/:processId/create-request", keeper.requireUser, multipartFormParser.none(), departController.createRequest);
app.post("/api/process/:processId/step/:stepSlug", keeper.requireUser, multipartFormParser.none(), processController.processRequest);
app.get("/api/request", keeper.requireUser, departController.loadRequest);
app.get("/api/request/:requestId", keeper.requireUser, departController.loadRequestById);
app.post("/api/request/create", keeper.requireUser, multipartFormParser.none(), processController.createRequest);

//app.post("/api/shop/:shopId/update-source-name", keeper.requireUser, multipartFormParser.none(), shop.addShopname);
app.post("/api/shop/:shopId/disconnect", keeper.requireUser, shopManagement.disconnectToSource);


app.get("/api/brand/:brandId/revenue-by-market", keeper.requireUser, dashboard.revenueByMarket);
app.get("/api/brand/:brandId/product-highlight", keeper.requireUser, productHighlight.productHighlight);
app.get("/api/brand/all-brand-report", keeper.requireUser, allBrandReport.revenueByMarket);


app.get("/oauth2/shopee-redirect", shop.createShop_shopee)
app.get("/oauth2/lazada-redirect", shop.createShop_lazada)
app.get("/oauth2/google-redirect", brandConnectSpreadsheet.googleGetTokenFromCode)
app.post("/api/brand/:brandId/connect-sendo", keeper.requireUser, multipartFormParser.none(), shop.createShop_sendo)
app.get("/api/shops", keeper.requireUser, shop.sourceListing)

app.post("/api/brand/:brandId/new-spreadsheet-source", keeper.requireUser, multipartFormParser.none(), brandConnectSpreadsheet.newSpreadsheetSource);
app.get("/api/source/:sourceId/drive-folder-detail", keeper.requireUser, brandConnectSpreadsheet.listDriveFolder);
app.post("/api/source/:sourceId/attach-spreadsheet-source", keeper.requireUser, multipartFormParser.none(), brandConnectSpreadsheet.attachSpreadsheetSource);

app.post("/brand/:brandId/upload-excel", keeper.requireUser, multipartFormParser.none(), shop.uploadSource)
app.post("/brand/:brandId/source/:sourceId/add-order", keeper.requireUser, multipartFormParser.none(), shop.addOrderToSource)


app.post("/api/v1/register", multipartFormParser.none(), userController.register);
app.post("/api/v1/login", multipartFormParser.none(), userController.login);
app.post("/api/v1/password-of-email", multipartFormParser.none(), userController.sendResetLink);
app.post("/api/v1/new-password", multipartFormParser.none(), userController.newPassword);
app.get("/api/v1/roles-permissions", keeper.requireUser, brandAccess.getRolePermission);

app.get("/api/v1/user/profile", keeper.requireUser, userAccount.getProfile);
app.post("/api/v1/user/update", keeper.requireUser, userAccount.update);
app.post("/api/v1/change-password", keeper.requireUser, multipartFormParser.none(), userAccount.changePassword);

app.post("/api/v1/admin/add-user-permission", keeper.requireUser, multipartFormParser.none(), userRolePermission.addUserPersmission);
app.get("/api/v1/user/role", keeper.requireUser, userRolePermission.userRole)


app.get("/api/v1/crawl-with-keyword", keeper.requireUser, crawler.createNewJob);
app.get("/api/v1/data-with-job", crawler.getJobResult);
app.get("/api/v1/crawl-history", keeper.requireUser, crawler.crawlHistoryByUser);

app.get("/api/v1/invite-manage-brand", brandAccess.invitationDetail);

app.post("/api/v1/brand/:brandId/remove-admin-brand", keeper.requireUser, multipartFormParser.none(), brandAccess.removeAdmin);
app.post("/api/v1/brand/:brandId/add-admin-brand", keeper.requireUser, multipartFormParser.none(), brandAccess.addAdminToBrand);
app.get("/api/v1/users/listing", keeper.requireUser, userAccount.listingUser);
app.get("/api/v1/brand/listing", keeper.requireUser, brandController.listing);

app.get("/api/logs", keeper.requireUser, log.listing);


app.get("/api/shop/:shopId/orders/other-source", keeper.requireUser, order.otherSource)
app.get("/api/shop/:shopId/orders/lazada-source", keeper.requireUser, order.lazadaOrder)
app.get("/api/shop/:shopId/orders/shopee-source", keeper.requireUser, order.shopeeOrder)
app.get("/api/shop/:shopId/orders/sendo-source", keeper.requireUser, order.sendoOrder)

app.post("/api/pricing/product-target", keeper.requireUser, multipartFormParser.none(), pricingController.addNewProduct);
app.get("/api/pricing/product-target", keeper.requireUser, pricingController.loadListProduct);

app.post("/api/pricing/product-group", keeper.requireUser, multipartFormParser.none(), pricingController.addNewGroup);
app.get("/api/pricing/product-group", keeper.requireUser, pricingController.loadListGroup);
app.post("/api/pricing/product-group/:groupId", keeper.requireUser, multipartFormParser.none(), pricingController.editGroup);
app.get("/api/pricing/product-group/:groupId", keeper.requireUser, pricingController.loadTargetData);

app.post("/api/target/:targetId/add-data", multipartFormParser.none(), pricingController.updateTargetData);
app.post("/api/target/:targetId/delete-data", multipartFormParser.none(), pricingController.deleteData);

app.get("/finance-report", keeper.requireUser, balanceController.generateReport);
app.post("/api/finance-report", keeper.requireUser, multipartFormParser.none(), balanceController.generateReport);

app.get("/invite-manage-brand", function (req, res) {
	res.send(indexHtml);
});

app.get("/dashboard/detail/:brandId", function (req, res) {
	res.send(indexHtml);
});

app.get("/dashboard/revenue/:brandId", function (req, res) {
	res.send(indexHtml);
});

app.get("/auth/set-password", function (req, res) {
	res.send(indexHtml);
});

app.get("/dashboard/orders/:brandId/:sourceId/:sourceType", keeper.requireUser, function (req, res) {
	res.send(indexHtml);
});

app.get("/live-streaming", function (req, res) {
	res.send(indexHtml);
});

app.get("/campaign", function (req, res) {
	res.send(indexHtml);
});

app.get("/post", function (req, res) {
	res.send(indexHtml);
});

app.get("/logout", function (req, res) {
	res.cookie("token", '');
  res.redirect('/');
});

app.get("/internal-report", keeper.requireUser, function (req, res) {
	res.send(indexHtml);
});

app.get("/profile", keeper.requireUser, function (req, res) {
	res.send(indexHtml);
});

app.get("/create-brand", keeper.requireUser, function (req, res) {
	res.send(indexHtml);
});

app.get("/authorization", keeper.requireUser, function (req, res) {
	res.send(indexHtml);
});

app.get("/permissions", keeper.requireUser, function (req, res) {
	res.send(indexHtml);
});

app.get("/crawl-data", function (req, res) {
	res.send(indexHtml);
});

app.get("/shops", function (req, res) {
	res.send(indexHtml);
});

app.get("/privacy-policies", function (req, res) {
	res.send(indexHtml);
});

app.get("/compare", function (req, res) {
	res.send(indexHtml);
});

app.get("/terms-conditions", function (req, res) {
	res.send(indexHtml);
});

app.get("/auth/login", function (req, res) {
	res.send(indexHtml);
});

app.get("/brand", function (req, res) {
	res.send(indexHtml);
});

app.get("/process-setting", function (req, res) {
	res.send(indexHtml);
});

app.get("/process/:processId", function (req, res) {
	res.send(indexHtml);
});

app.get("/requests", function (req, res) {
	res.send(indexHtml);
});

app.get("/finance-overview", function (req, res) {
	res.send(indexHtml);
});
app.get("/bank-list", function (req, res) {
	res.send(indexHtml);
});
app.get("/account_number/:accountNumber", function (req, res) {
	res.send(indexHtml);
});

app.get("/brand-detail/:brandId", function (req, res) {
	res.send(indexHtml);
});

app.get("/connect-market/:brandId", function (req, res) {
	res.send(indexHtml);
});

module.exports = app