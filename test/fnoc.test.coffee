testutil = require('testutil')

describe 'require(fnoc)', ->
  it 'should load all of the valid config files', ->
    configs = require('../lib/fnoc')
    T configs.package?
    T configs.database?
    T configs.shopping?
    F configs.malformed?

    T configs.shopping.server is 'localhost'
    T configs.package.name is 'fnoc'
    T configs.database.production.name is 'myapp_production'


describe 'env()', ->
  it 'should load the environment specific valid config files', ->
    T process.env.NODE_ENV is 'test'
    configs = require('../lib/fnoc').env()

    T configs.shopping.server is 'localhost'
    T configs.package.name is 'fnoc'
    T configs.database.name is 'myapp_test'
