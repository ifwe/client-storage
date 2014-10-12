[![Build Status](https://travis-ci.org/tagged/autogrow.png)](https://travis-ci.org/tagged/autogrow)
[![Dependency Status](https://gemnasium.com/tagged/autogrow.png)](https://gemnasium.com/tagged/autogrow)
[![Coverage Status](https://coveralls.io/repos/tagged/autogrow/badge.png)](https://coveralls.io/r/tagged/autogrow)

# Autogrowing Textareas for AngularJS
The easiest way to make autogrowing textareas in AngularJS

[View the demo!](http://htmlpreview.github.io/?https://github.com/tagged/autogrow/blob/master/demo/index.html)

```js
var app = angular.module('MyApp', ['tagged.directives.autogrow']);
app.controller('MainController', ['$scope', function($scope) {
  // No special controller code needed
}]);
```
```html
<div ng-app="MyApp">
  <div ng-controller="MainController">
    <textarea ng-model="myModel" tagged-autogrow></textarea>
  </div>
</div>
```

## Getting Started

To get started, add `taggedAutogrow-min.js` to your webpage:
```html
<script type="text/javascript" src="path/to/taggedAutogrow-min.js"></script>
```

And add the module `tagged.directives.autogrow` to your app's dependencies:
```js
var app = angular.module('MyApp', ['tagged.directives.autogrow']);
```

Then simply add the `tagged-autogrow` attribute to any `textarea` that is wired
up with `ng-model`. Style the textarea as usual, and it will grow automatically
as the user types.

### Requirements

* AngularJS 1.1.5 - 1.2.x
* jQuery 1.10.x
* RequireJS (Optional)

### Using RequireJS
This directive can be loaded as an AMD module if you're using RequireJS. There are a few requirements:

1. You must add paths to `angular` in your RequireJS config.
2. You must shim `angular` to export `angular`, and it must be dependent on `jquery` (path to jquery does not matter).

At minimum, your requirejs config must include this:
```js
requirejs.config({
  paths: {
    'angular': 'path/to/angular'
  },
  shim: {
    'angular': {
      'exports': 'angular',
      'deps': ['path/to/jquery']
    }
  }
});
```

Once configured, you can `require()` the original source file `src/taggedAutogrow` in your app:
```js
define(['angular', 'path/to/src/taggedAutogrow'], function(angular) {
  var app = angular.module('MyApp', ['tagged.directives.autogrow']);
  
  // ...

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

# Local node dependencies (karma, etc.)
$ npm install

# 3rd-party libraries (Angular, jQuery, etc.)
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

Copyright 2013 Tagged, Inc.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/tagged/autogrow/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

