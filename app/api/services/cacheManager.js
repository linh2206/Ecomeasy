var users = [];
const LENGTH = 200;

console.log("user cache volume: ", users.length);

Array.prototype.removeIf = function(callback) {
    var i = this.length;
    while (i--) {
        if (callback(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

function getUserFromCache(userId){
  var length = users.length;
  var user = null;

  for(let i=0; i<length; i++){
    if(users[i]._id.toString() == userId){
      user = users[i];
      break;
    }
  }

  return user;
}

function updateUserToCache(user){

  if(users.length == LENGTH){
    users.pop();
  }

  users.unshift(user);

  console.log("user cache volume: " + users.length);
}

function removeUserFromCache(userId){
  users.removeIf( function(user, idx) {
    return user._id.toString() == userId;
  })
}

module.exports = {
  getUserFromCache: getUserFromCache,
  updateUserToCache: updateUserToCache,
  removeUserFromCache: removeUserFromCache
};