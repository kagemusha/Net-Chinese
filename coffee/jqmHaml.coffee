DATA_ROLE = "data-role"

hId = (id) -> if id then "##{id}" else ""
hTag = (tag, id, options={}, content="") ->
  "%#{tag}#{hId id}#{hamlOptStr options} #{content}"

hamlHtml = (haml) ->
  hfunc = Haml(haml)
  hfunc()

hamlOptStr = (options, brackets=true) ->
  return "" if !options
  return options if typeof(options)=='string'
  opts = for key, val of options
      "#{key}: '#{val}'"
  if brackets then "{ #{opts.join ", "} }" else opts.join(", ")


h_ul = (id, options={}) ->
  dataTheme = options.dataTheme || DEFAULT_STYLE
  options["data-role"] = "listview"
  options["data-theme"] = "d"
  hTag "ul", id, options

h_link = (label="<blank>", href="#", options, reverse=false) ->
  options["href"] = href
  if reverse
    if (!href or href="#") then options["data-direction"]='reverse' else options["data-rel"]='back'
  hTag "a", null, options, label

h_button = (label, href="#", options={}, reverse=false) ->
  options[DATA_ROLE] = 'button'
  h_link label, href, options, reverse

h_saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  h_link label, page, {obj_type: objType, saveform: form}, true

h_rightButton = (label, href, options={}, reverse=false) ->
  options["class"] = "#{options["class"] || ""} ui-btn-right"
  h_link label, href, options, reverse

h_backButton = (label="Back", href="#", options={}) ->
  options["data-icon"]='arrow-l'
  h_link label, href, options, true

h_label = (text, forAttr, options={}) ->
  options["for"] = forAttr
  hTag "label", null, options, text

h_input = (type, id, options={}) ->
  options["name"] = id if !options["name"]
  idStr = if id then "##{id}" else ""
  options["type"] = type
  hTag "input", id, options

h_fieldset = (label, id, options={}) ->
  """
  #{ hTag "fieldset", id, options }
    %legend #{label}
  """

h_controlgroup = (label, id, options={}) ->
  options[DATA_ROLE] = 'controlgroup'
  h_fieldset label, id, options

h_radio = (label, id, options, checked) ->
  h_choice "radio", id, options

h_checkbox = (label, id, options, checked) ->
  h_choice "radio", id, options


h_choice = (label, id, options, isRadio, checked) ->
  options.value ?= id
  options.name ?= id
  type = if isRadio then "radio" else "checkbox"
  options["checked"] = "checked" if checked
  """
  #{h_input type, id, options}
  #{h_label(label, id)}
  """

yesnoChoiceTmpl = (id, label, group, yesChecked) ->
  options = {id: id, "data-type": "horizontal", label: label}
  """
  #{h_controlgroup label, id, options={} }
    #{h_radio "Yes", "yes", {name: group}, yesChecked}
    #{h_radio "No", "no", {name: group}, yesChecked}
  """

hForm = (id, options={}) ->
  options["accept-charset"] = options["accept-charset"] || "UTF-8"
  hTag "form", id, options

h_page = (id, options={}) ->
  options[DATA_ROLE] = "page"
  div options, id

h_pageHeader = (title="", options={}) ->
  options[DATA_ROLE] = "header"
  """
  #{div options}
      %h1 #{title}
  """

div = ( options={}, id, content) ->
  hTag "div", id, options, content

h_pageFooter = (fixed=true, options={}) ->
  options[DATA_ROLE] = "footer"
  div options

h_navbar = (options={}) ->
  options[DATA_ROLE] = "navbar"
  div options

h_content = (options={}) ->
  options[DATA_ROLE] = "content"
  div options


h_makePage = (id, specs) ->
  #elems = genElems(templateFn, data, options)
  tmpl = "h_#{id}PgTmpl"
  appendTmpl "body", tmpl

appendTmpl = (containers, templateFn, data, options) ->
  templateFn = eval(templateFn) if typeof templateFn == 'string'
  elems = genElems(templateFn, data, options)
  $(containers).append elems

heditUL = (id, type, options={}) ->
  options["class"] = " #{options.class || ""} editList"
  options.obj_type = type
  h_ul id, options

