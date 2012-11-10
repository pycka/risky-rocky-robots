var Dude = (function (window, undefined) {

  function Dude (color, x, y, dir) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.sword = 0;
    this.shield = 0;
  }

  Dude.prototype.draw = function (context) {

  };

  return Dude;
})(window);
