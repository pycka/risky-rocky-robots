var SceneManager = (function (window, document, undefined) {
  function SceneManager (canvas, dudes) {
    this.dudes = dudes || [];

    this.context = canvas.getContext('2d');
    if (!this.context) {
      throw new Error("Can't get a 2d context.");
    }

    // rotate coords for Box2D compatibility
    this.context.scale(1, -1);
    this.context.translate(0, -canvas.height);
  }

  SceneManager.prototype.addDude = function (dude) {
    this.dudes.push(dude);
  };

  SceneManager.prototype.redraw = function () {
    this.drawBackground();
    this.drawDudes();
  };

  SceneManager.prototype.drawBackground = function () {
    this.context.fillStyle = '#ddd'
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  };

  SceneManager.prototype.drawDudes = function () {
    for (var i = 0; i < this.dudes.length; ++i) {
      this.context.save();
      this.dudes[i].draw(this.context);
      this.context.restore();
    }
  };

  return SceneManager;
})(window, document);
