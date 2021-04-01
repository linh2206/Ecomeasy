// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 

let AWS_ACCESS_KEY = `AKIAJPFDLULOGDYHO3MA`
let AWS_SECRET_KEY = `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`

// const SESConfig = {
//     apiVersion: "2010-12-01",
//     accessKeyId: AWS_ACCESS_KEY,
//     accessSecretKey: AWS_SECRET_KEY,
//     region: "ap-southeast-1"
// }
AWS.config.loadFromPath('./config.json');

// Create sendEmail params 
var params = {
  Destination: { /* required */
    CcAddresses: [
      'thanhthang20@gmail.com',
      /* more items */
    ],
    ToAddresses: [
      'thanhthang20@gmail.com',
      /* more items */
    ]
  },
  Message: { /* required */
    Body: { /* required */
      Html: {
       Charset: "UTF-8",
       Data: "HTML_FORMAT_BODY"
      },
      Text: {
       Charset: "UTF-8",
       Data: "TEXT_FORMAT_BODY"
      }
     },
     Subject: {
      Charset: 'UTF-8',
      Data: 'Test email'
     }
    },
  Source: 'thang@ecomeasy.asia', /* required */
  ReplyToAddresses: [
     'thang@ecomeasy.asia',
    /* more items */
  ],
};

// Create the promise and SES service object
var sendPromise = new AWS.SES().sendEmail(params).promise();

// Handle promise's fulfilled/rejected states
console.log('sendPromise')
sendPromise.then(
  function(data) {
    console.log(data.MessageId);
  }).catch(
    function(err) {
    console.error(err, err.stack);
  });



var ses = new AWS.SES();
var params2 = {
  IdentityType: "EmailAddress", 
  MaxItems: 123, 
  NextToken: ""
 };
 ses.listIdentities(params2, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
   /*
   data = {
    Identities: [
       "user@example.com"
    ], 
    NextToken: ""
   }
   */
 });