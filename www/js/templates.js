var DEFAULT_PG_THEME, DEFAULT_STYLE, EDITING_CLASS, NOT_EDITING_CLASS, classSel, delImg, editUL, genElems, heditUL, idSel, img, refreshEditableListById, refreshListById, refreshTmpl, refreshTmplById, setLiTmpl, textInputPgTmpl, toggleEditControls;
root.BACK_REL = "data-rel='back'";
refreshTmplById = function(id, templateFn, data, options) {
  return refreshTmpl("" + (idSel(id)), templateFn, data, options);
};
refreshTmpl = function(containers, templateFn, data, options) {
  var elems;
  if (typeof templateFn === 'string') {
    templateFn = eval(templateFn);
  }
  $(containers).empty();
  elems = genElems(templateFn, data, options);
  return $(containers).append(elems);
};
refreshListById = function(id, template, objs, options) {
  refreshTmplById(id, template, objs, options);
  return listviewRefresh(id);
};
NOT_EDITING_CLASS = "notEditing";
EDITING_CLASS = "editing";
idSel = function(id) {
  if (!id || id.length < 1) {
    log("idsel no id!!");
  }
  if (id[0] === "#") {
    return id;
  } else {
    return "#" + id;
  }
};
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
  $("" + (idSel(baseListId))).addClass(NOT_EDITING_CLASS);
  $("" + (idSel(editListId))).addClass(EDITING_CLASS);
  refreshListById(baseListId, template, objs);
  return refreshListById(editListId, editTemplate, objs);
};
genElems = function(fn, data, options) {
  var elem, elems;
  if (_.isArray(data)) {
    elems = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        elem = data[_i];
        _results.push(fn(elem, options));
      }
      return _results;
    })();
    if (elems) {
      return elems.join("");
    } else {
      return "";
    }
  } else {
    return fn(data, options);
  }
};
DEFAULT_STYLE = "d";
DEFAULT_PG_THEME = "e";
img = function(file) {
  return "css/images/" + file;
};
/* App specific below */
setLiTmpl = function(set) {
  return li(link(set.name, "#setPage", "class='set' obj_id='" + set.id + "' init_pg='set'"), "class='set'");
};
delImg = function() {
  return "<img  class='del del_icon ui-li-icon' src='" + (img('delete.png')) + "'/>";
};
editUL = function(id, type, options) {
  if (options == null) {
    options = {};
  }
  options["class"] = " " + (options["class"] || "") + " editList";
  options.obj_type = type;
  return ul(id, null, options);
};
heditUL = function(id, type, options) {
  if (options == null) {
    options = {};
  }
  options["class"] = " " + (options["class"] || "") + " editList";
  options.obj_type = type;
  return hUL(id, options);
};
textInputPgTmpl = function() {
  return "<textarea id=\"tInput\" class=\"fullPage\" data-theme=\"d\" name=\"tInput\" placeholder=\"(Enter text)\" />";
};