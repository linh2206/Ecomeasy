const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');


function listData(spreadsheetId, range, authClient, cb) {
  
  const sheets = google.sheets({version: 'v4', auth: authClient});

  sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: range,
  }, (err, res) => {
    if (err) {
      cb(err, null)
      return console.log('listData 1', spreadsheetId, err)
    }

    if(res.data && res.data.values){
      var rows = res.data.values;
    }else{
      cb(err, null)
      return console.log('listData 2', spreadsheetId, res.data)
    }

    if (rows.length) {
      cb(null, rows)
    } else {
      return console.log('listData 3', spreadsheetId, res.data)
    }
    
  })
}

//https://ecomeasy.asia/callback/googlesheet?code=4/0QFGoa85o_WSIR9v0kgQy3T576wcCmV4lbtiK4hhrk1hju2AGaLKvZbymrDSYu8v3WRS31XXAkQ7DqTwgIi5SR8&scope=https://www.googleapis.com/auth/spreadsheets.readonly
function pushToGoogleSheet(_orders, fileName, cb){
  orders = _orders
  // Load client secrets from a local file.
  fs.readFile('./src/controller/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), async function(auth){
      authClient = auth
      const spreadsheet = await createSpreadsheet(fileName)
      const sheet = await addSheet(spreadsheet)
      await addData(spreadsheet, sheet)
      cb(spreadsheet)
    });
  });
}

async function createSpreadsheet (title) {

  const request = {
    resource: {
      "properties": {
        "title": title,
      },
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.create(request)).data;
    // TODO: Change code below to process the `response` object:
    
    let spreadsheet = JSON.stringify(response, null, 2)
    console.log(spreadsheet);
    return response
  } catch (err) {
    console.error(err);
  }
}

async function addSheet (spreadsheet) {
  console.log(spreadsheet.spreadsheetId)

  const request = {
    // The spreadsheet to apply the updates to.
    spreadsheetId: spreadsheet.spreadsheetId,  // TODO: Update placeholder value.

    resource: {
      // A list of updates to apply to the spreadsheet.
      // Requests will be applied in the order they are specified.
      // If any request is not valid, no requests will be applied.
      "requests": [
        {
          "addSheet": {
            "properties": {
              "title": "Deposits",
              "gridProperties": {
                "rowCount": 20,
                "columnCount": 12
              },
              "tabColor": {
                "red": 1.0,
                "green": 0.3,
                "blue": 0.4
              }
            }
          }
        }
      ]

      // TODO: Add desired properties to the request body.
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.batchUpdate(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
    return response
  } catch (err) {
    console.error(err);
  }
}

async function addData (spreadsheet, sheet) {

  const values = orders.map(function(el){
    return [
      el.order_id, 
      el.price
    ]
  })


  const title = sheet.replies[0].addSheet.properties.title
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadsheet.spreadsheetId,  // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    
    resource: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          "range": `${title}!A1:D100`,
          "majorDimension": "ROWS",
          "values": values

          // [
          //   ["Item", "Cost", "Stocked", "Ship Date"],
          //   ["Wheel", "$20.50", "4", "3/1/2016"],
          //   ["Door", "$15", "2", "3/15/2016"],
          //   ["Engine", "$100", "1", "3/20/2016"],
          //   ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
          // ],
        }
      ]
    },
    auth: authClient,
  };



  try {
    var response = (await sheets.spreadsheets.values.batchUpdate(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

async function updateDataToCurrentSheet (values, brand_src_des) {
 
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: brand_src_des.spreadsheet,  // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    
    resource: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          "range": `${brand_src_des.sheet}!${brand_src_des.range}`,
          "majorDimension": "ROWS",
          "values": values

          // [
          //   ["Item", "Cost", "Stocked", "Ship Date"],
          //   ["Wheel", "$20.50", "4", "3/1/2016"],
          //   ["Door", "$15", "2", "3/15/2016"],
          //   ["Engine", "$100", "1", "3/20/2016"],
          //   ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
          // ],
        }
      ]
    },
    auth: authClient,
  };



  try {
    var response = (await sheets.spreadsheets.values.batchUpdate(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

//https://stackoverflow.com/questions/39159535/i-want-to-delete-row-in-googlesheet-using-googlesheet-api-v4#:~:text=As%20mentioned%20in%20Migrate%20to,of%20a%20row%20or%20column.
async function clearOldData (authClient, spreadsheetId, range) {
  
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadsheetId,  // TODO: Update placeholder value.

    // The A1 notation of the values to clear.
    range: range,  // TODO: Update placeholder value.

    resource: {
      // TODO: Add desired properties to the request body.
    },

    auth: authClient,
  };

  const sheets = google.sheets({version: 'v4', auth: authClient});

  try {
    const response = (await sheets.spreadsheets.values.clear(request)).data;
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

async function getSheet(spreadsheetId) {
  
  const request = {
    // The spreadsheet to request.
    spreadsheetId: spreadsheetId,  // TODO: Update placeholder value.

    // The ranges to retrieve from the spreadsheet.
    ranges: [],  // TODO: Update placeholder value.

    // True if grid data should be returned.
    // This parameter is ignored if a field mask was set in the request.
    includeGridData: false,  // TODO: Update placeholder value.

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.get(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
    return response
  } catch (err) {
    console.error(err);
  }
}

async function insertRow (spreadsheet, data, range) {
  console.log(spreadsheet.spreadsheetId)
  const sheetId = spreadsheet.sheets[0].properties.sheetId

  const request = {
    // The spreadsheet to apply the updates to.
    spreadsheetId: spreadsheet.spreadsheetId,  // TODO: Update placeholder value.

    resource: {
      // A list of updates to apply to the spreadsheet.
      // Requests will be applied in the order they are specified.
      // If any request is not valid, no requests will be applied.
      "requests": [
        {
          "insertDimension": {
            "range": {
              "sheetId": sheetId,
              "dimension": "ROWS",
              "startIndex": 0,
              "endIndex": 0
            },
            "inheritFromBefore": false
          }
        }
      ]

      // TODO: Add desired properties to the request body.
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.batchUpdate(request)).data;
    // TODO: Change code below to process the `response` object:
    //console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }

  const dataRequest = {
    // The ID of the spreadsheet to update.
    spreadsheetId: spreadsheet.spreadsheetId,  // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    
    resource: {
      valueInputOption: "USER_ENTERED",
      data: [
        {
          "range": range,
          "majorDimension": "ROWS",
          "values": [[data.created, data.from, data.to, data.status]]

          // [
          //   ["Item", "Cost", "Stocked", "Ship Date"],
          //   ["Wheel", "$20.50", "4", "3/1/2016"],
          //   ["Door", "$15", "2", "3/15/2016"],
          //   ["Engine", "$100", "1", "3/20/2016"],
          //   ["Totals", "=SUM(B2:B4)", "=SUM(C2:C4)", "=MAX(D2:D4)"]
          // ],
        }
      ]
    },
    auth: authClient,
  };

  try {
    var response = (await sheets.spreadsheets.values.batchUpdate(dataRequest)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
    return response
  } catch (err) {
    console.error(err);
  }
}

async function checkSheetProperty(spreadsheetId, auth){
  const sheets = google.sheets({version: 'v4', auth: auth});
  const res = sheets.spreadsheets.get({
    spreadsheetId,
  })
  return res
}


module.exports = {
  pushToGoogleSheet: pushToGoogleSheet,
  updateDataToCurrentSheet: updateDataToCurrentSheet,
  clearOldData: clearOldData,
  getSheet: getSheet,
  insertRow: insertRow,
  listData: listData,
  checkSheetProperty: checkSheetProperty
}