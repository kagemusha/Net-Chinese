var MULTI_END, MULTI_START, correctIndents, haTag, hamlHtml, hamlOptionStr, multilineHaml;
hamlHtml = function(haml) {
  return Haml(correctIndents(haml))();
};
haTag = function(tag, options, content) {
  if (options == null) {
    options = {};
  }
  if (content == null) {
    content = "";
  }
  return "%" + tag + (hamlOptionStr(options)) + " " + content;
};
MULTI_START = "~multhaml";
MULTI_END = "~endmulthaml";
multilineHaml = function(haml) {
  return "" + MULTI_START + "\n" + haml + "\n" + MULTI_END;
};
correctIndents = function(haml) {
  var line, lines, multiSpaces, spaced, spaces, spacingArray, _i, _len;
  lines = haml.split("\n");
  spacingArray = new Array();
  spaced = new Array();
  for (_i = 0, _len = lines.length; _i < _len; _i++) {
    line = lines[_i];
    multiSpaces = line.search(MULTI_START);
    if (multiSpaces > -1) {
      spacingArray.push(line.substring(0, multiSpaces));
    } else if (line.search(MULTI_END) > -1) {
      spacingArray.pop();
    } else {
      spaces = spacingArray.join("");
      line = "" + spaces + line;
      spaced.push(line);
    }
  }
  return spaced.join("\n");
};
hamlOptionStr = function(options, brackets) {
  var key, opts, val;
  if (brackets == null) {
    brackets = true;
  }
  if (!options) {
    return "";
  }
  if (typeof options === 'string') {
    return options;
  }
  opts = (function() {
    var _results;
    _results = [];
    for (key in options) {
      val = options[key];
      _results.push("" + key + ": '" + val + "'");
    }
    return _results;
  })();
  if (brackets) {
    return "{ " + (opts.join(", ")) + " }";
  } else {
    return opts.join(", ");
  }
};