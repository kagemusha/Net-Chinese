$(document).bind "mobileinit", ->

  #apply overrides here
  $.extend  $.mobile,
      #ajaxEnabled: false,   #for jqm b1
      #loadingMessage: "Syncing..."
      #touchOverflowEnabled: true

  # Navigation
  #$.mobile.page.prototype.options.backBtnText = "Go back"
  #$.mobile.page.prototype.options.addBackBtn      = true
  #$.mobile.page.prototype.options.backBtnTheme    = "d"

  #a: black, b: blue, c: grey, d: white, e: yellow
  # Page
  $.mobile.page.prototype.options.headerTheme = "a"
  $.mobile.page.prototype.options.contentTheme  = "e"
  #$.mobile.page.prototype.options.footerTheme = "a"

  # Listviews
  $.mobile.listview.prototype.options.headerTheme = "a"  # Header for nested lists
  $.mobile.listview.prototype.options.theme           = "d"  # List items / content
  #$.mobile.listview.prototype.options.dividerTheme    = "d"  # List divider
  #$.mobile.listview.prototype.options.splitTheme   = "c"
  #$.mobile.listview.prototype.options.countTheme   = "c"
  #$.mobile.listview.prototype.options.filterTheme = "c"
  #$.mobile.listview.prototype.options.filterPlaceholder = "Filter data..."
  #slider
  #
  $.mobile.checkboxradio.prototype.options.theme           = "d"  # List items / content
  $.mobile.button.prototype.options.theme           = "d"  # List items / content
