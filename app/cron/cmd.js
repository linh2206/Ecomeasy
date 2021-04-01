const lazada_sdk = require('./controller/lazada/lazada_sdk')
const lazada = require('./controller/lazada/lazada')
const shoppee = require('./controller/shopee/shopee')
const sendo = require('./controller/sendo/sendo')

const accessTokenByShop = '50000201506aCNuehu130de75fbzOjeGAw3tUTioDNhVDyXnc0GSRdwocUq805'
lazada_sdk.authenticationByShop(accessTokenByShop);
// lazada_sdk.getOrderItems()
 lazada_sdk.getOrders()

//lazada.getTransactionDetails(accessTokenByShop)


// const shopid = 73089888
// shoppee.authentication(shopid)


// sendo.authentication()