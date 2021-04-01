const ShopeeApi = require('shopee-api');

const shopeeApi = new ShopeeApi({
    isUAT: false,
    shopid: '73089888',
    partner_id: '841171',
    partner_key: 'a0e43c61e9718d83baf41245b6d3dc5bd9e164117cf5c0316234c5b338b40d33',
    redirect_uri: 'http://localhost:3000/callback', // callback url when perform OAuth
    webhook_url: 'http://localhost:3000/webhook',
    verbose: true // show more logs
});

shopeeApi.post('/shop/get_partner_shop', {}, function (err, res, body) {
    if(err) {
      throw new Error(err);
    }
    
    console.log(body);
});