const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/gmail.readonly'
];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = './api/controller/token.json';

const credentials = require('../../config/credentials_google.json').web
const {client_secret, client_id, redirect_uris} = credentials;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

function gettingAuth(cb){
  // Load client secrets from a local file.
  fs.readFile('./app/integration/google/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    let _credentials = JSON.parse(content)

    credentials = _credentials.web;

    // authorize(JSON.parse(content), async function(auth){
    //   authClient = auth
    //   console.log('authorize to google')
    //   //cb()
    // });
  });
}
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(brandId, callback) {
  
  
  return getAuthUrl(oAuth2Client, brandId, callback)
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAuthUrl(state, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    approval_prompt: "force",
    access_type: 'offline',
    scope: SCOPES,
    state: state,
  });
  console.log('Authorize this app by visiting this url:', authUrl);

  return callback(authUrl)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function googleGetTokenFromCode(code, callback) {
  
  oAuth2Client.getToken(code, (err, token) => {
    if (err) {
      console.error('Error while trying to retrieve access token', err);
      return callback(err)
    }
    //oAuth2Client.setCredentials(token);
    console.log(token)
    callback(null, token);
  });
}

async function getAuthObject(token) {
  oAuth2Client.setCredentials(token);
  return oAuth2Client
}

async function  refeshToken(cb) {
  oAuth2Client.refreshAccessToken(function(err, tokens) {
    // your access_token is now refreshed and stored in oauth2Client
    // store these new tokens in a safe place (e.g. database)
    if(err){
      console.log('refreshAccessToken', err)
      return cb(err, null)
    }
    
    console.log('refreshAccessToken', tokens)
    cb(null, {
      oAuth2Client: oAuth2Client,
      tokens: tokens
    })
  });
}

module.exports = {
  getAuthUrl: getAuthUrl,
  googleGetTokenFromCode: googleGetTokenFromCode,
  getAuthObject: getAuthObject,
  refeshToken: refeshToken
}