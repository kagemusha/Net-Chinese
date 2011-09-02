var DEFAULT_PG_THEME, DEFAULT_STYLE, EDITING_CLASS, NOT_EDITING_CLASS, answerPgHeadTmpl, answerPgTmpl, backButton, button, cardBackTmpl, cardLiTmpl, cardPgTmpl, choiceButtons, choiceGroup, choiceTmpl, classSel, delImg, editCardLiTmpl, editLabelLiTmpl, editSetLiTmpl, editUL, filterPgTmpl, footerTmpl, genElems, headerTmpl, idSel, img, labelLiTmpl, labelPgTmpl, labelsPgTmpl, link, listLink, listLink2, listLinkTmpl, listLinkTmpl2, navBar, pageTmpl, refreshEditableListById, refreshListById, refreshTmpl, refreshTmplById, rightBtn, setLiTmpl, setPgTmpl, setsPgTmpl, settingsPgTmpl, studyPgTmpl, studyStatsTmpl, textInputPgTmpl, toggleEditControls, triesTmpl, ul, yesnoChoiceTmpl;
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
classSel = function(klasses) {
  if (klasses[0] === ".") {
    return klasses;
  } else {
    return "." + klasses;
  }
};
toggleEditControls = function(pageId) {
  if (pageId == null) {
    pageId = "";
  }
  return $("" + (idSel(pageId)) + " ." + EDITING_CLASS + ", " + (idSel(pageId)) + " ." + NOT_EDITING_CLASS).toggle();
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
  var checked, choiceType, label, val, valAttr;
  val = options.val || options.id;
  valAttr = val != null ? "value='" + val + "'" : "";
  label = options.label || options.name;
  choiceType = isRadio ? "radio" : "checkbox";
  checked = options.checked ? "checked=checked" : "";
  return "<input type=\"" + choiceType + "\" data-theme=\"d\" name=\"" + name + "\" " + valAttr + "  id=\"" + options.id + "\" " + checked + ">\n<label for=\"" + options.id + "\" >" + label + "</label>";
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
  log("but", but);
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
      _results.push("<li>" + btn + "</li>");
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
          _results.push("<li>" + btn + "</li>");
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
  return "<li class='set'>\n  <a class='set' href=\"#setPage\" obj_id=\"" + set.id + "\" init_pg='set'>\n    " + set.name + "\n  </a>\n</li>";
};
delImg = function() {
  return "<img  class='del del_icon ui-li-icon' src='" + (img('delete.png')) + "'/>";
};
editSetLiTmpl = function(set) {
  return "<li class='set' obj_id=\"" + set.id + "\">\n  " + (delImg()) + "\n  " + set.name + "\n</li>";
};
cardLiTmpl = function(card) {
  return "<li class=\"card " + (toStr(card.archived) === 'true' ? 'archived' : '') + " \">\n  <div class=\"overlay\">ARCHIVED</div>\n  <a class=\"card\" obj_id=\"" + card.id + "\" href=\"#cardPage\" init_pg=\"card\" >\n  <span class=\"front\">" + card.front + "</span><br/>\n  " + card.back + "\n</a></li>";
};
editCardLiTmpl = function(card) {
  return "<li class=\"card\" obj_id=\"" + card.id + "\">\n  " + (delImg()) + "\n  <span class=\"front\">" + card.front + "</span><br/>\n  " + card.back + "\n</li>";
};
labelLiTmpl = function(label, icon) {
  if (icon == null) {
    icon = "";
  }
  return "<li>\n    " + icon + "\n    <a href=\"#labelPage\" obj_id=\"" + label.id + "\"  init_pg=\"label\" >" + label.name + "</a>\n</li>";
};
editLabelLiTmpl = function(label) {
  return "<li class=\"card\" obj_id=\"" + label.id + "\">\n  " + (delImg()) + "\n  " + label.name + "\n</li>";
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
setsPgTmpl = function() {
  return "" + (ul("setList", null, null, "obj_type='card_set'")) + "\n" + (editUL("editSetList", "set"));
};
settingsPgTmpl = function() {
  return "<form accept-charset=\"UTF-8\"  id=\"syncForm\">\n    <div data-role=\"fieldcontain\">\n      <input type=\"submit\" name=\"submit\" value=\"Sync\"/>\n    </div>\n</form>";
};
cardBackTmpl = function(back, front) {
  return "\n\n<div class='backText'>" + back + "</div>\n" + front + "\n\n";
};
setPgTmpl = function(set) {
  return "<div id=\"cardsShowing\">\n    <a href=\"#\" id=\"prevCards\" class=\"cardList\"> prev </a>\n    <span id=\"cardsShowingMsg\"></span>\n    <a href=\"#\" id=\"nextCards\" class=\"cardList\"> next </a>\n</div>\n<br/>\n" + (ul("cardList", null, null, "obj_type='card'")) + "\n" + (editUL("editCardList", "card"));
};
labelsPgTmpl = function() {
  return "" + (button("Add Label", "#labelPage", "id='addLabelButton' init_pg='label'")) + "\n" + (ul("labelList", null, {
    dataInset: true
  })) + "\n" + (editUL("editLabelList", "label", {
    dataInset: true
  }));
};
labelPgTmpl = function() {
  return "<form accept-charset=\"UTF-8\"  id=\"labelForm\" obj_type=\"label\">\n  <div data-role=\"fieldcontain\">\n    <input type=\"hidden\" id=\"card_set_id\" name=\"card_set_id\" />\n    <input type=\"hidden\" id=\"id\" name=\"id\" />\n    <input type=\"text\" id=\"name\" name=\"name\" />\n  </div>\n</form>\n" + (button("Save", "#", "obj_type='label' saveForm='labelForm' " + root.BACK_REL));
};
filterPgTmpl = function() {
  return "<div id=\"backFirstOption\">\n</div>\n<div id=\"archivedFilter\"></div>\n<div id=\"filtersForm\"></div>";
};
listLink = function(label, href, options) {
  return "<li>" + (link(label, href, options)) + "</li>";
};
listLink2 = function(link) {
  return "<li>" + link + "</li>";
};
listLinkTmpl = function(link, options) {
  return listLink(link.label, link.link, link.options);
};
listLinkTmpl2 = function(link, options) {
  return listLink2(link);
};
cardPgTmpl = function() {
  var cardSideItems;
  cardSideItems = [listLink("Front (Chinese)", "#textInputPage", "id='frontTALink' init_pg='cardSide'"), listLink("Back (English)", "#textInputPage", "id='backTALink' init_pg='cardSide' side='back'")];
  return "<form accept-charset=\"UTF-8\"  id=\"cardForm\" obj_type=\"card\">\n  <input type=\"hidden\" id=\"card_set_id\" name=\"card_set_id\" />\n  <input type=\"hidden\" id=\"id\" name=\"id\" />\n  <br>\n  " + (ul("cardSides", cardSideItems, {
    dataInset: true
  })) + "\n  <div id=\"cardArchiveLabels\">" + (yesnoChoiceTmpl("archivedRB", "Archive", "archived")) + "</div>\n  <div id=\"cardLabels\"></div>\n\n</form>\n" + (button("Save", "#", "obj_type='card' saveForm='cardForm' " + root.BACK_REL));
};
textInputPgTmpl = function() {
  return "<textarea id=\"tInput\" class=\"fullPage\" data-theme=\"d\" name=\"tInput\" placeholder=\"(Enter text)\" />";
};
studyStatsTmpl = function(stats, full) {
  if (full == null) {
    full = true;
  }
  return "<div id=\"studyStatsMsg\">\n    <span class=\"stat label\">" + stats.leftInRun + " </span>\n    of\n    <span class=\"stat label\">" + stats.runCount + " </span>\n    left &nbsp;&nbsp;\n    " + (full ? triesTmpl(stats) : "") + "\n</div>";
};
triesTmpl = function(stats) {
  return "Correct 1 try:\n<span class=\"stat label\">" + stats.tries[0] + " </span>\n&nbsp;2:\n<span class=\"stat label\">" + stats.tries[1] + "</span>\n&nbsp;More:\n<span class=\"stat label\">" + stats.tries[2] + "</span>\n";
};
studyPgTmpl = function() {
  return "<div id=\"studyStatsFront\"></div>\n<div id=\"studyPanel\">\n  <div class=\"cardPanel front\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};
answerPgHeadTmpl = function() {
  return "<ul id=\"studyButtons\" class=\"back\">\n  <li>" + (button("Correct", "#", "id='correct' data-transition='pop' class='result'")) + "\n  <li>" + (button("Wrong", "#", "id='wrong' data-transition='pop' class='result'")) + "\n</ul>";
};
answerPgTmpl = function() {
  return "<div id=\"studyStats\"></div>\n<div id=\"studyPanel\">\n  <div class=\"cardPanel\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};
/*
loginPgTmpl = (login) ->
    """
    <h4>Login</h4>
    <form accept-charset="UTF-8"  id="loginForm">
        <div data-role="fieldcontain">
          <input type="text" id="email" name="email" placeholder="Email" value="#{login.email}"/>
        </div>
        <div data-role="fieldcontain">
          <input type="password" id="password" name="password" value="#{login.password}" placeholder="Password"/>
        </div>
        <div data-role="fieldcontain">
          <input type="submit" name="submit" value="Submit"/>
        </div>
        Server: <span id="server"></span>
    </form>
    """
*/