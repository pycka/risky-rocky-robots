var game = (function (net, user) {

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
    conn.bind('USER_ACCEPT', game.lobby.init);
    conn.bind('USER_DENY', function () {
      alert('Denied, try with other name.');
      game.configureUser();
    });

    game.configureUser();
  };

  game.configureUser = function () {
    user.name = prompt('Player name (required)');

    if (user.name) {
      user.color = prompt('Player color (optional)') || 'pink';
      conn.registerUser(user);
    }
  };

  /**
   *
   */
  game.lobby = {
    elLobby:        null,
    elPlayerInfo:   null,
    elLobbyStatus:  null,

    /**
     * @context {SocketNamespace}
     */
    init: function () {
      var that = game.lobby;

      that.elLobby = document.getElementById('lobby');
      that.elPlayerInfo = document.getElementById('lobby_player');
      that.elLobbyStatus = document.getElementById('lobby_status');

      that.elPlayerInfo.innerHTML = user.name;
      that.elPlayerInfo.style.color = user.color;
      that.show();

      conn.socket.on(net.common.LOBBY_UPDATE, that.update);
    },

    show: function () {
      this.elLobby.className = 'shown';
    },

    hide: function () {
      this.elLobby.className = '';
    },

    /**
     * @param   {Object}  data
     * @context {Undefined}
     */
    update: function (data) {
      var lobby = game.lobby;

      lobby.elLobbyStatus.innerHTML = 'Players: ' + data.userCount;
      lobby.updateArenas();
    },

    updateArenas: function () {

    },

    updateChat: function () {

    }
  };

  /**
   * Alert network errors.
   */
  game.onNetworkError = function () {
    alert('Network fail');
  };

  return game;
})(net, user);

game.bootstrap();
