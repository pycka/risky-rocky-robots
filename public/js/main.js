(function (window, document, undefined) {
  var canvas = document.getElementById('game');

  var dudes = [
    new Dude('red', 280, 200, Math.PI * 3 / 4),
    new Dude('green', 280, 280, Math.PI * 9 / 4),
    new Dude('blue', 360, 280, -Math.PI * 9 / 4),
    new Dude('yellow', 360, 200, -Math.PI * 3 / 4)
  ];

  var scene_manager = new SceneManager(canvas, dudes);
  scene_manager.redraw();

})(window, document);
