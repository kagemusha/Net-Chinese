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

classSel = (klasses) ->
  if (klasses[0]==".") then klasses else ".#{klasses}"

toggleEditControls = (pageId="") ->
  $("#{idSel pageId} .#{EDITING_CLASS}, #{idSel pageId} .#{NOT_EDITING_CLASS}").toggle()

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
    label = options.label || options.name
    choiceType = if isRadio then "radio" else "checkbox"
    checked = if options.checked then "checked=checked" else ""
    """
    <input type="#{choiceType}" data-theme="d" name="#{name}" #{valAttr}  id="#{options.id}" #{checked}>
    <label for="#{options.id}" >#{label}</label>
    """

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
button = (label, page, options) ->   link label, page, "#{options} data-role='button'"
backButton = (label="Back", page=null, options=null) ->
  if page
    dataRel="data-direction='reverse'"
  else
    dataRel = "data-rel='back'"
    page = "#"
  link label, page, "data-icon='arrow-l' #{dataRel} #{options}"

rightBtn = (label, url, options="", classes="") ->
  options = "class='ui-btn-right #{classes}' #{options}"
  but = link label, url, options
  log "but", but
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
              "<li>#{btn}</li>"
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
                  "<li>#{btn}</li>"
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
  """
  <li class='set'>
    <a class='set' href="#setPage" obj_id="#{set.id}" init_pg='set'>
      #{set.name}
    </a>
  </li>
  """

delImg = ->  "<img  class='del del_icon ui-li-icon' src='#{img('delete.png')}'/>"

editSetLiTmpl = (set) ->
    """
    <li class='set' obj_id="#{set.id}">
      #{delImg()}
      #{set.name}
    </li>
    """

cardLiTmpl = (card) ->
  """
  <li class="card #{if toStr(card.archived)=='true' then 'archived' else ''} ">
    <div class="overlay">ARCHIVED</div>
    <a class="card" obj_id="#{card.id}" href="#cardPage" init_pg="card" >
    <span class="front">#{card.front}</span><br/>
    #{card.back}
  </a></li>
  """

editCardLiTmpl = (card) ->
  """
  <li class="card" obj_id="#{card.id}">
    #{delImg()}
    <span class="front">#{card.front}</span><br/>
    #{card.back}
  </li>
  """

labelLiTmpl = (label, icon="") ->
  """
  <li>
      #{icon}
      <a href="#labelPage" obj_id="#{label.id}"  init_pg="label" >#{label.name}</a>
  </li>
  """

editLabelLiTmpl = (label) ->
  """
  <li class="card" obj_id="#{label.id}">
    #{delImg()}
    #{label.name}
  </li>
  """


ul = (id, listItems=[""], dataOptions={}, options="") ->
  dataTheme = dataOptions.dataTheme || DEFAULT_STYLE
  dataInset = dataOptions.dataInset || "false"
  listItems = listItems.join("")
  #dataDividerTheme =
  """
    <ul id="#{id}" data-role="listview" data-inset="#{dataInset}" data-theme="#{dataTheme}" #{options}>
      #{listItems}
    </ul>
  """

editUL = (id, type, dataOptions, options) ->
    ul id, null, dataOptions, "class='editList' obj_type='#{type}' #{options}"


setsPgTmpl = ->
    """
    #{ul "setList", null, null, "obj_type='card_set'"}
    #{editUL "editSetList", "set"}
    """

settingsPgTmpl = ->
    """
    <form accept-charset="UTF-8"  id="syncForm">
        <div data-role="fieldcontain">
          <input type="submit" name="submit" value="Sync"/>
        </div>
    </form>
    """

cardBackTmpl = (back, front) ->
  """
  \n
  <div class='backText'>#{back}</div>
  #{front}\n\n
  """

setPgTmpl = (set) ->
    """
    <div id="cardsShowing">
        <a href="#" id="prevCards" class="cardList"> prev </a>
        <span id="cardsShowingMsg"></span>
        <a href="#" id="nextCards" class="cardList"> next </a>
    </div>
    <br/>
    #{ul "cardList", null, null, "obj_type='card'"}
    #{editUL "editCardList", "card"}
    """

labelsPgTmpl = ->
    """
    #{button "Add Label", "#labelPage", "id='addLabelButton' init_pg='label'"}
    #{ul "labelList", null, {dataInset: true} }
    #{editUL "editLabelList", "label", {dataInset: true}}
    """


labelPgTmpl = ->
  """
  <form accept-charset="UTF-8"  id="labelForm" obj_type="label">
    <div data-role="fieldcontain">
      <input type="hidden" id="card_set_id" name="card_set_id" />
      <input type="hidden" id="id" name="id" />
      <input type="text" id="name" name="name" />
    </div>
  </form>
  #{ button "Save", "#", "obj_type='label' saveForm='labelForm' #{root.BACK_REL}" }
  """


filterPgTmpl = ->
  """
  <div id="backFirstOption">
  </div>
  <div id="archivedFilter"></div>
  <div id="filtersForm"></div>
  """

listLink = (label, href, options) ->
  """
  <li>#{link(label, href, options)}</li>
  """
listLink2 = (link) ->
  """
  <li>#{link}</li>
  """

listLinkTmpl = (link, options) ->
  listLink link.label, link.link, link.options

listLinkTmpl2 = (link, options) ->
  listLink2 link

cardPgTmpl = ->
  cardSideItems = [
    listLink("Front (Chinese)", "#textInputPage", "id='frontTALink' init_pg='cardSide'"),
    listLink("Back (English)", "#textInputPage", "id='backTALink' init_pg='cardSide' side='back'")
  ]

  """
  <form accept-charset="UTF-8"  id="cardForm" obj_type="card">
    <input type="hidden" id="card_set_id" name="card_set_id" />
    <input type="hidden" id="id" name="id" />
    <br>
    #{ul "cardSides", cardSideItems, {dataInset: true} }
    <div id="cardArchiveLabels">#{yesnoChoiceTmpl "archivedRB", "Archive", "archived"}</div>
    <div id="cardLabels"></div>

  </form>
  #{ button "Save", "#", "obj_type='card' saveForm='cardForm' #{root.BACK_REL}" }
  """

textInputPgTmpl = ->
  """
    <textarea id="tInput" class="fullPage" data-theme="d" name="tInput" placeholder="(Enter text)" />
  """


studyStatsTmpl = (stats, full=true) ->
  """
  <div id="studyStatsMsg">
      <span class="stat label">#{stats.leftInRun} </span>
      of
      <span class="stat label">#{stats.runCount} </span>
      left &nbsp;&nbsp;
      #{if full then triesTmpl(stats) else ""}
  </div>
  """

triesTmpl = (stats) ->
  """
  Correct 1 try:
  <span class="stat label">#{stats.tries[0]} </span>
  &nbsp;2:
  <span class="stat label">#{stats.tries[1]}</span>
  &nbsp;More:
  <span class="stat label">#{stats.tries[2]}</span>

  """

studyPgTmpl = ->
    """
    <div id="studyStatsFront"></div>
    <div id="studyPanel">
      <div class="cardPanel front">
         <div id="front" class="card_face">
             <div class="textPanel">
              Please wait...
             </div>
         </div>
      </div>
    </div>
    """

answerPgHeadTmpl = ->
  """
  <ul id="studyButtons" class="back">
    <li>#{button "Correct", "#", "id='correct' data-transition='pop' class='result'"}
    <li>#{button "Wrong", "#", "id='wrong' data-transition='pop' class='result'"}
  </ul>
  """


answerPgTmpl = ->
    """
    <div id="studyStats"></div>
    <div id="studyPanel">
      <div class="cardPanel">
         <div id="front" class="card_face">
             <div class="textPanel">
              Please wait...
             </div>
         </div>
      </div>
    </div>
    """

###
loginPgTmpl = (login) ->
    """
    <h4>Login</h4>
    <form accept-charset="UTF-8"  id="loginForm">
        <div data-role="fieldcontain">
          <input type="text" id="email" name="email" placeholder="Email" value="#{login.email}"/>
        </div>
        <div data-role="fieldcontain">
          <input type="password" id="password" name="password" value="#{login.password}" placeholder="Password"/>
        </div>
        <div data-role="fieldcontain">
          <input type="submit" name="submit" value="Submit"/>
        </div>
        Server: <span id="server"></span>
    </form>
    """
###