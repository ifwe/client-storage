/*! tagged-client-storage - v1.0.2 - 2014-10-21 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular'], factory);
    } else {
        // Browser globals
        root.taggedClientStorage = factory(root.angular);
    }
}(this, function(angular) {
    "use strict";

    // Client Storage
    // --------------
    //
    // Allows simple storage of data on the client.
    // Uses HTML5 localStorage if available,
    // otherwise falls back to cookies.
    //
    // **Usage:**
    //
    //     var storage = taggedClientStorage('my_namespace');
    //     storage.set('foo', 'bar');
    //     storage.get('foo');      // returns 'bar'
    //     storage.get('other');    // returns undefined
    //     storage.getAll();        // returns object { foo: 'bar' }
    var module = angular.module('tagged.services.client-storage', []);
    module.factory('taggedClientStorage', ['$window', '$document', function($window, $document) {
        // Cookie fallback implements the same interface as `localStorage`,
        // allowing us to drop it in when `localStorage` is not available.
        // Cookies are hard-coded to be stored domain-wide,
        // with an expiration of one year.
        // This gets us pretty close to the behavior we'd expect from `localStorage`.
        var cookieFallback = {
            // Returns the value of the specified cookie,
            // otherwise `null` if not found.
            getItem: function(name) {
                if (!$document[0].cookie.length) {
                    return null;
                }

                var start = $document[0].cookie.indexOf(name + "=");

                if (-1 == start) {
                    return null;
                }

                start = start + name.length + 1;
                var end = $document[0].cookie.indexOf(";", start);

                if (-1 == end) {
                    end = $document[0].cookie.length;
                }

                return unescape($document[0].cookie.substring(start, end));
            },

            // Stores the cookie site-wide for one year.
            setItem: function(name, value) {
                var date = new Date();
                date.setTime(date.getTime() + (1000 * 60 * 60 * 24 * 365)); // 1 year
                $document[0].cookie = escape(name) + '=' + escape(value) + '; path=/; expires=' + date.toGMTString();
            },

            // Removes the cookie by removing its value
            // and updating the expiration to a date in the past.
            removeItem: function(name) {
                var date = new Date();
                date.setTime(date.getTime() + (1000 * -1000)); // something in the past
                $document[0].cookie = escape(name) + '=; path=/; expires=' + date.toGMTString();
            }
        };

        // Keep track of all storage instances that have been created.
        var storages = {};

        // Checking for HTML5 storage support uses
        // [detection technique #1](http://diveintohtml5.info/detect.html#techniques).
        // If your browser supports HTML5 storage,
        // there will be a `localStorage` property on the global `window` object.
        // If your browser doesn’t support HTML5 storage,
        // the `localStorage` property will be `undefined`.
        // Due to an unfortunate bug in older versions of Firefox,
        // this test will raise an exception if cookies are disabled,
        // so the entire test is wrapped in a `try..catch` statement.
        // @see http://diveintohtml5.info/detect.html
        var isLocalStorageSupported;

        try {
            isLocalStorageSupported = ('localStorage' in $window && $window['localStorage'] !== null);
        } catch (e) {
            isLocalStorageSupported = false;
        }

        // The backend used to persist the data.
        // Defaults to HTML5 localStorage if supported,
        // otherwise uses cookies.
        // Since `$window.localStorage` and `$cookies` have the same interface,
        // we can use them directly.
        var backend = isLocalStorageSupported ? $window.localStorage : cookieFallback;

        // The Storage class keeps track of the namespace
        // and manages reading/writing to the backend.
        var Storage = function(namespace) {
            this.namespace = namespace;
        };

        // Gets all data from the backend according to the namespace.
        // Always returns an Object.
        // @returns Object
        Storage.prototype.getAll = function() {
            var data;

            try {
                data = angular.fromJson(backend.getItem(this.namespace));
            } catch (e) {
                data = {};
            }

            if (!angular.isObject(data)) data = {};

            return data;
        };

        // Returns the value assigned to the key within the namespace.
        // Defaults to `undefined` if not found.
        Storage.prototype.get = function(key) {
            var data = this.getAll();
            return data[key];
        };

        // Sets the value in the namespace under the provided key.
        Storage.prototype.set = function(key, value) {
            var data = this.getAll();
            data[key] = value;
            backend.setItem(this.namespace, angular.toJson(data));
        };

        // Clears the specified key from the namespace.
        Storage.prototype.clear = function(key) {
            var data = this.getAll();
            delete data[key];
            backend.setItem(this.namespace, angular.toJson(data));
        };

        // Clears all keys from the namespace.
        Storage.prototype.clearAll = function() {
            backend.removeItem(this.namespace);
        };

        // Factory function to generate a new Storage object with specified namespace,
        // or return an existing Storage if one with that namespace has already been created.
        return function(namespace) {
            // Return existing storage if namespace is already created.
            if (namespace in storages) return storages[namespace];
            storages[namespace] = new Storage(namespace);
            return storages[namespace];
        };
    }]);

    return module;
}));
