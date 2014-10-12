[![Build Status](https://travis-ci.org/tagged/client-storage.png)](https://travis-ci.org/tagged/client-storage)
[![Dependency Status](https://gemnasium.com/tagged/client-storage.png)](https://gemnasium.com/tagged/client-storage)
[![Coverage Status](https://coveralls.io/repos/tagged/client-storage/badge.png)](https://coveralls.io/r/tagged/client-storage)

# Client Storage for Angular JS

Namespaced client storage for Angular JS. Writes to localStorage, with cookie fallback.
No external dependencies other than Angular core; does not depend on `ngCookies`.

## Getting Started

To get started, add `taggedClientStorage-min.js` to your webpage:

```html
<script type="text/javascript" src="path/to/taggedClientStorage-min.js"></script>
```

And add the module `tagged.services.client-storage` to your app's dependencies:

```js
var app = angular.module('MyApp', ['tagged.services.client-storage']);
```

Then inject the `taggedClientStorage` factory into your app.

```js
app.controller('MyController', function($scope, taggedClientStorage) {
    var myStorage = taggedClientStorage('my_namespace');
    myStorage.set('foo', 'bar'); // stores `foo` with value `"bar"` under namespace `my_namespace`
    myStorage.get('foo'); // returns `"bar"`
    // Types are maintained
    myStorage.set('count', 123); // store an `int`
    myStorage.get('count') === 123; // get back an `int`
});
```

### Requirements

* AngularJS 1.2.x (Tested with 1.2.21)
* RequireJS (Optional)

### Using RequireJS

This service can be loaded as an AMD module if you're using RequireJS. There are a few requirements:

1. You must add paths to `angular` in your RequireJS config.
2. You must shim `angular` to export `angular`.

At minimum, your requirejs config must include this:

```js
requirejs.config({
    paths: {
        'angular': 'path/to/angular'
    },
    shim: {
        'angular': {
            'exports': 'angular'
        }
    }
});
```

Once configured, you can `require()` the original source file `src/taggedClientStorage` in your app:

```js
define(['angular', 'path/to/src/taggedClientStorage'], function(angular) {
    var app = angular.module('MyApp', ['tagged.services.clientStorage']);
  
    /* ... */
});
```

## Development

**Requirements**
* nodejs 1.10.x
* npm 1.2.32

To set up the development environment, run these commands once:

```bash
# Global dependencies
$ npm install --global grunt-cli bower

# Local node dependencies (Karma, etc.)
$ npm install

# 3rd-party libraries (Angular, etc.)
$ bower install
```

**Running Tests**
Once the development environment has been set up, tests can be run in a number of ways:

```bash
# Run all tests once
$ grunt test

# Run tests in development mode (enables file watcher to automatically rerun tests)
$ grunt dev
```

**Building Production Files**

```bash
# Build production files in `./`
$ grunt build
```

## Contributing
Contributions welcome! All we ask is that pull requests include unit tests. Thanks!

Copyright 2014 Tagged, Inc.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tagged/client-storage/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

