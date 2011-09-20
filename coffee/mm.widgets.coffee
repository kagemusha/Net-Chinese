###
saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  link(label, page, "obj_type='#{objType}' saveform='#{form}' #{linkReverseAttr page}" )
###

dualId = (id, addedPrefix) ->
  #log "dualId", id
  preLen =  addedPrefix.length
  if id[0..preLen-1] == addedPrefix
    "#{uncapitalize(id[preLen])}#{id.substr(preLen+1)}"
  else
    "#{addedPrefix}#{capitalize id}"

EDIT_CARD_BTN = "editCardBtn"
EDIT_LABEL_BTN = "editLabelBtn"

h_editBtns = (editBtnId, objList) ->
  dualBtnId = dualId editBtnId, "done"
  """
    #{ h_rightButton "Done", "#", {id: dualBtnId, callfn: 'toggleEditSet', objList: objList, class: "editing"}  }
    #{ h_rightButton "Edit", "#", {id: editBtnId, callfn: 'toggleEditSet', objList: objList, class: "notEditing"}  }
  """

editBtns = (editBtnId, objList) ->
  dualBtnId = dualId editBtnId, "done"
  [
    rightButton("Done", "#", {id: dualBtnId, callfn: 'toggleEditSet', objList: objList, class: "editing"} ),
    rightButton("Edit", "#", {id: editBtnId, callfn: 'toggleEditSet', objList: objList, class: "notEditing"} )
  ].join(" ")



