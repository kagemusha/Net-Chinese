var PG_DEFAULTS, answerPgTmpl, cardBackTmpl, cardLiTmpl, cardPgTmpl, delImg, editCardLiTmpl, editLabelLiTmpl, editSetLiTmpl, filterPgTmpl, h_labelGroup, img, labelLiTmpl, labelPgTmpl, labelsPgTmpl, setLiTmpl, setPgTmpl, setsPgTmpl, studyPgTmpl, studyStatsTmpl, textInputPgTmpl, triesTmpl;
PG_DEFAULTS = {
  "data-theme": "e"
};
setsPgTmpl = function() {
  return hamlHtml("" + (h_page("setsPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Sets")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (listview({
    id: "setList",
    obj_type: 'card_set'
  })));
};
setPgTmpl = function(set) {
  return hamlHtml("" + (h_page("setPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Set")) + "\n    " + (h_backButton("Sets", "#setsPage")) + "\n    " + (editBtns(EDIT_CARD_BTN, "cardList")) + "\n    " + (h_navbar()) + "\n      %ul\n        %li " + (h_link("Study!", "#studyPage", {
    id: 'studyButton',
    init_pg: 'study',
    "class": 'study'
  })) + "\n        %li " + (h_link("Add Card", "#cardPage", {
    init_pg: "card",
    obj_type: CARD_TYPE
  })) + "\n        %li " + (h_link("Labels", "#labelsPage", {
    init_pg: "labels"
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    #cardsShowing\n      %a#prevCards.cardList{href: \"#\", } Prev&nbsp;\n      %span#cardsShowingMsg\n      %a#nextCards.cardList{href: \"#\", } &nbsp;Next\n    %br\n    " + (listview({
    id: "cardList",
    obj_type: "card"
  })) + "\n    " + (heditUL("card", {
    id: "editCardList"
  })));
};
labelsPgTmpl = function() {
  return hamlHtml("" + (h_page("labelsPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Labels")) + "\n    " + (h_backButton("Back", "#setPage")) + "\n    " + (editBtns(EDIT_LABEL_BTN, "labelList")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (h_button("Add Label", "#labelPage", {
    id: 'addLabelButton',
    init_pg: 'label'
  })) + "\n    " + (listview({
    id: "labelList",
    "data-inset": 'true'
  })) + "\n    " + (heditUL("label", {
    id: "editLabelList",
    "data-inset": true
  })));
};
labelPgTmpl = function() {
  return hamlHtml("" + (h_page("labelPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Label")) + "\n    " + (backButton("Cancel", "#labelsPage")) + "\n    " + (h_saveButton('labelForm', 'label', "#labelsPage")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (hForm({
    id: "labelForm",
    obj_type: "label"
  })) + "\n      " + (fieldcontain()) + "\n        " + (input("hidden", "card_set_id")) + "\n        " + (input("hidden", "id")) + "\n        " + (input("text", "name", {
    placeholder: "Label Name"
  })) + "\n");
};
filterPgTmpl = function() {
  return hamlHtml("" + (h_page("filterPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Filters")) + "\n    " + (h_backButton("Back", "#studyPage", {
    callfn: 'filterChg'
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (yesnoChoiceTmpl("Show Back First", "backFirst")) + "\n    " + (yesnoChoiceTmpl("Show Archived", "filterArchived")) + "\n    " + (controlgroup("Labels", {
    id: "filterLabels"
  })));
};
cardPgTmpl = function() {
  var pg;
  pg = "" + (h_page("cardPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Card")) + "\n    " + (h_backButton("Cancel", "#setPage")) + "\n    " + (h_saveButton('cardForm', 'card', "#setPage")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (hForm({
    id: "cardForm",
    obj_type: "card"
  })) + "\n      " + (h_input("hidden", "card_set_id")) + "\n      " + (h_input("hidden", "id")) + "\n      " + (h_input("hidden", "front")) + "\n      " + (h_input("hidden", "back")) + "\n      %br\n      " + (listview({
    id: "cardSides",
    "data-inset": true
  })) + "\n        %li " + (h_link("enter front text (Chinese)", "#textInputPage", {
    id: 'frontTALink',
    init_pg: 'cardSide',
    saveCB: 'saveCardFront'
  })) + "\n        %li " + (h_link("enter back text (English)", "#textInputPage", {
    id: 'backTALink',
    init_pg: 'cardSide',
    saveCB: 'saveCardBack',
    side: 'back'
  })) + "\n      %br\n      " + (yesnoChoiceTmpl("Archived", "archived", false)) + "\n      " + (controlgroup("Labels", {
    id: "cardFormLabels",
    "data-theme": "d"
  }));
  return hamlHtml(pg);
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
  return hamlHtml("" + (h_page("studyPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Study")) + "\n    " + (h_backButton("Cards", "#setPage")) + "\n    " + (h_rightButton("Filter", "#filterPage", {
    "data-transition": "pop"
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    #studyStatsFront\n    #studyPanel\n      .cardPanel.front\n         #front.card_face\n           .textPanel\n              Please wait...");
};
answerPgTmpl = function() {
  return hamlHtml("" + (h_page("answerPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Answer")) + "\n    " + (h_backButton("Cards", "#setPage")) + "\n    " + (h_rightButton("Restart", "#studyPage", {
    "data-transition": "pop",
    stRestart: 'true'
  })) + "\n    " + (h_navbar()) + "\n      %ul#studyButtons.back\n        %li " + (h_link("Correct", "#", {
    id: 'correct',
    "data-transition": 'pop',
    "class": 'result'
  })) + "\n        %li " + (h_link("Wrong", "#", {
    id: 'wrong',
    "data-transition": 'pop',
    "class": 'result'
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    #studyStats\n    #studyPanel\n      .cardPanel\n         #front.card_face\n           .textPanel\n              Please wait...");
};
h_labelGroup = function(name, options, labels) {};
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
  return hamlHtml("" + (h_page("textInputPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Card")) + "\n    " + (h_backButton("Back", "#cardPage", {
    id: SAVE_TEXT_LINK
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (haTag("textarea", taOptions)));
};
setLiTmpl = function(set) {
  return hamlHtml("%li.set " + (h_link(set.name, "#setPage", {
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
  return hamlHtml("%li " + icon + " " + (h_link(label.name, '#labelPage', {
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
delImg = function() {
  return "%img.del.del_icon.ui-li-icon{src: '" + (img('delete.png')) + "' }";
};
img = function(file) {
  return "css/images/" + file;
};