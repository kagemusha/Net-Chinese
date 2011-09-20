optionStr = (options) ->
  return "" if !options
  return options if typeof(options)=='string'
  opts = for key, val of options
      "#{key}='#{val}'"
  opts.join(" ")

#links
link = (label="<blank>", href="#", options, reverse=false) ->
  revStr = if reverse then linkReverseAttr(url) else ""
  "<a href='#{href}' #{optionStr options} #{revStr} >#{label}</a>"

button = (label, href="#", options, reverse=false) ->
  options["data-role"] = 'button'
  link label, href, options, reverse

backButton = (label="Back", href="#", options={}) ->
  options["data-icon"]='arrow-l'
  button label, href, options, true

rightButton = (label, href, options={}, reverse=false) ->
  options["class"] = "#{options["class"] || ""} ui-btn-right"
  button label, href, options, reverse

linkReverseAttr = (href) ->  if (!href or href="#") then "data-direction='reverse'" else "data-rel='back'"


#form
label = (text, forAttr, options={}) -> "<label for='#{forAttr}' #{optionStr options} >#{text}</label>"

input = (type, id, options={}) ->
  options["name"] = id if !options["name"]
  "<input type='#{type}' id='#{id}' #{optionStr options} />"

#list
li = (text, options) -> "<li #{optionStr options}>#{text}</li>"

ul = (id, listItems=[""], options={}) ->
  dataTheme = options.dataTheme || DEFAULT_STYLE
  listItems = listItems.join("")
  """
  <ul id="#{id}" data-role="listview"  data-theme="#{dataTheme}" #{optionStr options}>
    #{listItems}
  </ul>
  """


#page
headerTmpl = (title, lButton="", rButtons="", navBar="", options={}) ->
  """
  <div data-role="header" #{optionStr options} >
    <h1>#{title}</h1>
    #{lButton}
    #{rButtons}
    <div data-role="navbar" id="headNav">
      <ul class="headButtons">
      </ul>
    </div>
  </div>
  """

footerTmpl = (specs, buttons...) ->
  klass = "class='#{specs.class || ""} #{if specs.ui_bar then "ui-bar" else ""}'"
  if buttons
    if specs.navBar
      buttons =  for btn in buttons
                  li btn
      btns =
        """
          <div data-role="navbar">
            <ul>#{buttons.join()}</ul>
          </div>
        """
    else
      btns = buttons.join(' ')

  dataPos = if specs.fixed then "data-position='fixed'" else ""
  """
  <div data-role="footer" data-theme="a" #{dataPos} #{klass}>
    #{btns}
  </div>
  """

#usually a UL
navbar = (buttonList, options) ->
  """
  <div data-role="navbar", #{optionStr options}>
    #{buttonList}
  </div>
  """


pageTmpl = (id, header, content, footer="", options={}) ->
  """
  <div id="#{id}" data-role="page" data-theme="#{DEFAULT_PG_THEME}"  data-auto-back-btn='true' class='pg'>
    #{header}
    #{content}
    #{footer}
  </div>
  """

choiceTmpl = ( isRadio, name, options) ->
    val = options.val || options.id
    valAttr = if val? then "value='#{val}'" else ""
    #log "val,o.val,o.id", val, options.val, options.id
    lbl = options.label || options.name
    choiceType = if isRadio then "radio" else "checkbox"
    checked = if options.checked then "checked=checked" else ""
    """
    #{input choiceType, options.id, "data-theme='d' name='#{name}' #{valAttr} #{checked} " }
    #{label(lbl, options.id)}
    """

choiceButtons = (isRadio, name, btnSpecs) ->
  (choiceTmpl(isRadio, name, spec) for spec in btnSpecs).join(" ") if btnSpecs

checkboxGroup = (name, options, choices) ->
  choiceGroup false, name, options, choices

#choiceType: radio or checkbox
###
choiceGroup = (isRadio, name, options, btnSpecs) ->
  btns = choiceButtons isRadio, name, btnSpecs
  dataType = if options.align then "data-type=#{options.align}" else ""
  options["data-theme"] = "d" #parametrize
  horiz = options.align
  delete options.align
  lbl = options.label
  delete options.label
  #controlGroup lbl, btns, options.align, options

  """
  <fieldset data-role='controlgroup' #{dataType} id='#{options.id}' data-theme='#{options["data-theme"]}'>
      <legend>#{lbl}</legend>
      #{btns}
  </fieldset>
  """

controlGroup = (legend=null, buttons, horizontal=false, options) ->
  options["data-type"]="horizontal" if horizontal
  legend = if legend then "<legend>#{legend}</legend>" else ""
  """
  <fieldset data-role='controlgroup' #{optionStr options} >
      #{legend}
      #{buttons}
  </fieldset>
  """
###