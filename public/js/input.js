var input = (function (window, document, undefined) {

  function direction (key_code) {
    switch (key_code) {
      case 87: return 'up';
      case 65: return 'left';
      case 83: return 'down';
      case 68: return 'right';
    }
  }

  function mouse_action (state, value) {
    return function (event) {
      event.preventDefault();

      var prop;
      prop = event.button === 0 ? 'fight' : event.button === 2 ? 'dodge' : null;
      if (prop) {
        state[prop] = value;
      }
    };
  }

  function angle (state, canvas, dude) {
    return function (event) {
      event.preventDefault();

      var dx, dy, dc, dir, sin;
      dx = event.offsetX / canvas.scale - dude.x;
      dy = event.offsetY / canvas.scale - dude.y;
      dc = Math.sqrt(dx * dx + dy * dy);
      dir = Math.asin(dy / dc) + Math.PI / 2;
      if (dx < 0) {
        dir = -dir;
      }
      state.dir = dir;
    };
  }

  function alternator (state, value) {
    return function (event) {
      var dir = direction(event.keyCode);
      if (dir) {
        state[dir] = value;
      }
    };
  }

  function input (canvas, dude) {
    var state = {
      dir:   0,
      fight: false,
      dodge: false,
      up:    false,
      down:  false,
      left:  false,
      right: false,
    };

    window.onkeydown = alternator(state, true);
    window.onkeyup = alternator(state, false);

    canvas.onmousedown = mouse_action(state, true);
    canvas.onmouseup = mouse_action(state, false);

    canvas.onmousemove = angle(state, canvas, dude);
    canvas.oncontextmenu = function (event) { event.preventDefault(); };

    return state;
  }

  return input;
})(window, document);
