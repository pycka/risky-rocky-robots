/**
 * Common thingies between Node and client.
 */
(function (global) {

  var common = {
    USER_REGISTER:   'usr',         // client ==> server
    USER_DENY:       'usr_deny',    // client <== server
    USER_ACCEPT:     'usr_acpt',    // client <== server
    LOBBY_UPDATE:    'lob_up',      // client <== server

    ARENA_CREATE:    'ar_creat',    // (req) client <=> server (acc)
    ARENA_ENTER:     'ar_enter',    // client ==> server
    ARENA_DENY:      'ar_deny',     // client <== server
    ARENA_ACCEPT:    'ar_accept',   // client <== server
    ARENA_EXIT:      'ar_exit',
    INPUT_PUSH:      'in',
    SCENE_UPDATE:    'scene',
  };

  // Export for Node:
  if (typeof module !== 'undefined') {
    module.exports = common;
  }
  // Export for client:
  else {
    global.net = global.net || {};
    global.net.common = common;
  }

})(this);
