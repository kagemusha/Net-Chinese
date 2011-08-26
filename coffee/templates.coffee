root.BACK_REL = "data-rel='back'"

refreshTmplById = (id, templateFn, data, options) ->
    refreshTmpl "##{id}", templateFn, data, options

refreshTmpl = (containers, templateFn, data, options) ->
    templateFn = eval(templateFn) if typeof templateFn == 'string'
    $(containers).empty()
    elems = genElems(templateFn, data, options)
    #log "elems", elems
    $(containers).append elems

genElems = (fn, data, options) ->
    if data instanceof Array
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
    <input type="#{choiceType}" name="#{name}" #{valAttr}  id="#{options.id}" #{checked}>
    <label for="#{options.id}" data-theme="c">#{label}</label>
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
    """
        <fieldset data-role="controlgroup" #{dataType} id="#{options.id}">
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
rightButton = (specs) -> link specs.label, specs.page, "#{specs.options} class='ui-btn-right #{specs.class}'"


pageTmpl = (specs) ->
    lButton =  if specs.head.leftBtn then specs.head.leftBtn else ""
    title = specs.head.title or "网 Net Chinese 中"
    rButton = specs.head.rightBtn || ""
    """
    <div id="#{specs.id}" data-role="page" data-theme="e"  data-auto-back-btn='true' class='pg'>
      #{ headerTmpl title, lButton, rButton }
      <div class="msg"></div>
      <div data-role="content" class="pgContent">
      </div><!-- /content -->
      <div data-role="footer" data-theme="a" data-position="fixed" class="pgFoot" class="ui-bar">
	    </div>
      <!-- footer -->
    </div>
    """


headerTmpl = (title, lButton, rButton) ->
  """
  <div data-role="header" data-theme="a" data-position="inline" class="pgHead"  >
    #{lButton}
    <h1>#{title}</h1>
    #{rButton}
    <div data-role="navbar" id="headNav">
      <ul class="headButtons">
      </ul>
    </div>
  </div>
  """


setLiTmpl = (set) ->
    """
    <li><a class='set' href="#setPage" obj_id="#{set.id}" init_pg='set'>#{set.name}</a></li>
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


labelLiTmpl = (label) ->
    """
    <li>
        <a href="#labelPage" obj_id="#{label.id}"  init_pg="label" >#{label.name}</a>
    </li>
    """

ulTmpl = (id, options=null) ->
  """
    <ul id="#{id}" data-role="listview" data-theme="d">
    </ul>
  """


setsPgTmpl = ->
    """
    #{ulTmpl "setList" }
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
    #{ button "Study", pageSel("study"), "id='studyButton' init_pg='study' class='study'" }
    """
    <div id="cardsShowing">
        <a href="#" id="prevCards" class="cardList"> prev </a>
        <span id="cardsShowingMsg"></span>
        <a href="#" id="nextCards" class="cardList"> next </a>
    </div>
    <br/>
    #{ulTmpl "cardList" }
    """


labelsPgTmpl = ->
    """
    <a href="#labelPage" data-role="button" id="addLabelButton" init_pg="label" >Add Label</a>
    <ul id="labelList" data-dividertheme="b" data-inset="true" data-role="listview" data-theme="c">
        <li data-role="list-divider">Labels</li>
    </ul>
    """


labelPgTmpl = ->
    """
    <h3>Label</h3>
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
    <fieldset data-role="controlgroup" id="filterCheckboxes">
    </fieldset>
    """

listLinkTmpl = (link, options) ->
    """
    <li><a href="#{link.link}" #{link.options} >#{link.label}</a></li>
    """


cardPgTmpl = ->
    """
    <form accept-charset="UTF-8"  id="cardForm" obj_type="card">
       <input type="hidden" id="card_set_id" name="card_set_id" />
       <input type="hidden" id="id" name="id" />
       <div data-role="fieldcontain">
         <textarea cols=30 rows=8 id="card_front" name="front" placeholder="Front" />
         <br/>
         <textarea cols=30 rows=8 id="card_back" name="back" placeholder="Back" />
       </div>
       <div id="cardArchiveLabels"></div>
       <div id="cardLabels"></div>
       </div>

    </form>
    #{ button "Save", "#", "obj_type='card' saveForm='cardForm' #{root.BACK_REL}" }

    """

textInputPgTmpl = ->
  """
  <textarea cols=30 rows=8 id="card_front" name="front" placeholder="Front" />
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
    <li><a href="#" id="correct" data-transition="pop" data-role="button"  class="result" >Correct</a></li>
    <li><a href="#" id="wrong" data-transition="pop" data-role="button"  class="result" >Wrong</a></li>
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