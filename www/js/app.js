var $atEnd, $currentCard, $currentSet, $editing, $saveAttr, $showFromCard, $showedStudyTip, $studyInit, $studyLink, $studyQueue, ARCHIVED_RB_SEL, CARDS_PER_PAGE, CARD_LABEL_SEL, CARD_TYPE, CLICK_EVENT, DATA_REL_DATE_KEY, EDIT_BTNS, EDIT_CARD_BTN, EDIT_LABEL_BTN, EDIT_SET_BTN, FILTER_CHG, LABEL_TYPE, MSG_SEL, OBJ_ID_ATTR, OBJ_TYPE_ATTR, PAGES, SAVE_TEXT_LINK, SET_FILTERS_SEL, SET_HEADER_BUTTONS, SET_ID_ATTR, SET_TYPE, SET_TYPE_ATTR, Set, TEXT_AREA_ELEM, addArchivedLabels, cardCountMsg, deleteFromList, deleteObj, dualId, editBtns, filterChg, getObj, initCallbacks, initCardPage, initCardSidePage, initLabelPage, initLabelsPage, initMobile, initPages, initSetPage, initStudyPage, initStudyingCBs, loadData, modCardText, nextCards, populateData, prevCards, refreshCardList, refreshCheckboxes, refreshLabels, remakeFilterPages, resetDeleteItem, resetEditing, rotateDelImg, saveCard, saveCardTextField, setViewUpdaters, setupForm, switchFilter, switchSet, toggleEditControls, toggleEditSet, updateCardView, updateDelLink, updateLabelSelector, updateLabelView, valCard, valLabel, validationsInit;
SET_TYPE = "card_set";
CARD_TYPE = 'card';
LABEL_TYPE = 'label';
OBJ_TYPE_ATTR = "obj_type";
OBJ_ID_ATTR = "obj_id";
SET_ID_ATTR = "set_id";
SET_TYPE_ATTR = "set_type";
CLICK_EVENT = "tap";
FILTER_CHG = "filChgx";
MSG_SEL = ".msg";
$atEnd = false;
ARCHIVED_RB_SEL = "#archivedRB input";
SET_FILTERS_SEL = "#filterCheckboxes input";
CARDS_PER_PAGE = 25;
$showFromCard = 0;
$studyInit = true;
$showedStudyTip = false;
$currentSet = null;
$currentCard = null;
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
$studyLink = link("Study!", "#studyPage", "id='studyButton' init_pg='study' class='study'");
dualId = function(id, addedPrefix) {
  var preLen;
  preLen = addedPrefix.length;
  if (id.slice(0, (preLen - 1 + 1) || 9e9) === addedPrefix) {
    return "" + (uncapitalize(id[preLen])) + (id.substr(preLen + 1));
  } else {
    return "" + addedPrefix + (capitalize(id));
  }
};
editBtns = function(editBtnId, objList) {
  var dualBtnId, olStr;
  dualBtnId = dualId(editBtnId, "done");
  olStr = "objList='" + objList + "'";
  return [rightBtn("Done", "#", "id='" + dualBtnId + "' callfn='toggleEditSet' " + olStr, "editing"), rightBtn("Edit", "#", "id='" + editBtnId + "' callfn='toggleEditSet' " + olStr, "notEditing")].join(" ");
};
SET_HEADER_BUTTONS = [$studyLink, link("Add Card", "#cardPage", "init_pg=card obj_type=card"), link("Labels", "#labelsPage", "init_pg=labels ")];
/*
STUDY_HEADER_BUTTONS=[link("Correct","#study","class result "),
                      link("Wrong", "#study", "class result")]
*/
EDIT_BTNS = [rightBtn("Edit", "#", "id='editSetButton' callfn='toggleEditSet' objList='setList'", NOT_EDITING_CLASS), rightBtn("Done", "#", "id='doneEditSetButton' callfn='toggleEditSet' objList='setList'", EDITING_CLASS)];
PAGES = {
  sets: {
    head: {
      title: "Sets"
    }
  },
  set: {
    head: {
      title: "Set",
      leftBtns: backButton("Sets", "#setsPage"),
      rightBtns: editBtns(EDIT_CARD_BTN, "cardList"),
      buttons: SET_HEADER_BUTTONS
    }
  },
  card: {
    head: {
      title: "Card",
      leftBtns: backButton("Cancel", "#setPage"),
      rightBtns: saveButton('cardForm', 'card', "#setPage")
    }
  },
  labels: {
    head: {
      title: "Labels",
      leftBtns: backButton("Back", "#setPage"),
      rightBtns: editBtns("editLabelBtn", "labelList")
    }
  },
  label: {
    head: {
      title: "Label",
      leftBtns: backButton("Cancel", "#labelsPage"),
      rightBtns: saveButton('labelForm', 'label', "#labelsPage")
    }
  },
  study: {
    head: {
      leftBtns: backButton("Cards", "#setPage"),
      rightBtns: link("Filter", pageSel("filter"), "data-transition=pop")
    }
  },
  answer: {
    head: {
      leftBtns: backButton("Cards", "#setPage"),
      rightBtns: link("Restart", pageSel("study"), "data-transition=pop stRestart=true")
    }
  },
  filter: {
    head: {
      title: "Filter",
      leftBtns: backButton("Back", "#studyPage", "callfn=filterChg")
    }
  },
  textInput: {
    head: {
      title: "Card",
      leftBtns: backButton("Back", "#cardPage", " id='" + SAVE_TEXT_LINK + "' ")
    }
  }
};
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
  env();
  root.msgSel = ".msg";
  loadData();
  showMsgs();
  initPages();
  validationsInit();
  loginFormInit();
  initCallbacks();
  return initStudyingCBs();
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
initPages = function() {
  var firstPage, hasData;
  TABLES[SET_TYPE] = Table.get(SET_TYPE);
  hasData = (TABLES[SET_TYPE].recs != null) && TABLES[SET_TYPE].recs.length > 0;
  firstPage = "sets";
  makePages(firstPage, PAGES);
  refreshTmpl("" + (pageSel('answer')) + " #headNav", answerPgHeadTmpl);
  $("" + (idSel(dualId(EDIT_SET_BTN, "done")))).hide();
  $("" + (idSel(dualId(EDIT_CARD_BTN, "done")))).hide();
  $("" + (idSel(dualId(EDIT_LABEL_BTN, "done")))).hide();
  if (hasData) {
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE);
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE);
    setViewUpdaters();
    refreshListById("setList", setLiTmpl, TABLES[SET_TYPE].all());
  }
  $("#backFirstOption").append(yesnoChoiceTmpl("backFirstRB", "Show Back First", "backFirst", false));
  addArchivedLabels("#archivedFilter", "Show Archived");
  $("tInput").css("height: 300px");
  $("tInput").css("width: 200px");
  log("noted", classSel(NOT_EDITING_CLASS));
  return $("" + (classSel(EDITING_CLASS))).hide();
};
validationsInit = function() {
  VALIDATIONS[LABEL_TYPE] = valLabel;
  return VALIDATIONS[CARD_TYPE] = valCard;
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
      popupMsg("Touch card to see answer");
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
  $("" + (pageSel('filter')) + " " + ARCHIVED_RB_SEL).live("change", function(event, ui) {
    log("arch filter");
    $studyQueue.showArchived = $(this).attr("value") === "true";
    return setFlag(FILTER_CHG);
  });
  $("" + (pageSel('filter')) + " " + SET_FILTERS_SEL).live("change", function() {
    log("filter chg");
    setFlag(FILTER_CHG);
    return switchFilter(SET_FILTERS_SEL);
  });
  $("" + (pageSel('filter')) + " #backFirstOption input").live("change", function(event, ui) {
    var backFirst;
    backFirst = $(this).attr("value") === "true";
    return $studyQueue.backFirst = backFirst;
  });
  return $('.del_icon').live(CLICK_EVENT, function() {
    return rotateDelImg(this);
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
    updateLabelView();
    return $studyQueue.clearFilters();
  }
};
remakeFilterPages = function() {
  log("remake");
  makePage("card", PAGES.card);
  return refreshLabels("#cardLabels", "Labels");
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
  refreshLabels("#cardLabels", "Labels");
  return setupForm("#cardForm", $currentCard, modCardText);
};
modCardText = function(obj) {
  $("#frontTALink").text(obj.front ? obj.front.replace(/(<([^>]+)>)/ig, "") : "Front (Chinese)");
  return $("#backTALink").text(obj.back ? obj.back.replace(/(<([^>]+)>)/ig, "") : "Back (English)");
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
  log("sctf", $saveAttr, $("#cardForm #" + $saveAttr).length);
  newVal = $("#textInputPage #tInput").val();
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
updateLabelView = function() {
  $currentSet.labels = TABLES[LABEL_TYPE].findAll("card_set_id", $currentSet.id);
  refreshEditableListById("labelList", labelLiTmpl, editLabelLiTmpl, $currentSet.labels);
  return refreshLabels("#filtersForm", "Filters");
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
    return updateCardView();
  }
};
updateCardView = function() {
  var displayCards;
  displayCards = $currentSet.cards.slice($showFromCard, $showFromCard + CARDS_PER_PAGE);
  log("set id", $currentSet.id, "cardlen: ", $currentSet.cards.length);
  cardCountMsg();
  refreshEditableListById("cardList", cardLiTmpl, editCardLiTmpl, displayCards);
  if (!$editing) {
    return $("#cardList").show();
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
addArchivedLabels = function(container, archiveLbl) {
  $(container).empty();
  return $(container).append(yesnoChoiceTmpl("archivedRB", archiveLbl, "archived"));
};
refreshLabels = function(container, lblsLbl) {
  var filterBtnSet, options;
  $(container).empty();
  options = {
    id: "filterCheckboxes",
    label: lblsLbl
  };
  filterBtnSet = choiceGroup(false, "labels", options, $currentSet.labels);
  return $(container).append(filterBtnSet);
};
refreshCheckboxes = function(sel) {
  try {
    $("input[type='radio']").checkboxradio("init");
    $("input[type='checkbox']").checkboxradio("init");
    $("input[type='radio']").checkboxradio("refresh");
    return $("input[type='checkbox']").checkboxradio("refresh");
  } catch (e) {
    return log("cbr error", e);
  }
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
  var cardSet, cards, labels, _i, _len;
  TABLES[SET_TYPE] = Table.get(SET_TYPE);
  TABLES[CARD_TYPE] = Table.get(CARD_TYPE);
  TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE);
  TABLES[SET_TYPE].nuke();
  TABLES[CARD_TYPE].nuke();
  TABLES[LABEL_TYPE].nuke();
  TABLES[SET_TYPE];
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
    TABLES[LABEL_TYPE].bulkAdd(labels);
  }
  return setViewUpdaters();
};
setViewUpdaters = function() {
  TABLES[CARD_TYPE].updateViews = function() {
    return refreshCardList();
  };
  return TABLES[LABEL_TYPE].updateViews = function() {
    return updateLabelView();
  };
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
toggleEditControls = function(pageId) {
  if (pageId == null) {
    pageId = "";
  }
  return $("" + (idSel(pageId)) + " ." + EDITING_CLASS + ", " + (idSel(pageId)) + " ." + NOT_EDITING_CLASS).toggle();
};
resetDeleteItem = function() {
  $('.aDeleteBtn').closest("li").find("img").rotate(0);
  return $('.aDeleteBtn').remove();
};
rotateDelImg = function(img) {
  var rotated;
  rotated = $(img).closest("li").attr("obj_id") === $('.aDeleteBtn').closest("li").attr("obj_id");
  log("rotated", rotated, $(img).closest("li").length, $('.aDeleteBtn').closest("li").length);
  log("rotated", rotated, $(img).closest("li").attr("obj_id"), $('.aDeleteBtn').closest("li").attr("obj_id"));
  resetDeleteItem();
  if (!rotated) {
    $(img).rotate(90);
    return $(img).closest("li").append(link("Delete", "#", "class='aDeleteBtn ui-btn-up-r'"));
  }
};
deleteFromList = function(link) {
  var liTmpl, list, obj_id, type;
  obj_id = $(link).closest("li").attr("obj_id");
  list = $(link).closest("ul");
  type = list.attr("obj_type");
  liTmpl = list.attr("liTmpl");
  deleteObj(type, obj_id);
  return $('.aDeleteBtn').closest("li").remove();
};
valLabel = function(label) {
  return fieldNotBlank(label.name);
};
valCard = function(card) {
  return fieldNotBlank(card.front) || fieldNotBlank(card.back);
};