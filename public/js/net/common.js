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
    ARENA_ENTER:     'ar_enter',
    ARENA_DENY:      'ar_deny',
    ARENA_ACCEPT:    'ar_accept',
    ARENA_EXIT:      'ar_exit',
    SCENE_UPDATE:    'scene',
    INPUT:           'in',
    CHAT_UPDATE:     'ch_up',
    CHAT_SAY:        'ch_say',
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
