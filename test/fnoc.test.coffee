testutil = require('testutil')

describe 'require(fnoc)', ->
  it 'should load all of the valid config files', (done) ->
    configs = require('../lib/fnoc')
    T configs.package?
    T configs.database?
    F configs.malformed?

    T configs.database.server is 'localhost'
    T configs.package.name is 'fnoc'

    done()
