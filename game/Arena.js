var _ = require('../public/js/lib/underscore.min');
var Dude = require('../public/js/Dude');
var Box2dScene = require('../public/js/Box2dScene');

/**
 * @param {String} name
 *   Arena's name.
 * @param {String} user
 *   Creator (owner) of this arena.
 *
 * @return {Boolean}
 *   Success.
 */

var scenes = {};

function Arena(name, user, hitCallback) {
  this.name = name;
  this.owner = user.name;
  this.players = {};
  this.dudes = [];
  this.count = 0;
  this.max = 4;
  scenes[name] = new Box2dScene;
  scenes[name].onHitCallback = _.bind(hitCallback, this);
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
    this.players[user.name] = {
      name: user.name,
      i: this.count
    };

    this.dudes[this.count] = dude;
    this.count++;

    scenes[this.name].addDude(dude);

    return true;
  }
  else {
    return false;
  }
};

Arena.prototype.detach = function (user) {
  user.arena = null;
  delete this.dudes[this.players[user.name].i];
  delete this.players[user.name];
  this.count--;
};

Arena.prototype.update = function (inputs) {
  var scene = scenes[this.name];

  scene.update(inputs);
  return {
    coords: scene.step(),
    stats: this.stats
  };
};

exports.Constructor = Arena;
