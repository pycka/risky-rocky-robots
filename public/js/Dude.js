var Dude = (function (undefined) {

  function Dude (color, x, y, dir) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.dir = dir || 0;
    this.sword = 0;
    this.shield = 0;
  }

  function oval (context, x, y) {
    var r = Math.min(x, y);
    context.beginPath();
    context.moveTo(0, y);
    context.arcTo(x, y, x, 0, r);
    context.arcTo(x, -y, 0, -y, r);
    context.arcTo(-x, -y, -x, 0, r);
    context.arcTo(-x, y, 0, y, r);
    context.lineTo(0, y);
  }

  Dude.prototype.draw_body = function (context) {
    context.fillStyle = this.color;
    oval(context, 20, 10);
    context.fill();
    context.stroke();
  };

  Dude.prototype.draw_head = function (context) {
    context.fillStyle = '#ffffcc';
    context.translate(0, -5);
    oval(context, 12, 12);
    context.fill();
    context.stroke();
    context.translate(0, 5);
  };


  Dude.prototype.draw_sword = function (context) {
    context.rotate(this.sword);
    context.translate(23, -5);
    var gradient = context.createLinearGradient(0, 0, 0, 13);
    gradient.addColorStop(0, '#ddd');
    gradient.addColorStop(1, '#999');
    context.fillStyle = gradient;
    context.beginPath();
    context.moveTo(0, 0);
    context.arcTo(60, 0, 60, 7, 13);
    context.lineTo(0, 10);
    context.lineTo(0, 0);
    context.fill();
    context.stroke();
  };

  Dude.prototype.draw_shield = function (context) {
    context.rotate(this.shield);
    context.translate(-23, 0);
    context.fillStyle = '#7c5b2b'
    context.beginPath();
    context.moveTo(0, -30);
    context.arcTo(-20, 0, 0, 30, 54);
    context.lineTo(0, -30);
    context.fill();
    context.stroke();
  };

  Dude.prototype.draw = function (context) {
    context.translate(this.x, this.y);
    context.rotate(this.dir);
    this.draw_body(context);
    this.draw_head(context);
    context.save();
    this.draw_sword(context);
    context.restore();
    this.draw_shield(context);
  };

  return Dude;
})();

if (typeof module !== 'undefined') {
  module.exports = Dude;
}
