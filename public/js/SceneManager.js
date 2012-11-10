var SceneManager = (function (window, document, undefined) {

  function resize (canvas) {
    var r = canvas.width / canvas.height;
    var size;
    return function () {
      var W, H, w, h, R;
      W = document.documentElement.clientWidth;
      H = window.innerHeight;
      R = W / H;
      if (r < R) {
        w = H * r;
        h = H;
      } else {
        w = W;
        h = W / r;
      }
      canvas.style.width = w + 'px';
      canvas.style.height = h  + 'px';
      canvas.scale = w / canvas.width;
    };
  }

  function SceneManager (canvas, dudes, debug) {
    this.dudes = dudes || [];
    this.debug = debug;

    this.context = canvas.getContext('2d');
    if (!this.context) {
      throw new Error("Can't get a 2d context.");
    }

    var resize_canvas = resize(canvas);

    if(debug) {
      var resize_debug = resize(debug);
    }

    window.onresize = function (event) {
      resize_canvas();

      if (debug) {
        resize_debug();
      }
    };

    window.onresize();
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
