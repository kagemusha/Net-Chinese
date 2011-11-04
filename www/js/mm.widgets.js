var DEFAULT_PG_THEME, DEFAULT_STYLE, EDITING_CLASS, EDIT_CARD_BTN, EDIT_LABEL_BTN, NOT_EDITING_CLASS, classSel, dualId, editBtns, editUL, refreshEditableListById, refreshListById, saveButton, toggleEditControls;
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
  return multilineHaml("" + (rightButton("Done", "#", {
    id: dualBtnId,
    callfn: 'toggleEditSet',
    objList: objList,
    "class": "editing"
  })) + "\n" + (rightButton("Edit", "#", {
    id: editBtnId,
    callfn: 'toggleEditSet',
    objList: objList,
    "class": "notEditing"
  })));
};
editUL = function(type, options) {
  if (options == null) {
    options = {};
  }
  options["class"] = " " + (options["class"] || "") + " editList";
  options.obj_type = type;
  return listview(options);
};
saveButton = function(form, objType, page, options, reverse, label) {
  if (page == null) {
    page = "#";
  }
  if (options == null) {
    options = {};
  }
  if (reverse == null) {
    reverse = true;
  }
  if (label == null) {
    label = "Save";
  }
  _.extend(options, {
    obj_type: objType,
    saveform: form
  });
  return link(label, page, options, true);
};
refreshListById = function(id, template, objs, options) {
  refreshTmplById(id, template, objs, options);
  return listviewRefresh(id);
};
NOT_EDITING_CLASS = "notEditing";
EDITING_CLASS = "editing";
classSel = function(klass) {
  if (klass[0] === ".") {
    return klass;
  } else {
    return "." + klass;
  }
};
toggleEditControls = function(pageId) {
  if (pageId == null) {
    pageId = "";
  }
  return $("" + (idSel(pageId)) + " ." + EDITING_CLASS + ", " + (idSel(pageId)) + " ." + NOT_EDITING_CLASS).toggle();
};
refreshEditableListById = function(baseListId, template, editTemplate, objs) {
  var editListId;
  editListId = "edit" + (capitalize(baseListId));
  log("refreshEditList", baseListId, editListId, template, editTemplate);
  $("" + (idSel(baseListId))).addClass(NOT_EDITING_CLASS);
  $("" + (idSel(editListId))).addClass(EDITING_CLASS);
  refreshListById(baseListId, template, objs);
  return refreshListById(editListId, editTemplate, objs);
};
DEFAULT_STYLE = "d";
DEFAULT_PG_THEME = "e";