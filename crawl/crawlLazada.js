const request = require('request');

let headers = {
  'accept': "*/*",
  //"accept-encoding": "gzip, deflate, br",
  "accept-language": "vi,en-US;q=0.9,en;q=0.8",
  //"cookie": `SPC_IA=-1; SPC_EC=-; SPC_F=kWeRQoZsi8XYnWiAWHmuEQc2zBcw9rfd; REC_T_ID=440e2498-c0fd-11ea-9279-20283e7225ee; SPC_CT_5dfed408="1594200458.fEaTV04ypcKsfTWq429Z7d8oBTj6wO/4EBptVl9UiPD2+rXQy0wO1eFQeQJqGBey"; SPC_SI=96xv3pa8kqm9io4ohsajij2qzbwa496a; SPC_U=-; REC_B_MD_6_25913978_370221297_161=1594201409_0.24.0.24_0.24.0.25_0.24.0.24; _dc_gtm_UA-61914164-6=1; _fbp=fb.1.1594200813144.2055257868; _gcl_au=1.1.261256834.1594200821; AMP_TOKEN=%24NOT_FOUND; _ga=GA1.2.1636293974.1594200827; _gid=GA1.2.1887999394.1594200827; SPC_CT_3fbfa35d="1594200843.IbJkmX5sh73tOml+aD4iGz0uy8cSlSKkgIl3NePHwKxjbLee/rnP/ElbfQTY1tVK"; SPC_R_T_ID="9baxSgJsDYfzr7kxXp6LXQXBN+iODf51RTV+mAAsQS8dEeXpLWgvpjhCl1Se8mA9HJDd67zgQg7+fEjOvbFPOpsA7HyjnaMt/NgMAJTCm+I="; SPC_T_IV="ZFaI8cERhhivRjDeGLb5Ig=="; SPC_R_T_IV="ZFaI8cERhhivRjDeGLb5Ig=="; SPC_T_ID="9baxSgJsDYfzr7kxXp6LXQXBN+iODf51RTV+mAAsQS8dEeXpLWgvpjhCl1Se8mA9HJDd67zgQg7+fEjOvbFPOpsA7HyjnaMt/NgMAJTCm+I="`,
  //"if-none-match-": "55b03-e0a95324d9efc68eb5d93092738fcb60",
  "referer": "https://www.lazada.vn/catalog/?_keyori=ss&from=input&page=1&q=gi%C3%A0y%20nike",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
  "x-api-source": "pc",
  "x-requested-with": "XMLHttpRequest",
  "x-shopee-language": "vi"
}

let _keyword = `giày nike max`

let newJob = {
  job: 111111111,
  keyword: 'giày nike max',
  status: 'processing',
  market: 'lazada',
  products: []
}

let cbTree = {

}

//crawlShopee(newJob, function(){})

function crawlShopee(newJob, cb){

  cbTree[newJob.job] = {
    job: newJob,
    cb: cb,
    products: []
  }

  let keyword = encodeURI(newJob.keyword)

  console.log(keyword)
  
  callService(keyword, newJob, 0)
}

function callService(keyword, job, page){

  let url = `https://www.lazada.vn/catalog/?_keyori=ss&ajax=true&from=input&page=${page}&q=${keyword}`
  request({
    headers: headers,
    url: url, 
    method:'get',

  },function (error, response, _body) {  
    if(error){
      console.log('callService error')

      cbTree[job.job].cb(job, [], [])

      return console.log(error)  
    }
    
    let body = JSON.parse(_body)

    if(body.mods){
      handleData(body.mods.listItems, keyword, job, page)
    }else{
      console.log(body)
    }

  })
}

async function handleData(data, keyword, job, page){

  data.map(function(e){
    let temp = {
      name: e.name,
      productUrl: e.productUrl,
      image: e.image,

      // view_count: e.view_count,
      // liked_count: e.liked_count,
      // cmt_count: e.cmt_count,
      // item_rating: e.item_rating,
      ratingScore: e.ratingScore,

      price: e.price,
      // price_max: e.price_max,
      // price_min: e.price_min,
      discount: e.discount,

      // stock: e.stock,
      // historical_sold: e.historical_sold,

      // shop_location: e.shop_location,
      // shopid: e.shopid
      sellerName: e.sellerName

    }

    console.log(temp.length)

    cbTree[job.job].products.push(temp)
  })

  if(cbTree[job.job].products.length == 200 || data.length < 40){

    //let listShopDetail = await addShopInfo(cbTree[job.job].products)

    cbTree[job.job].cb(job, cbTree[job.job].products, [])
    console.log('finish')
    return delete cbTree[job.job]
  }

  page = page + 1
  await timeout(5)
  callService(keyword, job, page)
}

async function addShopInfo(productList){
  let result = []
  productList.map(function(e){
    result.push(e.shopid)
  })

  let uniqueArray = result.filter(function(item, pos, self) {
    return self.indexOf(item) == pos;
  })

  console.log('uniqueArray', uniqueArray.length)

  let listShopDetail = []
  uniqueArray.map(function(e){
    listShopDetail.push(crawlShop(e))
  })

  const finalResult = await Promise.all(listShopDetail)
  
  console.log("shopList", finalResult[0])
  return finalResult
}

async function crawlShop(shopid){
  let url = `https://shopee.vn/api/v2/shop/get?is_brief=1&shopid=${shopid}`
  
  return new Promise((resolve, reject) => {
    request({
      headers: headers,
      url: url, 
      method:'get',

    },function (error, response, _body) {  
      if(error){
        console.log(error) 
        return reject(error) 
      }
      
      
      let body = JSON.parse(_body)

      resolve(body.data)
      //handleData(body.items, keyword, job, page)

    })
  })
}

async function timeout(timeInSecond){
  return new Promise( ( resolve, reject ) => {

    setTimeout( function(){
      resolve()
    }, timeInSecond * 1000 );

  });
}

module.exports = {
  crawlShopee: crawlShopee
}