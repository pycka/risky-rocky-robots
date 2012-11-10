(function (window, document, undefined) {
  var canvas = document.getElementById('game');

  var dudes = [
    new Dude('red', 20, 20, Math.PI / 4),
    new Dude('green', 20, 80, Math.PI * 5 / 4),
    new Dude('blue', 80, 80, Math.PI * 7 / 4),
    new Dude('yellow', 80, 20, Math.PI * 3 / 4)
  ];

  var scene_manager = new SceneManager(canvas, dudes);
  scene_manager.redraw();

})(window, document);
