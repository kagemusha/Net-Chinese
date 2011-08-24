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

#$SERVER = "http://localhost:3000"
$SERVER = "http://crambear.heroku.com"
RIGHT_BUTTON_CLASS = ".ui-btn-right"
ARCV_YES = "#archivedRB #yes"
$params = new Object()
$dataKey = "appDatKey"
$studyPanelHeight = null
MSG_SEL = ".msg"
SYNC_EL = "#setsPage a.ui-btn-right"
NO_RESTART_FLAG = "noRstrt"
$atEnd = false
ARCHIVED_RB_SEL = "#archivedRB input"
SET_FILTERS_SEL = "#filterCheckboxes input"
CARDS_PER_PAGE = 40
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

#sync_button = {page: "#loginPage", label: "Sync", options: "init_pg=login data-transition=flip"} #for sets page
PAGES = {
    #page: {pgParams: {}, content:{}, head:{}, foot:{}}
    login: {},
    #settings: {},
    sets: { head: {leftButton: "none", rightButton: null}} #,
    set: {head: {leftButton:{type: "back", label: "Sets", page: "#setsPage"},buttons: SET_HEADER_BUTTONS}}, #, rightButton: {page: "#setSettingsPage", label: "Settings"}}},
    card: {head: leftButton: {type: "back", label: 'Cancel'}, rightButton: {label: "Delete", options: "obj_type='card' class='delete' #{root.BACK_REL}"}},
    labels: {},
    label: {head: leftButton: {type: "back", label: "Cancel"}, rightButton: {label: "Delete", options: "obj_type='label' class='delete' #{root.BACK_REL}" }},
    study: {head: { leftButton:{type: "back", label: "Cards", page: "#setPage"}, rightButton: {page: pageSel("filter"), label: "Filter", options: "data-transition=pop"}      }},
    answer: {head: { leftButton:{type: "back", label: "Cards", page: "#setPage"}, rightButton: {page: pageSel("filter"), label: "Filter", options: "data-transition=pop"}      }},
    filter: {head: { leftButton:{type: "back",  page: "#studyPage", options: "callFn=filterChg"}} }
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
    #log "HIDA BACK"
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
    log "showCardFields", front, back
    $(@cardFrontSel).html(multiline(@formatCardText(front)))
    $(@cardBackSel).html multiline(@formatCardText(cardBackTmpl(back, front)))
  flipBack: ->
    #log "FLIPA BACK"
    $.mobile.changePage pageSel("answer"), { transition: "flip"}
    #$(".cardPanel.front .card_face").animate( height: '100px')
    #$(".back").slideDown 300, -> $("#studyButtons").fadeIn(100)
  onFlip: (toFront) ->
    showMsg(null) #to clear other msgs, if present
    $("#studyButtons").find("a.ui-btn-active").removeClass("ui-btn-active")

    if toFront
      log "to front"
      this.hideBack()
      this.showFront()
    else
      log "to back"
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
          #left: studyQueue.leftInRun,
          #total: studyQueue.runCount,
          #tries: studyQueue.tries
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
  log("Server", $SERVER)
  setFlag(MSG_KEY, "server: #{$SERVER}")
  testAddLogin()
  initPages()
  validationsInit()
  loginFormInit()
  initCallbacks()
  initStudyingCBs()

loadData = ->
  #localStorage.removeItem $dataKey          #test
  populateData(CARD_SET_DATA)



initPages = ->
  #log "initp"
  TABLES[SET_TYPE] = Table.get(SET_TYPE)
  hasData = TABLES[SET_TYPE].recs? and TABLES[SET_TYPE].recs.length > 0
  firstPage =  if hasData then "sets" else "login"
  makePages firstPage, PAGES
  log "#{pageSel 'study' } #headNav", $( "#{pageSel 'study' } #headNav").length
  refreshTmpl "#{pageSel('answer') } #headNav", answerPgHeadTmpl
  if hasData
    TABLES[CARD_TYPE] = Table.get(CARD_TYPE)
    TABLES[LABEL_TYPE] = Table.get(LABEL_TYPE)
    setViewUpdaters()
    refreshSetsPage()
  #apply js templates
  addArchivedLabels "#cardArchiveLabels", "Archive"
  addArchivedLabels "#archivedFilter", "Show Archived"

validationsInit = ->
  VALIDATIONS[LABEL_TYPE] = valLabel
  VALIDATIONS[CARD_TYPE] =  valCard

refreshSetsPage = ->
  refreshTmplById "setList", setLiTmpl, TABLES[SET_TYPE].all()
  listviewRefresh "setList"

initCallbacks = ->
  log "pageCount", $("*[data-role='page']").length

  $("*[data-role='page']").live 'pageshow',(event, ui) ->
      log "pg", @.id
      link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
      link = $(ui.prevPage).find("a.ui-btn-active").removeClass("ui-btn-active")
      showMsg()

  $('#studyPage').live 'pageshow',(event, ui) ->
    if !$showedStudyTip
      popupMsg "touch card to see back"
      $showedStudyTip = true
    filterChg()
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
      callFunctionType("init", pageId(page), params)

  $('a[callFn]').live CLICK_EVENT, ->
    fn = $(this).attr("callFn")
    log "XXX calling fn #{fn}"
    callFn fn

  $('a.result').live CLICK_EVENT, ->
    $($studyQueue.cardFrontSel).html("")

  $('a[saveForm]').live CLICK_EVENT, ->
      #log "saving form", $(this).attr("saveForm")
      formId = "#{ $(this).attr("saveForm") }"
      saveForm formId

  $("a.delete").live CLICK_EVENT, ->
      type = $(this).attr("obj_type")
      deleteObj type, $(this).attr("obj_id")
      popupMsg("Deleted #{type}")

  $(".overlay").live CLICK_EVENT, ->
      log "tapped overlay"
      $(this).parent().find("a").trigger CLICK_EVENT

  $(SYNC_EL).live CLICK_EVENT, ->
      log("sync")
      $(this).removeClass "ui-btn-active"
      #submitSyncReq()

  $("#{pageSel 'filter' } #{ARCHIVED_RB_SEL}").live "change", (event, ui) ->
      $studyQueue.showArchived = ($(this).attr("value") == "true")  #problem
      setFlag FILTER_CHG
      #$studyQueue.restart()  #problem

  $("#{pageSel 'filter' } #{SET_FILTERS_SEL}").live "change", ->
    log "change filter XXXX"
    setFlag FILTER_CHG
    switchFilter(SET_FILTERS_SEL)
 #formCB "#cardForm"
 #formCB "#labelForm"

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

getData = ->  retrieveObj($dataKey)

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

initLoginPage = (params) ->
    log "LGPAGE"
    $("#server").html($SERVER)

    
initSetPage = (params) ->
    log "initSetPage", params
    setId = params["obj_id"]
    switchSet(setId)

initLabelsPage = ->
    log "initLPage"




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
  log "XXXXXXXXXXXXXXXX      init studp"
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
    #fields = (field.name for field in formDataFields("#cardForm"))
    #log "flls", fields.join()
    populateForm(form, obj)
    #formCB form


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
  options = {id: "archivedRB", align: "horizontal", label: archiveLbl}
  arcvBtns =  [
              {id: "yes", name: "archived", val: "true", label: "Yes"},
              {id: "no", name: "archived", val: "false", label: "No"}
  ]
  arcvBtnSet = choiceGroup true, "archived", options, arcvBtns
  $(container).append arcvBtnSet


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


testAddLogin = ->
  cacheObj(root.loginKey, {email: "test@test.com", password: "tester"})     #test
  PAGES.login.content = retrieveObj(root.loginKey)

populateData=(cardSets) ->
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
