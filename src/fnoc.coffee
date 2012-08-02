path = require('path')
fs = require('fs-extra')
packpath = require('packpath')

configs = ->
  dirs = ['./', './config', './conf', "./configs"]
  jsonFiles = []
  fnoc = {}
  packageDir = packpath.parent()

  for dir in dirs
    newDir = path.join(packageDir, dir)

    if fs.existsSync(newDir)
      paths = fs.readdirSync newDir
      for p in paths
        if p is 'env.json'
          console.log "Can't have config file named 'env.json'"
        else
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
            fnoc[key] = jsonObj
  
  fnoc.env = ->
    #if global.__fnocEnv?
    #  return global.__fnocEnv
    #else
      if process.env.NODE_ENV? and typeof process.env.NODE_ENV is 'string' and process.env.NODE_ENV.length > 0
        currentEnv = process.env.NODE_ENV
      else
        currentEnv = 'development'
      
      env = {}
      for packageName,obj of fnoc
        if fnoc.hasOwnProperty(packageName)
          #console.log packageName + ":\n" + JSON.stringify(obj, null, 4)
          env[packageName] = obj
          if obj? and obj[currentEnv]?
            env[packageName] = obj[currentEnv]
      return env

  fnoc
       
module.exports.configs = configs