var DATA_ROLE, appendTmpl, delProp, div, hForm, h_backButton, h_button, h_checkbox, h_choice, h_choiceGroup, h_choices, h_content, h_controlgroup, h_fieldcontain, h_fieldset, h_input, h_label, h_link, h_makePage, h_navbar, h_page, h_pageFooter, h_pageHeader, h_radio, h_resetChoices, h_rightButton, h_saveButton, h_ul, heditUL, yesnoChoiceTmpl;
DATA_ROLE = "data-role";
h_ul = function(options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "listview";
  return hTag("ul", null, options);
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
  var _ref;
  if (label == null) {
    label = "Back";
  }
  if (href == null) {
    href = "#";
  }
  if (options == null) {
    options = {};
  }
    if ((_ref = options["data-icon"]) != null) {
    _ref;
  } else {
    options["data-icon"] = 'arrow-l';
  };
  return h_link(label, href, options, true);
};
h_label = function(text, forAttr, options) {
  if (options == null) {
    options = {};
  }
  options["for"] = forAttr;
  return hTag("label", null, options, text);
};
h_input = function(type, name, options) {
  var _ref;
  if (options == null) {
    options = {};
  }
  options["type"] = type;
  options["name"] = name;
    if ((_ref = options["id"]) != null) {
    _ref;
  } else {
    options["id"] = name;
  };
  return hTag("input", null, options);
};
/*
h_input = (type, id, options={}) ->
  options["name"] = id if !options["name"]
  idStr = if id then "##{id}" else ""
  options["type"] = type
  hTag "input", id, options
*/
h_fieldcontain = function(options) {
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "fieldcontain";
  return "" + (hTag("div", null, options));
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
  choiceDiv = id ? "" + (idSel(id)) + ".choices" : "";
  return multilineHaml("" + (hTag("fieldset", null, options)) + "\n  %legend " + label + "\n  " + choiceDiv);
};
yesnoChoiceTmpl = function(label, fieldName, yesChecked, cgOptions) {
  var haml;
  if (yesChecked == null) {
    yesChecked = false;
  }
  if (cgOptions == null) {
    cgOptions = {};
  }
  _.extend(cgOptions, {
    "data-type": "horizontal",
    id: "" + fieldName + "Choice"
  });
  haml = "" + (h_controlgroup(label, cgOptions)) + "\n    " + (h_radio("Yes", fieldName, "yes", "true", {}, yesChecked)) + "\n    " + (h_radio("No", fieldName, "no", "false", {}, !yesChecked));
  return multilineHaml(haml);
};
h_choiceGroup = function(isRadio, label, fieldName, options, choices) {
  if (choices == null) {
    choices = [];
  }
  return multilineHaml("" + (h_controlgroup(label, options)) + "\n  " + (h_choices(isRadio, fieldName, choices)));
};
h_resetChoices = function(isRadioBtns, fieldId, fieldName, choices, options) {
  var sel;
  if (options == null) {
    options = {};
  }
  sel = "" + (idSel(fieldId)) + ".choices";
  $(sel).empty();
  return $(sel).append(h_choices(isRadioBtns, fieldName, choices, options));
};
h_choices = function(isRadioBtns, fieldName, choicesArray, options) {
  var btns, choice;
  if (choicesArray == null) {
    choicesArray = [];
  }
  btns = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = choicesArray.length; _i < _len; _i++) {
      choice = choicesArray[_i];
      if (options) {
        _.extend(options, choice.options);
      }
      _results.push(h_choice(isRadioBtns, choice.label, fieldName, choice.id, choice.value, choice.options, choice.checked, choice.lbl_options, false));
    }
    return _results;
  })();
  if (btns && btns.length > 0) {
    return hamlHtml(multilineHaml(btns.join("\n")));
  } else {
    return "";
  }
};
h_choice = function(isRadio, label, fieldName, id, val, options, checked, lbl_options, multiline) {
  var haml, type, _ref;
  if (options == null) {
    options = {};
  }
  if (checked == null) {
    checked = false;
  }
  if (lbl_options == null) {
    lbl_options = {};
  }
  if (multiline == null) {
    multiline = true;
  }
  options.id = id;
    if ((_ref = options.value) != null) {
    _ref;
  } else {
    options.value = val || id;
  };
  type = isRadio ? "radio" : "checkbox";
  if (checked) {
    options["checked"] = "checked";
  }
  haml = "" + (h_input(type, fieldName, options)) + "\n" + (h_label(label, id, lbl_options));
  if (multiline) {
    return multilineHaml(haml);
  } else {
    return haml;
  }
};
h_radio = function(label, name, id, val, options, checked, lblOptions) {
  return h_choice(true, label, name, id, val, options, checked, lblOptions);
};
h_checkbox = function(label, name, id, val, options, checked, lblOptions) {
  return h_choice(false, label, name, id, val, options, checked, lblOptions);
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
h_pageHeader = function(title, position, options) {
  if (title == null) {
    title = "";
  }
  if (position == null) {
    position = "fixed";
  }
  if (options == null) {
    options = {};
  }
  options[DATA_ROLE] = "header";
  options["data-position"] = position;
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
heditUL = function(type, options) {
  if (options == null) {
    options = {};
  }
  options["class"] = " " + (options["class"] || "") + " editList";
  options.obj_type = type;
  return h_ul(options);
};
delProp = function(obj, prop) {
  var objProp;
  objProp = obj[prop];
  delete obj[prop];
  return objProp;
};