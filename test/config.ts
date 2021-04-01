export const config = {
  dbServer: {
    uri: "mongodb+srv://matchsticktest:matchsticktest@cluster0-ghugl.mongodb.net/test?retryWrites=true&w=majority",
    dbName: "matchstick"
  },
  userFileStorage : {
    publicAccess: {
      folderPath: "./backend_file_storage/public_access",
      user_avatar: "user_avatar",

    },
    privateAccess: {
      folderPath: "./backend_file_storage/private_access",
    }
  },

  selfServer: {
    domain: "outbreakagency.io",
    host: "null",
    ip: "http://167.179.81.138",
    port: 3002
  },

  webServer: {
    domain: "marketinggroup.io",
    host: "null",
    ip: "http://localhost",
    port: 3000
  },

  allowedOrigins: [
    "http://127.0.0.1:3000", 
    "http://localhost:3000", 
    "http://www.outbreakagency.com", 
    "http://outbreakagency.com",
    "https://www.outbreakagency.com", 
    "https://outbreakagency.com",
  ],

  sendGridAuth: {
    apiKey: "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" 
  },
  tokenSecret: "This is magic",
  imgurAuth: {
    clientId: "71d13145760354c"
  },
}