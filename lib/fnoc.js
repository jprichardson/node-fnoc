var path = require('path')
  , fs = require('fs')
  , packpath = require('packpath')
  , batch = require('batchflow')
  , ms = require('ms');

if (fs.exists === undefined) { //node v0.6
  fs.exists = path.exists;
}

var DIRS = ['./', './config', './conf', './configs'];

function fetchConfigs (callback) {
  var jsonFiles = []
    , fnoc = {}
    , packageDir = packpath.parent()
    , errors = {};

  batch(DIRS).seq().each(function (i, dir, nextDir) {
    var newDir = path.join(packageDir, dir);
    fetchJsonFilesFromDir(newDir, function (err, files) {
      batch(files).seq().each(function (j, file, nextFile) {
        readJSONFile(file, function (err, obj) {
          if (err)
            errors[file] = err;
          else {
            var fileKey = path.basename(file, '.json');
            if (fnoc[fileKey])
              errors[file] = new Error("Another object has already been loaded with this file name. In other words, you have more than one file named: " + fileKey);
            else
              fnoc[fileKey] = obj;
          }
          nextFile();
        })
      })
      .end(nextDir);
    })
  })
  .end(function() {
    fnoc.env = env; //attach env method
    if (length(errors) === 0)
      callback(null, fnoc);
    else
      callback(errors, fnoc);
  })
}


//****************************
//     PRIVATE METHODS
//****************************

function env() { //this gets attached to fnoc object
  var currentEnv = process.env.NODE_ENV || 'development'
    , envObj = {};

  for (var fileName in this) {
    if (this.hasOwnProperty(fileName)) {
      envObj[fileName] = this[fileName];
      if (this[fileName][currentEnv]) {
        envObj[fileName] = this[fileName][currentEnv];
      }
    }
  }

  return envObj;
}

function fetchJsonFilesFromDir(dir, callback) {
  fs.exists(dir, function(itDoes) {
    if (itDoes)
      fs.readdir(dir, function (err, files) {
        filterJsonFilesOnly(dir, files, callback);
      });
    else
      callback(null, []); 
  });
}

function filterJsonFilesOnly(dir, files, callback) {
  files = files.map(function (file) {
    return path.join(dir, file);
  });

  batch(files).par().each(function(i, file, next) {
    if (path.extname(file) === '.json')
      fs.lstat(file, function (err, stats) {
        if (stats.isFile())
          next(file);
      })
    else
      next(); //is a directory or does not have .json extension
  })
  .error(callback)
  .end(function(results){ 
    callback(null, results);
  });
}

function length(obj) {
  var keys = [];
  for (var k in obj) {
    if (obj.hasOwnProperty(k)) {
      keys.push(k);
    }
  }

  return keys.length;
}

function readJSONFile(file, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
    var obj = {}
    if (err)
      callback(err, null);
    else
      try {
        obj = JSON.parse(data, function(key, val) {
          if (key === '')
            return val;
          else {
            if (typeof val === 'string') {
              var ret = ms(val);
              if (ret === undefined)
                return val;
              else
                return ret;
            } else {
              return val;
            }
          }
        })
        callback(null, obj);
      } catch (e) {
        callback(e, null);
      } 
  })
}

module.exports = fetchConfigs;

