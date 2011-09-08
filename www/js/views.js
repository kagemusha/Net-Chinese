var answerPgHeadTmpl, answerPgTmpl, cardBackTmpl, cardLiTmpl, cardPgTmpl, editCardLiTmpl, editLabelLiTmpl, editSetLiTmpl, filterPgTmpl, labelLiTmpl, labelPgTmpl, labelsPgTmpl, setPgTmpl, setsPgTmpl, settingsPgTmpl, studyPgTmpl, studyStatsTmpl, triesTmpl;
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
  return "<div id=\"cardsShowing\">\n  " + (link("Prev", "#", "id='prevCards' class='cardList'")) + "\n  <span id=\"cardsShowingMsg\"></span>\n  " + (link("Next", "#", "id='nextCards' class='cardList'")) + "\n</div>\n<br/>\n" + (ul("cardList", null, null, "obj_type='card'")) + "\n" + (editUL("editCardList", "card"));
};
labelsPgTmpl = function() {
  return "" + (button("Add Label", "#labelPage", "id='addLabelButton' init_pg='label'")) + "\n" + (ul("labelList", null, {
    dataInset: true
  })) + "\n" + (editUL("editLabelList", "label", {
    dataInset: true
  }));
};
labelPgTmpl = function() {
  return "<form accept-charset=\"UTF-8\"  id=\"labelForm\" obj_type=\"label\">\n  <div data-role=\"fieldcontain\">\n    " + (input("hidden", "card_set_id")) + "\n    " + (input("hidden", "id")) + "\n    " + (input("text", "name")) + "\n  </div>\n</form>";
};
filterPgTmpl = function() {
  return "<div id=\"backFirstOption\">\n</div>\n<div id=\"archivedFilter\"></div>\n<div id=\"filtersForm\"></div>";
};
cardPgTmpl = function() {
  var cardSideItems;
  cardSideItems = [li(link("Front (Chinese)", "#textInputPage", "id='frontTALink' init_pg='cardSide' saveCB='saveCardFront'")), li(link("Back (English)", "#textInputPage", "id='backTALink' init_pg='cardSide' side='back' saveCB='saveCardBack'"))];
  return "<form accept-charset=\"UTF-8\"  id=\"cardForm\" obj_type=\"card\">\n  " + (input("hidden", "card_set_id")) + "\n  " + (input("hidden", "id")) + "\n  " + (input("hidden", "front")) + "\n  " + (input("hidden", "back")) + "\n  <br>\n  " + (ul("cardSides", cardSideItems, {
    dataInset: true
  })) + "\n  <div id=\"cardArchiveLabels\">" + (yesnoChoiceTmpl("archivedRB", "Archive", "archived")) + "</div>\n  <div id=\"cardLabels\"></div>\n\n</form>";
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
/*
answerPgHeadTmpl = ->
  btns = [li(button "Correct", "#", "id='correct' data-transition='pop' class='result'"),
          li(button "Wrong", "#", "id='wrong' data-transition='pop' class='result'")]
  ul "studyButtons", btns, "", "class='back'"
*/
answerPgHeadTmpl = function() {
  return "<ul id=\"studyButtons\" class=\"back\">\n  " + (li(button("Correct", "#", "id='correct' data-transition='pop' class='result'"))) + "\n  " + (li(button("Wrong", "#", "id='wrong' data-transition='pop' class='result'"))) + "\n</ul>";
};
answerPgTmpl = function() {
  return "<div id=\"studyStats\"></div>\n<div id=\"studyPanel\">\n  <div class=\"cardPanel\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};
editSetLiTmpl = function(set) {
  return li("" + (delImg()) + " " + set.name, "'class='set' obj_id='" + set.id + "'");
};
cardLiTmpl = function(card) {
  return "<li class=\"card " + (toStr(card.archived) === 'true' ? 'archived' : '') + " \">\n  <div class=\"overlay\">ARCHIVED</div>\n  <a class=\"card\" obj_id=\"" + card.id + "\" href=\"#cardPage\" init_pg=\"card\" >\n  <span class=\"front\">" + card.front + "</span><br/>\n  " + card.back + "\n</a></li>";
};
editCardLiTmpl = function(card) {
  return li("" + (delImg()) + "<span class='front'>" + card.front + "</span><br/>" + card.back, "class='card' obj_id='" + card.id + "'");
};
labelLiTmpl = function(label, icon) {
  if (icon == null) {
    icon = "";
  }
  return li("" + icon + " " + (link(label.name, '#labelPage', "obj_id='" + label.id + "'  init_pg='label'")));
};
editLabelLiTmpl = function(label) {
  return li("" + (delImg()) + " " + label.name, "class='card' obj_id='" + label.id + "'");
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