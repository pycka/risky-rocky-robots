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

    this.scores = [
      // {name: 'A', k: 0, d: 0},
      // {name: 'B', k: 0, d: 0},
      // {name: 'C', k: 0, d: 0},
      // {name: 'D', k: 0, d: 0}
    ];

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

  SceneManager.prototype.reset = function (dudes) {
    this.dudes = dudes;
  };

  SceneManager.prototype.redraw = function () {
    if (!this.debug) {
      this.drawBackground();
    }
    this.drawCredits();
    this.drawDudes();
    this.drawScores();
  };

  SceneManager.prototype.update = function (updates) {
    var update, dude;
    for (var i = 0; i < updates.length && i < this.dudes.length; ++i) {
      update = updates[i];
      dude = this.dudes[i];
      for (prop in update) {
        if (update.hasOwnProperty(prop)) {
          dude[prop] = update[prop];
        }
      }
    }
  };

  SceneManager.prototype.updateStats = function (scores) {
    if (scores) {
      this.scores = scores;
    }
  }

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

  SceneManager.prototype.drawCredits = function () {
    this.context.font = 'normal 12px sans-serif';
    this.context.fillStyle = '#777';
    this.context.fillText('By szywon & pycka 2012. Press Esc to exit arena.', 10, 470);
  }

  SceneManager.prototype.drawScores = function () {
    var score, text;
    this.context.save();
    for (var i = 0; i < this.dudes.length && i < this.scores.length; ++i) {
      score = this.scores[i];
      text = score.name + '\tkills: ' + score.k + '\tdeaths: ' + score.d
      this.context.translate(0, 25);
      this.context.font = 'normal 20px sans-serif';
      this.context.fillStyle = this.dudes[i].color;
      this.context.fillText(text, 10, 0);
      this.context.strokeText(text, 10, 0);
    }
    this.context.restore();
  }

  return SceneManager;
})(window, document);
g
