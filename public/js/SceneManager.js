var SceneManager = (function (window, document, undefined) {
  function SceneManager (canvas, dudes) {
    this.context = canvas.getContext('2d');
    if (!this.context) {
      throw new Error("Can't get a 2d context.");
    }

    // rotate coords for Box2D compatibility
    this.context.scale(1, -1);
    this.context.translate(0, -canvas.height);
    this.dudes = dudes || [];
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

  };

  return SceneManager;
})(window, document);
