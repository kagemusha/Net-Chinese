var answerPgHeadTmpl, answerPgTmpl, backButton, button, cardBackTmpl, cardLiTmpl, cardPgTmpl, choiceButtons, choiceGroup, choiceTmpl, filterPgTmpl, genElems, headerTmpl, labelLiTmpl, labelPgTmpl, labelsPgTmpl, link, listLinkTmpl, loginPgTmpl, pageTmpl, refreshTmpl, refreshTmplById, rightButton, setLiTmpl, setPgTmpl, setsPgTmpl, settingsPgTmpl, studyPgTmpl, studyStatsTmpl;
root.BACK_REL = "data-rel='back'";
refreshTmplById = function(id, templateFn, data, options) {
  return refreshTmpl("#" + id, templateFn, data, options);
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
genElems = function(fn, data, options) {
  var elem, elems;
  if (data instanceof Array) {
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
  var choiceType, label, val, valAttr;
  val = options.val || options.id;
  valAttr = val != null ? "value='" + val + "'" : "";
  label = options.label || options.name;
  choiceType = isRadio ? "radio" : "checkbox";
  return "<input type=\"" + choiceType + "\" name=\"" + name + "\" " + valAttr + "  id=\"" + options.id + "\" >\n<label for=\"" + options.id + "\" data-theme=\"c\">" + label + "</label>";
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
  var btns, dataType;
  btns = choiceButtons(isRadio, name, btnSpecs);
  dataType = options.align ? "data-type=" + options.align : "";
  return "<fieldset data-role=\"controlgroup\" " + dataType + " id=\"" + options.id + "\">\n    <legend>" + options.label + "</legend>\n    " + btns + "\n</fieldset>";
};
link = function(label, url, options) {
  return "<a href='" + (url || "#") + "' " + (options || "") + " >" + (label || "<blank>") + "</a>";
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
  if (page) {
    dataRel = "data-direction='reverse'";
  } else {
    dataRel = "data-rel='back'";
    page = "#";
  }
  return link(label, page, "data-icon='arrow-l' " + dataRel + " " + options);
};
rightButton = function(specs) {
  return link(specs.label, specs.page, "" + specs.options + " class='ui-btn-right " + specs["class"] + "'");
};
pageTmpl = function(specs) {
  var lButton, lbSpecs, rButton, title;
  lbSpecs = specs.head.leftButton;
  if (lbSpecs === "none") {
    lButton = "";
  } else if (lbSpecs) {
    lButton = lbSpecs.type === "back" ? backButton(lbSpecs.label, lbSpecs.page, lbSpecs.options) : link(lbSpecs.label, lbSpecs.page, lbSpecs.options);
  } else {
    lButton = backButton();
  }
  title = specs.head.head || "Crambear";
  rButton = specs.head.rightButton ? rightButton(specs.head.rightButton) : "";
  return "<div id=\"" + specs.id + "\" data-role=\"page\" data-theme=\"e\"  data-auto-back-btn='true' class='pg'>\n  <div data-role=\"header\" data-theme=\"a\" data-position=\"inline\" class=\"pgHead\"  >\n      " + lButton + "\n      <h1>" + title + "</h1>\n      " + rButton + "\n      <div data-role=\"navbar\" id=\"headNav\">\n          <ul class=\"headButtons\">\n          </ul>\n      </div>\n  </div>\n  <div class=\"msg\"></div>\n  <div data-role=\"content\" class=\"pgContent\">\n  </div><!-- /content -->\n  <div data-role=\"footer\" data-theme=\"a\" data-position=\"fixed\" class=\"pgFoot\" class=\"ui-bar\">\n	    </div>\n  <!-- footer -->\n</div>";
};
headerTmpl = function(title, lButton, rButton, headButtons) {
  return "<div data-role=\"header\" data-theme=\"a\" data-position=\"inline\" class=\"pgHead\"  >\n    " + lButton + "\n    <h1>" + title + "</h1>\n    " + rButton + "\n    <div data-role=\"navbar\" id=\"headNav\">\n        <ul class=\"headButtons\">\n          " + headButtons + "\n        </ul>\n    </div>\n</div>";
};
setLiTmpl = function(set) {
  return "<li><a class='set' href=\"#setPage\" obj_id=\"" + set.id + "\" init_pg='set'>" + set.name + "</a></li>";
};
cardLiTmpl = function(card) {
  return "<li class=\"card " + (toStr(card.archived) === 'true' ? 'archived' : '') + " \">\n    <div class=\"overlay\">ARCHIVED</div>\n    <a class=\"card\" obj_id=\"" + card.id + "\" href=\"#cardPage\" init_pg=\"card\" >\n    <span class=\"front\">" + card.front + "</span><br/>\n    " + card.back + "\n</a></li>";
};
labelLiTmpl = function(label) {
  return "<li>\n    <a href=\"#labelPage\" obj_id=\"" + label.id + "\"  init_pg=\"label\" >" + label.name + "</a>\n</li>";
};
setsPgTmpl = function() {
  return "<h4>Card Sets</h4>\n<ul id=\"setList\" data-dividertheme=\"b\" data-inset=\"true\" data-role=\"listview\" data-theme=\"c\">\n</ul>";
};
settingsPgTmpl = function() {
  return "<h4>Settings</h4>\n<form accept-charset=\"UTF-8\"  id=\"syncForm\">\n    <div data-role=\"fieldcontain\">\n      <input type=\"submit\" name=\"submit\" value=\"Sync\"/>\n    </div>\n</form>";
};
loginPgTmpl = function(login) {
  return "<h4>Login</h4>\n<form accept-charset=\"UTF-8\"  id=\"loginForm\">\n    <div data-role=\"fieldcontain\">\n      <input type=\"text\" id=\"email\" name=\"email\" placeholder=\"Email\" value=\"" + login.email + "\"/>\n    </div>\n    <div data-role=\"fieldcontain\">\n      <input type=\"password\" id=\"password\" name=\"password\" value=\"" + login.password + "\" placeholder=\"Password\"/>\n    </div>\n    <div data-role=\"fieldcontain\">\n      <input type=\"submit\" name=\"submit\" value=\"Submit\"/>\n    </div>\n    Server: <span id=\"server\"></span>\n</form>";
};
cardBackTmpl = function(back, front) {
  return "<p class='backText'>" + back + "</p>\n" + front;
};
setPgTmpl = function(set) {
  return "" + (button("Study", pageSel("study"), "id='studyButton' init_pg='study' class='study'")) + "\n<div id=\"cardsShowing\">\n    <a href=\"#\" id=\"prevCards\" class=\"cardList\"> prev </a>\n    <span id=\"cardsShowingMsg\"></span>\n    <a href=\"#\" id=\"nextCards\" class=\"cardList\"> next </a>\n</div>\n<ul id=\"cardList\" data-dividertheme=\"b\" data-inset=\"true\" data-role=\"listview\" data-theme=\"c\">\n    <li data-role=\"list-divider\">Cards</li>\n</ul>";
};
labelsPgTmpl = function() {
  return "<a href=\"#labelPage\" data-role=\"button\" id=\"addLabelButton\" init_pg=\"label\" >Add Label</a>\n<ul id=\"labelList\" data-dividertheme=\"b\" data-inset=\"true\" data-role=\"listview\" data-theme=\"c\">\n    <li data-role=\"list-divider\">Labels</li>\n</ul>";
};
labelPgTmpl = function() {
  return "<h3>Label</h3>\n<form accept-charset=\"UTF-8\"  id=\"labelForm\" obj_type=\"label\">\n    <div data-role=\"fieldcontain\">\n        <input type=\"hidden\" id=\"card_set_id\" name=\"card_set_id\" />\n        <input type=\"hidden\" id=\"id\" name=\"id\" />\n        <input type=\"text\" id=\"name\" name=\"name\" />\n    </div>\n</form>\n" + (button("Save", "#", "obj_type='label' saveForm='labelForm' " + root.BACK_REL));
};
filterPgTmpl = function() {
  return "<div id=\"archivedFilter\"></div>\n<div id=\"filtersForm\"></div>\n<fieldset data-role=\"controlgroup\" id=\"filterCheckboxes\">\n</fieldset>";
};
listLinkTmpl = function(link, options) {
  return "<li><a href=\"" + link.link + "\" " + link.options + " >" + link.label + "</a></li>";
};
cardPgTmpl = function() {
  return "<form accept-charset=\"UTF-8\"  id=\"cardForm\" obj_type=\"card\">\n   <input type=\"hidden\" id=\"card_set_id\" name=\"card_set_id\" />\n   <input type=\"hidden\" id=\"id\" name=\"id\" />\n   <div data-role=\"fieldcontain\">\n     <textarea cols=30 rows=8 id=\"card_front\" name=\"front\" placeholder=\"Front\" />\n     <br/>\n     <textarea cols=30 rows=8 id=\"card_back\" name=\"back\" placeholder=\"Back\" />\n   </div>\n   <div id=\"cardArchiveLabels\"></div>\n   <div id=\"cardLabels\"></div>\n   </div>\n\n</form>\n" + (button("Save", "#", "obj_type='card' saveForm='cardForm' " + root.BACK_REL)) + "\n";
};
studyStatsTmpl = function(stats) {
  return "<div id=\"studyStatsMsg\">\n    <span class=\"stat label\">" + stats.leftInRun + " </span>\n    of\n    <span class=\"stat label\">" + stats.runCount + " </span>\n    left &nbsp;&nbsp;\n    Correct 1 try:\n    <span class=\"stat label\">" + stats.tries[0] + " </span>\n    &nbsp;2:\n    <span class=\"stat label\">" + stats.tries[1] + "</span>\n    &nbsp;More:\n    <span class=\"stat label\">" + stats.tries[2] + "</span>\n</div>";
};
studyPgTmpl = function() {
  return "<div id=\"studyPanel\">\n  <div class=\"cardPanel front\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};
answerPgHeadTmpl = function() {
  return "<ul id=\"studyButtons\" class=\"back\">\n  <li><a href=\"#\" id=\"correct\" data-transition=\"pop\" data-role=\"button\"  class=\"result\" >Correct</a></li>\n  <li><a href=\"#\" id=\"wrong\" data-transition=\"pop\" data-role=\"button\"  class=\"result\" >Wrong</a></li>\n</ul>";
};
answerPgTmpl = function() {
  return "<div id=\"studyStats\"></div>\n<div id=\"studyPanel\">\n  <div class=\"cardPanel\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};