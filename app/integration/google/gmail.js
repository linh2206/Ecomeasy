const {google} = require('googleapis');

function getProfile(auth, cb){
	var gmail = google.gmail({auth: auth, version: 'v1'});

	gmail.users.getProfile({auth: auth, userId: 'me'}, function(err, res) {
    if (err) {
      console.log(err);
    } else {
      console.log(res.data);
      cb(res.data)
    }
	})
}

module.exports = {
  getProfile: getProfile
}