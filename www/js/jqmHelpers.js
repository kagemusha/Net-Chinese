var backButton, button, choiceButtons, choiceGroup, choiceTmpl, controlGroup, footerTmpl, headerTmpl, input, label, li, link, linkReverseAttr, navbar, optionStr, pageTmpl, rightButton, ul, yesnoChoiceTmpl;
var __slice = Array.prototype.slice;
optionStr = function(options) {
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
      _results.push("" + key + "='" + val + "'");
    }
    return _results;
  })();
  return opts.join(" ");
};
link = function(label, href, options, reverse) {
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
  return "<a href='" + href + "' " + (optionStr(options)) + " " + revStr + " >" + label + "</a>";
};
button = function(label, href, options, reverse) {
  if (href == null) {
    href = "#";
  }
  if (reverse == null) {
    reverse = false;
  }
  options["data-role"] = 'button';
  return link(label, href, options, reverse);
};
backButton = function(label, href, options) {
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
  return button(label, href, options, true);
};
rightButton = function(label, href, options, reverse) {
  if (options == null) {
    options = {};
  }
  if (reverse == null) {
    reverse = false;
  }
  options["class"] = "" + (options["class"] || "") + " ui-btn-right";
  return button(label, href, options, reverse);
};
linkReverseAttr = function(href) {
  if (!href || (href = "#")) {
    return "data-direction='reverse'";
  } else {
    return "data-rel='back'";
  }
};
label = function(text, forAttr, options) {
  if (options == null) {
    options = {};
  }
  return "<label for='" + forAttr + "' " + (optionStr(options)) + " >" + text + "</label>";
};
input = function(type, id, options) {
  if (options == null) {
    options = {};
  }
  if (!options["name"]) {
    options["name"] = id;
  }
  return "<input type='" + type + "' id='" + id + "' " + (optionStr(options)) + " />";
};
li = function(text, options) {
  return "<li " + (optionStr(options)) + ">" + text + "</li>";
};
ul = function(id, listItems, options) {
  var dataTheme;
  if (listItems == null) {
    listItems = [""];
  }
  if (options == null) {
    options = {};
  }
  dataTheme = options.dataTheme || DEFAULT_STYLE;
  listItems = listItems.join("");
  return "<ul id=\"" + id + "\" data-role=\"listview\"  data-theme=\"" + dataTheme + "\" " + (optionStr(options)) + ">\n  " + listItems + "\n</ul>";
};
headerTmpl = function(title, lButton, rButtons, navBar, options) {
  if (lButton == null) {
    lButton = "";
  }
  if (rButtons == null) {
    rButtons = "";
  }
  if (navBar == null) {
    navBar = "";
  }
  if (options == null) {
    options = {};
  }
  return "<div data-role=\"header\" " + (optionStr(options)) + " >\n  " + lButton + "\n  <h1>" + title + "</h1>\n  " + rButtons + "\n  <div data-role=\"navbar\" id=\"headNav\">\n    <ul class=\"headButtons\">\n    </ul>\n  </div>\n</div>";
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
navbar = function(buttonList, options) {
  return "<div data-role=\"navbar\", " + (optionStr(options)) + ">\n  " + buttonList + "\n</div>";
};
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
choiceTmpl = function(isRadio, name, options) {
  var checked, choiceType, lbl, val, valAttr;
  val = options.val || options.id;
  valAttr = val != null ? "value='" + val + "'" : "";
  lbl = options.label || options.name;
  choiceType = isRadio ? "radio" : "checkbox";
  checked = options.checked ? "checked=checked" : "";
  return "" + (input(choiceType, options.id, "data-theme='d' name='" + name + "' " + valAttr + " " + checked + " ")) + "\n" + (label(lbl, options.id));
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
  var btns, dataType, horiz, lbl;
  btns = choiceButtons(isRadio, name, btnSpecs);
  dataType = options.align ? "data-type=" + options.align : "";
  options["data-theme"] = "d";
  horiz = options.align;
  delete options.align;
  lbl = options.label;
  delete options.label;
  return "<fieldset data-role='controlgroup' " + dataType + " id='" + options.id + "' data-theme='" + options["data-theme"] + "'>\n    <legend>" + lbl + "</legend>\n    " + btns + "\n</fieldset>";
};
controlGroup = function(legend, buttons, horizontal, options) {
  if (legend == null) {
    legend = null;
  }
  if (horizontal == null) {
    horizontal = false;
  }
  if (horizontal) {
    options["data-type"] = "horizontal";
  }
  legend = legend ? "<legend>" + legend + "</legend>" : "";
  return "<fieldset data-role='controlgroup' " + (optionStr(options)) + " >\n    " + legend + "\n    " + buttons + "\n</fieldset>";
};