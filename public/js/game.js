var game = (function (net) {

  var game = {};
  var conn = net.connection;

  /**
   * Establish connection.
   *
   */
  game.bootstrap = function () {
    conn.init('http://localhost/');

    // errors
    conn.socket.on('connect_failed', this.onNetworkError);
    conn.socket.on('disconnect', this.onNetworkError);
    conn.socket.on('error', this.onNetworkError);

    // great success!
    conn.socket.on('connect', this.bootstrapUser);
  };

  /**
   * Get user data (name & color).
   */
  game.bootstrapUser = function () {
    conn.bind('USER_ACCEPT', game.loadLobby);
    conn.bind('USER_DENY', function () {
      alert('Denied, try with other name.');
      game.configureUser();
    });

    game.configureUser();
  };

  game.configureUser = function () {
    user.name = prompt('name') || 'Default User Name';
    user.color = prompt('color') || 'magenta';

    conn.registerUser(user);
  };

  /**
   *
   */
  game.loadLobby = function () {

  };

  /**
   * Alert network errors.
   */
  game.onNetworkError = function () {
    alert('Network fail');
  };

  return game;
})(net);

game.bootstrap();
