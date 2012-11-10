var input = (function (window, document, undefined) {
  function direction (key_code) {
    switch (key_code) {
      case 87: return 'up';
      case 65: return 'left';
      case 83: return 'down';
      case 68: return 'right';
    }
  }

  function alternator (state, value) {
    return function (event) {
      state[direction(event.keyCode)] = value;
    };
  }

  function direction (state, canvas, dude) {
    return function (event) {
      var dx, dy, dc, dir, sin;
      dx = event.offsetX / canvas.scale - dude.x;
      dy = event.offsetY / canvas.scale - dude.y;
      dc = Math.sqrt(dx * dx + dy * dy);
      dir = Math.asin(dy / dc) + Math.PI / 2;
      if (dx < 0) {
        dir = -dir;
      }
      dude.dir = dir;
    };
  }

  function input (canvas, dude) {
    var state = {
      dir: 0, up: false, down: false, left: false, right: false
    };

    window.onkeydown = alternator(state, true);
    window.onkeyup = alternator(state, false);

    canvas.onmousemove = direction(state, canvas, dude);
  }

  return input;
})(window, document);
