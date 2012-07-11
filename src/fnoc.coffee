path = require('path')
fs = require('fs-extra')

if global.__fnoc? #if config files already been loaded once, don't load again... this might be uncessary
  module.exports = global.__fnoc
else
  dirs = ['./', './config', './conf']
  jsonFiles = []
  global.__fnoc = {}

  for dir in dirs
    newDir = path.join(process.cwd(), dir)

    if fs.existsSync(dir)
      paths = fs.readdirSync newDir
      for p in paths
        p = path.join(newDir, p)
        stat = fs.lstatSync(p)
        if path.extname(p) is '.json' and stat.isFile()
          jsonObj = null
          try
            jsonObj = JSON.parse(fs.readFileSync(p))
          catch error
            console.log error
            console.log "fnoc: JSON parse error on file #{p}"
          key = path.basename(p, '.json')
          global.__fnoc[key] = jsonObj

  module.exports = global.__fnoc
       
