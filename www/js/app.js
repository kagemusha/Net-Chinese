var $atEnd, $currentCard, $currentSet, $editing, $saveAttr, $showFromCard, $showedStudyTip, $studyInit, $studyQueue, $updaters, ARCHIVED_RB_SEL, CARDS_PER_PAGE, CARD_LABEL_SEL, CARD_TYPE, CLICK_EVENT, DATA_REL_DATE_KEY, EDIT_CARD_BTN, EDIT_LABEL_BTN, EDIT_SET_BTN, FILTER_CHG, LABEL_TYPE, MSG_SEL, OBJ_ID_ATTR, OBJ_TYPE_ATTR, PAGES, SAVE_TEXT_LINK, SEL_TEST, SET_FILTERS_SEL, SET_ID_ATTR, SET_TYPE, SET_TYPE_ATTR, Set, TEXT_AREA_ELEM, addUpdater, cardCountMsg, deleteFromList, deleteObj, filterChg, getObj, initCallbacks, initCardPage, initCardSidePage, initLabelPage, initLabelsPage, initMobile, initPages, initSetPage, initStudyPage, initStudyingCBs, initUpdaters, labelChoices, loadData, modCardText, modSide, nextCards, populateData, prevCards, refreshCardList, remakeFilterPages, resetDeleteItem, resetEditing, saveCard, saveCardTextField, selectorSearch, setupForm, showDelButton, switchFilter, switchSet, test, toggleEditSet, update, updateCardViews, updateDelLink, updateLabelSelector, updateLabelViews, validateCard, validateLabel, validationsInit;
SET_TYPE = "card_set";
CARD_TYPE = 'card';
LABEL_TYPE = 'label';
OBJ_TYPE_ATTR = "obj_type";
OBJ_ID_ATTR = "obj_id";
SET_ID_ATTR = "set_id";
SET_TYPE_ATTR = "set_type";
CLICK_EVENT = "tap";
FILTER_CHG = "filChgx";
SEL_TEST = [ARCHIVED_RB_SEL, SET_FILTERS_SEL, TEXT_AREA_ELEM, CARD_LABEL_SEL];
MSG_SEL = ".msg";
$atEnd = false;
ARCHIVED_RB_SEL = "#archivedRB input";
SET_FILTERS_SEL = "#filterLabels input";
CARDS_PER_PAGE = 25;
$showFromCard = 0;
$studyInit = true;
$showedStudyTip = false;
$currentSet = null;
$currentCard = null;
$updaters = new Array();
TEXT_AREA_ELEM = "#textInputPage textArea";
SAVE_TEXT_LINK = "saveTextField";
$saveAttr = null;
EDIT_SET_BTN = "editSetBtn";
EDIT_CARD_BTN = "editCardBtn";
EDIT_LABEL_BTN = "editLabelBtn";
Set = (function() {
  function Set() {}
  Set.prototype.labels = null;
  Set.prototype.cards = null;
  return Set;
})();
/* studymanager conversion related */
CARD_LABEL_SEL = '#cardPanel #labels input:checkbox';
$studyQueue = new StudyQueue({
  cardFrontSel: "#studyPage .cardPanel .textPanel",
  cardBackSel: "#answerPage .cardPanel .textPanel",
  beforeRestart: function() {
    return $("#studyButtons").show();
  },
  getCards: function() {
    return $currentSet.cards;
  },
  hideBack: function(cb) {},
  showFront: function() {
    if (!$studyInit) {
      return $.mobile.changePage(pageSel("study"), {
        transition: "pop"
      });
    }
  },
  showCardFields: function(card) {
    var back, front;
    front = this.backFirst ? card.back : card.front;
    back = this.backFirst ? card.front : card.back;
    $(this.cardFrontSel).html(multiline(this.formatCardText(front)));
    return $(this.cardBackSel).html(multiline(this.formatCardText(cardBackTmpl(back, front))));
  },
  flipBack: function() {
    return $.mobile.changePage(pageSel("answer"), {
      transition: "flip"
    });
  },
  onFlip: function(toFront) {
    showMsg(null);
    $("#studyButtons").find("a.ui-btn-active").removeClass("ui-btn-active");
    if (toFront) {
      this.hideBack();
      return this.showFront();
    } else {
      return this.flipBack();
    }
  },
  showCardLabels: function(card) {
    if (card && card.labels) {
      return $(CARD_LABEL_SEL).each(function() {
        var cbLabelId, cbox;
        cbox = $(this);
        cbLabelId = cbox.attr("value");
        if (cbLabelId === "archived") {
          return;
        }
        return checkCBs($(cbox), valInArray(cbLabelId * 1, card.labels));
      });
    } else {
      if (!card) {
        log("No card!!");
      }
      checkCBs($(CARD_LABEL_SEL), false);
      return checkCBs($("#archiveCB"), card.archived);
    }
  },
  updateStudyStatsView: function(studyQueue) {
    refreshTmplById("studyStats", studyStatsTmpl, studyQueue);
    return refreshTmplById("studyStatsFront", studyStatsTmpl, studyQueue, false);
  },
  onFinished: function() {
    showMsg("Finished! Tap cards to restart");
    $("#studyButtons").hide();
    return $atEnd = true;
  }
});
initMobile = function() {
  var filt;
  env();
  selectorSearch();
  test();
  root.msgSel = ".msg";
  loadData();
  showMsgs();
  initPages();
  validationsInit();
  loginFormInit();
  initCallbacks();
  initStudyingCBs();
  initUpdaters();
  filt = "#filterPage #backFirstChoice input";
  return log(filt, $(filt).length);
};
DATA_REL_DATE_KEY = "dat_rel_dat";
loadData = function() {
  var lastLoadedDate;
  lastLoadedDate = retrieve(DATA_REL_DATE_KEY);
  if (!lastLoadedDate || (DATA_REL_DATE > lastLoadedDate)) {
    populateData(CARD_SET_DATA);
    return cache(DATA_REL_DATE_KEY, DATA_REL_DATE);
  }
};
PAGES = ["sets", "set", "labels", "label", "filter", "study", "answer", "card", "textInput"];
initPages = function() {
  var hasData;
  TABLES[SET_TYPE] = Table.get(SET_TYPE);
  hasData = (TABLES[SET_TYPE].recs != null) && TABLES[SET_TYPE].recs.length > 0;
  makePages(PAGES);
  $("" + (idSel(dualId(EDIT_SET_BTN, "done")))).hide();
  $("" + (idSel(dualId(EDIT_CARD_BTN, "done")))).hide();
  $("" + (idSel(dualId(EDIT_LABEL_BTN, "done")))).hide();
  if (hasData) {
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE);
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE);
    refreshListById("setList", setLiTmpl, TABLES[SET_TYPE].all());
  }
  return $("" + (classSel(EDITING_CLASS))).hide();
};
validationsInit = function() {
  VALIDATIONS[LABEL_TYPE] = validateLabel;
  return VALIDATIONS[CARD_TYPE] = validateCard;
};
initCallbacks = function() {
  $("*[data-role='page']").live('pageshow', function(event, ui) {
    var link;
    log("pg", this.id);
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active");
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active");
    showMsg();
    return resetEditing();
  });
  $('#studyPage').live('pageshow', function(event, ui) {
    if (!$showedStudyTip) {
      popupMsg("Touch card to see answer", 1200);
      $showedStudyTip = true;
    }
    filterChg();
    refreshTmplById("studyStatsFront", studyStatsTmpl, $studyQueue, false);
    return $studyQueue.showCard();
  });
  $("a#prevCards").live(CLICK_EVENT, function() {
    return prevCards();
  });
  $("a#nextCards").live(CLICK_EVENT, function() {
    return nextCards();
  });
  $('a[init_pg]').live(CLICK_EVENT, function() {
    var myHash, page, params;
    params = {};
    page = $(this).attr("init_pg");
    myHash = location.hash;
    log("initing", pageId(page));
    params.obj_id = $(this).attr("obj_id");
    params.source = $(this);
    return callFunctionType("init", pageId(page), params);
  });
  $('a[callfn]').live(CLICK_EVENT, function() {
    var fn;
    fn = $(this).attr("callfn");
    if (fn && fn.length > 0) {
      return callFn(fn, this);
    }
  });
  $('a[stRestart]').live(CLICK_EVENT, function() {
    return $studyQueue.restart();
  });
  $('a.result').live(CLICK_EVENT, function() {
    return $($studyQueue.cardFrontSel).html("");
  });
  $('a[saveform]').live(CLICK_EVENT, function() {
    var formId;
    log("saveform!!");
    formId = "" + ($(this).attr("saveform"));
    return saveForm(formId);
  });
  $("a.delete").live(CLICK_EVENT, function() {
    var type;
    type = $(this).attr("obj_type");
    deleteObj(type, $(this).attr("obj_id"));
    return popupMsg("Deleted " + type);
  });
  $('.aDeleteBtn').live(CLICK_EVENT, function() {
    return deleteFromList(this);
  });
  $(".overlay").live(CLICK_EVENT, function() {
    log("tapped overlay");
    return $(this).parent().find("a").trigger(CLICK_EVENT);
  });
  $("" + (pageSel('filter')) + " " + SET_FILTERS_SEL).live("change", function() {
    log("filter chg");
    setFlag(FILTER_CHG);
    return switchFilter(SET_FILTERS_SEL);
  });
  $("#filterPage #filterArchivedChoice input").live("change", function(event, ui) {
    var showArchived;
    showArchived = $(this).attr("value") === "true";
    log("show arch", showArchived);
    $studyQueue.showArchived = showArchived;
    return setFlag(FILTER_CHG);
  });
  $("#filterPage #backFirstChoice input").live("change", function(event, ui) {
    var backFirst;
    backFirst = $(this).attr("value") === "true";
    log("back first", backFirst);
    return $studyQueue.backFirst = backFirst;
  });
  return $('.del_icon').live(CLICK_EVENT, function() {
    return showDelButton(this);
  });
};
deleteObj = function(type, id) {
  var table;
  table = TABLES[type];
  table["delete"](id);
  return log("deleted", type, id);
};
switchFilter = function(checkboxElems) {
  var filters;
  filters = new Array();
  $(checkboxElems).each(function() {
    var checked, labelId;
    labelId = $(this).attr("value");
    checked = $(this).attr("checked");
    if (checked) {
      return filters.push(labelId);
    }
  });
  return $studyQueue.filters = filters;
};
initSetPage = function(params) {
  var setId;
  setId = params["obj_id"];
  return switchSet(setId);
};
switchSet = function(setId) {
  log("switch set", setId);
  if (!$currentSet || ($currentSet && (setId !== $currentSet.id))) {
    $showFromCard = 0;
    $currentSet = TABLES[SET_TYPE].findById(setId);
    refreshCardList();
    updateLabelViews();
    $studyQueue.clearFilters();
    switchFilter(SET_FILTERS_SEL);
    return remakeFilterPages();
  }
};
remakeFilterPages = function() {
  return log("remake");
};
initCardPage = function(params) {
  var cardId;
  cardId = params.obj_id;
  log("initCardPage id", cardId);
  $currentCard = cardId ? getObj(CARD_TYPE, cardId) : $currentCard = {
    card_set_id: $currentSet.id
  };
  if (!$currentCard.archived) {
    $currentCard.archived = false;
  }
  log("initCardPage", $currentCard);
  return setupForm("#cardForm", $currentCard, modCardText);
};
modCardText = function(obj) {
  modSide("front", obj.front);
  return modSide("back", obj.back);
};
modSide = function(side, text) {
  var elem;
  elem = "#" + side + "TALink";
  if (text) {
    $(elem).text(text.replace(/(<([^>]+)>)/ig, ""));
    return $(elem).removeClass("notext");
  } else {
    $(elem).text("Enter " + side + " side text (" + (side === "front" ? "Chinese" : "English") + ")");
    return $(elem).addClass("notext");
  }
};
initCardSidePage = function(params) {
  var side, source;
  source = $(params.source);
  side = source.attr("side") || "front";
  $saveAttr = side;
  $(TEXT_AREA_ELEM).val($currentCard[side] || "");
  return $("" + (idSel(SAVE_TEXT_LINK))).attr('callfn', 'saveCardTextField');
};
saveCardTextField = function() {
  var newVal;
  newVal = $(TEXT_AREA_ELEM).val();
  log("sctf-val", $saveAttr, $("#cardForm #" + $saveAttr).length, newVal);
  $currentCard[$saveAttr] = newVal;
  $("#cardForm #" + $saveAttr).val(newVal);
  return modCardText($currentCard);
};
saveCard = function() {
  return log("save card!");
};
setupForm = function(form, obj, postSetup) {
  log("obj to form", obj);
  populateForm(form, obj);
  if (postSetup) {
    return postSetup(obj);
  }
};
initLabelPage = function(params) {
  var id, label;
  id = params.obj_id;
  label = id ? getObj(LABEL_TYPE, id) : {
    card_set_id: $currentSet.id
  };
  setupForm("#labelForm", label);
  return updateDelLink(pageSel("label"), id);
};
initLabelsPage = function(params) {};
initStudyPage = function(params) {
  updateLabelSelector("#filterPage", $studyQueue.showArchived, $studyQueue.filters);
  $studyInit = true;
  $studyQueue.restart();
  return $studyInit = false;
};
filterChg = function() {
  var filterChanged;
  filterChanged = consumeFlag(FILTER_CHG);
  log("filterChng", filterChanged);
  if (filterChanged) {
    return $studyQueue.restart();
  }
};
updateLabelSelector = function(container, archived, filters) {
  var arcvContainer, filterCBs;
  arcvContainer = "" + container + " " + ARCHIVED_RB_SEL;
  log("archsel", $("" + arcvContainer + "#yes").length, archived);
  checkCBs("" + arcvContainer + "#yes", archived);
  checkCBs("" + arcvContainer + "#no", !archived);
  filterCBs = "" + container + " " + SET_FILTERS_SEL;
  $(filterCBs).each(function(n) {
    return checkCBs(this, valInArray($(this).attr("value"), filters));
  });
  refreshChoice(arcvContainer);
  return refreshChoice(filterCBs);
};
updateDelLink = function(container, objId) {
  var delLink;
  delLink = $("" + container + " a.delete");
  if (objId) {
    return delLink.attr("obj_id", objId).show();
  } else {
    return delLink.hide();
  }
};
getObj = function(type, id) {
  var obj;
  if (!id) {
    return null;
  }
  log("getObj t id", type, id);
  obj = TABLES[type].findById(id);
  log("getObj", obj, type, id);
  return obj || {};
};
prevCards = function() {
  if ($showFromCard > 0) {
    $showFromCard -= CARDS_PER_PAGE;
    return refreshCardList(false);
  }
};
nextCards = function() {
  if ($currentSet.cards.length > $showFromCard + CARDS_PER_PAGE) {
    $showFromCard += CARDS_PER_PAGE;
    return refreshCardList(false);
  }
};
refreshCardList = function(getCards) {
  if (getCards == null) {
    getCards = true;
  }
  if (getCards) {
    $currentSet.cards = TABLES[CARD_TYPE].findAll("card_set_id", $currentSet.id);
  }
  log("refresh cards, count", $currentSet.cards.length);
  if ($currentSet.cards.length === 0) {
    $("#cardsShowing").hide();
    $("#cardList").empty();
    popupMsg("No cards in this set");
    return $("#studyButton").hide();
  } else {
    return updateCardViews();
  }
};
cardCountMsg = function() {
  var last, msg, multiPage, setLength;
  $("#cardsShowing").show();
  setLength = $currentSet.cards.length;
  last = $showFromCard + CARDS_PER_PAGE;
  multiPage = setLength > CARDS_PER_PAGE;
  showElem("a.cardList", multiPage);
  msg = multiPage ? "Cards " + ($showFromCard + 1) + "-" + (last > setLength ? setLength : last) + " of " + setLength : "" + setLength + " cards";
  return $("#cardsShowingMsg").html(msg);
};
labelChoices = function(labels) {
  var label, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = labels.length; _i < _len; _i++) {
    label = labels[_i];
    _results.push({
      id: "lbl" + label.id,
      value: label.id,
      label: label.name,
      "data-theme": "a"
    });
  }
  return _results;
};
initStudyingCBs = function() {
  $("#studyPage #front").bind(CLICK_EVENT, function() {
    if (!$studyQueue.flipped) {
      return $studyQueue.flip(false);
    }
  });
  $("#answerPage .card_face").bind(CLICK_EVENT, function() {
    if ($atEnd) {
      $studyQueue.restart();
      return $atEnd = false;
    }
  });
  return $("#answerPage .result").bind(CLICK_EVENT, function() {
    return $studyQueue.result($(this).attr("id") !== "wrong");
  });
};
populateData = function(cardSets) {
  var cardSet, cards, labels, _i, _len, _results;
  TABLES[SET_TYPE] = Table.get(SET_TYPE);
  TABLES[CARD_TYPE] = Table.get(CARD_TYPE);
  TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE);
  TABLES[SET_TYPE].nuke();
  TABLES[CARD_TYPE].nuke();
  TABLES[LABEL_TYPE].nuke();
  TABLES[SET_TYPE];
  _results = [];
  for (_i = 0, _len = cardSets.length; _i < _len; _i++) {
    cardSet = cardSets[_i];
    if (cardSet.card_set) {
      cardSet = cardSet.card_set;
    }
    cards = cardSet.cards;
    delete cardSet.cards;
    labels = cardSet.labels;
    delete cardSet.labels;
    TABLES[SET_TYPE].add(cardSet);
    TABLES[CARD_TYPE].bulkAdd(cards);
    _results.push(TABLES[LABEL_TYPE].bulkAdd(labels));
  }
  return _results;
};
$editing = false;
toggleEditSet = function(link) {
  var edit, linkId, page;
  linkId = $(link).attr("id");
  edit = linkId.slice(0, 4) === "edit";
  log("$edI, edit", $editing, edit);
  if ((!$editing && edit) || ($editing && !edit)) {
    resetDeleteItem();
    page = $(link).closest("div[data-role=page]");
    log("linkPage", page.length, $(page).attr("id"));
    toggleEditControls(page.attr("id"));
    return setTimeout(function() {
      return $editing = edit;
    }, 600);
  }
};
resetEditing = function() {
  showHide(classSel(NOT_EDITING_CLASS), classSel(EDITING_CLASS));
  return $editing = false;
};
resetDeleteItem = function() {
  $('.aDeleteBtn').closest("li").find("img").rotate(0);
  return $('.aDeleteBtn').remove();
};
showDelButton = function(img) {
  var rotated;
  rotated = $(img).closest("li").attr("obj_id") === $('.aDeleteBtn').closest("li").attr("obj_id");
  log("rotated", rotated, $(img).closest("li").length, $('.aDeleteBtn').closest("li").length);
  log("rotated", rotated, $(img).closest("li").attr("obj_id"), $('.aDeleteBtn').closest("li").attr("obj_id"));
  resetDeleteItem();
  if (!rotated) {
    $(img).rotate(90);
    return $(img).closest("li").append(link("Delete", "#", {
      "class": 'aDeleteBtn ui-btn-up-r'
    }));
  }
};
deleteFromList = function(link) {
  var liTmpl, list, obj_id, type;
  obj_id = $(link).closest("li").attr("obj_id");
  list = $(link).closest("ul");
  type = list.attr("obj_type");
  liTmpl = list.attr("liTmpl");
  deleteObj(type, obj_id);
  $('.aDeleteBtn').closest("li").remove();
  return update(type, link, obj_id);
};
validateLabel = function(label) {
  if (fieldBlank(label.name)) {
    return "Not saved: no label name";
  } else {
    return false;
  }
};
validateCard = function(card) {
  var invalid;
  invalid = fieldBlank(card.front) && fieldBlank(card.back);
  if (invalid) {
    return "Not saved: must fill in either card front or back";
  } else {
    return false;
  }
};
updateLabelViews = function(source, label) {
  var labelSpecs;
  log("label updatING");
  $currentSet.labels = TABLES[LABEL_TYPE].findAll("card_set_id", $currentSet.id);
  labelSpecs = labelChoices($currentSet.labels);
  h_resetChoices(false, "cardFormLabels", "labels", labelSpecs, {
    "data-theme": "d"
  });
  h_resetChoices(false, "filterLabels", "labels", labelSpecs, {
    "data-theme": "d"
  });
  refreshEditableListById("labelList", labelLiTmpl, editLabelLiTmpl, $currentSet.labels);
  refreshPage("#cardPage");
  return refreshPage("#filterPage");
};
updateCardViews = function(type, updater) {
  var displayCards;
  $currentSet.cards = TABLES[CARD_TYPE].findAll("card_set_id", $currentSet.id);
  displayCards = $currentSet.cards.slice($showFromCard, $showFromCard + CARDS_PER_PAGE);
  log("set id", $currentSet.id, "cardlen: ", $currentSet.cards.length);
  cardCountMsg();
  refreshEditableListById("cardList", cardLiTmpl, editCardLiTmpl, displayCards);
  if (!$editing) {
    return $("#cardList").show();
  }
};
initUpdaters = function() {
  addUpdater("label", updateLabelViews);
  return addUpdater("card", updateCardViews);
};
addUpdater = function(type, updater) {
  var _ref;
    if ((_ref = $updaters[type]) != null) {
    _ref;
  } else {
    $updaters[type] = new Array();
  };
  return $updaters[type].push(updater);
};
update = function(type, source, obj) {
  var updater, _i, _len, _ref, _results;
  if (!$updaters[type]) {
    return;
  }
  _ref = $updaters[type];
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    updater = _ref[_i];
    _results.push(updater(source, obj));
  }
  return _results;
};
selectorSearch = function() {
  var sel, _i, _len, _results;
  log("Test essential selectors present");
  _results = [];
  for (_i = 0, _len = SEL_TEST.length; _i < _len; _i++) {
    sel = SEL_TEST[_i];
    _results.push(log(sel, $(sel).length));
  }
  return _results;
};
test = function() {
  return log($.mobile);
};