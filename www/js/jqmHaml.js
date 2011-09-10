var DATA_ROLE, appendTmpl, div, hForm, hId, hTag, h_backButton, h_button, h_checkbox, h_choice, h_content, h_controlgroup, h_fieldset, h_input, h_label, h_link, h_makePage, h_navbar, h_page, h_pageFooter, h_pageHeader, h_radio, h_rightButton, h_saveButton, h_ul, hamlHtml, hamlOptStr, heditUL, yesnoChoiceTmpl;
DATA_ROLE = "data-role";
hId = function(id) {
  if (id) {
    return "#" + id;
  } else {
    return "";
  }
};
hTag = function(tag, id, options, content) {
  if (options == null) {
    options = {};
  }
  if (content == null) {
    content = "";
  }
  return "%" + tag + (hId(id)) + (hamlOptStr(options)) + " " + content;
};
hamlHtml = function(haml) {
  var hfunc;
  hfunc = Haml(haml);
  return hfunc();
};
hamlOptStr = function(options, brackets) {
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
h_ul = function(id, options) {
  var dataTheme;
  if (options == null) {
    options = {};
  }
  dataTheme = options.dataTheme || DEFAULT_STYLE;
  options["data-role"] = "listview";
  options["data-theme"] = "d";
  return hTag("ul", id, options);
};
h_link = function(label, href, options, reverse) {
  if (label == null) {
    label = "<blank>";
  }
  if (href == null) {
    href = "#";
  }
  if (reverse == null) {
    reverse = false;
  }
  options["href"] = href;
  if (reverse) {
    if (!href || (href = "#")) {
      options["data-direction"] = 'reverse';
    } else {
      options["data-rel"] = 'back';
    }
  }
  return hTag("a", null, options, label);
};
h_button = function(label, href, options, reverse) {
  if (href == null) {
    href = "#";
  }
  if (options == null) {
    options = {};
  }
  if (reverse == null) {
    reverse = false;
  }
  options[DATA_ROLE] = 'button';
  return h_link(label, href, options, reverse);
};
h_saveButton = function(form, objType, page, reverse, label) {
  if (page == null) {
    page = "#";
  }
  if (reverse == null) {
    reverse = true;
  }
  if (label == null) {
    label = "Save";
  }
  return h_link(label, page, {
    obj_type: objType,
    saveform: form
  }, true);
};
h_rightButton = function(label, href, options, reverse) {
  if (options == null) {
    options = {};
  }
  if (reverse == null) {
    reverse = false;
  }
  options["class"] = "" + (options["class"] || "") + " ui-btn-right";
  return h_link(label, href, options, reverse);
};
h_backButton = function(label, href, options) {
  if (label == null) {
    label = "Back";
  }
  if (href == null) {
    href = "#";
  }
  if (options == null) {
    options = {};
  }
  options["data-icon"] = 'arrow-l';
  return h_link(label, href, options, true);
};
h_label = function(text, forAttr, options) {
  if (options == null) {
    options = {};
  }
  options["for"] = forAttr;
  return hTag("label", null, options, text);
};
h_input = function(type, id, options) {
  var idStr;
  if (options == null) {
    options = {};
  }
  if (!options["name"]) {
    options["name"] = id;
  }
  idStr = id ? "#" + id : "";
  options["type"] = type;
  return hTag("input", id, options);
};
h_fieldset = function(label, id, options) {
  if (options == null) {
    options = {};
  }
  return "" + (hTag("fieldset", id, options)) + "\n  %legend " + label;
};
h_controlgroup = function(label, id, options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = 'controlgroup';
  return h_fieldset(label, id, options);
};
h_radio = function(label, id, options, checked) {
  return h_choice("radio", id, options);
};
h_checkbox = function(label, id, options, checked) {
  return h_choice("radio", id, options);
};
h_choice = function(label, id, options, isRadio, checked) {
  var type, _ref, _ref2;
    if ((_ref = options.value) != null) {
    _ref;
  } else {
    options.value = id;
  };
    if ((_ref2 = options.name) != null) {
    _ref2;
  } else {
    options.name = id;
  };
  type = isRadio ? "radio" : "checkbox";
  if (checked) {
    options["checked"] = "checked";
  }
  return "" + (h_input(type, id, options)) + "\n" + (h_label(label, id));
};
yesnoChoiceTmpl = function(id, label, group, yesChecked) {
  var options;
  options = {
    id: id,
    "data-type": "horizontal",
    label: label
  };
  return "" + (h_controlgroup(label, id, options = {})) + "\n  " + (h_radio("Yes", "yes", {
    name: group
  }, yesChecked)) + "\n  " + (h_radio("No", "no", {
    name: group
  }, yesChecked));
};
hForm = function(id, options) {
  if (options == null) {
    options = {};
  }
  options["accept-charset"] = options["accept-charset"] || "UTF-8";
  return hTag("form", id, options);
};
h_page = function(id, options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "page";
  return div(options, id);
};
h_pageHeader = function(title, options) {
  if (title == null) {
    title = "";
  }
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "header";
  return "" + (div(options)) + "\n    %h1 " + title;
};
div = function(options, id, content) {
  if (options == null) {
    options = {};
  }
  return hTag("div", id, options, content);
};
h_pageFooter = function(fixed, options) {
  if (fixed == null) {
    fixed = true;
  }
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "footer";
  return div(options);
};
h_navbar = function(options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "navbar";
  return div(options);
};
h_content = function(options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "content";
  return div(options);
};
h_makePage = function(id, specs) {
  var tmpl;
  tmpl = "h_" + id + "PgTmpl";
  return appendTmpl("body", tmpl);
};
appendTmpl = function(containers, templateFn, data, options) {
  var elems;
  if (typeof templateFn === 'string') {
    templateFn = eval(templateFn);
  }
  elems = genElems(templateFn, data, options);
  return $(containers).append(elems);
};
heditUL = function(id, type, options) {
  if (options == null) {
    options = {};
  }
  options["class"] = " " + (options["class"] || "") + " editList";
  options.obj_type = type;
  return h_ul(id, options);
};