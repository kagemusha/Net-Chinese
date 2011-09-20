var MULTI_END, MULTI_START, hId, hTag, hamlHtml, hamlOptionStr, multilineHaml, spacedHaml;
MULTI_START = "~multhaml";
MULTI_END = "~endmulthaml";
hId = function(id) {
  if (!id || id.length === 0) {
    return "";
  }
  if (id[0] === "#") {
    return id;
  } else {
    return "#" + id;
  }
};
hTag = function(tag, id, options, content) {
  if (options == null) {
    options = {};
  }
  if (content == null) {
    content = "";
  }
  return "%" + tag + (hId(id)) + (hamlOptionStr(options)) + " " + content;
};
hamlHtml = function(haml) {
  var hfunc;
  hfunc = Haml(spacedHaml(haml));
  return hfunc();
};
spacedHaml = function(haml) {
  var line, lines, multiSpaces, sp, spaced, spaces, spacingArray, _i, _len;
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
  sp = spaced.join("\n");
  return sp;
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
multilineHaml = function(haml) {
  return "" + MULTI_START + "\n" + haml + "\n" + MULTI_END;
};