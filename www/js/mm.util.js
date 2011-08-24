var $flags, $pageAliases, $rootPage, FORM_EXCLUDED_PROPS, MSG_KEY, OBJ_ID_ATTR, OBJ_TYPE_ATTR, ONLINE_ONLY_SEL, SET_ID_ATTR, SET_TYPE_ATTR, TEST_OFFLINE, addRmClass, aliasPages, attr, attrStr, cache, cacheManifestAlert, cacheObj, callFn, callFunctionType, callbackFn, capitalize, checkCBs, checkbox, consumeFlag, datasetObjKey, delProp, disable, displayParams, elem, elemsToObj, elemsToObjArray, env, equalNum, isChecked, isOffline, link_to, log, logSelCount, multiline, objKey, offlineMode, paramStrToObj, recToParams, refreshElem, refreshElemById, refreshHeadFoot, retrieve, retrieveObj, root, setFlag, setFlags, setMsg, setRootPage, showElem, showHide, showMsg, toString, url, valInArray;
root = typeof global !== "undefined" && global !== null ? global : window;
root.offline = null;
root.msgSel = ".msg";
$flags = new Object();
MSG_KEY = "msgx";
OBJ_TYPE_ATTR = "obj_type";
OBJ_ID_ATTR = "obj_id";
SET_ID_ATTR = "set_id";
SET_TYPE_ATTR = "set_type";
$rootPage = null;
$pageAliases = null;
setRootPage = function(pageId) {
  return $rootPage = pageId;
};
aliasPages = function(aliases) {
  return $pageAliases = aliases;
};
env = function() {
  root.offline = isOffline();
  return log("browser", $.browser, "offline: ", root.offline);
};
cacheManifestAlert = function() {
  return $(window.applicationCache).bind('error', function() {
    return log('There was an error when loading the cache manifest.');
  });
};
refreshHeadFoot = function(pageSel) {
  $(pageSel).find("[data-role=header],[data-role=footer]").css("z-index", "1000");
  return $.fixedToolbars.show(true);
};
callFunctionType = function(type, id, params) {
  var fn;
  fn = "" + type + (capitalize(id.replace('#', '')));
  try {
    return callFn(fn, params);
  } catch (e) {
    return log("error calling " + fn, e);
  }
};
callFn = function(name, params) {
  var fn;
  fn = new Function("params", "" + name + "(params)");
  return fn(params);
};
showMsg = function(msgHTML) {
  var msg;
  $(root.msgSel).empty();
  msg = msgHTML || consumeFlag(MSG_KEY);
  if (msg) {
    return $(root.msgSel).html(msg);
  }
};
setMsg = function(msg) {
  return $flags[MSG_KEY] = val;
};
setFlags = function(flags) {
  var flag, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = flags.length; _i < _len; _i++) {
    flag = flags[_i];
    _results.push(setFlag(flag, true));
  }
  return _results;
};
setFlag = function(key, val) {
  return $flags[key] = val || true;
};
consumeFlag = function(key) {
  var val;
  val = $flags[key];
  $flags[key] = null;
  return val;
};
refreshElemById = function(id, templateId, params) {
  return refreshElem("#" + id, "#" + templateId, params);
};
refreshElem = function(elem, templateSel, params) {
  $(elem).empty();
  return $(templateSel).tmpl(params).appendTo(elem);
};
recToParams = function(obj) {
  var key, params, _i, _len;
  params = new Array();
  for (_i = 0, _len = obj.length; _i < _len; _i++) {
    key = obj[_i];
    params.push("" + key + "=" + obj[key]);
  }
  return params.join("&");
};
url = function(server, route, paramHash) {
  var urlStr;
  urlStr = "" + server + "/" + route;
  if (paramHash) {
    urlStr += "?" + (recToParams(paramHash));
  }
  return urlStr;
};
elem = function(tag, val, attrs) {
  var open;
  open = "<" + tag + " " + (attrStr(attrs)) + " " + (!(val != null) ? '/' : '') + ">";
  return open + (val != null ? "" + val + "</" + tag + ">" : "");
};
attrStr = function(obj) {
  var key, str, val;
  if (!(obj != null)) {
    return "";
  }
  str = "";
  for (key in obj) {
    val = obj[key];
    str += attr(key, val);
  }
  return str;
};
attr = function(key, val) {
  return "" + key + "='" + val + "' ";
};
link_to = function(label, path, attrs) {
  attrs = attrs || (new Object());
  attrs.href = path;
  return elem("a", label, attrs);
};
log = function() {
  var array, i, msg, _ref;
  msg = arguments[0];
  if (arguments.length > 1) {
    msg += ": ";
    array = new Array();
    for (i = 1, _ref = arguments.length - 1; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
      array.push(JSON.stringify(arguments[i]));
    }
    msg += array.join(",");
  }
  try {
    return console.log(msg);
  } catch (e) {

  }
};
logSelCount = function(sel) {
  return log(sel, $(sel).length);
};
checkCBs = function(cboxes, checked) {
  if (checked) {
    $(cboxes).attr('checked', 'checked');
  } else {
    $(cboxes).removeAttr('checked');
  }
  try {
    return $(cboxes).checkboxradio("refresh");
  } catch (e) {

  }
};
checkbox = function(checked, attrs) {
  attrs.type = "checkbox";
  if (checked) {
    attrs.checked = "checked";
  }
  return elem("input", null, attrs);
};
elemsToObjArray = function(elems, strategy) {
  var array;
  array = new Array();
  $(elems).each(function() {
    return array.push(strategy(this));
  });
  return array;
};
elemsToObj = function(elems, strategy) {
  var obj;
  obj = new Object();
  $(elems).each(function() {
    return strategy(obj, this);
  });
  return obj;
};
capitalize = function(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
objKey = function(prefix, id) {
  return prefix + id;
};
cacheObj = function(key, obj) {
  return cache(key, JSON.stringify(obj));
};
retrieveObj = function(key) {
  var obj;
  obj = retrieve(key);
  if (obj) {
    return JSON.parse(obj);
  } else {
    return null;
  }
};
cache = function(key, val) {
  return localStorage[key] = val;
};
retrieve = function(key) {
  return localStorage[key];
};
TEST_OFFLINE = false;
ONLINE_ONLY_SEL = ".online_only";
isOffline = function() {
  return TEST_OFFLINE || !navigator.onLine;
};
offlineMode = function() {
  if (isOffline()) {
    return $(ONLINE_ONLY_SEL).hide();
  }
};
disable = function(sel) {
  return $(sel).attr('disabled', 'disabled');
};
datasetObjKey = function(type, id) {
  return "dsObj-" + type + (id != null ? id : {
    id: ""
  });
};
displayParams = function(container, template) {
  var dParams, params;
  params = new Array();
  params[0] = container;
  params[1] = template;
  dParams = new Array();
  dParams.push(params);
  return dParams;
};
callbackFn = function(cb) {
  if (cb != null) {
    return callFn(cb);
  }
};
callbackFn = function(cb) {
  if (!(cb != null)) {
    return;
  }
  if (typeof cb === "string") {
    return callFn(cb);
  } else {
    if (typeof cb === "function") {
      return cb.call();
    }
  }
};
valInArray = function(val, array) {
  var arVal, _i, _len;
  if (!(array != null)) {
    return false;
  }
  for (_i = 0, _len = array.length; _i < _len; _i++) {
    arVal = array[_i];
    if (toStr(val) === toStr(arVal)) {
      return true;
    }
  }
  return false;
};
FORM_EXCLUDED_PROPS = ["utf8", "authenticity_token"];
paramStrToObj = function(paramStr) {
  var obj;
  obj = {};
  paramStr.replace(new RegExp("([^?=&]+)=([^&]*)?", "g"), function($0, objProp, val) {
    return objProp.replace(new RegExp("(.*?)%5B(.*?)%5D", "g"), function($0, $1, prop) {
      log("prop", prop, val);
      return obj[prop] = val;
    });
  });
  return obj;
};
multiline = function(string) {
  if (!string) {
    return "";
  }
  while (string.indexOf("\n") > -1) {
    string = string.replace("\n", "<br/>");
  }
  return string;
};
toString = function(primitive) {
  return "" + primitive;
};
isChecked = function(selector) {
  var chkd;
  chkd = $(selector).attr("checked");
  return (chkd === "checked") || (chkd === "true");
};
equalNum = function(a, b) {
  return a * 1 === b * 1;
};
showElem = function(elem, condition) {
  if (condition) {
    return $(elem).show();
  } else {
    return $(elem).hide();
  }
};
showHide = function(elems1, elems2, showElems1, showSpeed, hideSpeed) {
  showSpeed = showSpeed || 0;
  hideSpeed = hideSpeed || 0;
  $(elems1 + ", " + elems2).hide();
  if (showElems1) {
    return $(elems1).show(showSpeed);
  } else {
    return $(elems2).show(hideSpeed);
  }
};
addRmClass = function(sel, klass, add) {
  if (add) {
    return $(sel).addClass(klass);
  } else {
    return $(sel).removeClass(klass);
  }
};
delProp = function(obj, prop) {
  return delete obj[prop];
};
/* needs fixin
$.fn.serializeObject = ->
    log "serializing"
    a = this.serializeArray()
    $.each a, ->
        if obj[this.name] != undefined
            if !obj[this.name].push
                obj[this.name] = [obj[this.name]]
            obj[this.name].push this.value || ''
        else
            obj[this.name] = this.value || ''
    obj
*/