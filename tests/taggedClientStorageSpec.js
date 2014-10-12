/* jshint expr:true */
define(function(require) {
    var angular = require('angular');
    require('angular/mocks');
    require('src/taggedClientStorage');

    var mockLocalStorage;
    var mockDocument;

    describe('Module: tagged.services.client-storage', function() {
        beforeEach(function() {
            mockLocalStorage = {
                setItem: sinon.spy(function(key, value) {
                    this[key] = value;
                }),
                getItem: sinon.spy(function(key) {
                    return this[key];
                }),
                removeItem: sinon.spy(function(key) {
                    delete this[key];
                })
            };
            mockDocument = [{
                cookie: ''
            }];
        });

        afterEach(function() {
            mockLocalStorage = undefined;
            mockDocument = undefined;
        });

        describe('with localStorage support', function() {
            beforeEach(module('tagged.services.client-storage', function($provide) {
                $provide.decorator('$window', function($delegate) {
                    return {
                        localStorage: mockLocalStorage
                    };
                });
            }));

            beforeEach(inject(function(taggedClientStorage) {
                this.clientStorage = taggedClientStorage;
            }));

            describe('factory', function() {
                it('is a function', function() {
                    this.clientStorage.should.be.a('function');
                });

                it('returns an object', function() {
                    this.clientStorage('test').should.be.an('object');
                });

                it('returns a new object when called with different namespaces', function() {
                    var storage1 = this.clientStorage('test');
                    var storage2 = this.clientStorage('something_else');
                    storage1.should.not.equal(storage2);
                });

                it('returns the same object when called with the same namespaces', function() {
                    var storage1 = this.clientStorage('test');
                    var storage2 = this.clientStorage('test');
                    storage1.should.equal(storage2);
                });
            });

            // Used by `set` and `get` tests to ensure what goes in is what comes out.
            var dataSingleValueStored = [
                {
                    value: 'bar',
                    stored: '{"foo":"bar"}'
                },
                {
                    value: true,
                    stored: '{"foo":true}'
                },
                {
                    value: false,
                    stored: '{"foo":false}'
                },
                {
                    value: [1, 2],
                    stored: '{"foo":[1,2]}'
                },
                {
                    value: {derp: 'flerp'},
                    stored: '{"foo":{"derp":"flerp"}}'
                },
            ];

            describe('set', function() {
                beforeEach(function() {
                    this.storage = this.clientStorage('test_namespace');
                });

                dataSingleValueStored.forEach(function(data) {
                    it('stores data in local storage under namespace as a JSON string', function() {
                        this.storage.set('foo', data.value);
                        mockLocalStorage.should.have.property('test_namespace', data.stored);
                    });
                });

                it('stores more data in local storage under namespace as a JSON string', function() {
                    this.storage.set('foo', 'bar');
                    this.storage.set('derp', 'flerp');
                    mockLocalStorage.should.have.property('test_namespace', '{"foo":"bar","derp":"flerp"}');
                });
            });

            describe('get', function() {
                beforeEach(function() {
                    this.storage = this.clientStorage('test_namespace');
                });

                dataSingleValueStored.forEach(function(data) {
                    it('restores original value from local storage', function() {
                        mockLocalStorage['test_namespace'] = data.stored;
                        this.storage.get('foo').should.eql(data.value);
                    });
                });

                it('returns undefined when unable to parse JSON', function() {
                    mockLocalStorage['test_namespace'] = 'INVALID JSON';
                    expect(this.storage.get('foo')).to.be.undefined;
                });
            });

            var dataInvalidJson = [
                'INVALID JSON',
                '',
                undefined,
                null,
                0,
                1,
                -1,
                1.1,
                true,
                false,
                '{"foo"}' // broken
            ];

            describe('getAll', function() {
                beforeEach(function() {
                    this.storage = this.clientStorage('test_namespace');
                });

                it('returns an object with all values', function() {
                    mockLocalStorage['test_namespace'] = '{"foo":"bar","derp":"flerp"}';
                    this.storage.getAll().should.eql({foo: 'bar', derp: 'flerp'});
                });

                dataInvalidJson.forEach(function(invalidJson) {
                    it('returns an empty object if stored JSON is not parseable', function() {
                        mockLocalStorage['test_namespace'] = invalidJson;
                        this.storage.getAll().should.be.an('object');
                        this.storage.getAll().should.be.empty;
                    });
                });
            });

            describe('clear', function() {
                beforeEach(function() {
                    this.storage = this.clientStorage('test_namespace');
                    mockLocalStorage['test_namespace'] = '{"foo":"bar","derp":"flerp"}';
                });

                it('clears only specified key', function() {
                    expect(this.storage.get('foo')).to.not.be.undefined;
                    expect(this.storage.get('derp')).to.not.be.undefined;
                    this.storage.clear('foo');
                    expect(this.storage.get('foo')).to.be.undefined;
                    expect(this.storage.get('derp')).to.not.be.undefined;
                });
            });

            describe('clearAll', function() {
                beforeEach(function() {
                    this.storage = this.clientStorage('test_namespace');
                    mockLocalStorage['test_namespace'] = '{"foo":"bar","derp":"flerp"}';
                });

                it('clears all keys in namespace', function() {
                    expect(this.storage.get('foo')).to.not.be.undefined;
                    expect(this.storage.get('derp')).to.not.be.undefined;
                    this.storage.clearAll();
                    expect(this.storage.get('foo')).to.be.undefined;
                    expect(this.storage.get('derp')).to.be.undefined;
                });
            });
        });

        describe('without localStorage support', function() {
            describe('invalid localStorage', function() {
                beforeEach(module('tagged.services.client-storage', function($provide) {
                    $provide.decorator('$window', function($delegate) {
                        return {
                            localStorage: null // invalid locale storage
                        };
                    });

                    $provide.decorator('$document', function($delegate) {
                        return mockDocument;
                    });
                }));

                beforeEach(inject(function(taggedClientStorage) {
                    this.clientStorage = taggedClientStorage;
                    this.now = 1413442800000; // October 16th, 2014
                    this.clock = sinon.useFakeTimers(this.now);
                }));

                afterEach(function() {
                    this.clock.restore();
                });

                it('writes data as encoded JSON to document cookie', function() {
                    var storage = this.clientStorage('test_namespace');
                    storage.set('foo', 'bar');
                    mockLocalStorage.should.not.have.property('foo');
                    mockDocument[0].cookie.should.contain(escape('{"foo":"bar"}'));
                });

                it('sets cookie path to `/`', function() {
                    var storage = this.clientStorage('test_namespace');
                    storage.set('foo', 'bar');
                    mockDocument[0].cookie.should.contain('path=/');
                });

                it('sets expiration to 1 year from now', function() {
                    var storage = this.clientStorage('test_namespace');
                    storage.set('foo', 'bar');
                    mockDocument[0].cookie.should.contain('expires=Fri, 16 Oct 2015 07:00:00 GMT');
                });

                it('reads from existing cookie', function() {
                    mockDocument[0].cookie = 'test_namespace=' + escape('{"foo":"bar"}');
                    var storage = this.clientStorage('test_namespace');
                    storage.get('foo').should.equal('bar');
                });

                it('reads from existing cookie 2', function() {
                    mockDocument[0].cookie = 'test_namespace=' + escape('{"foo":"bar"}') + ';something_else=derp';
                    var storage = this.clientStorage('test_namespace');
                    storage.get('foo').should.equal('bar');
                });

                it('defaults to undefined', function() {
                    var storage = this.clientStorage('test_namespace');
                    expect(storage.get('foo')).to.be.undefined;
                });

                it('defaults to undefined 2', function() {
                    mockDocument[0].cookie = 'something_else=derp';
                    var storage = this.clientStorage('test_namespace');
                    expect(storage.get('foo')).to.be.undefined;
                });

                it('deletes entire cookie when clearing all', function() {
                    var storage = this.clientStorage('test_namespace');
                    storage.clearAll();
                    mockDocument[0].cookie.should.contain('expires=Thu, 16 Oct 2014 06:43:20 GMT'); // in the past
                });
            });

            describe('old versions of firefox that throw exceptions when checking for localStorage support', function() {
                var clientStorage;

                beforeEach(module('tagged.services.client-storage', function($injector) {
                    // Inject `null` as `$window`,
                    // which forces an exception to be thrown when using `'localStorage' in $window`.
                    // This is to emulate the behavior of some older FireFox browsers that throw an exception
                    // when looking for localStorage support.
                    // @see http://diveintohtml5.info/detect.html
                    // NOTE: This is a fraglie test
                    // because the order of the dependencies in the factory
                    // must be `$window`, `$document`.
                    // TODO: Find a better way to test this.
                    clientStorage = $injector.get('taggedClientStorageProvider').$get(null, mockDocument);
                }));

                // This empty inject() call is required, otherwise the module will not get loaded properly... :\
                it('falls back to cookies for storage', inject(function() {
                    var storage = clientStorage('test_namespace');
                    storage.set('foo', 'bar');
                    mockLocalStorage.should.not.have.property('foo');
                    mockDocument[0].cookie.should.contain(escape('{"foo":"bar"}'));
                }));
            });
        });
    });
});
