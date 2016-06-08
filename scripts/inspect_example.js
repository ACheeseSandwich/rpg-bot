// Generated by CoffeeScript 1.10.0
(function() {
  var getArgParams, util,
    hasProp = {}.hasOwnProperty;

  util = require("util");

  getArgParams = function(arg) {
    var key, key_capture, keys;
    key_capture = /--key=(.*?)( |$)/.exec(arg);
    if (key_capture) {
      key = key_capture[1];
      keys = key.split('.');
    } else {
      keys = null;
    }
    return {
      keys: keys
    };
  };

  module.exports = function(robot) {
    robot.respond(/brain show storage(.*)$/i, function(msg) {
      var arg_params, data, i, key, keys, len, output;
      arg_params = getArgParams(msg.match[1]);
      data = robot.brain.data;
      if (keys = arg_params.keys) {
        for (i = 0, len = keys.length; i < len; i++) {
          key = keys[i];
          data = data[key];
        }
      }
      output = util.inspect(data, false, null);
      return msg.send(output);
    });
    return robot.respond(/brain show users$/i, function(msg) {
      var key, ref, response, user;
      response = "";
      ref = robot.brain.data.users;
      for (key in ref) {
        if (!hasProp.call(ref, key)) continue;
        user = ref[key];
        response += user.id + " " + user.name;
        if (user.email_address) {
          response += " <" + user.email_address + ">";
        }
        response += "\n";
      }
      return msg.send(response);
    });
  };

}).call(this);