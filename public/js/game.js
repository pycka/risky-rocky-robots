var game = (function (net, user, input) {

  var TEXT_ABOUT = 'About text';
  var INPUT_PUSH_INTERVAL = 300;

  var game = {};
  var conn = net.connection;
  var inputPushTimer = 0;
  var inputPushOn = false;

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
    inputState:     null,

    /**
     * @context {SocketNamespace}
     */
    bootstrap: function () {
      var that = game.lobby;

      that.arenaRowTpl = _.template(
        '<tr>' +
        '<td><%- name %></td>' +
        '<td><%- count %></td>' +
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

      that.inputState = input(document.getElementById('game'));
      console.log(that.inputState);
      that.show();

      conn.socket.on(net.common.LOBBY_UPDATE, that.update);
      conn.socket.on(net.common.ARENA_CREATE, that.alert);
      conn.socket.on(net.common.ARENA_DENY, that.alert);
      conn.socket.on(net.common.ARENA_ACCEPT, that.enterArena);
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

    enterArena: function () {
      game.lobby.hide();
      game.lobby.startInputPush();
    },

    /**
     * @todo invocation
     */
    exitArena: function () {
      game.lobby.stopInputPush();
      game.lobby.show();
    },

    /**
     * @param   {MouseEvent}
     * @context {DOMElement}
     */
    selectArena: function (event) {
      var arenaName = event.target.textContent;

      if (arenaName) {
        conn.socket.emit(net.common.ARENA_ENTER, arenaName);
      }
    },

    startInputPush: function () {
      console.log(inputPushOn);
      if (inputPushOn === false) {
        this.inputPushOn = true;
        this.inputPush();
      }
    },

    stopInputPush: function () {
      inputPushOn = false;
      inputPushTimer = clearTimeout(inputPushTimer);
    },

    /**
     * @private
     */
    inputPush: function inputPush() {
      conn.socket.emit(net.common.INPUT_PUSH, game.lobby.inputState);
      inputPushTimer = setTimeout(inputPush, INPUT_PUSH_INTERVAL);
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
})(net, user, input);

window.addEventListener('load', function () {
  game.bootstrap();
}, false);

