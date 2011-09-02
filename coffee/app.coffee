SET_TYPE="card_set"
CARD_TYPE='card'
LABEL_TYPE='label'
OBJ_TYPE_ATTR = "obj_type"
OBJ_ID_ATTR = "obj_id"
SET_ID_ATTR = "set_id"
SET_TYPE_ATTR = "set_type"
CLICK_EVENT = "tap"
FILTER_CHG = "filChgx"

MSG_SEL = ".msg"
$atEnd = false
ARCHIVED_RB_SEL = "#archivedRB input"
SET_FILTERS_SEL = "#filterCheckboxes input"
CARDS_PER_PAGE = 25
$showFromCard = 0
$studyInit = true
$showedStudyTip = false
$currentSet = null
$currentCard = null

EDIT_SET_BTN = "editSetBtn"
EDIT_CARD_BTN = "editCardBtn"
EDIT_LABEL_BTN = "editLabelBtn"

class Set
    labels: null
    cards: null

$studyLink = link("Study!", "#studyPage", "id='studyButton' init_pg='study' class='study'")

dualId = (id, addedPrefix) ->
  log "dualId", id
  preLen =  addedPrefix.length
  if id[0..preLen-1] == addedPrefix
    "#{uncapitalize(id[preLen])}#{id.substr(preLen+1)}"
  else
    "#{addedPrefix}#{capitalize id}"


editBtns = (editBtnId, objList) ->
  dualBtnId = dualId editBtnId, "done"
  olStr = "objList='#{objList}'"
  [
    rightBtn("Done", "#", "id='#{dualBtnId}' callfn='toggleEditSet' #{olStr}", "editing"),
    rightBtn("Edit", "#", "id='#{editBtnId}' callfn='toggleEditSet' #{olStr}", "notEditing")
  ].join(" ")

SET_HEADER_BUTTONS=[ $studyLink,
                      link("Add Card","#cardPage", "init_pg=card obj_type=card"),
                      link("Labels","#labelsPage","init_pg=labels ")]
                    
STUDY_HEADER_BUTTONS=[link("Correct","#study","class result "),
                      link("Wrong", "#study", "class result")]

EDIT_BTNS = [
  rightBtn("Edit", "#", "id='editSetButton' callfn='toggleEditSet' objList='setList'", NOT_EDITING_CLASS),
  rightBtn("Done", "#", "id='doneEditSetButton' callfn='toggleEditSet' objList='setList'", EDITING_CLASS)
]
PAGES = {
  sets:
    head:
      title: "Sets",
      #rightBtns: editBtns("editSetBtn", "setList")
  ,
  set:
    head:
      title: "Set",
      #leftBtns: [backButton("Sets", "#setsPage", "class='#{NOT_EDITING_CLASS}'"), link("Settings", "#settingsPage", "class='#{EDITING_CLASS}'")],
      leftBtns: backButton("Sets", "#setsPage"),
      rightBtns: editBtns(EDIT_CARD_BTN, "cardList"),
      buttons: SET_HEADER_BUTTONS
    #footer: footerTmpl {ui_bar: true, fixed: true, navBar: true}, $studyLink
  ,
  card:
    head:
      title: "Card",
      leftBtns: backButton("Cancel", "#setPage"),
      rightBtns: link("Save", "#", "obj_type='card' class='save' #{root.BACK_REL}")
  ,
  labels:
    head:
      title: "Labels",
      leftBtns: backButton("Back", "#setPage"),
      rightBtns: editBtns("editLabelBtn", "labelList"),
      #buttons: SET_HEADER_BUTTONS,
  label:
    head:
      title: "Label",
      leftBtns: backButton("Cancel", "#labelsPage"),
      rightBtns: link("Save", "#", "obj_type='card' class='save' #{root.BACK_REL}")
      #rightBtns: link("Delete", "#", "obj_type='label' class='delete' #{root.BACK_REL}") }},
  ,
  study: {head: { leftBtns: backButton("Cards","#setPage"), rightBtns: link("Filter", pageSel("filter"), "data-transition=pop") }},
  answer: {head: { leftBtns: backButton("Cards","#setPage"), rightBtns: link("Restart", pageSel("study"), "data-transition=pop stRestart=true") }},
  filter: {head: { title: "Filter", leftBtns: backButton("Back","#studyPage", "callfn=filterChg") } },
  textInput: {head: { title: "Card", leftBtns: backButton("Cancel","#cardPage"), rightBtns: link("Save", pageSel("card"), "save=true") }},
}


### studymanager conversion related ###
CARD_LABEL_SEL = '#cardPanel #labels input:checkbox'
$studyQueue = new StudyQueue
  cardFrontSel: "#studyPage .cardPanel .textPanel",
  cardBackSel: "#answerPage .cardPanel .textPanel",
  #beforeRestart: ->  showHide("#flip","#restudy2", true) ,
  #beforeShowCard: (card) -> onShowStudyCard(card)  ,
  getCards: -> $currentSet.cards ,
  hideBack: (cb) ->
    #$.mobile.changePage(pageSel("answer"), { transition: "flip"}) if !$studyInit
    #$("#studyButtons, .cardPanel.front, #studyPanel .back" ).fadeOut 200, ->
    #  $(".cardPanel.front .card_face").css( height: '100%')
  showFront: ->
    #log "SHOW FRONT"
    $.mobile.changePage(pageSel("study"), { transition: "pop"})  if !$studyInit
    #$studyQueue.showCard()
  showCardFields: (card) ->
    front = if @backFirst then card.back else card.front
    back = if @backFirst then card.front else card.back
    $(@cardFrontSel).html(multiline(@formatCardText(front)))
    $(@cardBackSel).html multiline(@formatCardText(cardBackTmpl(back, front)))
  flipBack: ->
    $.mobile.changePage pageSel("answer"), { transition: "flip"}
  onFlip: (toFront) ->
    showMsg(null) #to clear other msgs, if present
    $("#studyButtons").find("a.ui-btn-active").removeClass("ui-btn-active")

    if toFront
      this.hideBack()
      this.showFront()
    else
      this.flipBack()
  ,
  showCardLabels: (card) ->
    if card and card.labels
      $(CARD_LABEL_SEL).each ->
        cbox = $(this)
        cbLabelId = cbox.attr("value")
        return if (cbLabelId == "archived")
        checkCBs($(cbox), valInArray(cbLabelId*1, card.labels))
    else
      log "No card!!" if !card
      checkCBs($(CARD_LABEL_SEL), false)
      checkCBs($("#archiveCB"), card.archived)     #set Archive CB
  ,
  updateStudyStatsView:  (studyQueue) ->
    refreshTmplById "studyStats", studyStatsTmpl, studyQueue
    refreshTmplById "studyStatsFront", studyStatsTmpl, studyQueue, false
  ,
  onFinished: ->
    showMsg("Finished! Tap cards to restart")
    $("#studyButtons").hide()
    $atEnd = true

initMobile = ->
  env()
  root.msgSel = ".msg"
  loadData()
  showMsgs()
  initPages()
  validationsInit()
  loginFormInit()
  initCallbacks()
  initStudyingCBs()

DATA_REL_DATE_KEY = "dat_rel_dat"

loadData = ->
  lastLoadedDate = retrieve DATA_REL_DATE_KEY
  if (!lastLoadedDate or (DATA_REL_DATE > lastLoadedDate))
    populateData CARD_SET_DATA
    cache DATA_REL_DATE_KEY, DATA_REL_DATE

initPages = ->
  TABLES[SET_TYPE] = Table.get(SET_TYPE)
  hasData = TABLES[SET_TYPE].recs? and TABLES[SET_TYPE].recs.length > 0
  firstPage =  "sets"
  makePages firstPage, PAGES
  refreshTmpl "#{pageSel('answer') } #headNav", answerPgHeadTmpl
  $("#{ idSel(dualId EDIT_SET_BTN, "done" ) }").hide()
  $("#{ idSel(dualId EDIT_CARD_BTN, "done" )}").hide()
  $("#{ idSel(dualId EDIT_LABEL_BTN, "done" )}").hide()
  if hasData
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE)
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE)
    setViewUpdaters()
    refreshListById "setList", setLiTmpl, TABLES[SET_TYPE].all()


  $("#backFirstOption").append yesnoChoiceTmpl("backFirstRB", "Show Back First", "backFirst", false)
  #addArchivedLabels "#cardArchiveLabels", "Archive"
  addArchivedLabels "#archivedFilter", "Show Archived"
  $("tInput").css "height: 300px"
  $("tInput").css "width: 200px"
  log "noted", classSel(NOT_EDITING_CLASS)
  $("#{classSel EDITING_CLASS}").hide()


validationsInit = ->
  VALIDATIONS[LABEL_TYPE] = valLabel
  VALIDATIONS[CARD_TYPE] =  valCard


initCallbacks = ->
  $("*[data-role='page']").live 'pageshow',(event, ui) ->
    log "pg", @.id
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
    showMsg()
    resetEditing()

  $('#studyPage').live 'pageshow',(event, ui) ->
    if !$showedStudyTip
      popupMsg "Touch card to see answer"
      $showedStudyTip = true
    filterChg()
    refreshTmplById "studyStatsFront", studyStatsTmpl, $studyQueue, false
    $studyQueue.showCard()

  $("a#prevCards").live CLICK_EVENT, -> prevCards()
  $("a#nextCards").live CLICK_EVENT, -> nextCards()

  $('a[init_pg]').live CLICK_EVENT, ->
    params = {}
    page = $(this).attr("init_pg")
    myHash = location.hash
    #log "lochash", location.hash
    log "initing", pageId(page)
    params.obj_id = $(this).attr("obj_id")
    params.source = $(this)
    callFunctionType "init", pageId(page), params

  $('a[callfn]').live CLICK_EVENT, ->
    fn = $(this).attr("callfn")
    callFn fn, this if (fn and fn.length > 0)

  $('a[stRestart]').live CLICK_EVENT, ->
    $studyQueue.restart()

  $('a.result').live CLICK_EVENT, ->
    $($studyQueue.cardFrontSel).html("")

  $('a[saveForm]').live CLICK_EVENT, ->
    formId = "#{ $(this).attr("saveForm") }"
    saveForm formId

  $("a.delete").live CLICK_EVENT, ->
    type = $(this).attr("obj_type")
    deleteObj type, $(this).attr("obj_id")
    popupMsg("Deleted #{type}")

  $('.aDeleteBtn').live CLICK_EVENT, ->
    deleteFromList this

  $(".overlay").live CLICK_EVENT, ->
    log "tapped overlay"
    $(this).parent().find("a").trigger CLICK_EVENT

  $("#{pageSel 'filter' } #{ARCHIVED_RB_SEL}").live "change", (event, ui) ->
    log "arch filter"
    $studyQueue.showArchived = ($(this).attr("value") == "true")
    setFlag FILTER_CHG

  $("#{pageSel 'filter' } #{SET_FILTERS_SEL}").live "change", ->
    log "filter chg"
    setFlag FILTER_CHG
    switchFilter(SET_FILTERS_SEL)

  $("#{pageSel 'filter' } #backFirstOption input").live "change", (event, ui) ->
    backFirst = ($(this).attr("value") == "true")
    log "setBF", backFirst
    $studyQueue.backFirst = backFirst

  $('.del_icon').live CLICK_EVENT, ->
    log "delicont click"
    rotateDelImg this

###
unrotate = ->
  $($rotated).rotate(-90) if $rotated
  rot = $rotated
  $rotated = null
  rot
###

deleteObj = (type, id) ->
  log "delete", type, id
  table = TABLES[type]
  table.delete id
  log "deleted", type, id

switchFilter = (checkboxElems) ->
  filters = new Array()
  $(checkboxElems).each ->
    labelId = $(this).attr("value")
    checked = $(this).attr("checked")
    #log("labelcboxchecked", labelId, checked)
    filters.push(labelId) if checked

  $studyQueue.filters = filters
  #log("fArray", $studyQueue.filters.join(","))
  #$studyQueue.restart()


initSetPage = (params) ->
  setId = params["obj_id"]
  switchSet(setId)

initCardSidePage = (params) ->
  side = $(params.source).attr("side") || "front"
  elem = "#textInputPage textArea"
  #log elem, $(elem).length
  $(elem).text $currentCard[side]



switchSet = (setId) ->
  log "switch set", setId
  if !$currentSet || ($currentSet && (setId != $currentSet.id))
    $showFromCard = 0
    $currentSet = TABLES[SET_TYPE].findById(setId)
    #log "switch set, id, card#, label#", $currentSet.id, $currentSet.cards.length, $currentSet.labels.length
    refreshCardList()
    updateLabelView()
    $studyQueue.clearFilters()
    #switchFilter(SET_FILTERS_SEL)
    #remakeFilterPages()

remakeFilterPages = ->
  log "remake"
  makePage "card", PAGES.card
  refreshLabels "#cardLabels", "Labels"

initCardPage = (params) ->
  id = params.obj_id
  form = "#cardForm"
  updateDelLink pageSel("card"), id
  otherFields = {card_set_id: $currentSet.id}
  otherFields.archived = false if !id?
  refreshLabels "#cardLabels", "Labels"
  setupForm form, CARD_TYPE, id, otherFields
  $currentCard = getObj CARD_TYPE, id
  $("#frontTALink").text $currentCard.front.replace(/(<([^>]+)>)/ig,"")
  $("#backTALink").text $currentCard.back.replace(/(<([^>]+)>)/ig,"")

initLabelPage = (params) ->
  id = params.obj_id
  form = "#labelForm"
  setupForm form, LABEL_TYPE, id, {card_set_id: $currentSet.id}
  updateDelLink pageSel("label"), id

initLabelsPage = (params)->

initStudyPage = (params) ->
  updateLabelSelector "#filterPage", $studyQueue.showArchived, $studyQueue.filters
  $studyInit = true
  $studyQueue.restart()
  $studyInit = false

filterChg = ->
  filterChanged = consumeFlag FILTER_CHG
  log "filterChng", filterChanged
  $studyQueue.restart() if filterChanged


updateLabelView = ->
  #log "updating label view"
  $currentSet.labels = TABLES[LABEL_TYPE].findAll "card_set_id", $currentSet.id
  refreshEditableListById "labelList", labelLiTmpl, editLabelLiTmpl, $currentSet.labels
  #refreshListById "labelList", labelLiTmpl, $currentSet.labels
  refreshLabels "#filtersForm", "Filters"

updateLabelSelector = (container, archived, filters)->
  arcvContainer = "#{container} #{ARCHIVED_RB_SEL}"
  log "archsel", $("#{arcvContainer}#yes").length, archived
  checkCBs("#{arcvContainer}#yes", archived)
  checkCBs("#{arcvContainer}#no", !archived)
  filterCBs = "#{container} #{SET_FILTERS_SEL}"
  $(filterCBs).each (n) ->
    #log "cbVal", $(this).attr("value"), filters
    checkCBs this, valInArray($(this).attr("value"), filters)
  refreshChoice(arcvContainer)
  refreshChoice(filterCBs)


updateDelLink = (container, objId) ->
  delLink = $("#{container} a.delete")
  if objId then delLink.attr("obj_id", objId).show() else delLink.hide()


setupForm = (form, type, id, otherProps) ->
  obj = getObj type, id
  $.extend obj, otherProps
  log "obj to form", obj
  populateForm(form, obj)


getObj = (type, id) ->
    obj = TABLES[type].findById(id) if id
    obj or {}


prevCards = ->
  if ($showFromCard > 0)
    $showFromCard -= CARDS_PER_PAGE
    refreshCardList false

nextCards = ->
  if $currentSet.cards.length  > $showFromCard+CARDS_PER_PAGE
    $showFromCard += CARDS_PER_PAGE
    refreshCardList false

refreshCardList= (getCards=true)->
  $currentSet.cards = TABLES[CARD_TYPE].findAll("card_set_id", $currentSet.id) if getCards
  log "refresh cards, count", $currentSet.cards.length
  if $currentSet.cards.length == 0
    #setMsg("No cards in this set")
    $("#cardsShowing").hide()
    $("#cardList").empty()
    popupMsg("No cards in this set")
    $("#studyButton").hide()
  else
    updateCardView()


updateCardView = ->
  displayCards = $currentSet.cards.slice($showFromCard, $showFromCard+CARDS_PER_PAGE)
  log("set id", $currentSet.id, "cardlen: ", $currentSet.cards.length)
  cardCountMsg()
  refreshEditableListById "cardList", cardLiTmpl, editCardLiTmpl, displayCards
  $("#studyButton").show()
  $("#cardList").show() if !$editing


cardCountMsg = ->
  $("#cardsShowing").show()
  setLength = $currentSet.cards.length
  last = $showFromCard+CARDS_PER_PAGE
  multiPage = setLength > CARDS_PER_PAGE
  showElem("a.cardList", multiPage)
  msg = if multiPage
        "Cards #{$showFromCard+1}-#{if last > setLength then setLength else last} of #{setLength}"
      else
        "#{setLength} cards"
  $("#cardsShowingMsg").html(msg)


addArchivedLabels = (container, archiveLbl) ->
  $(container).empty()
  $(container).append yesnoChoiceTmpl("archivedRB", archiveLbl, "archived")


refreshLabels = (container, lblsLbl)->
  $(container).empty()
  options = {id: "filterCheckboxes", label: lblsLbl}
  filterBtnSet = choiceGroup false, "labels", options, $currentSet.labels
  $(container).append filterBtnSet


refreshCheckboxes = (sel) ->
  try
    #log "choice counts(rd, cb)", $("input[type='radio']").length, ("input[type='checkbox']").length
    $("input[type='radio']").checkboxradio("init")
    $("input[type='checkbox']").checkboxradio("init")
    $("input[type='radio']").checkboxradio("refresh")
    $("input[type='checkbox']").checkboxradio("refresh")
  catch e
    log("cbr error", e)


initStudyingCBs = ->
  $("#front").bind CLICK_EVENT, ->
    $studyQueue.flip(false) if !$studyQueue.flipped
  $(".card_face").bind CLICK_EVENT, ->
    if $atEnd
      $studyQueue.restart()
      $atEnd = false
  $(".result").bind CLICK_EVENT, -> $studyQueue.result($(this).attr("id")!="wrong")


populateData=(cardSets) ->
  #log "populating data"
  TABLES[SET_TYPE] = Table.get(SET_TYPE)
  TABLES[CARD_TYPE] = Table.get(CARD_TYPE)
  TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE)
  TABLES[SET_TYPE].nuke()
  TABLES[CARD_TYPE].nuke()
  TABLES[LABEL_TYPE].nuke()
  TABLES[SET_TYPE]
  for cardSet in cardSets
    cardSet = cardSet.card_set if cardSet.card_set
    cards = cardSet.cards
    delete cardSet.cards
    labels = cardSet.labels
    delete cardSet.labels

    TABLES[SET_TYPE].add cardSet
    TABLES[CARD_TYPE].bulkAdd cards
    TABLES[LABEL_TYPE].bulkAdd labels

  setViewUpdaters()

setViewUpdaters = ->
  TABLES[CARD_TYPE].updateViews = -> refreshCardList()
  TABLES[LABEL_TYPE].updateViews = -> updateLabelView()


$editing = false

toggleEditSet = (link) ->
  linkId = $(link).attr "id"
  edit = ( linkId[0..3] == "edit")
  log "$edI, edit", $editing, edit
  #following if and the timeout setting of $editing b/c of
  if (!$editing and edit) or ($editing and !edit)
    #log "togEdit", edit
    resetDeleteItem()
    page = $(link).closest("div[data-role=page]")
    log "linkPage", page.length, $(page).attr("id")
    #dualLinkId = dualId linkId, "done"

    #listId = $(link).attr "objList"
    #dualListId = dualId listId, "edit"

    #$("ul##{listId},ul##{dualListId},##{linkId},##{dualLinkId}").toggle()
    toggleEditControls(page.attr "id")
    setTimeout -> $editing = edit
      ,
      600

resetEditing = ->
  showHide classSel(NOT_EDITING_CLASS), classSel(EDITING_CLASS)
  $editing = false


resetDeleteItem = ->
  $('.aDeleteBtn').closest("li").find("img").rotate(0)
  $('.aDeleteBtn').remove()

rotateDelImg = (img)->
  #log "rotated class", (if $rotated then $rotated else "null")
  #$(img).append link("Delete", "#", "class='aDeleteBtn ui-btn-up-r'")
  rotated = ( $(img).closest("li").attr("obj_id") == $('.aDeleteBtn').closest("li").attr("obj_id") )
  log "rotated", rotated, $(img).closest("li").length, $('.aDeleteBtn').closest("li").length
  log "rotated", rotated, $(img).closest("li").attr("obj_id"), $('.aDeleteBtn').closest("li").attr("obj_id")
  resetDeleteItem()
  if !rotated #unrotate
    $(img).rotate(90)
    $(img).closest("li").append link("Delete", "#", "class='aDeleteBtn ui-btn-up-r'")


deleteFromList = (link) ->
  log "delfromRIST"
  obj_id = $(link).closest("li").attr("obj_id")
  list = $(link).closest("ul")
  type = list.attr("obj_type")
  liTmpl = list.attr("liTmpl")
  log "adel", type, obj_id
  deleteObj type, obj_id
  log "hmm"
  $('.aDeleteBtn').closest("li").remove()
  log "soup"



valLabel = (label) -> fieldNotBlank(label.name)
valCard = (card) -> fieldNotBlank(card.front) or fieldNotBlank(card.back)


