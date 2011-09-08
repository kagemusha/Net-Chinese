TABLES = {}
VALIDATIONS = {}

fieldNotBlank = (val) ->  val and val.length > 0

saveForm = (formId) ->
    obj = getObjFromForm formId
    log "saveObj", formId, obj
    type = $("##{formId}").attr "obj_type"
    valFn = VALIDATIONS[type]
    if !valFn(obj)
        log "invalid obj"
        return
    log "objFromForm", obj
    table = TABLES[type]
    edit = obj.id? and obj.id.length > 0
    log("obj-id, edit", (if obj.id then obj.id else "null"), edit)
    popupMsg "Saving..."
    if edit
        #log "edit", obj.id  #find and replace obj
        table.replace obj
    else
        table.add obj



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

uncapitalize = (str) ->
  return str if (!str or str.length < 1)
  "#{str[0].toLowerCase()}#{str.substr 1}"

makePages = (firstPage, pages) ->
    makePage(firstPage, pages[firstPage])
    #log("makgpage", firstPage)
    for pageId, specs of pages when pageId != firstPage
        makePage(pageId, specs)

makePage = (id, specs) ->
    specs.head={}   if !specs.head?
    specs.head.back = !specs.head.noback
    specs.foot={} if !specs.foot?
    specs.id = pageId(id)
    $('body').remove(specs.id)
    $('body').append(genElems(pageTmpl, specs))
    #addHeader(id, specs.head)
    if specs.head.buttons #this are buttons below title bar like "Right","Wrong"
        btnSel = "#{pageSel(id)} ul.headButtons"
        #log("btnsel", btnSel, $(btnSel).length)
        refreshTmpl btnSel, li, specs.head.buttons
    addFooter id, specs.foot
    refreshPage id, specs.content


refreshPage = (id, params) ->
    contentDiv = "#{pageSel(id)} .pgContent"
    refreshTmpl(contentDiv, pgTmplFn(id), params)



PG_TMPL_SEL = "PgTmpl"
PG_HEAD_SEL = ".pgHead"
PG_HEAD_TMPL_SEL = "PgHeadTmpl"
PG_FOOT_SEL = ".pgFoot"
PAGE_FOOT_TMPL_SEL = "PgFootTmpl"

pageId = (id) -> "#{id}Page"
pageSel = (id) -> "##{pageId(id)}"

pgTmplFn = (id) -> "#{id}#{PG_TMPL_SEL}"

pgHead = (id) -> "#{pageSel(id)} #{PG_HEAD_SEL}"

pgHeadTmpl = (id) -> "#{id}#{PG_HEAD_TMPL_SEL}"

pgFoot = (id) -> "#{pageSel(id)} #{PG_FOOT_SEL}"

pgFootTmpl = (id) -> "##{id}#{PAGE_FOOT_TMPL_SEL}"

addHeader = (id, params) ->
    refreshTmpl(pgHead(id), pgHeadTmpl(id), params) if ($(pgHeadTmpl(id)).length>0)

addFooter = (id, params) ->
    ###log("foot", pgFootTmpl(id), selCount(pgFootTmpl(id)), pgFoot(id), selCount(pgFoot(id)),
            pageSel(id), selCount(pageSel(id)))###
    refreshElem(pgFoot(id), pgFootTmpl(id), params) if $(pgFootTmpl(id)).length>0


root.loginKey = "logKey"

#get or set credentials
login = (credentials) ->
    cacheObj(credentials) if (credentials)
    retrieveObj(root.loginKey)

setHeaderBtn = (page, button, left=true) ->


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
        #log "listview error", e
    try
        $(listSel).listview("refresh")
    catch e
        #log "listview error", e

go = (pg) ->
    $.mobile.changePage(pg)
    pg

onPage = (pageId) -> pageId == $.mobile.activePage[0].id


setPageHeaderTitle = (page, title) ->
    $(page + " .ui-header h1").text(title)

lia = (label, href, linkAttrs, liAttrs) ->
    linkAttrs.href = href
    link = elem("a", label, linkAttrs)
    lElem = elem("li", link, liAttrs)  #link

popupMsg = (msg, delay) ->
    removePopup()
    wait = delay || 800
    msgDiv = $("<div class='popup ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>" + msg + "</h1></div>")
        .css({
            display: "block",
            opacity: 0.8,
            top: window.pageYOffset+100
        }).appendTo("body")
        if delay != 0
            msgDiv.delay(wait)
            .fadeOut(400, ->
                $(this).remove();
            )

removePopup = ->    $(".popup").remove();

LIST_ITEM_CLASS = "licrv"

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
                log $(input).attr("name"), val, $(input).attr("value")
                checkCBs input, equalStr( $(input).attr("value"), val )
            else if $(input).is(':checkbox')
                log $(input).attr("name"), val, $(input).attr("value"), valInArray( $(input).attr("value"), val )
                checkCBs input, valInArray( $(input).attr("value"), val )
            else
                $(input).attr "value", val

equalStr = (a, b) ->
    toStr(a) == toStr(b)


###
formCB = (formId, options) ->
    log "formCB", formId
    vOptions = {
        submitHandler: handleForm,
        onfocusout: false,
        errorClass: "field_error",
        errorPlacement: (error, element) ->
            #error.prepend("<br/>") works initially but not on back tabs
            error.insertAfter(element);
    }
    $.extend(vOptions, options)
    #log("validating form count", $(formId).length)
    $(formId).validate(vOptions)
    #log("after form validate")


handleForm = (form) ->
    formId = $(form).attr("id")
    type = $(form).attr "obj_type"
    #fields = objFields type
    obj = getObjFromForm(formId)
    log "objFromForm", obj

    table = TABLES[type]
    edit = obj.id? and obj.id.length > 0
    log("obj-id, edit", (if obj.id then obj.id else "null"), edit)
    showMsg "Saving..."
    if edit
        #log "edit", obj.id  #find and replace obj
        table.replace obj
    else
        table.add obj
    $('.ui-dialog').dialog('close')
    log "Saved"

###
