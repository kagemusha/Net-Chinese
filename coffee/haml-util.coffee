MULTI_START = "~multhaml"
MULTI_END = "~endmulthaml"



hId = (id) ->
  return "" if (!id or id.length == 0)
  if id[0] == "#" then id else "##{id}"


hTag = (tag, id, options={}, content="") ->
  "%#{tag}#{hId id}#{hamlOptionStr options} #{content}"

hamlHtml = (haml) ->
  hfunc = Haml spacedHaml(haml)
  #hfunc = Haml(haml)
  hfunc()

spacedHaml = (haml) ->
  lines = haml.split("\n")
  spacingArray = new Array()
  spaced = new Array()

  for line in lines
    multiSpaces = line.search(MULTI_START)
    if multiSpaces > -1
      #log "start multi", multiSpaces
      spacingArray.push line.substring(0, multiSpaces)
    else if line.search(MULTI_END) > -1
      spacingArray.pop()
      #log "end multi", spacingArray.join("").length
    else
      spaces =  spacingArray.join("")
      line = "#{spaces}#{line}"
      spaced.push line
  sp = spaced.join("\n")
  sp

hamlOptionStr = (options, brackets=true) ->
  return "" if !options
  return options if typeof(options)=='string'
  opts = for key, val of options
      "#{key}: '#{val}'"
  if brackets then "{ #{opts.join ", "} }" else opts.join(", ")

multilineHaml = (haml) ->
  """
  #{MULTI_START}
  #{haml}
  #{MULTI_END}
  """
