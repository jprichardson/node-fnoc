var testutil = require('testutil')
  , path = require('path-extra')
  , fm = require('./node_modules/faux-module');

OWD = process.cwd();

describe('fnoc', function() {
  describe('+ fnoc()', function() {
    it('should load all of the valid config files', function  (done) {
      fm.getConfigs(function (err, configs) {
        var malformedJsonPath = path.resolve('test/node_modules/faux-module/config/malformed.json')
        T (err)
        T (err[malformedJsonPath]) //error on parsing file
        
        T (configs.package)
        T (configs.shopping)
        T (configs.database)
        F (configs.malformed)

        T (configs.shopping.server === 'localhost')
        T (configs.package.name === 'faux-module')
        T (configs.database.production.name === 'myapp_production')

        done();
      })
    })

    it('should load all of the valid config files from a different directory', function (done) {
      var malformedJsonPath = path.resolve('test/node_modules/faux-module/config/malformed.json')
      process.chdir(path.tempdir());
      fm.getConfigs(function (err, configs) {
        T (err)
        T (err[malformedJsonPath]) //error on parsing file
        
        T (configs.package)
        T (configs.shopping)
        T (configs.database)
        F (configs.malformed)

        T (configs.shopping.server === 'localhost')
        T (configs.package.name === 'faux-module')
        T (configs.database.production.name === 'myapp_production')
        process.chdir(OWD);

        done();
      })
    })

    it('should load the environment specific valid config files', function (done) {
      T (process.env.NODE_ENV === 'test')
      fm.getConfigs(function (err, configs) {
        T (err)

        var envConfigs = configs.env();
        T (envConfigs.shopping.server === 'localhost')
        T (envConfigs.package.name === 'faux-module')
        T (envConfigs.database.name === 'myapp_test')
      
        done();
      })
    })


  })
})