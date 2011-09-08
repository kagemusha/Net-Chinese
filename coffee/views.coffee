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
      #{link "Prev", "#", "id='prevCards' class='cardList'"}
      <span id="cardsShowingMsg"></span>
      #{link "Next", "#", "id='nextCards' class='cardList'"}
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
  #{ button "Save", "#", "obj_type='label' saveForm='labelForm' #{root.BACK_REL}" }
  """
  <form accept-charset="UTF-8"  id="labelForm" obj_type="label">
    <div data-role="fieldcontain">
      #{input "hidden", "card_set_id"}
      #{input "hidden", "id"}
      #{input "text", "name"}
    </div>
  </form>
  """



filterPgTmpl = ->
  """
  <div id="backFirstOption">
  </div>
  <div id="archivedFilter"></div>
  <div id="filtersForm"></div>
  """


cardPgTmpl = ->
  cardSideItems = [
    li(link "Front (Chinese)", "#textInputPage", "id='frontTALink' init_pg='cardSide' saveCB='saveCardFront'"),
    li(link "Back (English)", "#textInputPage", "id='backTALink' init_pg='cardSide' side='back' saveCB='saveCardBack'")
  ]

  #{ button "Save", "#", "obj_type='card' saveForm='cardForm' #{root.BACK_REL}" }
  """
  <form accept-charset="UTF-8"  id="cardForm" obj_type="card">
    #{input "hidden", "card_set_id"}
    #{input "hidden", "id"}
    #{input "hidden", "front"}
    #{input "hidden", "back"}
    <br>
    #{ul "cardSides", cardSideItems, {dataInset: true} }
    <div id="cardArchiveLabels">#{yesnoChoiceTmpl "archivedRB", "Archive", "archived"}</div>
    <div id="cardLabels"></div>

  </form>
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

###
answerPgHeadTmpl = ->
  btns = [li(button "Correct", "#", "id='correct' data-transition='pop' class='result'"),
          li(button "Wrong", "#", "id='wrong' data-transition='pop' class='result'")]
  ul "studyButtons", btns, "", "class='back'"
###

answerPgHeadTmpl = ->
  """
  <ul id="studyButtons" class="back">
    #{li(button "Correct", "#", "id='correct' data-transition='pop' class='result'")}
    #{li(button "Wrong", "#", "id='wrong' data-transition='pop' class='result'")}
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

editSetLiTmpl = (set) ->
  li "#{delImg()} #{set.name}", "'class='set' obj_id='#{set.id}'"


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
  li  "#{delImg()}<span class='front'>#{card.front}</span><br/>#{card.back}", "class='card' obj_id='#{card.id}'"

labelLiTmpl = (label, icon="") ->
  li "#{icon} #{link label.name, '#labelPage', "obj_id='#{label.id}'  init_pg='label'"}"

editLabelLiTmpl = (label) ->
  li "#{delImg()} #{label.name}", "class='card' obj_id='#{label.id}'"


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