testutil = require('testutil')
path = require('path-extra')
fm = require('faux-module') #in test dir

OWD = process.cwd()

describe 'fnoc', ->
  describe '+ configs()', ->
    it 'should load all of the valid config files', ->
      configs = fm.getConfigs()
      T configs.package?
      T configs.database?
      T configs.shopping?
      F configs.malformed?

      T configs.shopping.server is 'localhost'
      T configs.package.name is 'faux-module'
      T configs.database.production.name is 'myapp_production'

  
    it 'should load all of the valid config files from a different directory', ->
      process.chdir(path.tempdir())
      configs = fm.getConfigs()
      T configs.package?
      T configs.database?
      T configs.shopping?
      F configs.malformed?

      T configs.shopping.server is 'localhost'
      T configs.package.name is 'faux-module'
      T configs.database.production.name is 'myapp_production'

  describe '+ env()', ->
    it 'should load the environment specific valid config files', ->
      process.chdir(OWD)
      T process.env.NODE_ENV is 'test'
      configs = fm.getEnv()

      T configs.shopping.server is 'localhost'
      T configs.package.name is 'faux-module'
      T configs.database.name is 'myapp_test'
  
