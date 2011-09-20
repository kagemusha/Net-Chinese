var answerPgHeadTmpl, answerPgTmpl, cardPgTmpl, filterPgTmpl, labelPgTmpl, labelsPgTmpl, setPgTmpl, setsPgTmpl, studyPgTmpl;
labelPgTmpl = function() {
  return hamlHtml("" + (hForm("labelForm", {
    obj_type: "label"
  })) + "\n  %div{ data-role=\"fieldcontain\" }\n    " + (h_input("hidden", "card_set_id")) + "\n    " + (h_input("hidden", "id")) + "\n    " + (h_input("text", "name", {
    placeholder: "Label Name"
  })));
};
filterPgTmpl = function() {
  return hamlHtml("#backFirstOption\n#archivedFilter\n#filtersForm");
};
cardPgTmpl = function() {
  return hamlHtml("" + (hForm("cardForm", {
    obj_type: "card"
  })) + "\n  " + (h_input("hidden", "card_set_id")) + "\n  " + (h_input("hidden", "id")) + "\n  " + (h_input("hidden", "front")) + "\n  " + (h_input("hidden", "back")) + "\n  %br\n  " + (h_ul("cardSides", {
    "data-inset": true
  })) + "\n    %li\n      " + (h_link("Front (Chinese)", "#textInputPage", {
    id: 'frontTALink',
    init_pg: 'cardSide',
    saveCB: 'saveCardFront'
  })) + "\n    %li\n      " + (h_link("Back (English)", "#textInputPage", {
    id: 'backTALink',
    init_pg: 'cardSide',
    saveCB: 'saveCardBack',
    side: 'back'
  })) + "\n\n  #cardLabels");
};
/*
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
    <div id="cardArchiveLabels">#{hamlHtml yesnoChoiceTmpl("archivedRB", "Archive", "archived")}</div>
    <div id="cardLabels"></div>

  </form>
  """
*/
studyPgTmpl = function() {
  return "<div id=\"studyStatsFront\"></div>\n<div id=\"studyPanel\">\n  <div class=\"cardPanel front\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};
/*
answerPgHeadTmpl = ->
  btns = [li(button "Correct", "#", "id='correct' data-transition='pop' class='result'"),
          li(button "Wrong", "#", "id='wrong' data-transition='pop' class='result'")]
  ul "studyButtons", btns,  {class: 'back'}
*/
answerPgHeadTmpl = function() {
  return "<ul id=\"studyButtons\" class=\"back\">\n  " + (li(button("Correct", "#", "id='correct' data-transition='pop' class='result'"))) + "\n  " + (li(button("Wrong", "#", "id='wrong' data-transition='pop' class='result'"))) + "\n</ul>";
};
answerPgTmpl = function() {
  return "<div id=\"studyStats\"></div>\n<div id=\"studyPanel\">\n  <div class=\"cardPanel\">\n     <div id=\"front\" class=\"card_face\">\n         <div class=\"textPanel\">\n          Please wait...\n         </div>\n     </div>\n  </div>\n</div>";
};
/*
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


*/
labelsPgTmpl = function() {
  return hamlHtml("" + (h_button("Add Label", "#labelPage", {
    id: 'addLabelButton',
    init_pg: 'label'
  })) + "\n" + (h_ul("labelList", {
    "data-inset": 'true'
  })) + "\n" + (heditUL("editLabelList", "label", {
    "data-inset": true
  })));
};
setsPgTmpl = function() {
  return hamlHtml("" + (h_ul("setList", {
    obj_type: 'card_set'
  })) + "\n" + (heditUL("editSetList", "set")));
};
setPgTmpl = function(set) {
  return hamlHtml("#cardsShowing\n  %a#prevCards.cardList{href: \"#\", } Prev\n  %span#cardsShowingMsg\n  %a#nextCards.cardList{href: \"#\", } Next\n%br\n" + (h_ul("cardList", {
    obj_type: 'card'
  })) + "\n" + (heditUL("editCardList", "card")));
};
/*
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
*/
/*
formCB = (formId, options) ->
    log "formCB", formId
    vOptions = {
        submitHandler: handleForm,
        onfocusout: false,
        errorClass: "field_error",
        errorPlacement: (error, element) ->
            #error.prepend("<br/>") works initially but not on back tabs
            error.insertAfter(element);
    }
    $.extend(vOptions, options)
    #log("validating form count", $(formId).length)
    $(formId).validate(vOptions)
    #log("after form validate")


handleForm = (form) ->
    formId = $(form).attr("id")
    type = $(form).attr "obj_type"
    #fields = objFields type
    obj = getObjFromForm(formId)
    log "objFromForm", obj

    table = TABLES[type]
    edit = obj.id? and obj.id.length > 0
    log("obj-id, edit", (if obj.id then obj.id else "null"), edit)
    showMsg "Saving..."
    if edit
        #log "edit", obj.id  #find and replace obj
        table.replace obj
    else
        table.add obj
    $('.ui-dialog').dialog('close')
    log "Saved"

makePage = (id, specs) ->
    specs.head={}   if !specs.head?
    specs.head.back = !specs.head.noback
    specs.foot={} if !specs.foot?
    specs.id = pageId(id)
    $('body').remove(specs.id)
    $('body').append(genElems(pageTmpl, specs))
    #addHeader(id, specs.head)
    if specs.head.buttons #this are buttons below title bar like "Right","Wrong"
        btnSel = "#{pageSel(id)} ul.headButtons"
        #log("btnsel", btnSel, $(btnSel).length)
        refreshTmpl btnSel, li, specs.head.buttons
    addFooter id, specs.foot
    refreshPage id, specs.content

refreshPage = (id, params) ->
    contentDiv = "#{pageSel(id)} .pgContent"
    refreshTmpl(contentDiv, pgTmplFn(id), params)



*/
/*
yesnoChoiceTmpl = (id, label, group, yesChecked) ->
  options = {id: id, align: "horizontal", label: label}
  noChecked = (yesChecked != null and !yesChecked)
  btns =  [
            {id: "yes", name: group, val: "true", label: "Yes", checked: yesChecked},
            {id: "no", name: group, val: "false", label: "No", checked: noChecked}
          ]
  choiceGroup true, group, options, btns
*/
/*
yesnoChoiceTmpl = (id, label, group, yesChecked) ->
  options = {"data-type": "horizontal", "data-theme": "d"}
  """
  #{h_controlgroup label, id, options}
    #{ h_checkbox "Yes", "yes", {"data-theme": "d", name: "labels", value: "yes"}, yesChecked }
    #{ h_checkbox "No", "no", {"data-theme": "d", name: "labels", value: "no"}, !yesChecked }
  """
*/
/*
cg = (isRadio, label, fieldName, choices=[], options )->
  btns = for choice in choices
    h_choice isRadio, choice.label, fieldName, choice.id, choice.options, choice.checked, choice.lbl_options, false
  btns = multilineHaml(btns.join("\n")) if (btns and btns.length > 0)
  multilineHaml """
  #{h_controlgroup label, options}
    #{btns || ""}
  """
*/
/*
h_checkboxGroup = (name, options, choices) -> h_choiceGroup false, name, options, choices

h_choiceGroup = (isRadio, label, fieldName, choices, options) ->
  if choices
    btns = for choice in choices
      h_choice isRadio, choice.label, fieldName, choice.id, choice.options, choice.checked
    btns = btns.join("\n")

  multilineHaml """
  #{h_controlgroup label, options}
    #{btns || ""}
  """
*/