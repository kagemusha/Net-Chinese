root.BACK_REL = "data-rel='back'"

refreshTmplById = (id, templateFn, data, options) ->
    refreshTmpl "#{idSel id}", templateFn, data, options

refreshTmpl = (containers, templateFn, data, options) ->
    templateFn = eval(templateFn) if typeof templateFn == 'string'
    $(containers).empty()
    elems = genElems(templateFn, data, options)
    #log "elems", elems
    $(containers).append elems

refreshListById = (id, template, objs, options) ->
  refreshTmplById id, template, objs, options
  listviewRefresh id

NOT_EDITING_CLASS = "notEditing"
EDITING_CLASS = "editing"

idSel = (id) ->
  log "idsel no id!!" if !id or id.length < 1
  if (id[0]=="#") then id else "##{id}"

classSel = (klass) ->
  if (klass[0]==".") then klass else ".#{klass}"

toggleEditControls = (pageId="") ->
  $("#{idSel pageId} .#{EDITING_CLASS}, #{idSel pageId} .#{NOT_EDITING_CLASS}").toggle()


refreshEditableListById = (baseListId, template, editTemplate, objs) ->
  editListId = "edit#{capitalize baseListId}"
  $("#{idSel baseListId}").addClass NOT_EDITING_CLASS
  $("#{idSel editListId}").addClass EDITING_CLASS
  refreshListById baseListId, template, objs
  refreshListById editListId, editTemplate, objs


genElems = (fn, data, options) ->
  if _.isArray(data)
    elems = for elem in data
              fn elem, options
    if elems then elems.join("") else ""
  else
    fn data, options

DEFAULT_STYLE="d"
DEFAULT_PG_THEME = "e"



img = (file) ->  "css/images/#{file}"

### App specific below ###


###
editUL = (id, type, options={}) ->
  options["class"] = " #{options.class || ""} editList"
  options.obj_type = type
  ul id, null,  options
###

textInputPgTmpl = ->
  """
  <textarea id="tInput" class="fullPage" data-theme="d" name="tInput" placeholder="(Enter text)" />
  """



