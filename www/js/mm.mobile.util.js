var PAGE_FOOT_TMPL_SEL, PG_FOOT_SEL, PG_HEAD_SEL, PG_HEAD_TMPL_SEL, PG_TMPL_SEL, TABLES, VALIDATIONS, addFooter, addHeader, equalStr, fieldNotBlank, formDataFields, getObjFromForm, go, lia, listviewRefresh, login, makePage, makePages, onPage, pageId, pageSel, pgFoot, pgFootTmpl, pgHead, pgHeadTmpl, pgTmplFn, populateForm, populateList, popupMsg, refreshChoice, refreshPage, removePopup, saveForm, selCount, setHeaderBtn, setPageHeaderTitle, showHide, showMsgs, uncapitalize;
TABLES = {};
VALIDATIONS = {};
fieldNotBlank = function(val) {
  return val && val.length > 0;
};
saveForm = function(formId) {
  var edit, obj, table, type, valFn;
  obj = getObjFromForm(formId);
  log("saveObj", formId, obj);
  type = $("#" + formId).attr("obj_type");
  valFn = VALIDATIONS[type];
  if (!valFn(obj)) {
    log("invalid obj");
    return;
  }
  log("objFromForm", obj);
  table = TABLES[type];
  edit = (obj.id != null) && obj.id.length > 0;
  log("obj-id, edit", (obj.id ? obj.id : "null"), edit);
  popupMsg("Saving...");
  if (edit) {
    return table.replace(obj);
  } else {
    return table.add(obj);
  }
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
uncapitalize = function(str) {
  if (!str || str.length < 1) {
    return str;
  }
  return "" + (str[0].toLowerCase()) + (str.substr(1));
};
makePages = function(firstPage, pages) {
  var pageId, specs, _results;
  makePage(firstPage, pages[firstPage]);
  _results = [];
  for (pageId in pages) {
    specs = pages[pageId];
    if (pageId !== firstPage) {
      _results.push(makePage(pageId, specs));
    }
  }
  return _results;
};
makePage = function(id, specs) {
  var btnSel;
  if (!(specs.head != null)) {
    specs.head = {};
  }
  specs.head.back = !specs.head.noback;
  if (!(specs.foot != null)) {
    specs.foot = {};
  }
  specs.id = pageId(id);
  $('body').remove(specs.id);
  $('body').append(genElems(pageTmpl, specs));
  if (specs.head.buttons) {
    btnSel = "" + (pageSel(id)) + " ul.headButtons";
    refreshTmpl(btnSel, li, specs.head.buttons);
  }
  addFooter(id, specs.foot);
  return refreshPage(id, specs.content);
};
refreshPage = function(id, params) {
  var contentDiv;
  contentDiv = "" + (pageSel(id)) + " .pgContent";
  return refreshTmpl(contentDiv, pgTmplFn(id), params);
};
PG_TMPL_SEL = "PgTmpl";
PG_HEAD_SEL = ".pgHead";
PG_HEAD_TMPL_SEL = "PgHeadTmpl";
PG_FOOT_SEL = ".pgFoot";
PAGE_FOOT_TMPL_SEL = "PgFootTmpl";
pageId = function(id) {
  return "" + id + "Page";
};
pageSel = function(id) {
  return "#" + (pageId(id));
};
pgTmplFn = function(id) {
  return "" + id + PG_TMPL_SEL;
};
pgHead = function(id) {
  return "" + (pageSel(id)) + " " + PG_HEAD_SEL;
};
pgHeadTmpl = function(id) {
  return "" + id + PG_HEAD_TMPL_SEL;
};
pgFoot = function(id) {
  return "" + (pageSel(id)) + " " + PG_FOOT_SEL;
};
pgFootTmpl = function(id) {
  return "#" + id + PAGE_FOOT_TMPL_SEL;
};
addHeader = function(id, params) {
  if ($(pgHeadTmpl(id)).length > 0) {
    return refreshTmpl(pgHead(id), pgHeadTmpl(id), params);
  }
};
addFooter = function(id, params) {
  /*log("foot", pgFootTmpl(id), selCount(pgFootTmpl(id)), pgFoot(id), selCount(pgFoot(id)),
          pageSel(id), selCount(pageSel(id)))*/  if ($(pgFootTmpl(id)).length > 0) {
    return refreshElem(pgFoot(id), pgFootTmpl(id), params);
  }
};
root.loginKey = "logKey";
login = function(credentials) {
  if (credentials) {
    cacheObj(credentials);
  }
  return retrieveObj(root.loginKey);
};
setHeaderBtn = function(page, button, left) {
  if (left == null) {
    left = true;
  }
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
lia = function(label, href, linkAttrs, liAttrs) {
  var lElem, link;
  linkAttrs.href = href;
  link = elem("a", label, linkAttrs);
  return lElem = elem("li", link, liAttrs);
};
popupMsg = function(msg, delay) {
  var msgDiv, wait;
  removePopup();
  wait = delay || 800;
  msgDiv = $("<div class='popup ui-loader ui-overlay-shadow ui-body-b ui-corner-all'><h1>" + msg + "</h1></div>").css({
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
populateList = function(list, objects, strategy) {
  var childCount, item, obj, rmClass, _i, _len;
  rmClass = $(list).attr("id") + LIST_ITEM_CLASS;
  $("." + rmClass).remove();
  childCount = $(list).children().length - 1;
  for (_i = 0, _len = objects.length; _i < _len; _i++) {
    obj = objects[_i];
    item = strategy(obj);
    $(item).attr("id", LIST_ITEM_CLASS);
    $(list).append(item);
  }
  $(list).children(":gt(" + childCount + ")").addClass(rmClass);
  return $(list).listview("refresh");
};
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
        _results2.push($(input).is(':radio') ? (log($(input).attr("name"), val, $(input).attr("value")), checkCBs(input, equalStr($(input).attr("value"), val))) : $(input).is(':checkbox') ? (log($(input).attr("name"), val, $(input).attr("value"), valInArray($(input).attr("value"), val)), checkCBs(input, valInArray($(input).attr("value"), val))) : $(input).attr("value", val));
      }
      return _results2;
    })());
  }
  return _results;
};
equalStr = function(a, b) {
  return toStr(a) === toStr(b);
};
/*
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

*/