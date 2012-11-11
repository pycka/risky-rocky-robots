var Dude = require('../public/js/Dude').Constructor;

/**
 * @param {String} name
 *   Arena's name.
 * @param {String} user
 *   Creator (owner) of this arena.
 *
 * @return {Boolean}
 *   Success.
 */
function Arena(name, user) {
  this.name = name;
  this.owner = user.name;
  this.players = {};
  this.dudes = {};
  this.count = 0;
  this.max = 2;
}

Arena.prototype.attach = function (user) {
  if (this.count < this.max) {
    if (user.arena) {
      user.arena.detach(user);
    }

    var dx = Math.random() * 640;
    var dy = Math.random() * 480;
    var dude = new Dude(user.color, dx, dy, 0);

    user.arena = this;
    this.players[user.name] = user;
    this.dudes[user.name] = dude;
    this.count++;

    return true;
  }
  else {
    return false;
  }
};

Arena.prototype.detach = function (user) {
  user.arena = null;
  this.count--;
};

exports.Constructor = Arena;
