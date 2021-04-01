const request = require('request');

let headers = {
  'accept': "*/*",
  //"accept-encoding": "gzip, deflate, br",
  "accept-language": "vi,en-US;q=0.9,en;q=0.8",
  //"cookie": `SPC_IA=-1; SPC_EC=-; SPC_F=kWeRQoZsi8XYnWiAWHmuEQc2zBcw9rfd; REC_T_ID=440e2498-c0fd-11ea-9279-20283e7225ee; SPC_CT_5dfed408="1594200458.fEaTV04ypcKsfTWq429Z7d8oBTj6wO/4EBptVl9UiPD2+rXQy0wO1eFQeQJqGBey"; SPC_SI=96xv3pa8kqm9io4ohsajij2qzbwa496a; SPC_U=-; REC_B_MD_6_25913978_370221297_161=1594201409_0.24.0.24_0.24.0.25_0.24.0.24; _dc_gtm_UA-61914164-6=1; _fbp=fb.1.1594200813144.2055257868; _gcl_au=1.1.261256834.1594200821; AMP_TOKEN=%24NOT_FOUND; _ga=GA1.2.1636293974.1594200827; _gid=GA1.2.1887999394.1594200827; SPC_CT_3fbfa35d="1594200843.IbJkmX5sh73tOml+aD4iGz0uy8cSlSKkgIl3NePHwKxjbLee/rnP/ElbfQTY1tVK"; SPC_R_T_ID="9baxSgJsDYfzr7kxXp6LXQXBN+iODf51RTV+mAAsQS8dEeXpLWgvpjhCl1Se8mA9HJDd67zgQg7+fEjOvbFPOpsA7HyjnaMt/NgMAJTCm+I="; SPC_T_IV="ZFaI8cERhhivRjDeGLb5Ig=="; SPC_R_T_IV="ZFaI8cERhhivRjDeGLb5Ig=="; SPC_T_ID="9baxSgJsDYfzr7kxXp6LXQXBN+iODf51RTV+mAAsQS8dEeXpLWgvpjhCl1Se8mA9HJDd67zgQg7+fEjOvbFPOpsA7HyjnaMt/NgMAJTCm+I="`,
  //"if-none-match-": "55b03-e0a95324d9efc68eb5d93092738fcb60",
  "referer": "https://shopee.vn/search?keyword=gi%C3%A0y%20nike%20air%20max&newItem=true&noCorrection=true&page=7",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
  "x-api-source": "pc",
  "x-requested-with": "XMLHttpRequest",
  "x-shopee-language": "vi"
}

let _keyword = `giày nike max`

let sampleJob = {
  job: 111111111,
  keyword: 'giày nike max',
  status: 'processing',
  products: []
}

let cbTree = {

}

const { Parser } = require('json2csv');
const fs = require('fs');
const fields = ['field1', 'field2', 'field3'];
const opts = { fields };


//crawlShopee(sampleJob, function(){})

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

function callService(keyword, job, newest){

  let page = newest/50-1

  let url = `https://shopee.vn/api/v2/search_items/?by=sales&conditions=new&keyword=${keyword}&limit=50&newest=${newest}&order=desc&page_type=search&skip_autocorrect=1&version=2`
  let referer = `https://shopee.vn/search?keyword=${keyword}`

  if(page >=1){
    referer = `https://shopee.vn/search?keyword=${keyword}&page=${page}`
  }

  if(job.shopid){
    url = `https://shopee.vn/api/v2/search_items/?by=sales&limit=50&match_id=${job.shopid}&newest=${newest}&order=desc&page_type=shop&version=2`
    referer = `https://shopee.vn/shop/${job.shopid}/search?page=${newest/50}`
  }

  headers['referer'] = referer

  console.log(headers)
  console.log(url)

  request({
    headers: headers,
    url: url, 
    method:'get',

  },function (error, response, _body) {  
    if(error){
      console.log('callService error')

      cbTree[job.job].cb(job, [], [], error)

      return console.log(error)  
    }
    
    //console.log(_body)
    try{
      var body = JSON.parse(_body)
    }catch(e){
      console.log(e)
      console.log(_body)
      console.log(response)

      return cbTree[job.job].cb(job, [], [], _body)
    }

    console.log(body.items[0])

    handleData(body.items, keyword, job, newest)

  })
}

async function handleData(data, keyword, job, newest){

  data.map(function(e){

    let temp = {
      name: e.name,
      images: !e.images ? [] : e.images.map(function(item){
        return `https://cf.shopee.vn/file/${item}_tn`
      }),

      view_count: e.view_count,
      liked_count: e.liked_count,
      cmt_count: e.cmt_count,
      item_rating: e.item_rating,

      price: e.price,
      price_max: e.price_max,
      price_min: e.price_min,
      discount: e.discount,
      price_before_discount: e.price_before_discount,

      stock: e.stock,
      historical_sold: e.historical_sold,
      sold: e.sold,

      shop_location: e.shop_location,
      shopid: e.shopid,
      link: `https://shopee.vn/${e.name.replace(/[ ,]/g, '-')}-i.${e.shopid}.${e.itemid}`

    }

    cbTree[job.job].products.push(temp)
  })

  if(!job.shopid){
    cbTree[job.job].cb(job, cbTree[job.job].products, [])
    console.log('finish')
    return delete cbTree[job.job]
  }

  if(data.length < 50){

    //let listShopDetail = await addShopInfo(cbTree[job.job].products)

    // try {
    //   const parser = new Parser();
    //   const csv = parser.parse(cbTree[job.job].products);
    //   fs.writeFileSync('./82301700.csv', csv);
    // } catch (err) {
    //   console.error(err);
    // }

    cbTree[job.job].cb(job, cbTree[job.job].products, [])
    console.log('finish')
    return delete cbTree[job.job]
  }

  newest = newest + 50
  await timeout(5)
  callService(keyword, job, newest)
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
      //handleData(body.items, keyword, job, newest)

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