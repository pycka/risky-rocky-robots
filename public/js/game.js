var game = (function () {

  var game = {};

  game.init = function () {
    net.connection.init('http://localhost/');
    net.bind('HELLO', function (data) {

    });

  };

  return game;
})();

game.init();
