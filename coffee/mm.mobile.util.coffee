TABLES = {}
VALIDATIONS = {}

makePages = (pages) ->
  for page in pages
    h_makePage page
  #appendTmpl "body", "h2_setPgTmpl"
  #log "########### Set Page HTML #########"
  #log h_setPgTmpl()
  #log "\n########### Set Page HAML #########"
  #log h2_setPgTmpl()



fieldBlank = (val) ->  !val or val.length == 0

saveForm = (formId) ->
  obj = getObjFromForm formId
  log "saveObj", formId, obj
  type = $("##{formId}").attr "obj_type"
  errorFn = VALIDATIONS[type]
  errorMsg = errorFn(obj)
  if errorMsg
    popupMsg  errorMsg, 2000
    return
  table = TABLES[type]
  edit = obj.id? and obj.id.length > 0
  popupMsg "Saving..."
  if edit
    #log "edit", obj.id  #find and replace obj
    table.replace obj
  else
    table.add obj
  update type, formId, obj


getObjFromForm = (formId, fields) ->
  inputs = formDataFields "##{formId}"
  obj = new Object()
  for input in inputs
    prop = $(input).attr "name"
    val = $(input).attr "value"
    try
      if $(input).is(':radio')
          obj[prop] = val if $(input).attr("checked")
      else if $(input).is(':checkbox')
        if $(input).attr("checked")
          if obj[prop]? then obj[prop].push(val) else obj[prop] = [val]
      else if $(input).is(':submit')
        log "no submit!!"
      else
        obj[prop] = val
    catch e
      log e
  delete obj.submit
  obj


refreshPage = (page) ->
  try
    $(idSel page).page('destroy').page()
  catch e

uncapitalize = (str) ->
  return str if (!str or str.length < 1)
  "#{str[0].toLowerCase()}#{str.substr 1}"

#PG_TMPL_SEL = "PgTmpl"
#PG_HEAD_SEL = ".pgHead"
#PG_HEAD_TMPL_SEL = "PgHeadTmpl"
#PG_FOOT_SEL = ".pgFoot"
#PAGE_FOOT_TMPL_SEL = "PgFootTmpl"

pageId = (id) -> "#{id}Page"
pageSel = (id) -> "##{pageId(id)}"

pgTmplFn = (id) -> "#{id}#{PG_TMPL_SEL}"


root.loginKey = "logKey"

#get or set credentials
login = (credentials) ->
    cacheObj(credentials) if (credentials)
    retrieveObj(root.loginKey)


selCount = (sel) -> $(sel).length

###
refreshElemById = (id, templateId, params) ->
    refreshElem "##{id}", "##{templateId}", params

refreshElem = (elem, templateSel, params) ->
    $(elem).empty()
    $(templateSel).tmpl(params).appendTo(elem)
###

showMsgs = ->
  $('.pg').live('pageshow', (event, ui) ->
    showMsg()
  )

showHide = (showSel, hideSel, condition=true) ->
  ([showSel, hideSel] = [hideSel, showSe]) if !condition
  $(showSel).show()
  $(hideSel).hide()

listviewRefresh = (list) ->
  listSel = "##{list}"
  try
    $(listSel).listview("init")
  catch e
  try
    $(listSel).listview("refresh")
  catch e

go = (pg) ->
  $.mobile.changePage(pg)
  pg

onPage = (pageId) -> pageId == $.mobile.activePage[0].id

setPageHeaderTitle = (page, title) -> $(page + " .ui-header h1").text(title)

popupMsg = (msg, delay) ->
  removePopup()
  wait = delay || 800
  msgHTML = "<div class='popup ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>#{msg}</h1></div>"
  msgDiv = $(msgHTML)
    .css({
      display: "block",
      opacity: 0.8,
      top: window.pageYOffset+100
    }).appendTo("body")

  if delay != 0
    msgDiv.delay(wait).fadeOut 400, -> $(this).remove()

removePopup = ->    $(".popup").remove();

LIST_ITEM_CLASS = "licrv"

### 9/15
populateList = (list, objects, strategy) ->
  rmClass = $(list).attr("id")+LIST_ITEM_CLASS
  $("." + rmClass).remove()
  childCount = $(list).children().length-1
  #log("list obj.len", objects.length)
  for obj in objects
    item = strategy(obj)
    $(item).attr("id",LIST_ITEM_CLASS)
    $(list).append(item)
  $(list).children(":gt("+childCount+")").addClass(rmClass)
  $(list).listview("refresh")
###

formDataFields = (formId) ->
  $("#{formId} *:input:not(:button,:reset,:submit,:image)")

refreshChoice = (sel, type="refresh") ->
  try
    $(sel).checkboxradio(type)
  catch e
    log "refreshChoice", e

populateForm = (formId, obj) ->
  $("#{formId} :input:not(:button,:reset,:submit,:image,:checkbox,:radio)").attr("value", "")
  checkCBs $("#{formId} :checkbox"), false
  checkCBs $("#{formId} :radio"), false
  log "hidden submits", $("#{formId} :input:hidden:submit").length
  $("#{formId} :input:hidden:submit").remove()

  for prop, val of obj
    inputFields = $("#{formId} :input[name='#{prop}']:not(:button,:reset,:submit,:image)")
    for input in inputFields
      if $(input).is(':radio')
        log $(input).attr("name"), toStr(val), $(input).attr("value")
        checkCBs input, equalStr( $(input).attr("value"), val )
      else if $(input).is(':checkbox')
        log $(input).attr("name"), val, $(input).attr("value"), valInArray( $(input).attr("value"), val )
        checkCBs input, valInArray( $(input).attr("value"), val )
      else
        $(input).attr "value", val

equalStr = (a, b) ->
  toStr(a) == toStr(b)

