var input = (function (window, document, undefined) {

  function direction (key_code) {
    switch (key_code) {
      case 87: return 'up';
      case 65: return 'left';
      case 83: return 'down';
      case 68: return 'right';
      case 27: game.lobby.exitArena(); return null;
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

  function mouse_position (state, canvas) {
    return function (event) {
      state.mouse_x = event.offsetX / canvas.scale;
      state.mouse_y = event.offsetY / canvas.scale;
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

  function input (canvas) {
    var state = {
      mouse_x: 320,
      mouse_y: 240,
      fight:   false,
      dodge:   false,
      up:      false,
      down:    false,
      left:    false,
      right:   false,
    };

    window.onkeydown = alternator(state, true);
    window.onkeyup = alternator(state, false);

    canvas.onmousedown = mouse_action(state, true);
    canvas.onmouseup = mouse_action(state, false);

    canvas.onmousemove = mouse_position(state, canvas);
    canvas.oncontextmenu = function (event) { event.preventDefault(); };

    return state;
  }

  return input;
})(window, document);
