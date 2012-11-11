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
  this.players = [];
  this.count = 0;
  this.max = 4;
}

Arena.prototype.attach = function (user) {
  if (this.count < this.max) {
    if (user.arena) {
      user.arena.detach(user);
    }

    user.arena = this;
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
