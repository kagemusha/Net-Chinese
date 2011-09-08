root.BACK_REL = "data-rel='back'"

refreshTmplById = (id, templateFn, data, options) ->
    refreshTmpl "#{idSel id}", templateFn, data, options

refreshTmpl = (containers, templateFn, data, options) ->
    templateFn = eval(templateFn) if typeof templateFn == 'string'
    $(containers).empty()
    elems = genElems(templateFn, data, options)
    #log "elems", elems
    $(containers).append elems

refreshListById = (id, template, objs, options) ->
  refreshTmplById id, template, objs, options
  listviewRefresh id

NOT_EDITING_CLASS = "notEditing"
EDITING_CLASS = "editing"

idSel = (id) ->
  log "idsel no id!!" if !id or id.length < 1
  if (id[0]=="#") then id else "##{id}"

classSel = (klass) ->
  if (klass[0]==".") then klass else ".#{klass}"

refreshEditableListById = (baseListId, template, editTemplate, objs) ->
  editListId = "edit#{capitalize baseListId}"
  $("#{idSel baseListId}").addClass NOT_EDITING_CLASS
  $("#{idSel editListId}").addClass EDITING_CLASS
  refreshListById baseListId, template, objs
  refreshListById editListId, editTemplate, objs


genElems = (fn, data, options) ->
    if _.isArray(data)
        elems = for elem in data
                    fn elem, options
        if elems then elems.join("") else ""
    else
        fn data, options

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

label = (text, forAttr, options="") ->
    "<label for='#{forAttr}' #{options} >#{text}</label>"

input = (type, id, options="") ->
  hasName = options.search(/\s+name\s*=/)  > 0
  log "input", hasName
  options = "#{options} name='#{id}'" if !hasName
  "<input type='#{type}' id='#{id}' #{options} />"


yesnoChoiceTmpl = (id, label, group, yesChecked) ->
  options = {id: id, align: "horizontal", label: label}
  noChecked = (yesChecked != null and !yesChecked)
  btns =  [
            {id: "yes", name: group, val: "true", label: "Yes", checked: yesChecked},
            {id: "no", name: group, val: "false", label: "No", checked: noChecked}
          ]
  choiceGroup true, group, options, btns

choiceButtons = (isRadio, name, btnSpecs) ->
  (choiceTmpl(isRadio, name, spec) for spec in btnSpecs).join(" ") if btnSpecs

#choiceType: radio or checkbox
choiceGroup = (isRadio, name, options, btnSpecs) ->
    btns = choiceButtons isRadio, name, btnSpecs
    dataType = if options.align then "data-type=#{options.align}" else ""
    dataTheme = "d" #parametrize
    """
        <fieldset data-role='controlgroup' #{dataType} id='#{options.id}' data-theme='#{dataTheme}'>
            <legend>#{options.label}</legend>
            #{btns}
        </fieldset>
    """

link = (label, url, options) ->  "<a href='#{url or "#"}' #{options or ""} >#{label or "<blank>"}</a>"
linkReverseAttr = (page) ->  if (!page or page="#") then "data-direction='reverse'" else "data-rel='back'"
button = (label, page, options) ->   link label, page, "#{options} data-role='button'"
backButton = (label="Back", page=null, options=null) ->
  dataRel = linkReverseAttr page
  page = "#" if !page
  link label, page, "data-icon='arrow-l' #{dataRel} #{options}"

saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  link(label, page, "obj_type='#{objType}' saveform='#{form}' #{linkReverseAttr page}" )



rightBtn = (label, url, options="", classes="") ->
  options = "class='ui-btn-right #{classes}' #{options}"
  but = link label, url, options
  #log "but", but
  but

DEFAULT_STYLE="d"
DEFAULT_PG_THEME = "e"
pageTmpl = (specs) ->
  if specs.head.leftBtns
    lButtons = if _.isArray(specs.head.leftBtns) then specs.head.leftBtns.join("") else specs.head.leftBtns
  else
    lButtons=""
  title = specs.head.title or "网 Net Chinese 中"
  rButtons = specs.head.rightBtns || ""
  footer = specs.footer || ""
  """
  <div id="#{specs.id}" data-role="page" data-theme="#{DEFAULT_PG_THEME}"  data-auto-back-btn='true' class='pg'>
    #{ headerTmpl title, lButtons, rButtons }
    <div class="msg"></div>
    <div data-role="content" class="pgContent">
    </div><!-- /content -->
    #{footer}
  </div>
  """

navBar = (buttons, listStyle=true) ->
  buttons =  for btn in buttons
                li btn
  btns =
    """
      <div data-role="navbar">
        <ul>#{buttons.join()}</ul>
      </div>
    """
  btns = buttons.join(' ')



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

headerTmpl = (title, lButton="", rButtons="") ->
  """
  <div data-role="header" data-theme="a" data-position="inline" class="pgHead"  >
    #{lButton}
    <h1>#{title}</h1>
    #{rButtons}
    <div data-role="navbar" id="headNav">
      <ul class="headButtons">
      </ul>
    </div>
  </div>
  """

img = (file) ->  "css/images/#{file}"

### App specific below ###

setLiTmpl = (set) ->
  li link(set.name, "#setPage", "class='set' obj_id='#{set.id}' init_pg='set'"), "class='set'"

delImg = ->  "<img  class='del del_icon ui-li-icon' src='#{img('delete.png')}'/>"

ul = (id, listItems=[""], dataOptions={}, options="") ->
  dataTheme = dataOptions.dataTheme || DEFAULT_STYLE
  dataInset = dataOptions.dataInset || "false"
  listItems = listItems.join("")
  """
  <ul id="#{id}" data-role="listview" data-inset="#{dataInset}" data-theme="#{dataTheme}" #{options}>
    #{listItems}
  </ul>
  """

editUL = (id, type, dataOptions, options) ->
    ul id, null, dataOptions, "class='editList' obj_type='#{type}' #{options}"

li = (text, options) -> "<li #{options}>#{text}</li>"

textInputPgTmpl = ->
  """
  <textarea id="tInput" class="fullPage" data-theme="d" name="tInput" placeholder="(Enter text)" />
  """

