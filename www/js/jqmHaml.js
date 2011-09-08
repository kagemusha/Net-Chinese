var hLink, hUL, hamlHtml, hamlOptStr;
hamlHtml = function(haml) {
  var hfunc;
  hfunc = Haml(haml);
  return hfunc();
};
hamlOptStr = function(options) {
  var key, opts, val;
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
  return "{ " + (opts.join(", ")) + " }";
};
hUL = function(id, options) {
  var dataTheme;
  if (options == null) {
    options = {};
  }
  dataTheme = options.dataTheme || DEFAULT_STYLE;
  options["data-role"] = "listview";
  options["data-theme"] = "d";
  return "%ul#" + id + (hamlOptStr(options));
};
hLink = function(label, href, options, reverse) {
  var revStr;
  if (label == null) {
    label = "<blank>";
  }
  if (href == null) {
    href = "#";
  }
  if (reverse == null) {
    reverse = false;
  }
  revStr = reverse ? linkReverseAttr(url) : "";
  return "%a href='" + href + "' " + (hamlOptStr(options)) + " " + revStr + " >" + label + "</a>";
};