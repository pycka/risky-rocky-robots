var net = require('../public/js/net/common');

var lobby = {
  // statics
  usersByName: {},
  usersBySid: {},
  arenas: {},
  arenaNextId: 1,
  chat: [],

  state: {
    userCount: 0,
    arenas:    null
  },

  arena: {
    register: function (arenaName, socket) {
      if (!lobby.arenas[arenaName]) {
        var user = lobby.usersBySid[socket.id];
        var arena = lobby.arena.create(arenaName, user);
        lobby.arenas[arenaName] = arena;

        return true;
      }

      return false;
    },

    create: function (arenaName, user) {
      var arena = {
        id:       lobby.arenaNextId++,
        name:     arenaName,
        owner:    user.name,
        players:  0,
        max:      1
      };

      return arena;
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
    unregisterBySocketId: function (socketId) {
      var user = lobby.usersBySid[socketId];

      if (user) {
        if (user.arena) {
          // @todo handle  departure from arena
        }

        delete lobby.usersBySid[socketId];
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
          console.log('arena accepted', arenaName);
          // socket.emit(net.ARENA_CREATE, 'Arena created');
          lobby.notify();
        }
        else {
          console.log('arena denied');
          socket.emit(net.ARENA_DENY, 'Name alrady taken.');
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
  var socketId = socket.id;
  console.log('Connected ', socket.id);

  // bind essential listeners
  game.user.initSocket(socket);
  game.arena.initSocket(socket);
  socket.on('disconnect', function () {
    lobby.user.unregisterBySocketId(socketId);
  });
}

// Exports:
exports.onClientConnect = onClientConnect;

