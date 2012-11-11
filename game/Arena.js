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
  this.playersByIndex = {};
  this.dudes = [];
  this.count = 0;
  this.max = 4;
  this.stats = [];
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
    var index = this.count;

    user.arena = this;
    this.players[user.name] = {
      name: user.name,
      i: index
    };
    this.playersByIndex[index] = user.name;
    this.stats[index] = {
      name: user.name,
      k: 0,
      d: 0
    };

    this.dudes[index] = dude;

    // console.log('new');
    // console.log(this.players);
    // console.log(this.playersByIndex);

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
  var index = this.players[user.name].i;

  delete this.players[user.name];
  // delete this.playersByIndex[index];
  this.stats.splice(index, 1);
  this.dudes.splice(index, 1);

  this.count--;
  console.log(index);
  scenes[this.name].removeDude(index);

  // recalc index values
  var i;
  // console.log('before');
  // console.log(this.players);
  // console.log(this.playersByIndex);
  this.playersByIndex = {};
  for (var player in this.players) {
    player = this.players[player];
    i = player.i;
    if (i > index) {
      --i;
      player.i = i;
      this.playersByIndex[i] = player.name;
    }
  }
  // console.log('after');
  // console.log(this.players);
  // console.log(this.playersByIndex);
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
