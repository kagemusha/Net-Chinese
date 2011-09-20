var TABLES, VALIDATIONS, equalStr, fieldBlank, formDataFields, getObjFromForm, go, listviewRefresh, login, makePages, onPage, pageId, pageSel, pgTmplFn, populateForm, popupMsg, refreshChoice, refreshPage, removePopup, saveForm, selCount, setPageHeaderTitle, showHide, showMsgs, uncapitalize;
TABLES = {};
VALIDATIONS = {};
makePages = function(pages) {
  var page, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = pages.length; _i < _len; _i++) {
    page = pages[_i];
    _results.push(h_makePage(page));
  }
  return _results;
};
fieldBlank = function(val) {
  return !val || val.length === 0;
};
saveForm = function(formId) {
  var edit, errorFn, errorMsg, obj, table, type;
  obj = getObjFromForm(formId);
  log("saveObj", formId, obj);
  type = $("#" + formId).attr("obj_type");
  errorFn = VALIDATIONS[type];
  errorMsg = errorFn(obj);
  if (errorMsg) {
    popupMsg(errorMsg, 2000);
    return;
  }
  table = TABLES[type];
  edit = (obj.id != null) && obj.id.length > 0;
  popupMsg("Saving...");
  if (edit) {
    table.replace(obj);
  } else {
    table.add(obj);
  }
  return update(type, formId, obj);
};
getObjFromForm = function(formId, fields) {
  var input, inputs, obj, prop, val, _i, _len;
  inputs = formDataFields("#" + formId);
  obj = new Object();
  for (_i = 0, _len = inputs.length; _i < _len; _i++) {
    input = inputs[_i];
    prop = $(input).attr("name");
    val = $(input).attr("value");
    try {
      if ($(input).is(':radio')) {
        if ($(input).attr("checked")) {
          obj[prop] = val;
        }
      } else if ($(input).is(':checkbox')) {
        if ($(input).attr("checked")) {
          if (obj[prop] != null) {
            obj[prop].push(val);
          } else {
            obj[prop] = [val];
          }
        }
      } else if ($(input).is(':submit')) {
        log("no submit!!");
      } else {
        obj[prop] = val;
      }
    } catch (e) {
      log(e);
    }
  }
  delete obj.submit;
  return obj;
};
refreshPage = function(page) {
  try {
    return $(idSel(page)).page('destroy').page();
  } catch (e) {

  }
};
uncapitalize = function(str) {
  if (!str || str.length < 1) {
    return str;
  }
  return "" + (str[0].toLowerCase()) + (str.substr(1));
};
pageId = function(id) {
  return "" + id + "Page";
};
pageSel = function(id) {
  return "#" + (pageId(id));
};
pgTmplFn = function(id) {
  return "" + id + PG_TMPL_SEL;
};
root.loginKey = "logKey";
login = function(credentials) {
  if (credentials) {
    cacheObj(credentials);
  }
  return retrieveObj(root.loginKey);
};
selCount = function(sel) {
  return $(sel).length;
};
/*
refreshElemById = (id, templateId, params) ->
    refreshElem "##{id}", "##{templateId}", params

refreshElem = (elem, templateSel, params) ->
    $(elem).empty()
    $(templateSel).tmpl(params).appendTo(elem)
*/
showMsgs = function() {
  return $('.pg').live('pageshow', function(event, ui) {
    return showMsg();
  });
};
showHide = function(showSel, hideSel, condition) {
  var _ref;
  if (condition == null) {
    condition = true;
  }
  if (!condition) {
    _ref = [hideSel, showSe], showSel = _ref[0], hideSel = _ref[1];
  }
  $(showSel).show();
  return $(hideSel).hide();
};
listviewRefresh = function(list) {
  var listSel;
  listSel = "#" + list;
  try {
    $(listSel).listview("init");
  } catch (e) {

  }
  try {
    return $(listSel).listview("refresh");
  } catch (e) {

  }
};
go = function(pg) {
  $.mobile.changePage(pg);
  return pg;
};
onPage = function(pageId) {
  return pageId === $.mobile.activePage[0].id;
};
setPageHeaderTitle = function(page, title) {
  return $(page + " .ui-header h1").text(title);
};
popupMsg = function(msg, delay) {
  var msgDiv, msgHTML, wait;
  removePopup();
  wait = delay || 800;
  msgHTML = "<div class='popup ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>" + msg + "</h1></div>";
  msgDiv = $(msgHTML).css({
    display: "block",
    opacity: 0.8,
    top: window.pageYOffset + 100
  }).appendTo("body");
  if (delay !== 0) {
    return msgDiv.delay(wait).fadeOut(400, function() {
      return $(this).remove();
    });
  }
};
removePopup = function() {
  var LIST_ITEM_CLASS;
  $(".popup").remove();
  return LIST_ITEM_CLASS = "licrv";
};
/* 9/15
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
*/
formDataFields = function(formId) {
  return $("" + formId + " *:input:not(:button,:reset,:submit,:image)");
};
refreshChoice = function(sel, type) {
  if (type == null) {
    type = "refresh";
  }
  try {
    return $(sel).checkboxradio(type);
  } catch (e) {
    return log("refreshChoice", e);
  }
};
populateForm = function(formId, obj) {
  var input, inputFields, prop, val, _results;
  $("" + formId + " :input:not(:button,:reset,:submit,:image,:checkbox,:radio)").attr("value", "");
  checkCBs($("" + formId + " :checkbox"), false);
  checkCBs($("" + formId + " :radio"), false);
  log("hidden submits", $("" + formId + " :input:hidden:submit").length);
  $("" + formId + " :input:hidden:submit").remove();
  _results = [];
  for (prop in obj) {
    val = obj[prop];
    inputFields = $("" + formId + " :input[name='" + prop + "']:not(:button,:reset,:submit,:image)");
    _results.push((function() {
      var _i, _len, _results2;
      _results2 = [];
      for (_i = 0, _len = inputFields.length; _i < _len; _i++) {
        input = inputFields[_i];
        _results2.push($(input).is(':radio') ? (log($(input).attr("name"), toStr(val), $(input).attr("value")), checkCBs(input, equalStr($(input).attr("value"), val))) : $(input).is(':checkbox') ? (log($(input).attr("name"), val, $(input).attr("value"), valInArray($(input).attr("value"), val)), checkCBs(input, valInArray($(input).attr("value"), val))) : $(input).attr("value", val));
      }
      return _results2;
    })());
  }
  return _results;
};
equalStr = function(a, b) {
  return toStr(a) === toStr(b);
};