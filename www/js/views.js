var CARD_PAGE_BACK_BUTTON, PG_DEFAULTS, TEXT_INPUT_PG_SEL, answerPgTmpl, cardBackTmpl, cardLiTmpl, cardPgTmpl, delBtnLink, delImg, editCardLiTmpl, editCardPgTmpl, editLabelLiTmpl, editSetLiTmpl, filterPgTmpl, img, labelGroup, labelLiTmpl, labelPgTmpl, labelsPgTmpl, setLiTmpl, setPgTmpl, setsPgTmpl, studyPgTmpl, studyStatsTmpl, textInputPgTmpl, triesTmpl;
PG_DEFAULTS = {
  "data-theme": "e"
};
TEXT_INPUT_PG_SEL = "#editCardPage";
setsPgTmpl = function() {
  return hamlHtml("" + (page("setsPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Sets")) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    " + (listview({
    id: "setList",
    obj_type: 'card_set'
  })));
};
setPgTmpl = function(set) {
  return hamlHtml("" + (page("setPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Set", "fixed")) + "\n    " + (backButton("Sets", "#setsPage")) + "\n    " + (editBtns(EDIT_CARD_BTN, "cardList")) + "\n    " + (navbar()) + "\n      %ul\n        %li " + (link("Study!", "#studyPage", {
    id: 'studyButton',
    init_pg: 'study',
    "class": 'study'
  })) + "\n        %li " + (link("Add Card", "#editCardPage", {
    init_pg: "editCard",
    obj_type: CARD_TYPE
  })) + "\n        %li " + (link("Labels", "#labelsPage", {
    init_pg: "labels"
  })) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    #cardsShowing\n      %a#prevCards.cardList{href: \"#\", } Prev&nbsp;\n      %span#cardsShowingMsg\n      %a#nextCards.cardList{href: \"#\", } &nbsp;Next\n    %br\n    " + (listview({
    id: "cardList",
    obj_type: "card"
  })) + "\n    " + (editUL("card", {
    id: "editCardList"
  })));
};
labelsPgTmpl = function() {
  return hamlHtml("" + (page("labelsPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Labels")) + "\n    " + (backButton("Back", "#setPage")) + "\n    " + (editBtns(EDIT_LABEL_BTN, "labelList")) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    " + (button("Add Label", "#labelPage", {
    id: 'addLabelButton',
    init_pg: 'label',
    "data-theme": "a"
  })) + "\n    " + (listview({
    id: "labelList",
    "data-inset": 'true'
  })) + "\n    " + (editUL("label", {
    id: "editLabelList",
    "data-inset": true
  })));
};
labelPgTmpl = function() {
  return hamlHtml("" + (page("labelPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Label")) + "\n    " + (backButton("Cancel", "#labelsPage")) + "\n    " + (saveButton('labelForm', 'label', "#labelsPage")) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    " + (form({
    id: "labelForm",
    obj_type: "label"
  })) + "\n      " + (fieldcontain()) + "\n        " + (input("hidden", "card_set_id")) + "\n        " + (input("hidden", "id")) + "\n        " + (input("text", "name", {
    placeholder: "Label Name",
    "data-theme": "d"
  })) + "\n");
};
filterPgTmpl = function() {
  return hamlHtml("" + (page("filterPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Filters")) + "\n    " + (backButton("Back", "#studyPage", {
    callfn: 'filterChg'
  })) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    " + (yesnoChoiceTmpl("Show Back First", "backFirst")) + "\n    " + (yesnoChoiceTmpl("Show Archived", "filterArchived")) + "\n    " + (controlgroup("Labels", {
    id: "filterLabels"
  })));
};
CARD_PAGE_BACK_BUTTON = "cardPgBackBtn";
cardPgTmpl = function() {
  var pg;
  pg = "" + (page("cardPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Card")) + "\n    " + (backButton("Set", "#setPage")) + "\n    " + (rightButton("Edit", 'editCardPage')) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    .labelsPanel\n      %span.label Archived:&nbsp;\n      %span#showCardArchived\n      %br\n      %span.label Labels:&nbsp;\n      %span#showCardLabels (none)\n    %br\n    .cardPanel\n      .card_face\n        .textPanel#showCard\n          %span#frontText\n          %br\n          %span#backText";
  return hamlHtml(pg);
};
editCardPgTmpl = function(id, taOptions) {
  var taOptions2;
  if (taOptions == null) {
    taOptions = {};
  }
  taOptions["data-theme"] = "d";
  taOptions["class"] = "" + (taOptions["class"] || "") + " tInput";
  _.extend(taOptions, {
    name: "tInput",
    placeholder: "Enter card text"
  });
  taOptions2 = _.clone(taOptions);
  taOptions["name"] = taOptions["id"] = "front";
  taOptions2["name"] = taOptions2["id"] = "back";
  log("tInputOpts", taOptions);
  return hamlHtml("" + (page("editCardPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Card")) + "\n    " + (backButton("Back", "#cardPage", {
    id: CARD_PAGE_BACK_BUTTON
  })) + "\n    " + (saveButton('cardForm', 'card', "#cardPage")) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    " + (form({
    id: "cardForm",
    obj_type: "card"
  })) + "\n      " + (input("hidden", "card_set_id")) + "\n      " + (input("hidden", "id")) + "\n      %br\n      " + (haTag("textarea", taOptions)) + "\n      %br\n      " + (haTag("textarea", taOptions2)) + "\n      " + (yesnoChoiceTmpl("Archived", "archived", false)) + "\n      " + (controlgroup("Labels", {
    id: "cardFormLabels",
    "data-theme": "d"
  })));
};
studyStatsTmpl = function(stats, full) {
  if (full == null) {
    full = true;
  }
  return hamlHtml("#studyStatsMsg\n  %span.stat.label " + stats.leftInRun + "\n  &nbsp;of&nbsp;\n  %span.stat.label " + stats.runCount + "\n  &nbsp;left&nbsp;&nbsp;\n  " + (full ? triesTmpl(stats) : ""));
};
triesTmpl = function(stats) {
  return hamlHtml("Correct 1 try:\n%span.stat.label " + stats.tries[0] + "\n&nbsp;2:\n%span.stat.label " + stats.tries[1] + "\n&nbsp;more:\n%span.stat.label " + stats.tries[2]);
};
studyPgTmpl = function() {
  return hamlHtml("" + (page("studyPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Study")) + "\n    " + (backButton("Cards", "#setPage")) + "\n    " + (rightButton("Filter", "#filterPage", {
    "data-transition": "pop"
  })) + "\n  " + (content({
    "class": "pgContent",
    "data-theme": "d"
  })) + "\n    #studyStatsFront\n    #studyPanel\n      .cardPanel.front\n         #front.card_face\n           .textPanel\n              Please wait...");
};
answerPgTmpl = function() {
  return hamlHtml("" + (page("answerPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Answer")) + "\n    " + (backButton("Cards", "#setPage")) + "\n    " + (rightButton("Restart", "#studyPage", {
    "data-transition": "pop",
    stRestart: 'true'
  })) + "\n    " + (navbar()) + "\n      %ul#studyButtons.back\n        %li " + (link("Correct", "#", {
    id: 'correct',
    "data-transition": 'pop',
    "class": 'result'
  })) + "\n        %li " + (link("Wrong", "#", {
    id: 'wrong',
    "data-transition": 'pop',
    "class": 'result'
  })) + "\n  " + (content({
    "class": "pgContent",
    "data-theme": "d"
  })) + "\n    #studyStats\n    #studyPanel\n      .cardPanel\n         #front.card_face\n           .textPanel\n              Please wait...");
};
labelGroup = function(name, options, labels) {};
textInputPgTmpl = function(id, taOptions) {
  var _ref;
  if (taOptions == null) {
    taOptions = {};
  }
  taOptions["data-theme"] = "d";
  taOptions["class"] = "" + (taOptions["class"] || "") + " tInput";
  _.extend(taOptions, {
    name: "tInput",
    placeholder: "Enter card text"
  });
    if ((_ref = taOptions["id"]) != null) {
    _ref;
  } else {
    taOptions["id"] = id;
  };
  log("tInputOpts", taOptions);
  return hamlHtml("" + (page("textInputPage", PG_DEFAULTS)) + "\n  " + (pageHeader("Card")) + "\n    " + (backButton("Back", "#cardPage", {
    id: SAVE_TEXT_LINK
  })) + "\n  " + (content({
    "class": "pgContent"
  })) + "\n    " + (haTag("textarea", taOptions)));
};
setLiTmpl = function(set) {
  return hamlHtml("%li.set " + (link(set.name, "#setPage", {
    "class": 'set',
    obj_id: set.id,
    init_pg: 'set'
  })));
};
editSetLiTmpl = function(set) {
  return hamlHtml("%li.set{obj_id='" + set.id + "'} " + (delImg()) + " " + set.name);
};
cardLiTmpl = function(card) {
  var archClass;
  archClass = toStr(card.archived) === 'true' ? 'archived' : '';
  return "<li class='card " + archClass + "' >\n  <div class='overlay'>ARCHIVED</div>\n  <a class='card' obj_id='" + card.id + "' href='#cardPage'  init_pg='card' >\n    <span class='front'> " + card.front + "</span><br/>\n    " + card.back + "\n  </a>\n</li>";
};
editCardLiTmpl = function(card) {
  return hamlHtml("<li class='card' obj_id='" + card.id + "' >\n  " + (delImg()) + "\n  <span class='front'> " + card.front + "</span><br/>\n  " + card.back + "\"\n</li>");
};
labelLiTmpl = function(label, icon) {
  if (icon == null) {
    icon = "";
  }
  return hamlHtml("%li " + icon + " " + (link(label.name, '#labelPage', {
    obj_id: label.id,
    init_pg: 'label'
  })));
};
editLabelLiTmpl = function(label) {
  return hamlHtml("%li{class: 'card', obj_id: '" + label.id + "'}\n  " + (delImg()) + "\n  " + label.name);
};
cardBackTmpl = function(back, front) {
  return "\n\n<div class='backText'>" + back + "</div>\n" + front + "\n\n";
};
delBtnLink = function() {
  return hamlHtml(link("Delete", "#", {
    "class": 'aDeleteBtn ui-btn-up-r'
  }));
};
delImg = function() {
  return "%img.del.del_icon.ui-li-icon{src: '" + (img('delete.png')) + "' }";
};
img = function(file) {
  return "css/images/" + file;
};