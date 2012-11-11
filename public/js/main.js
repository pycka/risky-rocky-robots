// (function (window, document, undefined) {
//   var canvas = document.getElementById('game');

//   var dudes = [
//     new Dude('red', 280, 200, Math.PI * 3 / 4),
//     new Dude('green', 280, 280, Math.PI * 9 / 4),
//     new Dude('blue', 360, 280, -Math.PI * 9 / 4),
//     new Dude('yellow', 360, 200, -Math.PI * 3 / 4)
//   ];

//   var scene_manager = new SceneManager(canvas, dudes);

//   var b2_scene = new Box2dScene(dudes);

//   var input_state = input(canvas);

//   function update () {
//     // client -> serv: input_state[]
//     b2_scene.update([input_state]);
//     var updates = b2_scene.step();
//     // serv -> clients[] : bcast updates
//     scene_manager.update(updates);
//     scene_manager.redraw();
//     webkitRequestAnimationFrame(update);
//   }

//   update();

// })(window, document);
