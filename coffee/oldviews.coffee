########################
#########################
labelPgTmpl = ->
  hamlHtml    """
    #{ hForm "labelForm", {obj_type: "label"} }
      %div{ data-role="fieldcontain" }
        #{h_input "hidden", "card_set_id"}
        #{h_input "hidden", "id"}
        #{h_input "text", "name", {placeholder: "Label Name"} }
    """

filterPgTmpl = ->
  hamlHtml """
    #backFirstOption
    #archivedFilter
    #filtersForm
    """

cardPgTmpl = ->
  hamlHtml """
    #{hForm "cardForm", {obj_type: "card"} }
      #{h_input "hidden", "card_set_id"}
      #{h_input "hidden", "id"}
      #{h_input "hidden", "front"}
      #{h_input "hidden", "back"}
      %br
      #{h_ul "cardSides", {"data-inset": true} }
        %li
          #{h_link "Front (Chinese)", "#textInputPage", {id: 'frontTALink', init_pg: 'cardSide', saveCB: 'saveCardFront'} }
        %li
          #{h_link "Back (English)", "#textInputPage", {id: 'backTALink', init_pg: 'cardSide', saveCB: 'saveCardBack', side: 'back'} }

      #cardLabels
    """




#cardArchiveLabels #{yesnoChoiceTmpl "archivedRB", "Archive", "archived"}



###
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
    #{ul "cardSides", cardSideItems, {"data-inset": true} }
    <div id="cardArchiveLabels">#{yesnoChoiceTmpl "archivedRB", "Archive", "archived"}</div>
    <div id="cardLabels"></div>

  </form>
  """
###


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
  ul "studyButtons", btns,  {class: 'back'}
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

settingsPgTmpl = ->
    """
    <form accept-charset="UTF-8"  id="syncForm">
        <div data-role="fieldcontain">
          <input type="submit" name="submit" value="Sync"/>
        </div>
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


###


labelsPgTmpl = ->
  hamlHtml """
    #{h_button "Add Label", "#labelPage", {id: 'addLabelButton', init_pg: 'label'} }
    #{h_ul "labelList", {"data-inset": 'true'} }
    #{heditUL "editLabelList", "label", {"data-inset": true}}
    """

setsPgTmpl = ->
  hamlHtml  """
    #{h_ul "setList", { obj_type: 'card_set'} }
    #{heditUL "editSetList", "set"}
    """

setPgTmpl = (set) ->
  hamlHtml  """
    #cardsShowing
      %a#prevCards.cardList{href: "#", } Prev
      %span#cardsShowingMsg
      %a#nextCards.cardList{href: "#", } Next
    %br
    #{ h_ul "cardList", {obj_type: 'card'} }
    #{ heditUL "editCardList", "card"  }
    """

#from app.coffee
###
$studyLink = link "Study!", "#studyPage", {id: 'studyButton', init_pg: 'study', class: 'study'}

editBtns = (editBtnId, objList) ->
  dualBtnId = dualId editBtnId, "done"
  [
    rightButton("Done", "#", {id: dualBtnId, callfn: 'toggleEditSet', objList: objList, class: "editing"} ),
    rightButton("Edit", "#", {id: editBtnId, callfn: 'toggleEditSet', objList: objList, class: "notEditing"} )
  ].join(" ")

SET_HEADER_BUTTONS=[ $studyLink,
                      link("Add Card","#cardPage", {init_pg: "card", obj_type: CARD_TYPE}),
                      link("Labels","#labelsPage", {init_pg: "labels"} )]

OLD = {
  set:
    head:
      title: "Set",
      leftBtns: backButton("Sets", "#setsPage"),
      rightBtns: editBtns(EDIT_CARD_BTN, "cardList"),
      buttons: SET_HEADER_BUTTONS,
    #footer: footerTmpl {ui_bar: true, fixed: true, navBar: true}, $studyLink
  labels:
    head:
      title: "Labels",
      leftBtns: backButton("Back", "#setPage"),
      rightBtns: editBtns("editLabelBtn", "labelList"),
      #buttons: SET_HEADER_BUTTONS,
  label:
    head:
      title: "Label",
      leftBtns: backButton("Cancel", "#labelsPage"),
      rightBtns: saveButton( 'labelForm', 'label', "#labelsPage"),
      #rightBtns: link("Delete", "#", "obj_type='label' class='delete' #{root.BACK_REL}") }},
  filter: {head: { title: "Filter", leftBtns: backButton("Back","#studyPage", {callfn: 'filterChg'} ) } },
  study: {head: { leftBtns: backButton("Cards","#setPage"), rightBtns: link("Filter", pageSel("filter"), {"data-transition": "pop"}) }},
  answer: {head: { leftBtns: backButton("Cards","#setPage"), rightBtns: link("Restart", pageSel("study"), {"data-transition": 'pop', stRestart: 'true'}) }},
  sets:
    head:
      title: "Sets",
      #rightBtns: editBtns("editSetBtn", "setList")
  card:
    head:
      title: "Card",
      leftBtns: backButton("Cancel", "#setPage"),
      rightBtns: saveButton( 'cardForm', 'card', "#setPage"),
}

PAGES = {
  textInput:
    head:
      title: "Card",
      leftBtns: backButton("Back","#cardPage", {id: SAVE_TEXT_LINK }),
}
###
