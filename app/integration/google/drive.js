const fs = require('fs');
const {google} = require('googleapis');

function listFiles(oauth2Client, googleFolderId, cb) {

  let drive = google.drive({ version: 'v3', auth: oauth2Client});

  let params = {
    includeRemoved: false,
    spaces: 'drive',
    fields: 'nextPageToken, files(id, name, parents, mimeType, webViewLink)',
    corpora: 'user',
    q: `mimeType="application/vnd.google-apps.spreadsheet" or mimeType="application/vnd.ms-excel"`
  }
  // if(googleFolderId){
  //   params = {
  //     q: `'${googleFolderId}' in parents`
  //   }
  // }

  drive.files.list(params, (err, data) => {
    if (err) {
      console.log('listFiles', err)
      if(cb){
        return cb('get file error', null)
      }
    }

    if(cb){
      cb(null, data.data.files)
    }
  })

  // var retrievePageOfFiles = function(request, result) {
  //   request.execute(function(resp) {
  //     result = result.concat(resp.items);
  //     var nextPageToken = resp.nextPageToken;
  //     if (nextPageToken) {
  //       request = drive.files.list({
  //         'pageToken': nextPageToken
  //       });
  //       retrievePageOfFiles(request, result);
  //     } else {
  //       callback(result);
  //     }
  //   });
  // }

  // var initialRequest = drive.files.list();

  // retrievePageOfFiles(initialRequest, []);
}


module.exports = {
  listFiles: listFiles
}