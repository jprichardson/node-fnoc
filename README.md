

Node.js - fnoc
=====================

`fnoc` is `conf` backwards. This module automatically loads JSON configuration files. It first finds your `package.json` file and considers that the root directory of the package, the `packageDir`. This enables you to have multiple modules that also use `fnoc`. It then looks for any JSON files in the `packageDir` and in `#{packageDir}/conf`, `#{packageDir}/config`, `#{packageDir}/configs`.



Why?
----

Because loading JSON writing logic to read JSON configuration files over and over is annoying. Also, I wanted a module that could load JSON config files relative to the module path and not the current directory.



Installation
------------

    npm install fnoc



Example
-------

Let's assume that you have a database configuration file named `database.json` in your `./config` directory and it looks like this:

```javascript
{
    "host": "localhost",
    "port": 27017
}
```

Require the `fnoc` function:

```javascript
var fnoc = require('fnoc');


fnoc(function(err, configs) {
  console.log(configs.database.host); //localhost
  console.log(configs.database.port); //27017

  //automatically loads package.json
  console.log(configs.package.name); //YOUR PACKAGE NAME
})
```

It will not load nor crash if a JSON file can't be parsed. Instead, the `err` variable in the callback is `null` if no errors exist or it's an object with the file name as key and the `Error` object as the value.

So, let's say you have the file: `/tmp/malformed.json`

**malformed.json**:

```json
{
    this is NOT valid JSON
}
```

Load `malformed.json`:

```javascript
var fnoc = require('fnoc');

fnoc(function(err, configs) {
  console.log(err['/tmp/malformed.json']) //string representation of the error
})
```


Now Let's assume that your database configuration file looks like this:

```javascript
{
    "development": {
        "name": "myapp_development",
        "host": "127.0.0.1",
        "port": 27017
    },
    "test": {
        "name": "myapp_test",
        "host": "127.0.0.1",
        "port": 27017
    },
    "production": {
        "name": "myapp_production",
        "host": "myserver.com",
        "port": 27017
    }
}
```

Now if you call the `env()` method:

```javascript
var fnoc = require('fnoc');

fnoc(function(err, configs) {
  var envConfigs = configs.env();
  console.log(envConfigs.database.name); //output depending upon NODE_ENV   
});

```


Test Environment:

    NODE_ENV=test node myapp.js

yields...

```javascript
console.log(configs.database.name); //myapp_test
```



Author
------

`node-batchflow` was written by [JP Richardson][aboutjp]. You should follow him on Twitter [@jprichardson][twitter]. Also read his coding blog [Procbits][procbits]. If you write software with others, you should checkout [Gitpilot][gitpilot] to make collaboration with Git simple.



License
-------

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012 JP Richardson


[aboutjp]: http://about.me/jprichardson
[twitter]: http://twitter.com/jprichardson
[procbits]: http://procbits.com
[gitpilot]: http://gitpilot.com



