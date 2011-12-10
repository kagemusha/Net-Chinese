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
SET_FILTERS_SEL = "#filterLabels input"
TEXT_AREA_ELEM = "#{TEXT_INPUT_PG_SEL} textArea"
CARD_LABEL_SEL = '#cardPanel #labels input:checkbox'
SAVE_TEXT_LINK = "saveTextField"

SEL_TEST = [ ARCHIVED_RB_SEL, SET_FILTERS_SEL,TEXT_AREA_ELEM, CARD_LABEL_SEL, SAVE_TEXT_LINK]

CARDS_PER_PAGE = 25
$showFromCard = 0
$studyInit = true
$showedStudyTip = false
$currentSet = null
$currentCard = null
$updaters = new Array()

$saveAttr = null

EDIT_SET_BTN = "editSetBtn"
EDIT_CARD_BTN = "editCardBtn"
EDIT_LABEL_BTN = "editLabelBtn"

class Set
  labels: null
  cards: null

### studymanager conversion related ###
$studyQueue = new StudyQueue
  cardFrontSel: "#studyPage .cardPanel .textPanel",
  cardBackSel: "#answerPage .cardPanel .textPanel",
  beforeRestart: ->  $("#studyButtons").show(),
  #beforeShowCard: (card) -> onShowStudyCard(card)  ,
  getCards: -> $currentSet.cards ,
  hideBack: (cb) ->
  showFront: ->
    if !$studyInit
      $.mobile.changePage(pageSel("study"), { transition: "pop"})
      $("#tapMsg").fadeIn 600
  showCardFields: (card) ->
    front = if @backFirst then card.back else card.front
    back = if @backFirst then card.front else card.back
    $(@cardFrontSel).html(multiline(@formatCardText(front)))
    $(@cardBackSel).html multiline(@formatCardText(cardBackTmpl(back, front)))
  flipBack: ->
    $.mobile.changePage pageSel("answer"), { transition: "flip"}
    $("#tapMsg").hide()
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
  test()
  root.msgSel = ".msg"
  loadData()
  showMsgs()
  initPages()
  selectorSearch()
  validationsInit()
  loginFormInit()
  initCallbacks()
  initStudyingCBs()
  initUpdaters()
  filt = "#filterPage #backFirstChoice input"
  log filt, $(filt).length

DATA_REL_DATE_KEY = "dat_rel_dat"

loadData = ->
  lastLoadedDate = retrieve DATA_REL_DATE_KEY
  #if (!lastLoadedDate or (DATA_REL_DATE > lastLoadedDate))
  populateData CARD_SET_DATA
  cache DATA_REL_DATE_KEY, DATA_REL_DATE

initPages = ->
  TABLES[SET_TYPE] = Table.get(SET_TYPE)
  hasData = TABLES[SET_TYPE].recs? and TABLES[SET_TYPE].recs.length > 0
  makePages()
  #refreshTmpl "#{pageSel('answer') } #headNav", answerPgHeadTmpl
  $("#{ idSel(dualId EDIT_SET_BTN, "done" ) }").hide()
  $("#{ idSel(dualId EDIT_CARD_BTN, "done" )}").hide()
  $("#{ idSel(dualId EDIT_LABEL_BTN, "done" )}").hide()
  if hasData
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE)
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE)
    refreshListById "setList", setLiTmpl, TABLES[SET_TYPE].all()
  $("#{classSel EDITING_CLASS}").hide()

validationsInit = ->
  VALIDATIONS[LABEL_TYPE] = validateLabel
  VALIDATIONS[CARD_TYPE] =  validateCard

initCallbacks = ->
  $("*[data-role='page']").live 'pageshow',(event, ui) ->
    log "pg", @.id
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
    link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
    showMsg()
    resetEditing()

  $('#studyPage').live 'pageshow',(event, ui) ->
    if !$showedStudyTip
      popupMsg "Tap card to see answer", 1200
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
    #fn(this) if (fn and fn.length > 0)
    #execFn fn, null, this if (fn and fn.length > 0)

  $('a[stRestart]').live CLICK_EVENT, ->  $studyQueue.restart()

  $('a.result').live CLICK_EVENT, ->    $($studyQueue.cardFrontSel).html("")

  $('a[saveform]').live CLICK_EVENT, ->
    log "saveform!!"
    formId = "#{ $(this).attr("saveform") }"
    saveForm formId

  $("a.delete").live CLICK_EVENT, ->
    type = $(this).attr("obj_type")
    deleteObj type, $(this).attr("obj_id")
    popupMsg("Deleted #{type}")

  $('.aDeleteBtn').live CLICK_EVENT, ->  deleteFromList this

  $(".overlay").live CLICK_EVENT, ->
    log "tapped overlay"
    $(this).parent().find("a").trigger CLICK_EVENT

  $("#{pageSel 'filter' } #{SET_FILTERS_SEL}").live "change", ->
    log "filter chg"
    setFlag FILTER_CHG
    switchFilter(SET_FILTERS_SEL)

  $("#filterPage #filterArchivedChoice input").live "change", (event, ui) ->
    showArchived = $(this).attr("value") == "true"
    log "show arch", showArchived
    $studyQueue.showArchived = showArchived
    setFlag FILTER_CHG

  $("#filterPage #backFirstChoice input").live "change", (event, ui) ->
    backFirst = ($(this).attr("value") == "true")
    log "back first", backFirst
    $studyQueue.backFirst = backFirst

  $('.del_icon').live CLICK_EVENT, ->    showDelButton this

deleteObj = (type, id) ->
  table = TABLES[type]
  table.delete id
  log "deleted", type, id

switchFilter = (checkboxElems) ->
  filters = new Array()
  $(checkboxElems).each ->
    labelId = $(this).attr("value")
    checked = $(this).attr("checked")
    filters.push(labelId) if checked

  $studyQueue.filters = filters
  #log("fArray", $studyQueue.filters.join(","))
  #$studyQueue.restart()

initSetPage = (params) ->
  setId = params["obj_id"]
  switchSet setId

switchSet = (setId) ->
  log "switch set", setId
  if !$currentSet || ($currentSet && (setId != $currentSet.id))
    $showFromCard = 0
    $currentSet = TABLES[SET_TYPE].findById(setId)
    #log "switch set, id, card#, label#", $currentSet.id, $currentSet.cards.length, $currentSet.labels.length
    refreshCardList()
    updateLabelViews()
    $studyQueue.clearFilters()
    switchFilter(SET_FILTERS_SEL)


initCardPage = (params) ->
  cardId = params.obj_id
  log "initCardPage id", cardId
  $currentCard = if cardId then getObj(CARD_TYPE, cardId) else $currentCard = {card_set_id: $currentSet.id}
  $currentCard.archived = false if !$currentCard.archived #in case null
  showCard $currentCard
  setupForm "#cardForm", $currentCard

showCard = (card={}) ->
  log "modCT", card
  $(".textPanel#showCard #frontText").html multiline(card.front)
  $(".textPanel#showCard #backText").html multiline(card.back)
  $("#showCardArchived").html if (card.archived=="true") then "yes" else "no"
  $("#showCardLabels").html cardLabelStr(card)

cardLabelStr = (card) ->
  return "(none)" if !card.labels
  lbls = for id in card.labels
    for sLbl in $currentSet.labels when sLbl.id == id
      sLbl.name
  lbls.join ", "

modSide = (side, text) ->
  elem = "##{side}TALink"
  if text
    $(elem).text text.replace(/(<([^>]+)>)/ig,"")
    $(elem).removeClass "notext"
  else
    $(elem).text "Enter #{side} side text (#{if side=="front" then "Chinese" else "English"})"
    $(elem).addClass "notext"

initEditCardPage = (params) ->
  if params.id
    backPg = "#cardPage"
  else
    backPg = "#setPage"
    setupForm "cardForm", {card_set_id: $currentSet.id, id: null, front: "", back: "", archived: false, labels: null}
  $(idSel CARD_PAGE_BACK_BUTTON).attr "href", backPg

setupForm = (form, obj, postSetup) ->
  log "setupForm obj", obj
  populateForm form, obj
  postSetup(obj) if postSetup

initLabelPage = (params) ->
  id = params.obj_id
  label = if id then getObj LABEL_TYPE, id else {card_set_id: $currentSet.id}
  setupForm "#labelForm", label
  updateDelLink pageSel("label"), id

initLabelsPage = (params)->


###
initCardSidePage = (params) ->
  source = $(params.source)
  side = source.attr("side") || "front"
  $saveAttr = side
  $(TEXT_AREA_ELEM).val $currentCard[side] || ""
  $("#{idSel SAVE_TEXT_LINK}").attr('callfn', 'saveCardTextField')
###


initStudyPage = (params) ->
  updateLabelSelector "#filterPage", $studyQueue.showArchived, $studyQueue.filters
  $studyInit = true
  $studyQueue.restart()
  $studyInit = false

filterChg = ->
  filterChanged = consumeFlag FILTER_CHG
  log "filterChng", filterChanged
  $studyQueue.restart() if filterChanged


updateLabelSelector = (container, archived, filters)->
  arcvContainer = "#{container} #{ARCHIVED_RB_SEL}"
  log "archsel", $("#{arcvContainer}#yes").length, archived
  checkCBs "#{arcvContainer}#yes", archived
  checkCBs "#{arcvContainer}#no", !archived
  filterCBs = "#{container} #{SET_FILTERS_SEL}"
  $(filterCBs).each (n) ->
    #log "cbVal", $(this).attr("value"), filters
    checkCBs this, valInArray($(this).attr("value"), filters)
  refreshChoice arcvContainer
  refreshChoice filterCBs


updateDelLink = (container, objId) ->
  delLink = $("#{container} a.delete")
  if objId then delLink.attr("obj_id", objId).show() else delLink.hide()


getObj = (type, id) ->
  return null if !id
  obj = TABLES[type].findById(id)
  #log "getObj", obj, type, id
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
    updateCardViews()


cardCountMsg = ->
  $("#cardsShowing").show()
  setLength = $currentSet.cards.length
  last = $showFromCard+CARDS_PER_PAGE
  multiPage = setLength > CARDS_PER_PAGE
  showElem "a.cardList", multiPage
  msg = if multiPage
        "Cards #{$showFromCard+1}-#{if last > setLength then setLength else last} of #{setLength}"
      else
        "#{setLength} cards"
  $("#cardsShowingMsg").html msg


labelChoices = (labels) ->
  for label in labels
    {id: "lbl#{label.id}", value: label.id, label: label.name, "data-theme": "a"}


initStudyingCBs = ->
  $("#studyPage #front").bind CLICK_EVENT, ->
    $studyQueue.flip(false) if !$studyQueue.flipped
  $("#answerPage .card_face").bind CLICK_EVENT, ->
    if $atEnd
      $studyQueue.restart()
      $atEnd = false
  $("#answerPage .result").bind CLICK_EVENT, -> $studyQueue.result($(this).attr("id")!="wrong")


populateData=(cardSets) ->
  #log "populating data"
  TABLES[SET_TYPE] = Table.get SET_TYPE
  TABLES[CARD_TYPE] = Table.get CARD_TYPE
  TABLES[LABEL_TYPE] = Table.get LABEL_TYPE
  log TABLES[SET_TYPE].recs.length
  if TABLES[SET_TYPE].recs.length > 0
      log "data populated, not loading"
      return
   else
      log "populating data"
  #TABLES[SET_TYPE].nuke()
  #TABLES[CARD_TYPE].nuke()
  #TABLES[LABEL_TYPE].nuke()
  #TABLES[SET_TYPE]
  for cardSet in cardSets
    cardSet = cardSet.card_set if cardSet.card_set
    cards = cardSet.cards
    delete cardSet.cards
    labels = cardSet.labels
    delete cardSet.labels

    TABLES[SET_TYPE].add cardSet
    TABLES[CARD_TYPE].bulkAdd cards
    TABLES[LABEL_TYPE].bulkAdd labels


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

showDelButton = (img)->
  rotated = ( $(img).closest("li").attr("obj_id") == $('.aDeleteBtn').closest("li").attr("obj_id") )
  #log "rotated", rotated, $(img).closest("li").attr("obj_id"), $('.aDeleteBtn').closest("li").attr("obj_id")
  resetDeleteItem()
  if !rotated #unrotate
    $(img).rotate(90)
    $(img).closest("li").append delBtnLink()

makePages = ->
  log "makepages"
  pages = [ "sets", "set","labels", "label", "filter", "study", "answer", "card", "editCard"]
  for page in pages
    log "making #{page}"
    makePage page

makePage = (id, data, options) ->
  appendTmpl "body", pgTmpl(id), data, options

pgTmpl = (id) ->
  "#{id}PgTmpl"

deleteFromList = (link) ->
  obj_id = $(link).closest("li").attr("obj_id")
  list = $(link).closest("ul")
  type = list.attr("obj_type")
  liTmpl = list.attr("liTmpl")
  deleteObj type, obj_id
  $('.aDeleteBtn').closest("li").remove()
  update type, link, obj_id


validateLabel = (label) ->
  if fieldBlank(label.name) then "Not saved: no label name" else false

validateCard = (card) ->
  invalid = fieldBlank(card.front) and fieldBlank(card.back)
  if invalid then "Not saved: must fill in either card front or back" else false

updateLabelViews = (source, label) ->
  log "label updatING"
  $currentSet.labels = TABLES[LABEL_TYPE].findAll "card_set_id", $currentSet.id
  labelSpecs = labelChoices($currentSet.labels)
  resetChoices false, "cardFormLabels", "labels" , labelSpecs, {"data-theme": "d"}
  resetChoices false, "filterLabels", "labels" , labelSpecs, {"data-theme": "d"}
  refreshEditableListById "labelList", labelLiTmpl, editLabelLiTmpl, $currentSet.labels
  refreshPage "#cardPage"
  refreshPage "#filterPage"


updateCardViews = (source, card) ->
  #log "updCV", source, card
  $currentSet.cards = TABLES[CARD_TYPE].findAll("card_set_id", $currentSet.id)
  displayCards = $currentSet.cards.slice $showFromCard, $showFromCard+CARDS_PER_PAGE
  log "set id", $currentSet.id, "cardlen: ", $currentSet.cards.length
  $(idSel CARD_PAGE_BACK_BUTTON).attr("href", "#cardPage") if card and card.id
  cardCountMsg()
  refreshEditableListById "cardList", cardLiTmpl, editCardLiTmpl, displayCards
  #fix should be editable
  #refreshListById "cardList", cardLiTmpl, displayCards
  $("#cardList").show() if !$editing

  showCard card


initUpdaters = ->
  addUpdater "label", updateLabelViews
  addUpdater "card", updateCardViews

addUpdater = (type, updater) ->
  $updaters[type] ?= new Array()
  $updaters[type].push updater


update = (type, source, obj) ->
  return if !$updaters[type]
  for updater in $updaters[type]
    updater source, obj


#test that all essential selectors present
selectorSearch = ->
  log "Test essential selectors present:"
  for sel in SEL_TEST
    log " -- #{sel}", $(sel).length

INIT_KEY = "~xxInit" #make this something weird so no overwrite problems

initialized = ->
	#localStorage is obj built into html5 supported by all major browsers
	#objs in local storage persistent across sessions
	if localStorage[INIT_KEY]
		return true
	else
		localStorage[INIT_KEY] = true
		return false

test = ->
  console.log "initialized? #{initialized()}"
#517 lines on 9/16


