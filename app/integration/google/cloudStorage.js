export {}

const Cloud = require('@google-cloud/storage')
const path = require('path')
const util = require('util')

const serviceKey = path.join(__dirname, "../../BeSmitten-db9e973e6e08.json")

const { Storage } = Cloud

const storage = new Storage({
    keyFilename: serviceKey,
    projectId: "besmitten"
});

const bucket = storage.bucket('besmittenstorage') // should be your bucket name

module.exports = {
  uploadImageGC: (file: any) => new Promise((resolve, reject) => {

    const { name, data } = file
    const blob = bucket.file(name.replace(/ /g, "_"))
    const blobStream = blob.createWriteStream({
      resumable: false
    })
    blobStream.on('finish', () => {
      const publicUrl = `${blob.name}`
      resolve(publicUrl)
    })
    .on('error', (e:any) => {
      console.log(e)
      reject(`Unable to upload image, something went wrong`)
    })
    .end(data)
  }),
  newPublicWriteStream(gcsFileName: any) {
    return bucket.file(gcsFileName).createWriteStream({
      predefinedAcl: 'publicRead'
    });
  },
  getImageGC(fileName: any, res: any) {
    bucket.file(fileName).exists().then(function(status: any){
      if (status[0]) {
        bucket.file(fileName).createReadStream().pipe(res);
      }
      else {
        res.status(404).end();
      }
    }).catch(function(error: any){
      console.log(error);
      res.status(500).send("error file")
    })
  },
}
