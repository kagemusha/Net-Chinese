var $SERVER, $atEnd, $currentSet, $dataKey, $params, $showFromCard, $showedStudyTip, $studyInit, $studyPanelHeight, $studyQueue, ARCHIVED_RB_SEL, ARCV_YES, CARDS_PER_PAGE, CARD_FORM_LABEL_GROUP, CARD_LABEL_SEL, CARD_TYPE, CLICK_EVENT, FILTER_CHG, LABEL_TYPE, MSG_SEL, NO_RESTART_FLAG, OBJ_ID_ATTR, OBJ_TYPE_ATTR, PAGES, RIGHT_BUTTON_CLASS, SET_FILTERS_SEL, SET_HEADER_BUTTONS, SET_ID_ATTR, SET_TYPE, SET_TYPE_ATTR, STUDY_HEADER_BUTTONS, SYNC_EL, Set, addArchivedLabels, cardCountMsg, deleteObj, filterChg, getData, getObj, initCallbacks, initCardPage, initLabelPage, initLabelsPage, initLoginPage, initMobile, initPages, initSetPage, initStudyPage, initStudyingCBs, loadData, nextCards, populateData, prevCards, refreshCardList, refreshCheckboxes, refreshLabels, refreshSetsPage, remakeFilterPages, setViewUpdaters, setupForm, submitSyncReq, switchFilter, switchSet, sync, testAddLogin, updateCardView, updateDelLink, updateLabelSelector, updateLabelView, valCard, valLabel, validationsInit;
SET_TYPE = "card_set";
CARD_TYPE = 'card';
LABEL_TYPE = 'label';
OBJ_TYPE_ATTR = "obj_type";
OBJ_ID_ATTR = "obj_id";
SET_ID_ATTR = "set_id";
SET_TYPE_ATTR = "set_type";
CARD_FORM_LABEL_GROUP = "#cardForm #labels";
CLICK_EVENT = "tap";
FILTER_CHG = "filChgx";
$SERVER = "http://crambear.heroku.com";
RIGHT_BUTTON_CLASS = ".ui-btn-right";
ARCV_YES = "#archivedRB #yes";
$params = new Object();
$dataKey = "appDatKey";
$studyPanelHeight = null;
MSG_SEL = ".msg";
SYNC_EL = "#setsPage a.ui-btn-right";
NO_RESTART_FLAG = "noRstrt";
$atEnd = false;
ARCHIVED_RB_SEL = "#archivedRB input";
SET_FILTERS_SEL = "#filterCheckboxes input";
CARDS_PER_PAGE = 40;
$showFromCard = 0;
$studyInit = true;
$showedStudyTip = false;
$currentSet = null;
Set = (function() {
  function Set() {}
  Set.prototype.labels = null;
  Set.prototype.cards = null;
  return Set;
})();
SET_HEADER_BUTTONS = [
  {
    label: "Add Card",
    link: "#cardPage",
    options: "init_pg=card obj_type=card "
  }, {
    label: "Labels",
    link: "#labelsPage",
    options: "init_pg=labels"
  }
];
STUDY_HEADER_BUTTONS = [
  {
    label: "Correct",
    link: "#study",
    options: "class result "
  }, {
    label: "Wrong",
    link: "#study",
    options: "class result"
  }
];
PAGES = {
  login: {},
  sets: {
    head: {
      leftButton: "none",
      rightButton: null
    }
  },
  set: {
    head: {
      leftButton: {
        type: "back",
        label: "Sets",
        page: "#setsPage"
      },
      buttons: SET_HEADER_BUTTONS
    }
  },
  card: {
    head: {
      leftButton: {
        type: "back",
        label: 'Cancel'
      },
      rightButton: {
        label: "Delete",
        options: "obj_type='card' class='delete' " + root.BACK_REL
      }
    }
  },
  labels: {},
  label: {
    head: {
      leftButton: {
        type: "back",
        label: "Cancel"
      },
      rightButton: {
        label: "Delete",
        options: "obj_type='label' class='delete' " + root.BACK_REL
      }
    }
  },
  study: {
    head: {
      leftButton: {
        type: "back",
        label: "Cards",
        page: "#setPage"
      },
      rightButton: {
        page: pageSel("filter"),
        label: "Filter",
        options: "data-transition=pop"
      }
    }
  },
  answer: {
    head: {
      leftButton: {
        type: "back",
        label: "Cards",
        page: "#setPage"
      },
      rightButton: {
        page: pageSel("filter"),
        label: "Filter",
        options: "data-transition=pop"
      }
    }
  },
  filter: {
    head: {
      leftButton: {
        type: "back",
        page: "#studyPage",
        options: "callFn=filterChg"
      }
    }
  }
};
/* studymanager conversion related */
CARD_LABEL_SEL = '#cardPanel #labels input:checkbox';
$studyQueue = new StudyQueue({
  cardFrontSel: "#studyPage .cardPanel .textPanel",
  cardBackSel: "#answerPage .cardPanel .textPanel",
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
    log("showCardFields", front, back);
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
      log("to front");
      this.hideBack();
      return this.showFront();
    } else {
      log("to back");
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
    return refreshTmplById("studyStats", studyStatsTmpl, studyQueue);
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
  log("Server", $SERVER);
  setFlag(MSG_KEY, "server: " + $SERVER);
  testAddLogin();
  initPages();
  validationsInit();
  loginFormInit();
  initCallbacks();
  return initStudyingCBs();
};
loadData = function() {
  return populateData(CARD_SET_DATA);
};
initPages = function() {
  var firstPage, hasData;
  TABLES[SET_TYPE] = Table.get(SET_TYPE);
  hasData = (TABLES[SET_TYPE].recs != null) && TABLES[SET_TYPE].recs.length > 0;
  firstPage = hasData ? "sets" : "login";
  makePages(firstPage, PAGES);
  log("" + (pageSel('study')) + " #headNav", $("" + (pageSel('study')) + " #headNav").length);
  refreshTmpl("" + (pageSel('answer')) + " #headNav", answerPgHeadTmpl);
  if (hasData) {
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE);
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE);
    setViewUpdaters();
    refreshSetsPage();
  }
  addArchivedLabels("#cardArchiveLabels", "Archive");
  return addArchivedLabels("#archivedFilter", "Show Archived");
};
validationsInit = function() {
  VALIDATIONS[LABEL_TYPE] = valLabel;
  return VALIDATIONS[CARD_TYPE] = valCard;
};
refreshSetsPage = function() {
  refreshTmplById("setList", setLiTmpl, TABLES[SET_TYPE].all());
  return listviewRefresh("setList");
};
initCallbacks = function() {
  log("pageCount", $("*[data-role='page']").length);
  $("*[data-role='page']").live('pageshow', function(event, ui) {
    var link;
    log("pg", this.id);
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active");
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active");
    return showMsg();
  });
  $('#studyPage').live('pageshow', function(event, ui) {
    if (!$showedStudyTip) {
      popupMsg("touch card to see back");
      $showedStudyTip = true;
    }
    filterChg();
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
    return callFunctionType("init", pageId(page), params);
  });
  $('a[callFn]').live(CLICK_EVENT, function() {
    var fn;
    fn = $(this).attr("callFn");
    log("XXX calling fn " + fn);
    return callFn(fn);
  });
  $('a.result').live(CLICK_EVENT, function() {
    return $($studyQueue.cardFrontSel).html("");
  });
  $('a[saveForm]').live(CLICK_EVENT, function() {
    var formId;
    formId = "" + ($(this).attr("saveForm"));
    return saveForm(formId);
  });
  $("a.delete").live(CLICK_EVENT, function() {
    var type;
    type = $(this).attr("obj_type");
    deleteObj(type, $(this).attr("obj_id"));
    return popupMsg("Deleted " + type);
  });
  $(".overlay").live(CLICK_EVENT, function() {
    log("tapped overlay");
    return $(this).parent().find("a").trigger(CLICK_EVENT);
  });
  $(SYNC_EL).live(CLICK_EVENT, function() {
    log("sync");
    return $(this).removeClass("ui-btn-active");
  });
  $("" + (pageSel('filter')) + " " + ARCHIVED_RB_SEL).live("change", function(event, ui) {
    $studyQueue.showArchived = $(this).attr("value") === "true";
    return setFlag(FILTER_CHG);
  });
  return $("" + (pageSel('filter')) + " " + SET_FILTERS_SEL).live("change", function() {
    log("change filter XXXX");
    setFlag(FILTER_CHG);
    return switchFilter(SET_FILTERS_SEL);
  });
};
deleteObj = function(type, id) {
  var table;
  log("delete", type, id);
  table = TABLES[type];
  return table["delete"](id);
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
getData = function() {
  return retrieveObj($dataKey);
};
submitSyncReq = function(login) {
  showMsg("Syncing...");
  return $.post(url($SERVER, "sync"), login, function(data) {
    return sync(data, login);
  });
};
sync = function(response, credentials) {
  log("ajaxsync", response);
  if (response.error_msg) {
    showMsg(response.error_msg);
  } else {
    populateData(response);
    login(credentials);
    refreshSetsPage();
    if (onPage("loginPage")) {
      $.mobile.changePage(pageSel("sets"));
    }
  }
  return removePopup();
};
initLoginPage = function(params) {
  log("LGPAGE");
  return $("#server").html($SERVER);
};
initSetPage = function(params) {
  var setId;
  log("initSetPage", params);
  setId = params["obj_id"];
  return switchSet(setId);
};
initLabelsPage = function() {
  return log("initLPage");
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
  var form, id, otherFields;
  id = params.obj_id;
  form = "#cardForm";
  updateDelLink(pageSel("card"), id);
  otherFields = {
    card_set_id: $currentSet.id
  };
  if (!(id != null)) {
    otherFields.archived = false;
  }
  refreshLabels("#cardLabels", "Labels");
  return setupForm(form, CARD_TYPE, id, otherFields);
};
initLabelPage = function(params) {
  var form, id;
  id = params.obj_id;
  form = "#labelForm";
  setupForm(form, LABEL_TYPE, id, {
    card_set_id: $currentSet.id
  });
  return updateDelLink(pageSel("label"), id);
};
initStudyPage = function(params) {
  log("XXXXXXXXXXXXXXXX      init studp");
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
  refreshTmplById("labelList", labelLiTmpl, $currentSet.labels);
  listviewRefresh("labelList");
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
setupForm = function(form, type, id, otherProps) {
  var obj;
  obj = getObj(type, id);
  $.extend(obj, otherProps);
  log("obj to form", obj);
  return populateForm(form, obj);
};
getObj = function(type, id) {
  var obj;
  if (id) {
    obj = TABLES[type].findById(id);
  }
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
  refreshTmplById("cardList", cardLiTmpl, displayCards);
  listviewRefresh("cardList");
  $("#studyButton").show();
  return $("#cardList").show();
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
  var arcvBtnSet, arcvBtns, options;
  $(container).empty();
  options = {
    id: "archivedRB",
    align: "horizontal",
    label: archiveLbl
  };
  arcvBtns = [
    {
      id: "yes",
      name: "archived",
      val: "true",
      label: "Yes"
    }, {
      id: "no",
      name: "archived",
      val: "false",
      label: "No"
    }
  ];
  arcvBtnSet = choiceGroup(true, "archived", options, arcvBtns);
  return $(container).append(arcvBtnSet);
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
    log("choice counts(rd, cb)", $("input[type='radio']").length, "input[type='checkbox']".length);
    $("input[type='radio']").checkboxradio("init");
    $("input[type='checkbox']").checkboxradio("init");
    $("input[type='radio']").checkboxradio("refresh");
    return $("input[type='checkbox']").checkboxradio("refresh");
  } catch (e) {
    return log("cbr error", e);
  }
};
initStudyingCBs = function() {
  $("#front").bind(CLICK_EVENT, function() {
    if (!$studyQueue.flipped) {
      return $studyQueue.flip(false);
    }
  });
  $(".card_face").bind(CLICK_EVENT, function() {
    if ($atEnd) {
      $studyQueue.restart();
      return $atEnd = false;
    }
  });
  return $(".result").bind(CLICK_EVENT, function() {
    return $studyQueue.result($(this).attr("id") !== "wrong");
  });
};
testAddLogin = function() {
  cacheObj(root.loginKey, {
    email: "test@test.com",
    password: "tester"
  });
  return PAGES.login.content = retrieveObj(root.loginKey);
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
valLabel = function(label) {
  return fieldNotBlank(label.name);
};
valCard = function(card) {
  return fieldNotBlank(card.front) || fieldNotBlank(card.back);
};