PG_DEFAULTS = {"data-theme": "e"}

setsPgTmpl = ->
  hamlHtml  """
    #{page "setsPage", PG_DEFAULTS}
      #{pageHeader "Sets"}
      #{content {class: "pgContent"}}
        #{listview {id:"setList", obj_type: 'card_set'} }
    """

setPgTmpl = (set) ->
  hamlHtml  """
    #{page "setPage", PG_DEFAULTS}
      #{pageHeader "Set", "fixed"}
        #{ backButton("Sets", "#setsPage") }
        #{ editBtns EDIT_CARD_BTN, "cardList" }
        #{navbar() }
          %ul
            %li #{link "Study!", "#studyPage", {id: 'studyButton', init_pg: 'study', class: 'study'} }
            %li #{link "Add Card","#cardPage", {init_pg: "card", obj_type: CARD_TYPE} }
            %li #{link "Labels","#labelsPage", {init_pg: "labels"}  }
      #{content {class: "pgContent"}}
        #cardsShowing
          %a#prevCards.cardList{href: "#", } Prev&nbsp;
          %span#cardsShowingMsg
          %a#nextCards.cardList{href: "#", } &nbsp;Next
        %br
        #{ listview {id: "cardList", obj_type: "card"} }
        #{ editUL "card", id: "editCardList" }
    """

labelsPgTmpl = ->
  hamlHtml """
    #{page "labelsPage", PG_DEFAULTS}
      #{pageHeader "Labels"}
        #{ backButton "Back", "#setPage" }
        #{ editBtns EDIT_LABEL_BTN, "labelList" }
      #{content {class: "pgContent"}}
        #{button "Add Label", "#labelPage", {id: 'addLabelButton', init_pg: 'label', "data-theme": "a"} }
        #{listview {id: "labelList", "data-inset": 'true'} }
        #{editUL "label", {id: "editLabelList", "data-inset": true}}
    """

labelPgTmpl = ->
  hamlHtml    """
    #{page "labelPage", PG_DEFAULTS}
      #{pageHeader "Label"}
        #{ backButton "Cancel", "#labelsPage" }
        #{ saveButton 'labelForm', 'label', "#labelsPage" }
      #{content {class: "pgContent"}}
        #{ form {id: "labelForm", obj_type: "label"} }
          #{ fieldcontain() }
            #{input "hidden", "card_set_id"}
            #{input "hidden", "id"}
            #{input "text", "name", {placeholder: "Label Name", "data-theme": "d"} }

    """

filterPgTmpl = ->
  hamlHtml """
    #{page "filterPage", PG_DEFAULTS}
      #{pageHeader "Filters"}
        #{ backButton "Back","#studyPage", {callfn: 'filterChg'} }
      #{content {class: "pgContent", }}
        #{yesnoChoiceTmpl "Show Back First", "backFirst" }
        #{yesnoChoiceTmpl "Show Archived", "filterArchived"}
        #{controlgroup "Labels",{id: "filterLabels"} }
    """

viewCardPgTmpl = ->
  pg = """
  #{page "viewCardPage", PG_DEFAULTS}
    #{pageHeader "Card"}
      #{ backButton "Back","#setPage" }
      #{ rightButton( 'cardForm', 'card', "#setPage") }
    #{content {class: "pgContent"}}
      #{form {id: "cardForm", obj_type: "card"} }
        #{input "hidden", "card_set_id"}
        #{input "hidden", "id"}
        #{input "hidden", "front"}
        #{input "hidden", "back"}
        %br
        #{listview {id: "cardSides", "data-inset": true} }
          %li #{link "enter front text (Chinese)", "#textInputPage", {id: 'frontTALink', init_pg: 'cardSide', saveCB: 'saveCardFront'} }
          %li #{link "enter back text (English)", "#textInputPage", {id: 'backTALink', init_pg: 'cardSide', saveCB: 'saveCardBack', side: 'back'} }
        %br
        #{yesnoChoiceTmpl "Archived", "archived" , false}
        #{controlgroup "Labels",{id: "cardFormLabels", "data-theme": "d"} }
  """
  hamlHtml pg


cardPgTmpl = ->
  pg = """
  #{page "cardPage", PG_DEFAULTS}
    #{pageHeader "Card"}
      #{ backButton "Cancel","#setPage" }
      #{ saveButton( 'cardForm', 'card', "#setPage") }
    #{content {class: "pgContent"}}
      #{form {id: "cardForm", obj_type: "card"} }
        #{input "hidden", "card_set_id"}
        #{input "hidden", "id"}
        #{input "hidden", "front"}
        #{input "hidden", "back"}
        %br
        #{listview {id: "cardSides", "data-inset": true} }
          %li #{link "enter front text (Chinese)", "#textInputPage", {id: 'frontTALink', init_pg: 'cardSide', saveCB: 'saveCardFront'} }
          %li #{link "enter back text (English)", "#textInputPage", {id: 'backTALink', init_pg: 'cardSide', saveCB: 'saveCardBack', side: 'back'} }
        %br
        #{yesnoChoiceTmpl "Archived", "archived" , false}
        #{controlgroup "Labels",{id: "cardFormLabels", "data-theme": "d"} }
  """
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

studyPgTmpl = ->
  hamlHtml """
    #{page "studyPage", PG_DEFAULTS }
      #{pageHeader "Study"}
        #{ backButton "Cards","#setPage" }
        #{ rightButton "Filter", "#filterPage", {"data-transition": "pop"} }
      #{content {class: "pgContent", "data-theme": "d"} }
        #studyStatsFront
        #studyPanel
          .cardPanel.front
             #front.card_face
               .textPanel
                  Please wait...
  """


answerPgTmpl = ->
  hamlHtml """
    #{page "answerPage", PG_DEFAULTS}
      #{pageHeader "Answer"}
        #{ backButton "Cards","#setPage" }
        #{ rightButton "Restart", "#studyPage", {"data-transition": "pop", stRestart: 'true'} }
        #{navbar() }
          %ul#studyButtons.back
            %li #{ link "Correct", "#", {id: 'correct', "data-transition": 'pop', class: 'result'} }
            %li #{ link "Wrong", "#", {id: 'wrong', "data-transition": 'pop', class: 'result'} }
      #{content {class: "pgContent", "data-theme": "d"}}
        #studyStats
        #studyPanel
          .cardPanel
             #front.card_face
               .textPanel
                  Please wait...
    """

labelGroup = (name, options, labels) ->

textInputPgTmpl = (id, taOptions={}) ->
  taOptions["data-theme"] = "d"
  taOptions["class"] = "#{taOptions["class"] || ""} tInput"
  _.extend taOptions, {name: "tInput", placeholder: "Enter card text"}
  taOptions["id"] ?= id
  log "tInputOpts", taOptions
  hamlHtml """
    #{page "textInputPage", PG_DEFAULTS}
      #{pageHeader "Card"}
        #{ backButton "Back","#cardPage", {id: SAVE_TEXT_LINK } }
      #{content {class: "pgContent"}}
        #{ haTag "textarea", taOptions }
  """

setLiTmpl = (set) ->
  hamlHtml """
    %li.set #{link set.name, "#setPage", {class: 'set', obj_id: set.id, init_pg: 'set'} }
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
    %li #{icon} #{link label.name, '#labelPage', {obj_id: label.id,  init_pg: 'label'} }
  """

editLabelLiTmpl = (label) ->
  hamlHtml """
    %li{class: 'card', obj_id: '#{label.id}'}
      #{delImg()}
      #{label.name}
  """


cardBackTmpl = (back, front) ->
  """
  \n
  <div class='backText'>#{back}</div>
  #{front}\n\n
  """

delBtnLink = ->
  hamlHtml link("Delete", "#", {class: 'aDeleteBtn ui-btn-up-r'})


delImg = ->  "%img.del.del_icon.ui-li-icon{src: '#{img 'delete.png'}' }"
img = (file) ->  "css/images/#{file}"
