var game = (function (net, user) {

  var TEXT_ABOUT = 'About text';

  var game = {};
  var conn = net.connection;

  /**
   * Start init process. Establish connection. Called manually.
   */
  game.bootstrap = function () {
    conn.init(window.location);

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
    conn.bind('USER_ACCEPT', game.lobby.bootstrap);
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
    arenaRowTpl:    null,
    elLobby:        null,
    elPlayerInfo:   null,
    elLobbyStatus:  null,
    elAboutLink:    null,
    elLobbyArenas:  null,

    /**
     * @context {SocketNamespace}
     */
    bootstrap: function () {
      var that = game.lobby;

      that.arenaRowTpl = _.template(
        '<tr data-arena="<%- name %>">' +
        '<td><%- name %></td>' +
        '<td><%- players %></td>' +
        '<td><%- max %></td>' +
        '</tr>'
      );

      that.elLobby = document.getElementById('lobby');
      that.elPlayerInfo = document.getElementById('lobby_player');
      that.elLobbyStatus = document.getElementById('lobby_status');
      that.elAboutLink = document.getElementById('lobby_about');
      that.elLobbyArenas = document.getElementById('lobby_arenas_tab');
      that.elNewArenaLink = document.getElementById('lobby_arena_new')
      that.elNewArenaLink.addEventListener('click', that.createArena, false);

      that.elPlayerInfo.innerHTML = user.name;
      that.elPlayerInfo.style.color = user.color;
      that.elAboutLink.addEventListener('click', that.about, false);
      that.elLobbyArenas.addEventListener('click', that.selectArena, false);

      that.show();

      conn.socket.on(net.common.LOBBY_UPDATE, that.update);
      conn.socket.on(net.common.ARENA_CREATE, that.alert);
      conn.socket.on(net.common.ARENA_DENY, that.alert);
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
      lobby.updateArenas(data.arenas);
    },

    updateArenas: function (arenas) {
      var html = '';
      var tpl = this.arenaRowTpl;

      for (var id in arenas) {
        html += tpl(arenas[id]);
      }

      this.elLobbyArenas.innerHTML = html;
    },

    /**
     * @context {DOMElement}
     */
    createArena: function () {
      var name = prompt('Arena name');
      if (name) {
        conn.registerArena(name);
      }
    },

    /**
     * @param   {MouseEvent}
     * @context {DOMElement}
     */
    selectArena: function (event) {
      console.log(event);
      console.log(this);
    },

    /**
     * Used to display instructions.
     * @context {DOMElement}
     */
    about: function (ev) {
      ev.preventDefault();
      alert(TEXT_ABOUT);
    },

    alert: function (text) {
      alert(text);
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
