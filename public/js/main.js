(function (window, document, undefined) {
  var canvas = document.getElementById('game');
  var debug_canvas = document.getElementById('debug');

  var dudes = [
    new Dude('red', 280, 200, Math.PI * 3 / 4),
    new Dude('green', 280, 280, Math.PI * 9 / 4),
    new Dude('blue', 360, 280, -Math.PI * 9 / 4),
    new Dude('yellow', 360, 200, -Math.PI * 3 / 4)
  ];

  var scene_manager = new SceneManager(canvas, dudes, debug_canvas);

  var b2_scene = new Box2dScene(dudes, debug_canvas);

  var input_state = input(debug_canvas, dudes[0]);

  function update () {
    b2_scene.update([input_state]);
    b2_scene.step();
    scene_manager.redraw();
    webkitRequestAnimationFrame(update);
  }

  update();

})(window, document);
