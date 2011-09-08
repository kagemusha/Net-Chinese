saveButton = (form, objType, page="#", reverse=true, label="Save") ->
  link(label, page, "obj_type='#{objType}' saveform='#{form}' #{linkReverseAttr page}" )

