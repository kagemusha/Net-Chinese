var idSel, refreshPage;
refreshPage = function(page) {
  try {
    return $(idSel(page)).page('destroy').page();
  } catch (e) {

  }
};
idSel = function(id) {
  if (!id || id.length === 0) {
    return "";
  }
  if (id[0] === "#") {
    return id;
  } else {
    return "#" + id;
  }
};