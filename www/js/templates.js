var DEFAULT_PG_THEME, DEFAULT_STYLE, EDITING_CLASS, NOT_EDITING_CLASS, backButton, button, choiceButtons, choiceGroup, choiceTmpl, classSel, delImg, editUL, footerTmpl, genElems, headerTmpl, idSel, img, input, label, li, link, linkReverseAttr, navBar, pageTmpl, refreshEditableListById, refreshListById, refreshTmpl, refreshTmplById, rightBtn, saveButton, setLiTmpl, textInputPgTmpl, ul, yesnoChoiceTmpl;
var __slice = Array.prototype.slice;
root.BACK_REL = "data-rel='back'";
refreshTmplById = function(id, templateFn, data, options) {
  return refreshTmpl("" + (idSel(id)), templateFn, data, options);
};
refreshTmpl = function(containers, templateFn, data, options) {
  var elems;
  if (typeof templateFn === 'string') {
    templateFn = eval(templateFn);
  }
  $(containers).empty();
  elems = genElems(templateFn, data, options);
  return $(containers).append(elems);
};
refreshListById = function(id, template, objs, options) {
  refreshTmplById(id, template, objs, options);
  return listviewRefresh(id);
};
NOT_EDITING_CLASS = "notEditing";
EDITING_CLASS = "editing";
idSel = function(id) {
  if (!id || id.length < 1) {
    log("idsel no id!!");
  }
  if (id[0] === "#") {
    return id;
  } else {
    return "#" + id;
  }
};
classSel = function(klass) {
  if (klass[0] === ".") {
    return klass;
  } else {
    return "." + klass;
  }
};
refreshEditableListById = function(baseListId, template, editTemplate, objs) {
  var editListId;
  editListId = "edit" + (capitalize(baseListId));
  $("" + (idSel(baseListId))).addClass(NOT_EDITING_CLASS);
  $("" + (idSel(editListId))).addClass(EDITING_CLASS);
  refreshListById(baseListId, template, objs);
  return refreshListById(editListId, editTemplate, objs);
};
genElems = function(fn, data, options) {
  var elem, elems;
  if (_.isArray(data)) {
    elems = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        elem = data[_i];
        _results.push(fn(elem, options));
      }
      return _results;
    })();
    if (elems) {
      return elems.join("");
    } else {
      return "";
    }
  } else {
    return fn(data, options);
  }
};
choiceTmpl = function(isRadio, name, options) {
  var checked, choiceType, lbl, val, valAttr;
  val = options.val || options.id;
  valAttr = val != null ? "value='" + val + "'" : "";
  lbl = options.label || options.name;
  choiceType = isRadio ? "radio" : "checkbox";
  checked = options.checked ? "checked=checked" : "";
  return "" + (input(choiceType, options.id, "data-theme='d' name='" + name + "' " + valAttr + " " + checked + " ")) + "\n" + (label(lbl, options.id));
};
label = function(text, forAttr, options) {
  if (options == null) {
    options = "";
  }
  return "<label for='" + forAttr + "' " + options + " >" + text + "</label>";
};
input = function(type, id, options) {
  var hasName;
  if (options == null) {
    options = "";
  }
  hasName = options.search(/\s+name\s*=/) > 0;
  log("input", hasName);
  if (!hasName) {
    options = "" + options + " name='" + id + "'";
  }
  return "<input type='" + type + "' id='" + id + "' " + options + " />";
};
yesnoChoiceTmpl = function(id, label, group, yesChecked) {
  var btns, noChecked, options;
  options = {
    id: id,
    align: "horizontal",
    label: label
  };
  noChecked = yesChecked !== null && !yesChecked;
  btns = [
    {
      id: "yes",
      name: group,
      val: "true",
      label: "Yes",
      checked: yesChecked
    }, {
      id: "no",
      name: group,
      val: "false",
      label: "No",
      checked: noChecked
    }
  ];
  return choiceGroup(true, group, options, btns);
};
choiceButtons = function(isRadio, name, btnSpecs) {
  var spec;
  if (btnSpecs) {
    return ((function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = btnSpecs.length; _i < _len; _i++) {
        spec = btnSpecs[_i];
        _results.push(choiceTmpl(isRadio, name, spec));
      }
      return _results;
    })()).join(" ");
  }
};
choiceGroup = function(isRadio, name, options, btnSpecs) {
  var btns, dataTheme, dataType;
  btns = choiceButtons(isRadio, name, btnSpecs);
  dataType = options.align ? "data-type=" + options.align : "";
  dataTheme = "d";
  return "<fieldset data-role='controlgroup' " + dataType + " id='" + options.id + "' data-theme='" + dataTheme + "'>\n    <legend>" + options.label + "</legend>\n    " + btns + "\n</fieldset>";
};
link = function(label, url, options) {
  return "<a href='" + (url || "#") + "' " + (options || "") + " >" + (label || "<blank>") + "</a>";
};
linkReverseAttr = function(page) {
  if (!page || (page = "#")) {
    return "data-direction='reverse'";
  } else {
    return "data-rel='back'";
  }
};
button = function(label, page, options) {
  return link(label, page, "" + options + " data-role='button'");
};
backButton = function(label, page, options) {
  var dataRel;
  if (label == null) {
    label = "Back";
  }
  if (page == null) {
    page = null;
  }
  if (options == null) {
    options = null;
  }
  dataRel = linkReverseAttr(page);
  if (!page) {
    page = "#";
  }
  return link(label, page, "data-icon='arrow-l' " + dataRel + " " + options);
};
saveButton = function(form, objType, page, reverse, label) {
  if (page == null) {
    page = "#";
  }
  if (reverse == null) {
    reverse = true;
  }
  if (label == null) {
    label = "Save";
  }
  return link(label, page, "obj_type='" + objType + "' saveform='" + form + "' " + (linkReverseAttr(page)));
};
rightBtn = function(label, url, options, classes) {
  var but;
  if (options == null) {
    options = "";
  }
  if (classes == null) {
    classes = "";
  }
  options = "class='ui-btn-right " + classes + "' " + options;
  but = link(label, url, options);
  return but;
};
DEFAULT_STYLE = "d";
DEFAULT_PG_THEME = "e";
pageTmpl = function(specs) {
  var footer, lButtons, rButtons, title;
  if (specs.head.leftBtns) {
    lButtons = _.isArray(specs.head.leftBtns) ? specs.head.leftBtns.join("") : specs.head.leftBtns;
  } else {
    lButtons = "";
  }
  title = specs.head.title || "网 Net Chinese 中";
  rButtons = specs.head.rightBtns || "";
  footer = specs.footer || "";
  return "<div id=\"" + specs.id + "\" data-role=\"page\" data-theme=\"" + DEFAULT_PG_THEME + "\"  data-auto-back-btn='true' class='pg'>\n  " + (headerTmpl(title, lButtons, rButtons)) + "\n  <div class=\"msg\"></div>\n  <div data-role=\"content\" class=\"pgContent\">\n  </div><!-- /content -->\n  " + footer + "\n</div>";
};
navBar = function(buttons, listStyle) {
  var btn, btns;
  if (listStyle == null) {
    listStyle = true;
  }
  buttons = (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      btn = buttons[_i];
      _results.push(li(btn));
    }
    return _results;
  })();
  btns = "<div data-role=\"navbar\">\n  <ul>" + (buttons.join()) + "</ul>\n</div>";
  return btns = buttons.join(' ');
};
footerTmpl = function() {
  var btn, btns, buttons, dataPos, klass, specs;
  specs = arguments[0], buttons = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
  klass = "class='" + (specs["class"] || "") + " " + (specs.ui_bar ? "ui-bar" : "") + "'";
  if (buttons) {
    if (specs.navBar) {
      buttons = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = buttons.length; _i < _len; _i++) {
          btn = buttons[_i];
          _results.push(li(btn));
        }
        return _results;
      })();
      btns = "<div data-role=\"navbar\">\n  <ul>" + (buttons.join()) + "</ul>\n</div>";
    } else {
      btns = buttons.join(' ');
    }
  }
  dataPos = specs.fixed ? "data-position='fixed'" : "";
  return "<div data-role=\"footer\" data-theme=\"a\" " + dataPos + " " + klass + ">\n  " + btns + "\n</div>";
};
headerTmpl = function(title, lButton, rButtons) {
  if (lButton == null) {
    lButton = "";
  }
  if (rButtons == null) {
    rButtons = "";
  }
  return "<div data-role=\"header\" data-theme=\"a\" data-position=\"inline\" class=\"pgHead\"  >\n  " + lButton + "\n  <h1>" + title + "</h1>\n  " + rButtons + "\n  <div data-role=\"navbar\" id=\"headNav\">\n    <ul class=\"headButtons\">\n    </ul>\n  </div>\n</div>";
};
img = function(file) {
  return "css/images/" + file;
};
/* App specific below */
setLiTmpl = function(set) {
  return li(link(set.name, "#setPage", "class='set' obj_id='" + set.id + "' init_pg='set'"), "class='set'");
};
delImg = function() {
  return "<img  class='del del_icon ui-li-icon' src='" + (img('delete.png')) + "'/>";
};
ul = function(id, listItems, dataOptions, options) {
  var dataInset, dataTheme;
  if (listItems == null) {
    listItems = [""];
  }
  if (dataOptions == null) {
    dataOptions = {};
  }
  if (options == null) {
    options = "";
  }
  dataTheme = dataOptions.dataTheme || DEFAULT_STYLE;
  dataInset = dataOptions.dataInset || "false";
  listItems = listItems.join("");
  return "<ul id=\"" + id + "\" data-role=\"listview\" data-inset=\"" + dataInset + "\" data-theme=\"" + dataTheme + "\" " + options + ">\n  " + listItems + "\n</ul>";
};
editUL = function(id, type, dataOptions, options) {
  return ul(id, null, dataOptions, "class='editList' obj_type='" + type + "' " + options);
};
li = function(text, options) {
  return "<li " + options + ">" + text + "</li>";
};
textInputPgTmpl = function() {
  return "<textarea id=\"tInput\" class=\"fullPage\" data-theme=\"d\" name=\"tInput\" placeholder=\"(Enter text)\" />";
};