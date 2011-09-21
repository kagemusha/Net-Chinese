DATA_ROLE = "data-role"


listview = (options={}) ->
  options[DATA_ROLE] = "listview"
  haTag "ul", options

h_link = (label="<blank>", href="#", options={}, reverse=false) ->
  options["href"] = href
  if reverse
    if (!href or href="#") then options["data-direction"]='reverse' else options["data-rel"]='back'
  haTag "a", options, label

h_button = (label, href="#", options={}, reverse=false) ->
  options[DATA_ROLE] = 'button'
  h_link label, href, options, reverse

h_saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  h_link label, page, {obj_type: objType, saveform: form}, true


h_rightButton = (label, href, options={}, reverse=false) ->
  options["class"] = "#{options["class"] || ""} ui-btn-right"
  h_link label, href, options, reverse


h_backButton = (label="Back", href="#", options={}) ->
  options["data-icon"] ?='arrow-l'
  h_link label, href, options, true


h_label = (text, forAttr, options={}) ->
  options["for"] = forAttr
  haTag "label", options, text


h_input = (type, name, options={}) ->
  options["type"] = type
  options["name"] = name
  options["id"] ?= name
  haTag "input", options


fieldcontain = (options={}) ->
  options[DATA_ROLE] = "fieldcontain"
  """
  #{ haTag "div", options }
  """

controlgroup = (label, options={}) ->
  options[DATA_ROLE] = 'controlgroup'
  h_fieldset label, options

h_fieldset = (label, options={}) ->
  id = delProp options, "id"
  #log "fieldset", id
  choiceDiv = if id then "#{idSel id}.choices" else "" #needed for dynamic choice groups
  multilineHaml """
  #{ haTag "fieldset", options }
    %legend #{label}
    #{choiceDiv}
  """

yesnoChoiceTmpl = (label, fieldName, yesChecked=false, cgOptions={}) ->
  _.extend cgOptions, {"data-type": "horizontal", id: "#{fieldName}Choice"}
  haml = """
  #{controlgroup label, cgOptions}
      #{ h_radio "Yes", fieldName, "yes", "true", {}, yesChecked }
      #{ h_radio "No", fieldName, "no", "false", {}, !yesChecked }
  """
  multilineHaml haml

h_choiceGroup = (isRadio, label, fieldName, options, choices=[] )->
  multilineHaml """
  #{controlgroup label, options}
    #{h_choices isRadio, fieldName, choices}
  """

h_resetChoices = (isRadioBtns, fieldId, fieldName, choices, options={}) ->
  sel = "#{idSel fieldId}.choices"
  $(sel).empty()
  #log "reset choicezz", sel, $(sel).length
  $( sel ).append h_choices(isRadioBtns, fieldName, choices, options)

h_choices = (isRadioBtns, fieldName, choicesArray=[], options) ->
  btns = for choice in choicesArray
    #log "choice", choice
    _.extend options, choice.options if options #choice options take precedence
    h_choice isRadioBtns, choice.label, fieldName, choice.id, choice.value, choice.options, choice.checked, choice.lbl_options, false
  if (btns and btns.length > 0) then hamlHtml(multilineHaml(btns.join "\n")) else ""

h_choice = (isRadio, label, fieldName, id, val, options={}, checked=false, lbl_options={}, multiline=true) ->
  #lbl_options["data-theme"] = "d"
  #log "choizzopts", options, fieldName, val, id
  options.id = id
  options.value ?= val || id
  type = if isRadio then "radio" else "checkbox"
  options["checked"] = "checked" if checked
  haml = """
  #{h_input type, fieldName, options}
  #{h_label(label, id, lbl_options)}
  """
  if multiline then multilineHaml(haml) else haml



#<div data-role="fieldcontain">
#    <fieldset data-role="controlgroup">
#    	<legend>Choose a pet:</legend>
#         <input type="radio" name="radio-choice-1" id="radio-choice-1" value="choice-1" checked="checked" />
#         <label for="radio-choice-1">Cat</label>
#         <input type="radio" name="radio-choice-1" id="radio-choice-2" value="choice-2"  />
#         <label for="radio-choice-2">Dog</label>


#<div data-role="fieldcontain">
# 	<fieldset data-role="controlgroup">
#		<legend>Agree to the terms:</legend>
#		<input type="checkbox" name="checkbox-1" id="checkbox-1" class="custom" />
#		<label for="checkbox-1">I agree</label>
#    </fieldset>
#</div>

#name is the field/var name
    #{ h_radio "Yes", fieldName, id, {"data-theme": "d", name: "labels", value: "yes"}, yesChecked }
    #{ h_radio "No", fieldName, id, {"data-theme": "d", name: "labels", value: "no"}, !yesChecked }
h_radio = (label, name, id, val, options, checked, lblOptions) -> h_choice true, label, name, id, val, options, checked, lblOptions
h_checkbox = (label, name, id, val, options, checked, lblOptions) -> h_choice false, label, name, id, val, options, checked, lblOptions

hForm = (options={}) ->
  options["accept-charset"] ?= "UTF-8"
  haTag "form", options


h_page = (id, options={}) ->
  options[DATA_ROLE] = "page"
  options["id"] = id
  div options

#position can be "inline", "fixed", or "fullscreen"
h_pageHeader = (title="", position="fixed", options={}) ->
  options[DATA_ROLE] = "header"
  options["data-position"] = position
  """
  #{div options}
      %h1 #{title}
  """

div = ( options={}, content) ->
  haTag "div", options, content

h_pageFooter = (fixed=true, options={}) ->
  options[DATA_ROLE] = "footer"
  div options

h_navbar = (options={}) ->
  options[DATA_ROLE] = "navbar"
  div options

h_content = (options={}) ->
  options[DATA_ROLE] = "content"
  div options

appendTmpl = (containers, templateFn, data, options) ->
  templateFn = eval(templateFn) if typeof templateFn == 'string'
  elems = genElems(templateFn, data, options)
  $(containers).append elems


delProp = (obj, prop) ->
  objProp = obj[prop]
  delete obj[prop]
  objProp