var net = require('../public/js/net/common');
var Arena = require('./Arena').Constructor;

var lobby = {

  // statics
  usersByName:  {},
  usersBySid:   {},
  arenas:       {},
  state: {
    userCount: 0,
    arenas:    null
  },

  // methods
  getArena: function (name) {
    return this.arenas[name];
  },

  getUserBySocket: function (socket) {
    return this.usersBySid[socket.id];
  },


  // subspaces
  arena: {

    register: function (arenaName, socket) {
      if (!lobby.arenas[arenaName]) {
        var user = lobby.getUserBySocket(socket);
        var arena = new Arena(arenaName, user.name);

        lobby.arenas[arenaName] = arena;

        return true;
      }

      return false;
    },

    enter: function (arenaName, user) {
      var arena = lobby.getArena(arenaName);

      return arena && arena.attach(user);
    },

    exit: function (user, arena) {

    }
  },

  // namespaces
  user: {
    register: function (user, socket) {
      if (!lobby.usersByName[user.name]) {
        user.socket = socket;
        user.arena = null;

        lobby.usersByName[user.name] = user;
        lobby.usersBySid[user.socket.id] = user;

        return true;
      }

      return false;
    },

    /**
     * Usually invoked by client disconnecting from server.
     */
    unregisterBySocket: function (socket) {
      var user = lobby.getUserBySocket(socket);

      if (user) {
        if (user.arena) {
          user.arena.detach(user);
        }

        delete lobby.usersBySid[socket.id];
        delete lobby.usersByName[user.name];

        lobby.notify();
      }
    }

  },

  /**
   * Broadcast lobby update to clients.
   */
  notify: function () {
    var state = this.state;
    state.userCount = Object.keys(this.usersByName).length;
    state.arenas = lobby.arenas;

    game.net.broadcast(net.LOBBY_UPDATE, state);
  }
};

var game = {

  arena: {
    initSocket: function (socket) {
      socket.on(net.ARENA_CREATE, function (arenaName) {
        if (lobby.arena.register(arenaName, socket)) {
          console.log('arena created', arenaName);
          lobby.notify();
        }
        else {
          console.log('arena denied');
          socket.emit(net.ARENA_DENY, 'Name alrady taken.');
        }
      });

      socket.on(net.ARENA_ENTER, function (arenaName) {
        var user = lobby.getUserBySocket(socket);
        var arena = lobby.getArena(arenaName);

        if (arena && arena.attach(user)) {
          console.log('arena');
          console.log(arena);
          console.log(user.name);

          socket.emit(net.ARENA_ACCEPT);
        }
        else {
          socket.emit(net.ARENA_DENY, 'Arena not found or full.');
        }
      });
    }
  },

  input: {
    initSocket: function (socket) {
      socket.on(net.INPUT_PUSH, function (input) {
        var user = lobby.getUserBySocket(socket);
        if (user) {
          user.input = input;
        }
      });
    }
  },

  net: {
    broadcast: function (ev, data) {
      var users = lobby.usersByName;

      for (var user in users) {
        users[user].socket.emit(ev, data);
      }
    }
  },

  user: {
    // Inject socket handlers.
    initSocket: function (socket) {
      socket.on(net.USER_REGISTER, function (user) {
        if (lobby.user.register(user, socket)) {
          console.log('user accepted', user.name);
          socket.emit(net.USER_ACCEPT);
          lobby.notify();
        }
        else {
          console.log('user denied');
          socket.emit(net.USER_DENY, 'Name alrady taken.');
        }
      });
    },
  }

};

function onClientConnect (socket) {
  console.log('Connected ', socket.id);

  // bind essential listeners
  game.user.initSocket(socket);
  game.arena.initSocket(socket);
  game.input.initSocket(socket);
  socket.on('disconnect', function () {
    lobby.user.unregisterBySocket(socket);
  });
}

// Exports:
exports.onClientConnect = onClientConnect;

