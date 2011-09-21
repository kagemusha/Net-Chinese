
hamlHtml = (haml) ->
  Haml(correctIndents(haml))()

#convenience method which generates haml
#e.g. haTag("a", {href: "#editPage", class: "notEditing"}, "Edit")
# => %a{href: "#editPage", class: "notEditing"} Edit
haTag = (tag, options={}, content="") ->
  "%#{tag}#{hamlOptionStr options} #{content}"


MULTI_START = "~multhaml"
MULTI_END = "~endmulthaml"

#needed for functions which return multiple lines of Haml
#e.g.
multilineHaml = (haml) ->
  """
  #{MULTI_START}
  #{haml}
  #{MULTI_END}
  """

correctIndents = (haml) ->
  lines = haml.split("\n")
  spacingArray = new Array()
  spaced = new Array()

  for line in lines
    multiSpaces = line.search(MULTI_START)
    if multiSpaces > -1
      spacingArray.push line.substring(0, multiSpaces)
    else if line.search(MULTI_END) > -1
      spacingArray.pop()
    else
      spaces =  spacingArray.join("")
      line = "#{spaces}#{line}"
      spaced.push line
  spaced.join("\n")

#takes javascript obj andgenerats option string
# properly formatted for haml.js
hamlOptionStr = (options, brackets=true) ->
  return "" if !options
  return options if typeof(options)=='string'
  opts = for key, val of options
      "#{key}: '#{val}'"
  if brackets then "{ #{opts.join ", "} }" else opts.join(", ")

