var DATA_ROLE, MULTI_END, MULTI_START, appendTmpl, delProp, div, hForm, hId, hTag, h_backButton, h_button, h_checkbox, h_choice, h_choiceGroup, h_choices, h_content, h_controlgroup, h_fieldcontain, h_fieldset, h_input, h_label, h_link, h_makePage, h_navbar, h_page, h_pageFooter, h_pageHeader, h_radio, h_resetChoices, h_rightButton, h_saveButton, h_ul, hamlHtml, hamlOptionStr, heditUL, multilineHaml, multilineTest, spacedHaml, yesnoChoiceTmpl;
DATA_ROLE = "data-role";
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
  if (options == null) {
    options = {};
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
h_fieldcontain = function(id, options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "fieldcontain";
  return "" + (hTag("div", id, options));
};
h_controlgroup = function(label, options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = 'controlgroup';
  return h_fieldset(label, options);
};
h_fieldset = function(label, options) {
  var choiceDiv, id;
  if (options == null) {
    options = {};
  }
  id = delProp(options, "id");
  log("fieldset", id);
  choiceDiv = id ? "" + (idSel(id)) + ".choices" : "";
  return multilineHaml("" + (hTag("fieldset", null, options)) + "\n  %legend " + label + "\n  " + choiceDiv);
};
yesnoChoiceTmpl = function(label, fieldName, yesChecked, cgOptions) {
  var haml, options;
  if (yesChecked == null) {
    yesChecked = false;
  }
  if (cgOptions == null) {
    cgOptions = {};
  }
  options = {
    "data-type": "horizontal",
    "data-theme": "d"
  };
  haml = "" + (h_controlgroup(label, options)) + "\n  " + (h_radio("Yes", fieldName, "yes", {
    "data-theme": "d",
    value: "yes"
  }, yesChecked)) + "\n  " + (h_radio("No", fieldName, "no", {
    "data-theme": "d",
    value: "no"
  }, !yesChecked));
  return multilineHaml(haml);
};
h_choiceGroup = function(isRadio, label, fieldName, options, choices) {
  if (choices == null) {
    choices = [];
  }
  return multilineHaml("" + (h_controlgroup(label, options)) + "\n  " + (h_choices(isRadio, fieldName, choices)));
};
h_resetChoices = function(isRadioBtns, fieldId, fieldName, choices) {
  var sel;
  sel = "" + (idSel(fieldId)) + ".choices";
  $(sel).empty();
  log("reset choicezz", sel, $(sel).length);
  return $(sel).append(h_choices(isRadioBtns, fieldName, choices));
};
h_choices = function(isRadioBtns, fieldName, choicesArray) {
  var btns, choice;
  if (choicesArray == null) {
    choicesArray = [];
  }
  btns = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = choicesArray.length; _i < _len; _i++) {
      choice = choicesArray[_i];
      _results.push(h_choice(isRadioBtns, choice.label, fieldName, choice.id, choice.options, choice.checked, choice.lbl_options, false));
    }
    return _results;
  })();
  if (btns && btns.length > 0) {
    return hamlHtml(multilineHaml(btns.join("\n")));
  } else {
    return "";
  }
};
h_radio = function(label, name, id, options, checked, lblOptions) {
  return h_choice(true, label, name, id, options, checked, lblOptions);
};
h_checkbox = function(label, name, id, options, checked, lblOptions) {
  return h_choice(false, label, name, id, options, checked, lblOptions);
};
h_choice = function(isRadio, label, fieldName, id, options, checked, lbl_options, multiline) {
  var haml, type, _ref, _ref2;
  if (options == null) {
    options = {};
  }
  if (checked == null) {
    checked = false;
  }
  if (multiline == null) {
    multiline = true;
  }
    if ((_ref = options.value) != null) {
    _ref;
  } else {
    options.value = id;
  };
    if ((_ref2 = options.name) != null) {
    _ref2;
  } else {
    options.name = fieldName;
  };
  type = isRadio ? "radio" : "checkbox";
  if (checked) {
    options["checked"] = "checked";
  }
  haml = "" + (h_input(type, id, options)) + "\n" + (h_label(label, id, lbl_options));
  if (multiline) {
    return multilineHaml(haml);
  } else {
    return haml;
  }
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
h_makePage = function(id) {
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
multilineTest = function() {
  var haml, spaced;
  haml = "#someSection\n  " + (yesnoChoiceTmpl("test", "Test", "group", true)) + "\n  #anotherWidget\n#anotherSection";
  return spaced = spacedHaml(haml);
};
multilineHaml = function(haml) {
  return "" + MULTI_START + "\n" + haml + "\n" + MULTI_END;
};
delProp = function(obj, prop) {
  var objProp;
  objProp = obj[prop];
  delete obj[prop];
  return objProp;
};