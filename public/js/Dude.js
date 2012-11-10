var Dude = (function (window, undefined) {

  function Dude (color, x, y, dir) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.dir = dir;
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
  };

  Dude.prototype.draw = function (context) {
    context.translate(this.x, this.y);
    context.rotate(this.dir);
    this.draw_body(context);
    this.draw_head(context);
  };

  return Dude;
})(window);
