/*
saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  link(label, page, "obj_type='#{objType}' saveform='#{form}' #{linkReverseAttr page}" )
*/var EDIT_CARD_BTN, EDIT_LABEL_BTN, dualId, editBtns, h_editBtns, heditUL;
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
h_editBtns = function(editBtnId, objList) {
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
editBtns = function(editBtnId, objList) {
  var dualBtnId;
  dualBtnId = dualId(editBtnId, "done");
  return [
    rightButton("Done", "#", {
      id: dualBtnId,
      callfn: 'toggleEditSet',
      objList: objList,
      "class": "editing"
    }), rightButton("Edit", "#", {
      id: editBtnId,
      callfn: 'toggleEditSet',
      objList: objList,
      "class": "notEditing"
    })
  ].join(" ");
};
heditUL = function(type, options) {
  if (options == null) {
    options = {};
  }
  options["class"] = " " + (options["class"] || "") + " editList";
  options.obj_type = type;
  return listview(options);
};