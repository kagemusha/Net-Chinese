var PG_DEFAULTS, cardBackTmpl, cardLiTmpl, delImg, editCardLiTmpl, editLabelLiTmpl, editSetLiTmpl, h_answerPgTmpl, h_cardPgTmpl, h_filterPgTmpl, h_labelPgTmpl, h_labelsPgTmpl, h_setPgTmpl, h_setsPgTmpl, h_studyPgTmpl, h_textInputPgTmpl, labelLiTmpl, setLiTmpl, studyStatsTmpl, triesTmpl;
PG_DEFAULTS = {
  "data-theme": "e"
};
h_setsPgTmpl = function() {
  return hamlHtml("" + (h_page("setsPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Sets")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (h_ul("setList", {
    obj_type: 'card_set'
  })));
};
h_setPgTmpl = function(set) {
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
  })) + "\n    #cardsShowing\n      %a#prevCards.cardList{href: \"#\", } Prev\n      %span#cardsShowingMsg\n      %a#nextCards.cardList{href: \"#\", } Next\n    %br\n    " + (h_ul("cardList", {
    obj_type: 'card'
  })) + "\n    " + (heditUL("editCardList", "card")));
};
/*

*/
h_labelsPgTmpl = function() {
  return hamlHtml("" + (h_page("labelsPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Labels")) + "\n    " + (h_backButton("Back", "#setPage")) + "\n    " + (editBtns(EDIT_LABEL_BTN, "labelList")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (h_button("Add Label", "#labelPage", {
    id: 'addLabelButton',
    init_pg: 'label'
  })) + "\n    " + (h_ul("labelList", {
    "data-inset": 'true'
  })) + "\n    " + (heditUL("editLabelList", "label", {
    "data-inset": true
  })));
};
h_labelPgTmpl = function() {
  return hamlHtml("" + (h_page("labelPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Label")) + "\n    " + (h_backButton("Cancel", "#labelsPage")) + "\n    " + (h_saveButton('labelForm', 'label', "#labelsPage")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (hForm("labelForm", {
    obj_type: "label"
  })) + "\n      %div{ data-role=\"fieldcontain\" }\n        " + (h_input("hidden", "card_set_id")) + "\n        " + (h_input("hidden", "id")) + "\n        " + (h_input("text", "name", {
    placeholder: "Label Name"
  })));
};
h_filterPgTmpl = function() {
  return hamlHtml("" + (h_page("filterPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Filters")) + "\n    " + (h_backButton("Back", "#studyPage", {
    callfn: 'filterChg'
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    #backFirstOption\n    #archivedFilter\n    #filtersForm");
};
studyStatsTmpl = function(stats, full) {
  if (full == null) {
    full = true;
  }
  return hamlHtml("#studyStatsMsg\n  %span.stat.label " + stats.leftInRun + "\n  of\n  %span.stat.label " + stats.runCount + "\n  left &nbsp;&nbsp;\n  " + (full ? triesTmpl(stats) : ""));
};
triesTmpl = function(stats) {
  return hamlHtml("Correct 1 try:\n%span.stat.label " + stats.tries[0] + "\n&nbsp;2:\n%span.stat.label " + stats.tries[1] + "\n&nbsp;More:\n%span.stat.label " + stats.tries[2]);
};
h_studyPgTmpl = function() {
  return hamlHtml("" + (h_page("studyPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Study")) + "\n    " + (h_backButton("Cards", "#setPage")) + "\n    " + (h_rightButton("Filter", "#filterPage", {
    "data-transition": "pop"
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    #studyStatsFront\n    #studyPanel\n      .cardPanel.front\n         #front.card_face\n             .textPanel\n                Please wait...");
};
h_cardPgTmpl = function() {
  return hamlHtml("" + (h_page("cardPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Card")) + "\n    " + (h_backButton("Cards", "#setPage")) + "\n    " + (h_saveButton('cardForm', 'card', "#setPage")) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (hForm("cardForm", {
    obj_type: "card"
  })) + "\n      " + (h_input("hidden", "card_set_id")) + "\n      " + (h_input("hidden", "id")) + "\n      " + (h_input("hidden", "front")) + "\n      " + (h_input("hidden", "back")) + "\n      %br\n      " + (h_ul("cardSides", {
    "data-inset": true
  })) + "\n        %li " + (h_link("Front (Chinese)", "#textInputPage", {
    id: 'frontTALink',
    init_pg: 'cardSide',
    saveCB: 'saveCardFront'
  })) + "\n        %li " + (h_link("Back (English)", "#textInputPage", {
    id: 'backTALink',
    init_pg: 'cardSide',
    saveCB: 'saveCardBack',
    side: 'back'
  })) + "\n      #cardLabels");
};
h_answerPgTmpl = function() {
  return hamlHtml("" + (h_page("answerPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Answer")) + "\n    " + (h_navbar()) + "\n      %ul#studyButtons.back\n        %li " + (h_link("Correct", "#", {
    id: 'correct',
    "data-transition": 'pop',
    "class": 'result'
  })) + "\n        %li " + (h_link("Wrong", "#", {
    id: 'wrong',
    "data-transition": 'pop',
    "class": 'result'
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    #studyStats\n    #studyPanel\n      .cardPanel\n         #front.card_face\n             .textPanel\n                Please wait...");
};
h_textInputPgTmpl = function(id, options) {
  if (options == null) {
    options = {};
  }
  _.extend({
    name: "tInput",
    placeholder: "(Enter text)"
  }, options);
  options["class"] = "" + (options["class"] || "") + " tInput";
  return hamlHtml("" + (h_page("textInputPage", PG_DEFAULTS)) + "\n  " + (h_pageHeader("Card")) + "\n    " + (h_backButton("Back", "#cardPage", {
    id: SAVE_TEXT_LINK
  })) + "\n  " + (h_content({
    "class": "pgContent"
  })) + "\n    " + (hTag("textarea", id || "tInput", options)));
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
  return "<li class='card " + archClass + "' >\n  <div class='overlay'>ARCHIVED</div>\n  <a class='card' obj_id='" + card.id + "' href='#cardPage' init_pg: 'card'>\n    <span class='front'> " + card.front + "</span><br/>\n    " + card.back + "\n  </a>\n</li>";
};
editCardLiTmpl = function(card) {
  return hamlHtml("<li class='card' obj_id='" + card.id + "' >\n  " + (delImg()) + "\n  <span class='front'> " + card.front + "</span><br/>\n  " + card.back + "\"\n</li>");
};
labelLiTmpl = function(label, icon) {
  if (icon == null) {
    icon = "";
  }
  return hamlHtml("%li " + icon + " " + (h_link(label.name, '#labelPage', {
    obj_id: '#{label.id}',
    init_pg: 'label'
  })));
};
editLabelLiTmpl = function(label) {
  return hamlHtml("%li{class: 'card', obj_id='" + label.id + "'} " + (delImg()) + " " + label.name);
};
delImg = function() {
  return "%img.del.del_icon.ui-li-icon{src: '" + (img('delete.png')) + "' }";
};
cardBackTmpl = function(back, front) {
  return "\n\n<div class='backText'>" + back + "</div>\n" + front + "\n\n";
};
/*
cardBackTmpl = (back, front) ->
  hamlHtml  """
            %br
            .backText
              #{back}
            #{front}
            %br
            %br
            """
*/