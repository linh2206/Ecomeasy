const fs = require("fs");
const CronJob = require('cron').CronJob;
var parser = require('cron-parser');

const expressApp = require('./api/app')
const balance = require('./api/controller/balance')
const config = require('./config/config_app.json')

const weeklyEmails = [
  'ngoc@ecomeasy.asia',
  'phuong@ecomeasy.asia',
  'diem@ecomeasy.asia',
  'loi@ecomeasy.asia',
  'thang@ecomeasy.asia',
  'nhung@ecomeasy.asia',
  'trinh@clevergroup.vn',
  'phuoc@viisa.vn'
]

const weeklyPattern = '00 14 * * 1'

var interval = parser.parseExpression(weeklyPattern);
console.log('weeklyPattern: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
console.log('weeklyPattern: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
console.log('weeklyPattern: ', interval.next().toString()); // Sat Dec 28 2012 22:46:00 GMT+0200 (EET)

const weeklyJob = new CronJob(
  weeklyPattern,
  async function() {
    console.log('You will see this message every week');
    let req = {
      body : {emails: JSON.stringify(weeklyEmails)},
      query: {reportType: 'week'}
    }

    let res = {
      json: function(data){
        console.log(data)
      }
    }
    balance.generateReport(req, res)
  },
  null,
  false
);
//Use this if the 4th param is default value(false)


const monthlyEmails = [
  'ngoc@ecomeasy.asia',
  'phuong@ecomeasy.asia',
  'diem@ecomeasy.asia',
  'loi@ecomeasy.asia',
  'thang@ecomeasy.asia',
  'nhung@ecomeasy.asia',
  'trinh@clevergroup.vn',
  'phuoc@viisa.vn',
  'hieu@viisa.vn'
]

const monthlyPattern = '00 14 1 * *'

interval = parser.parseExpression(monthlyPattern);
console.log('monthlyPattern: ', interval.next().toString()); // Sat Dec 29 2012 00:42:00 GMT+0200 (EET)
console.log('monthlyPattern: ', interval.next().toString()); // Sat Dec 29 2012 00:44:00 GMT+0200 (EET)
console.log('monthlyPattern: ', interval.next().toString()); // Sat Dec 28 2012 22:46:00 GMT+0200 (EET)

const monthlyJob = new CronJob(
  monthlyPattern,
  async function() {
    console.log('You will see this message every month');
    let req = {
      body : {emails: JSON.stringify(monthlyEmails)},
      query: {reportType: 'month'}
    }

    let res = {
      json: function(data){
        console.log(data)
      }
    }
    balance.generateReport(req, res)
  },
  null,
  false
);
//Use this if the 4th param is default value(false)

/**
 * Start Express server.
 */

var server;
if (process.env.NODE_ENV === 'production') {
    
  const https_options = {
    key: fs.readFileSync(
      '/etc/letsencrypt/live/data.ecomeasy.vn/privkey.pem'
    ),
    cert: fs.readFileSync(
      '/etc/letsencrypt/live/data.ecomeasy.vn/fullchain.pem'
    ),
  }
  server = require('https').Server(https_options, expressApp);


  server.listen(443, () => {
    console.log("App is running at port", 443);
  });

  if(config.cronjob){
    monthlyJob.start();
    weeklyJob.start();
  }
  
} else {

  server = require('http').Server(expressApp);

  server.listen(8080, () => {
    console.log("App is running at port", 8080);
  });
}



