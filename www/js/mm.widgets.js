/*
saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  link(label, page, "obj_type='#{objType}' saveform='#{form}' #{linkReverseAttr page}" )
*/var EDIT_CARD_BTN, EDIT_LABEL_BTN, dualId, editBtns;
dualId = function(id, addedPrefix) {
  var preLen;
  preLen = addedPrefix.length;
  if (id.slice(0, (preLen - 1 + 1) || 9e9) === addedPrefix) {
    return "" + (uncapitalize(id[preLen])) + (id.substr(preLen + 1));
  } else {
    return "" + addedPrefix + (capitalize(id));
  }
};
EDIT_CARD_BTN = "editCardBtn";
EDIT_LABEL_BTN = "editLabelBtn";
editBtns = function(editBtnId, objList) {
  var dualBtnId;
  dualBtnId = dualId(editBtnId, "done");
  return "" + (h_rightButton("Done", "#", {
    id: dualBtnId,
    callfn: 'toggleEditSet',
    objList: objList,
    "class": "editing"
  })) + "\n" + (h_rightButton("Edit", "#", {
    id: editBtnId,
    callfn: 'toggleEditSet',
    objList: objList,
    "class": "notEditing"
  }));
};