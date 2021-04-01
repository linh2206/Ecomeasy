const jwt = require("jsonwebtoken");
const config = require('../../config/config_app')

module.exports = {
  createToken: function(payload) {
    var options = {
      //expiresInMinutes: 123456
    };
    var token = jwt.sign(payload, config.tokenSecret, options);
    return token;
  },

  decodeToken: function (token, cb){
    try {
	    var payload = jwt.verify(token, config.tokenSecret);
    } catch(err) {
	    return cb(err);
    }
    return cb(null, payload);
  },

  syncDecodeToken: function(token){
    return jwt.verify(token, config.tokenSecret);
  }
};