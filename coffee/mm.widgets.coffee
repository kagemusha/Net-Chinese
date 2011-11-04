
dualId = (id, addedPrefix) ->
  #log "dualId", id
  preLen =  addedPrefix.length
  if id[0..preLen-1] == addedPrefix
    "#{uncapitalize(id[preLen])}#{id.substr(preLen+1)}"
  else
    "#{addedPrefix}#{capitalize id}"

EDIT_CARD_BTN = "editCardBtn"
EDIT_LABEL_BTN = "editLabelBtn"

editBtns = (editBtnId, objList) ->
  dualBtnId = dualId editBtnId, "done"
  multilineHaml """
    #{ rightButton "Done", "#", {id: dualBtnId, callfn: 'toggleEditSet', objList: objList, class: "editing"}  }
    #{ rightButton "Edit", "#", {id: editBtnId, callfn: 'toggleEditSet', objList: objList, class: "notEditing"}  }
  """


editUL = (type, options={}) ->
  options["class"] = " #{options.class || ""} editList"
  options.obj_type = type
  listview options


saveButton = (form, objType, page="#", options={}, reverse=true, label="Save") ->
  _.extend options, {obj_type: objType, saveform: form}
  link label, page, options, true


refreshListById = (id, template, objs, options) ->
  refreshTmplById id, template, objs, options
  listviewRefresh id

NOT_EDITING_CLASS = "notEditing"
EDITING_CLASS = "editing"


classSel = (klass) ->
  if (klass[0]==".") then klass else ".#{klass}"

toggleEditControls = (pageId="") ->
  $("#{idSel pageId} .#{EDITING_CLASS}, #{idSel pageId} .#{NOT_EDITING_CLASS}").toggle()


refreshEditableListById = (baseListId, template, editTemplate, objs) ->
  editListId = "edit#{capitalize baseListId}"
  log "refreshEditList", baseListId, editListId, template, editTemplate
  $("#{idSel baseListId}").addClass NOT_EDITING_CLASS
  $("#{idSel editListId}").addClass EDITING_CLASS
  refreshListById baseListId, template, objs
  refreshListById editListId, editTemplate, objs


DEFAULT_STYLE="d"
DEFAULT_PG_THEME = "e"


