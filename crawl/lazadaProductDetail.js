
/**
 * Require the puppeteer library.
 */
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const lazadaProductCol = require('../app/database/lazadaProductCol')

/**
 * Inside the main function we'll place all the required code
 * that will be used in the scraping process.
 * The reason why we create an async function is to use
 * the power of async programming  that comes with puppeteer.
 */

const ports = 9097
const excludePorts = [
  9125,
  9123,
  9103,
  9090,
  9080,
]

let paging = 0;
let portIndex = 0

//https://levelup.gitconnected.com/anonymous-web-scrapping-with-node-js-tor-apify-and-cheerio-3b36ec6a45dc
async function main(portIndex) {
  /**
   * Launch Chromium. By setting `headless` key to false,
   * we can see the browser UI.
   */

  // let temp = ports + portIndex
  // if(excludePorts.includes(temp)){
  //   portIndex = portIndex + 1
  //   return main(portIndex);
  // }

  const browser = await puppeteer.launch({
    headless: false,
    //args: ['--no-sandbox', '--proxy-server=socks5://127.0.0.1:' + (ports + portIndex)]
  });

  const page = await browser.newPage();

  handlePage(page)

  /**
   * Create a new page.
   */


  /**
   * Wait 3 seconds and then close the browser instance.
   */

  // setTimeout(() => {
  //   browser.close();
  // }, 3000);
}

async function handlePage(page) {

  let url = `https://www.lazada.vn/products/balo-set-4-mon-hoa-cuc-balo-nu-di-hoc-balo-nu-di-choi-balo-nu-thoi-trang-balo-nu-han-quoc-b2020-i735164086-s1887520514.html?spm=a2o4n.home.just4u.16.19056afeFzQi4P&scm=1007.17519.162103.0&pvid=367b82c5-e4ed-4af3-8b1b-e2f6c394d67d&clickTrackInfo=tctags%3A2024240392+1498575426+26968978%3BtcExpIds%3A243%3Btcsceneid%3AHPJFY%3Bbuyernid%3AW6f2OxnS3xV0OTbaBwbUq1k7yKvqWsTo%3Btcbid%3A2%3Btcboost%3A0%3Bpvid%3A367b82c5-e4ed-4af3-8b1b-e2f6c394d67d%3Bchannel_id%3A0000%3Bmt%3Ahot%3Bitem_id%3A735164086%3Bself_ab_id%3A162103%3Bself_app_id%3A7519%3Blayer_buckets%3A955.3634%3B`
  // console.log(url)
  await page.goto(url)
  content = await page.content();
  $ = cheerio.load(content);
  let product = {
    name: $('.pdp-mod-product-badge-title').text(),
    url: url,
    sku: $('.key-li:nth-child(2) > .key-value').text(),
    image: $('.item-gallery__thumbnail-image').attr('src'),
    price: $('.pdp-price_type_normal').text(),
    originalPrice: $('.pdp-price_type_deleted').text(),
    discount: $('.pdp-product-price__discount').text() || 0,
    stock: '',
    sold: '',
    revenue: '',
    isOutofStock: Boolean($('.add-to-cart-buy-now-btn.pdp-button_theme_gray').text()),
    crawled: new Date()
  }

  console.log('product', product)

  let filter = {
    lazadaSku: product.sku,
  }

  let staticField = {
    versions: {
      action: '$set',
      data: product,
    }
  }

  let setOnInsert = {
    lazadaSku: product.sku,
    link: url,
  }

  lazadaProductCol.findOneAndUpdate(filter, staticField, setOnInsert)

}

/**
 * Start the script by calling main().
 */
main(portIndex);



async function timeout(timeInSecond) {
  return new Promise((resolve, reject) => {

    setTimeout(function () {
      resolve()
    }, timeInSecond * 1000);

  });
}
