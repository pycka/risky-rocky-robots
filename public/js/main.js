// (function (window, document, undefined) {
//   var canvas = document.getElementById('game');

//   var dudes = [
//     new Dude('red', 280, 200, 0),
//     new Dude('green', 280, 280, 0),
//     new Dude('blue', 360, 280, 0),
//     new Dude('yellow', 360, 200, 0)
//   ];

//   var scene_manager = new SceneManager(canvas, dudes, canvas);

//   var b2_scene = new Box2dScene(dudes, canvas);

//   var input_state = input(canvas);

//   function update () {
//     // client -> serv: input_state[]
//     b2_scene.update([input_state]);
//     var updates = b2_scene.step();
//     // serv -> clients[] : bcast updates
//     scene_manager.update(updates);
//     b2_scene.redraw();
//     scene_manager.redraw();
//     webkitRequestAnimationFrame(update);
//   }

//   update();

// })(window, document);
