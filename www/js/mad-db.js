var Table, testBulkAdd, toStr;
var __slice = Array.prototype.slice;
Table = (function() {
  Table.idSeed = function() {
    return "" + ((new Date()).getTime());
  };
  Table.idString = function(seed, count) {
    if (count == null) {
      count = "";
    }
    return "" + seed + count;
  };
  Table.prototype.lastSeed = Table.idSeed();
  Table.prototype.count = 0;
  Table.prototype.recs = new Array();
  Table.prototype.updateViews = function() {
    return null;
  };
  function Table(name) {
    this.name = name;
    this.recs = new Array();
  }
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
      this.saveTable();
    }
    return rec;
  };
  Table.prototype.bulkAdd = function(addRecs, empty) {
    var count, rec, seed, _i, _len;
    if (empty == null) {
      empty = false;
    }
    if (empty) {
      this.recs = new Array;
    }
    seed = Table.idSeed();
    count = 0;
    for (_i = 0, _len = addRecs.length; _i < _len; _i++) {
      rec = addRecs[_i];
      count++;
      if (!rec.id) {
        rec.id = Table.idString(seed, count);
      }
      this.add(rec, false);
    }
    this.lastSeed = seed;
    return this.saveTable();
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
      this.saveTable();
    }
    return rec;
  };
  Table.prototype.updateAttrs = function(newRec, save, originalPos) {
    var original;
    if (save == null) {
      save = true;
    }
    if (originalPos == null) {
      originalPos = false;
    }
    original = findById(newRec.idProp);
    if (!original) {
      return;
    }
    _.extend(original, newRec);
    replace(original, save, originalPos);
    if (save != null) {
      this.saveTable();
    }
    return original;
  };
  Table.prototype["delete"] = function(id, save) {
    var deleted, index;
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
    deleted = this.recs[index];
    this.recs.splice(index, 1);
    this.updateViews();
    if (save != null) {
      this.saveTable();
    }
    return deleted;
  };
  Table.prototype.deleteAll = function(prop, val) {
    if (typeof save !== "undefined" && save !== null) {
      return this.saveTable();
    }
  };
  Table.prototype.nuke = function(save) {
    if (save == null) {
      save = true;
    }
    this.recs = new Array();
    if (save != null) {
      return this.saveTable();
    }
  };
  Table.prototype.saveTable = function() {
    return cacheObj(this.tableName(), this);
  };
  Table.prototype.sync = function(syncField, data) {};
  Table.prototype.tableName = function() {
    return "_mm_tbl_" + this.name;
  };
  Table.prototype.generateId = function() {
    var id, newSeed;
    newSeed = Table.idSeed();
    if (newSeed = this.lastSeed) {
      this.count++;
      id = Table.idString(newSeed, this.count);
    } else {
      this.lastSeed = newSeed;
      this.count = 0;
      id = this.Table.dString(newSeed);
    }
    return id;
  };
  return Table;
})();
toStr = function(val) {
  return "" + val;
};
testBulkAdd = function(count) {
  var obj, objs, table, _i, _len, _results;
  if (count == null) {
    count = 5;
  }
  table = new Table("mad");
  log("tableId", Table.idString(5, 6));
  objs = [
    {
      name: "o1"
    }, {
      name: "o2"
    }
  ];
  table.bulkAdd(objs);
  objs = table.all();
  _results = [];
  for (_i = 0, _len = objs.length; _i < _len; _i++) {
    obj = objs[_i];
    _results.push(log("batest obj", obj));
  }
  return _results;
};