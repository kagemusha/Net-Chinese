PG_DEFAULTS = {"data-theme": "e"}

h_setsPgTmpl = ->
  hamlHtml  """
    #{h_page "setsPage", PG_DEFAULTS}
      #{h_pageHeader "Sets"}
      #{h_content {class: "pgContent"}}
        #{h_ul {id:"setList", obj_type: 'card_set'} }
    """


h_setPgTmpl = (set) ->
  hamlHtml  """
    #{h_page "setPage", PG_DEFAULTS}
      #{h_pageHeader "Set"}
        #{ h_backButton("Sets", "#setsPage") }
        #{ editBtns EDIT_CARD_BTN, "cardList" }
        #{h_navbar() }
          %ul
            %li #{h_link "Study!", "#studyPage", {id: 'studyButton', init_pg: 'study', class: 'study'} }
            %li #{h_link "Add Card","#cardPage", {init_pg: "card", obj_type: CARD_TYPE} }
            %li #{h_link "Labels","#labelsPage", {init_pg: "labels"}  }
      #{h_content {class: "pgContent"}}
        #cardsShowing
          %a#prevCards.cardList{href: "#", } Prev&nbsp;
          %span#cardsShowingMsg
          %a#nextCards.cardList{href: "#", } &nbsp;Next
        %br
        #{ h_ul {id: "cardList", obj_type: "card"} }
        #{ heditUL "card", id: "editCardList" }
    """

h_labelsPgTmpl = ->
  hamlHtml """
    #{h_page "labelsPage", PG_DEFAULTS}
      #{h_pageHeader "Labels"}
        #{ h_backButton "Back", "#setPage" }
        #{ editBtns EDIT_LABEL_BTN, "labelList" }
      #{h_content {class: "pgContent"}}
        #{h_button "Add Label", "#labelPage", {id: 'addLabelButton', init_pg: 'label'} }
        #{h_ul {id: "labelList", "data-inset": 'true'} }
        #{heditUL "label", {id: "editLabelList", "data-inset": true}}
    """

h_labelPgTmpl = ->
  hamlHtml    """
    #{h_page "labelPage", PG_DEFAULTS}
      #{h_pageHeader "Label"}
        #{ h_backButton "Cancel", "#labelsPage" }
        #{ h_saveButton 'labelForm', 'label', "#labelsPage" }
      #{h_content {class: "pgContent"}}
        #{ hForm "labelForm", {obj_type: "label"} }
          %div{ data-role="fieldcontain" }
            #{h_input "hidden", "card_set_id"}
            #{h_input "hidden", "id"}
            #{h_input "text", "name", {placeholder: "Label Name"} }

    """

h_filterPgTmpl = ->
  hamlHtml """
    #{h_page "filterPage", PG_DEFAULTS}
      #{h_pageHeader "Filters"}
        #{ h_backButton "Back","#studyPage", {callfn: 'filterChg'} }
      #{h_content {class: "pgContent"}}
        #{yesnoChoiceTmpl "Show Back First", "backFirst" }
        #{yesnoChoiceTmpl "Show Archived", "filterArchived"}
        #{h_controlgroup "Labels",{id: "filterLabels"} }
    """

h_cardPgTmpl = ->
  #do we need fieldcontains() on form fields?
  #h_choice isRadio, choice.label, fieldName, choice.id, choice.options, choice.checked
  pg = """
  #{h_page "cardPage", PG_DEFAULTS}
    #{h_pageHeader "Card"}
      #{ h_backButton "Cancel","#setPage" }
      #{ h_saveButton( 'cardForm', 'card', "#setPage") }
    #{h_content {class: "pgContent"}}
      #{hForm "cardForm", {obj_type: "card"} }
        #{h_input "hidden", "card_set_id"}
        #{h_input "hidden", "id"}
        #{h_input "hidden", "front"}
        #{h_input "hidden", "back"}
        %br
        #{h_ul {id: "cardSides", "data-inset": true} }
          %li #{h_link "enter front text (Chinese)", "#textInputPage", {id: 'frontTALink', init_pg: 'cardSide', saveCB: 'saveCardFront'} }
          %li #{h_link "enter back text (English)", "#textInputPage", {id: 'backTALink', init_pg: 'cardSide', saveCB: 'saveCardBack', side: 'back'} }
        %br
        #{yesnoChoiceTmpl "Archived", "archived" , false}
        #{h_controlgroup "Labels",{id: "cardFormLabels", "data-theme": "d"} }
  """
  #{h_choiceGroup false, "Labels", "labels", choices }
  #log "haml cardForm"
  #log pg
  #log "html cardForm"
  #log hamlHtml(pg)
  hamlHtml pg

studyStatsTmpl = (stats, full=true) ->
  hamlHtml """
  #studyStatsMsg
    %span.stat.label #{stats.leftInRun}
    &nbsp;of&nbsp;
    %span.stat.label #{stats.runCount}
    &nbsp;left&nbsp;&nbsp;
    #{if full then triesTmpl(stats) else ""}
  """

triesTmpl = (stats) ->
  hamlHtml """
    Correct 1 try:
    %span.stat.label #{stats.tries[0]}
    &nbsp;2:
    %span.stat.label #{stats.tries[1]}
    &nbsp;more:
    %span.stat.label #{stats.tries[2]}
  """

#  study: {head: { leftBtns: , rightBtns: link("Filter", pageSel("filter"), {"data-transition": "pop"}) }},
h_studyPgTmpl = ->
  hamlHtml """
    #{h_page "studyPage", PG_DEFAULTS}
      #{h_pageHeader "Study"}
        #{ h_backButton "Cards","#setPage" }
        #{ h_rightButton "Filter", "#filterPage", {"data-transition": "pop"} }
      #{h_content {class: "pgContent"}}
        #studyStatsFront
        #studyPanel
          .cardPanel.front
             #front.card_face
               .textPanel
                  Please wait...
  """


h_answerPgTmpl = ->
  hamlHtml """
    #{h_page "answerPage", PG_DEFAULTS}
      #{h_pageHeader "Answer"}
        #{ h_backButton "Cards","#setPage" }
        #{ h_rightButton "Restart", "#studyPage", {"data-transition": "pop", stRestart: 'true'} }
        #{h_navbar() }
          %ul#studyButtons.back
            %li #{ h_link "Correct", "#", {id: 'correct', "data-transition": 'pop', class: 'result'} }
            %li #{ h_link "Wrong", "#", {id: 'wrong', "data-transition": 'pop', class: 'result'} }
      #{h_content {class: "pgContent"}}
        #studyStats
        #studyPanel
          .cardPanel
             #front.card_face
               .textPanel
                  Please wait...
    """

h_labelGroup = (name, options, labels) ->

h_textInputPgTmpl = (id, taOptions={}) ->
  taOptions["data-theme"] = "d"
  taOptions["class"] = "#{taOptions["class"] || ""} tInput"
  _.extend taOptions, {name: "tInput", placeholder: "Enter card text"}
  taOptions["id"] ?= id
  log "tInputOpts", taOptions
  hamlHtml """
    #{h_page "textInputPage", PG_DEFAULTS}
      #{h_pageHeader "Card"}
        #{ h_backButton "Back","#cardPage", {id: SAVE_TEXT_LINK } }
      #{h_content {class: "pgContent"}}
        #{ hTag "textarea", null, taOptions }
  """

setLiTmpl = (set) ->
  hamlHtml """
    %li.set #{h_link set.name, "#setPage", {class: 'set', obj_id: set.id, init_pg: 'set'} }
  """

editSetLiTmpl = (set) ->
  hamlHtml """
    %li.set{obj_id='#{set.id}'} #{delImg()} #{set.name}
  """

#can't haml b/c of html in front and back fields
cardLiTmpl = (card) ->
  archClass = if toStr(card.archived)=='true' then 'archived' else ''
  """
    <li class='card #{archClass}' >
      <div class='overlay'>ARCHIVED</div>
      <a class='card' obj_id='#{card.id}' href='#cardPage'  init_pg='card' >
        <span class='front'> #{card.front}</span><br/>
        #{card.back}
      </a>
    </li>
  """

editCardLiTmpl = (card) ->
  hamlHtml """
    <li class='card' obj_id='#{card.id}' >
      #{delImg()}
      <span class='front'> #{card.front}</span><br/>
      #{card.back}"
    </li>
  """

labelLiTmpl = (label, icon="") ->
  hamlHtml """
    %li #{icon} #{h_link label.name, '#labelPage', {obj_id: label.id,  init_pg: 'label'} }
  """

editLabelLiTmpl = (label) ->
  hamlHtml """
    %li{class: 'card', obj_id: '#{label.id}'}
      #{delImg()}
      #{label.name}
  """

delImg = ->  "%img.del.del_icon.ui-li-icon{src: '#{img 'delete.png'}' }"

cardBackTmpl = (back, front) ->
  """
  \n
  <div class='backText'>#{back}</div>
  #{front}\n\n
  """
###
cardBackTmpl = (back, front) ->
  hamlHtml  """
            %br
            .backText
              #{back}
            #{front}
            %br
            %br
            """
###

###
h_setPgTmpl = (set) ->
  lButton = backButton("Sets", "#setsPage")
  rButton = editBtns(EDIT_CARD_BTN, "cardList")
  navbar = hamlHtml """
    %ul
      %li #{h_link "Study!", "#studyPage", {id: 'studyButton', init_pg: 'study', class: 'study'} }
      %li #{h_link "Add Card","#cardPage", {init_pg: "card", obj_type: CARD_TYPE} }
      %li #{h_link "Labels","#labelsPage", {init_pg: "labels"}  }
  """
  header = headerTmpl("Set", lButton, rButton, navbar)
  content = hamlHtml  """
      #{h_content {class: "pgContent"}}
        #cardsShowing
          %a#prevCards.cardList{href: "#", } Prev
          %span#cardsShowingMsg
          %a#nextCards.cardList{href: "#", } Next
        %br
        #{ h_ul {id: "cardList", obj_type: 'card'} }
        #{ heditUL "editCardList", "card" }
      """
  pageTmpl "setPage", header, content
###


