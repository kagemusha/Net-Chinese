SET_TYPE="card_set"
CARD_TYPE='card'
LABEL_TYPE='label'
OBJ_TYPE_ATTR = "obj_type"
OBJ_ID_ATTR = "obj_id"
SET_ID_ATTR = "set_id"
SET_TYPE_ATTR = "set_type"
CARD_FORM_LABEL_GROUP = "#cardForm #labels"
CLICK_EVENT = "tap"
FILTER_CHG = "filChgx"

RIGHT_BUTTON_CLASS = ".ui-btn-right"
$params = new Object()
$dataKey = "appDatKey"
MSG_SEL = ".msg"
NO_RESTART_FLAG = "noRstrt"
$atEnd = false
ARCHIVED_RB_SEL = "#archivedRB input"
BACK_FIRST_SEL = "#backFirstRB"
SET_FILTERS_SEL = "#filterCheckboxes input"
CARDS_PER_PAGE = 20
$showFromCard = 0
$studyInit = true
$showedStudyTip = false
$currentSet = null

class Set
    labels: null
    cards: null

SET_HEADER_BUTTONS=[{label: "Add Card", link:"#cardPage", options: "init_pg=card obj_type=card "},
                    {label: "Labels", link: "#labelsPage", options: "init_pg=labels"}]
                    
STUDY_HEADER_BUTTONS=[{label: "Correct", link:"#study", options: "class result "},
                    {label: "Wrong", link: "#study", options: "class result"}]

PAGES = {
    sets: { head: {title: "Sets", rightButton: null}},
    set:
      head:
        title: "Set",
        leftBtn: backButton("Sets", "#setsPage"),
        rightBtn: link("Study!", "#studyPage", "id='studyButton' init_pg='study' class='study'"),
        buttons: SET_HEADER_BUTTONS
    ,
    card: {head: {leftBtn: backButton("Cancel"), rightBtn: link("Delete", "#", "obj_type='card' class='delete' #{root.BACK_REL}") }},
    labels: {},
    label: {head: { leftBtn: backButton("Cancel"), rightBtn: link("Delete", "#", "obj_type='label' class='delete' #{root.BACK_REL}") }},
    study: {head: { leftBtn: backButton("Cards","#setPage"), rightBtn: link("Filter", pageSel("filter"), "data-transition=pop") }},
    answer: {head: { leftBtn: backButton("Cards","#setPage"), rightBtn: link("Restart", pageSel("study"), "data-transition=pop stRestart=true") }},
    filter: {head: { leftBtn: backButton("","#setPage", "callFn=filterChg") } }
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
  if hasData
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE)
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE)
    setViewUpdaters()
    refreshSetsPage()

  $("#backFirstOption").append yesnoChoiceTmpl("backFirstRB", "Show Back First", "backFirst", false)
  addArchivedLabels "#cardArchiveLabels", "Archive"
  addArchivedLabels "#archivedFilter", "Show Archived"



validationsInit = ->
  VALIDATIONS[LABEL_TYPE] = valLabel
  VALIDATIONS[CARD_TYPE] =  valCard

refreshSetsPage = ->
  refreshTmplById "setList", setLiTmpl, TABLES[SET_TYPE].all()
  listviewRefresh "setList"

initCallbacks = ->

  $("*[data-role='page']").live 'pageshow',(event, ui) ->
      log "pg", @.id
      link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
      link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
      showMsg()

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
      callFunctionType "init", pageId(page), params

  $('a[callFn]').live CLICK_EVENT, ->
    fn = $(this).attr("callFn")
    callFn fn

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

  $(".overlay").live CLICK_EVENT, ->
      log "tapped overlay"
      $(this).parent().find("a").trigger CLICK_EVENT

  $("#{pageSel 'filter' } #{ARCHIVED_RB_SEL}").live "change", (event, ui) ->
      $studyQueue.showArchived = ($(this).attr("value") == "true")
      setFlag FILTER_CHG

  $("#{pageSel 'filter' } #{SET_FILTERS_SEL}").live "change", ->
    setFlag FILTER_CHG
    switchFilter(SET_FILTERS_SEL)

  $("#{pageSel 'filter' } #{BACK_FIRST_SEL} input").live "change", (event, ui) ->
      backFirst = ($(this).attr("value") == "true")
      $studyQueue.backFirst = backFirst

deleteObj = (type, id) ->
  log "delete", type, id
  table = TABLES[type]
  table.delete id

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

initLabelPage = (params) ->
  id = params.obj_id
  form = "#labelForm"
  setupForm form, LABEL_TYPE, id, {card_set_id: $currentSet.id}
  updateDelLink pageSel("label"), id

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
  $currentSet.labels = TABLES[LABEL_TYPE].findAll("card_set_id", $currentSet.id)
  refreshTmplById "labelList", labelLiTmpl, $currentSet.labels
  listviewRefresh "labelList"
  refreshLabels "#filtersForm", "Filters"


updateLabelSelector = (container, archived, filters)->
  arcvContainer = "#{container} #{ARCHIVED_RB_SEL}"
  log "archsel", $("#{arcvContainer}#yes").length, archived
  checkCBs("#{arcvContainer}#yes", archived)
  checkCBs("#{arcvContainer}#no", !archived)
  filterCBs = "#{container} #{SET_FILTERS_SEL}"
  $(filterCBs).each (n) ->
    #log "cbVal", $(this).attr("value"), filters
    checkCBs(this, valInArray($(this).attr("value"), filters))
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
  refreshTmplById "cardList", cardLiTmpl, displayCards
  listviewRefresh "cardList"
  $("#studyButton").show()
  $("#cardList").show()


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
    log "choice counts(rd, cb)", $("input[type='radio']").length, ("input[type='checkbox']").length
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
  log "populating data"
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


valLabel = (label) -> fieldNotBlank(label.name)
valCard = (card) -> fieldNotBlank(card.front) or fieldNotBlank(card.back)



###
#$SERVER = "http://localhost:3000"
$SERVER = "http://crambear.heroku.com"


initLoginPage = (params) ->
    log "LGPAGE"
    $("#server").html($SERVER)


SYNC_EL = "#setsPage a.ui-btn-right"
sync_button = {page: "#loginPage", label: "Sync", options: "init_pg=login data-transition=flip"} #for sets page
  $(SYNC_EL).live CLICK_EVENT, ->
      log("sync")
      $(this).removeClass "ui-btn-active"
      #submitSyncReq()

submitSyncReq = (login) ->
    showMsg "Syncing..."
    $.post url($SERVER, "sync"), login, (data) ->
        sync data, login

#callback from sync op
sync = (response, credentials) ->
    log("ajaxsync",response)
    if response.error_msg
        showMsg(response.error_msg)
    else
        populateData(response)
        login credentials
        refreshSetsPage()
        $.mobile.changePage(pageSel("sets")) if (onPage("loginPage"))
    removePopup()    #page chg
    #resetForm(form)

testAddLogin = ->
  cacheObj(root.loginKey, {email: "test@test.com", password: "tester"})     #test
  PAGES.login.content = retrieveObj(root.loginKey)


###
