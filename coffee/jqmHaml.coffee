hamlHtml = (haml) ->
  hfunc = Haml(haml)
  hfunc()


hamlOptStr = (options) ->
  return "" if !options
  return options if typeof(options)=='string'
  opts = for key, val of options
      "#{key}: '#{val}'"
  "{ #{opts.join ", "} }"

hUL = (id, options={}) ->
  dataTheme = options.dataTheme || DEFAULT_STYLE
  options["data-role"] = "listview"
  options["data-theme"] = "d"
  "%ul##{id}#{hamlOptStr options}"

hLink = (label="<blank>", href="#", options, reverse=false) ->
  revStr = if reverse then linkReverseAttr(url) else ""
  "%a href='#{href}' #{hamlOptStr options} #{revStr} >#{label}</a>"
