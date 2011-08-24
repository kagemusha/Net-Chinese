var Table, toStr;
var __slice = Array.prototype.slice;
Table = (function() {
  Table.get = function(name) {
    var table, tableProps;
    table = new Table(name);
    tableProps = retrieveObj(table.tableName());
    if (tableProps != null) {
      table.recs = tableProps.recs;
      table.counter = tableProps.counter;
    }
    return table;
  };
  Table.prototype.lastSeed = "" + ((new Date()).getTime());
  Table.prototype.count = 0;
  Table.prototype.recs = new Array();
  Table.prototype.updateViews = function() {
    return null;
  };
  function Table(name) {
    this.name = name;
    this.recs = new Array();
  }
  Table.prototype.bulkAdd = function(addRecs, empty) {
    var count, idSeed, rec, _i, _len;
    if (empty == null) {
      empty = false;
    }
    if (empty) {
      this.recs = new Array;
    }
    idSeed = (new Date()).getTime();
    count = 0;
    for (_i = 0, _len = addRecs.length; _i < _len; _i++) {
      rec = addRecs[_i];
      if (!rec.id) {
        rec.id = "" + idSeed + (count++);
      }
      this.add(rec, false);
    }
    return this.saveTable();
  };
  Table.prototype.findAll = function() {
    var options, prop, val;
    prop = arguments[0], val = arguments[1], options = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    return _.select(this.recs, function(rec) {
      return toStr(rec[prop]) === toStr(val);
    });
  };
  Table.prototype.findById = function(id) {
    return this.findFirst("id", id);
  };
  Table.prototype.findFirst = function() {
    var options, prop, val;
    prop = arguments[0], val = arguments[1], options = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
    return _.detect(this.recs, function(rec) {
      return toStr(rec[prop]) === toStr(val);
    });
  };
  Table.prototype.all = function() {
    return this.recs;
  };
  Table.prototype.add = function(rec, save) {
    if (save == null) {
      save = true;
    }
    if (!rec) {
      return;
    }
    rec.created_at = rec.updated_at = (new Date()).getTime();
    if (!rec.id) {
      rec.id = this.generateId();
    }
    this.recs.unshift(rec);
    this.updateViews();
    if (save != null) {
      return this.saveTable();
    }
  };
  Table.prototype.replace = function(rec, save, originalPos) {
    if (save == null) {
      save = true;
    }
    if (originalPos == null) {
      originalPos = false;
    }
    rec.updated_at = (new Date()).getTime();
    if (originalPos) {} else {
      this["delete"](rec.id, false);
      this.recs.unshift(rec);
    }
    this.updateViews();
    if (save != null) {
      return this.saveTable();
    }
  };
  Table.prototype.updateAttrs = function(newRec, save) {
    var original;
    if (save == null) {
      save = true;
    }
    original = findById(rec.idProp);
    if (!original) {
      return;
    }
    $.extend(original, newRec);
    rec.updated_at = (new Date()).getTime();
    if (save != null) {
      return this.saveTable();
    }
  };
  Table.prototype["delete"] = function(id, save) {
    var index;
    if (save == null) {
      save = true;
    }
    index = -1;
    _.each(this.recs, function(rec, i) {
      if (toStr(rec.id) === toStr(id)) {
        index = i;
        return i;
      }
    });
    if (index < 0) {
      return;
    }
    this.recs.splice(index, 1);
    this.updateViews();
    if (save != null) {
      return this.saveTable();
    }
  };
  Table.prototype.deleteAll = function(prop, val) {
    if (typeof save !== "undefined" && save !== null) {
      return this.saveTable();
    }
  };
  Table.prototype.nuke = function() {
    return this.recs = new Array();
  };
  Table.prototype.saveTable = function() {
    return cacheObj(this.tableName(), this);
  };
  Table.prototype.sync = function(syncField, data) {};
  Table.prototype.tableName = function() {
    return "_mm_tbl_" + this.name;
  };
  Table.prototype.generateId = function() {
    var id;
    id = "" + ((new Date()).getTime());
    if (id === this.lastSeed) {
      id = "" + id + (this.count++);
    } else {
      this.lastSeed = id;
      this.count = 0;
    }
    return id;
  };
  return Table;
})();
toStr = function(val) {
  return "" + val;
};