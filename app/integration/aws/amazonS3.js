var AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// const config = path.resolve(process.cwd(), './app/config/config_aws.json')
// console.log(config)
// AWS.config.loadFromPath(config);


AWS.config.update({ region: 'ap-southeast-1' });
const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

function upload(file, Key, cb) {

    const params = {
        Bucket: 'ece-brand-v2',
        Key: Key,
        ACL: 'public-read',
        Body: fs.readFileSync(file)

    };

    console.log("File: " + file);


    s3.upload(params, function (err, data) {
        if (err) {
            console.log("Error: ", err);
        } else {
            cb(data)
            console.log(data);
        }
    });
}

module.exports = {
    upload: upload,
}