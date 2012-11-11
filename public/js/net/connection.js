(function (io, global) {

  var common = net.common;

  global.net.connection = {

    /**
     *
     */
    socket: null,

    /**
     * Connect to server.
     */
    init: function (url) {
      this.socket = io.connect(url);

    },

    bind: function (evname, callback) {
      this.socket.on(common[evname], callback);
    },

    /**
     * @param {Object} user
     */
    registerUser: function (user) {
      this.socket.emit(common.USER_REGISTER, user);
    },

    /**
     *
     */
    registerArena: function (name) {
      this.socket.emit(common.ARENA_CREATE, name);
    },


  };

})(io, this);

// Temporarily

