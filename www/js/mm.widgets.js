var saveButton;
saveButton = function(form, objType, page, reverse, label) {
  if (page == null) {
    page = "#";
  }
  if (reverse == null) {
    reverse = true;
  }
  if (label == null) {
    label = "Save";
  }
  return link(label, page, "obj_type='" + objType + "' saveform='" + form + "' " + (linkReverseAttr(page)));
};