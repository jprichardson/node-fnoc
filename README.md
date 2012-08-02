Node.js - fnoc
=====================

`fnoc` is `conf` backwards. This module automatically and synchronously loads JSON configuration files.

Your Node.js process must run in the root of your app as `fnoc` uses `process.cwd()` to determine what files to load. It loads all JSON files in the current directory and any that exist in `./conf` or `./config`. 



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

You can then include `fnoc` and it will automatically load this file. If `fnoc` is included in more than one module, it will not load the modules more than once.

```javascript
var configs = require('fnoc').configs();

console.log(configs.database.host); //localhost
console.log(configs.database.port); //27017

//automatically loads package.json
console.log(configs.package.name); //YOUR PACKAGE NAME
```

It will not load nor crash if a JSON file can't be parsed.


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
var configs = require('fnoc').configs().env()
console.log(configs.database.name); //output depending upon NODE_ENV
```

Test Environment:

    NODE_ENV=test node myapp.js

yields...

```javascript
console.log(configs.database.name); //myapp_test
```

You can still access regular JSON config files that do not have environment specific keys such as `package.json`. If the file has the environment key, it's chopped to only that configuration information.



Test
----

    npm test

or...

    mocha test



License
-------

Licensed under MIT. See `LICENSE` for more details.

Copyright (c) 2012 JP Richardson

