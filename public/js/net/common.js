/**
 * Common thingies between Node and client.
 */
(function (global) {

  var common = {
    USER_REGISTER:   'usr',
    USER_DENY:       'usr_deny',
    USER_ACCEPT:     'usr_acpt',
    LOBBY_UPDATE:    'lob_up',

    CHAT_UPDATE:     'ch_up',
    CHAT_SAY:        'ch_say',
    ARENA_CREATE:    'ar_creat',    // (request) client <=> server (accept)
    ARENA_ENTER:     'ar_enter',
    ARENA_DENY:      'ar_deny',
    ARENA_ACCEPT:    'ar_accept',
    ARENA_EXIT:      'ar_exit',
    SCENE_UPDATE:    'scene',
    INPUT:           'in',
    ERROR:           'err'
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
