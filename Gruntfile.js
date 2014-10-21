module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-karma-coveralls');
  grunt.loadNpmTasks('grunt-ng-annotate');

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),

    clean: {
      tmp: ["tmp"]
    },

    concat: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n',
      },
      build: {
        src: ['src/taggedClientStorage.js'],
        dest: 'tmp/taggedClientStorage.js'
      },
    },

    coveralls: {
      options: {
        coverage_dir: 'coverage/'
      }
    },

    karma: {
      options: {
        configFile: 'config/karma.conf.js'
      },
      test: {
        // Use defaults
      },
      dev: {
        singleRun: false
      },
      bdd: {
        reporters: ['story', 'coverage']
      },
      cobertura: {
        reporters: ['dots', 'coverage'],
        browsers: ['PhantomJS'],
        coverageReporter: {
          type : 'cobertura',
          dir : 'coverage/'
        }
      },
      travis: {
        singleRun: true,
        reporters: ['dots', 'coverage'],
        browsers: ['PhantomJS'],
        preprocessors: {
          'src/*.js': 'coverage'
        },
        coverageReporter: {
          type : 'lcov',
          dir : 'coverage/'
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      main: {
        files: { 'taggedClientStorage.js': 'tmp/taggedClientStorage.js' }
      }
    },

    uglify: {
      build: {
        files: {
          'taggedClientStorage.min.js': ['taggedClientStorage.js']
        }
      }
    }
  });

  // Run tests, single pass
  grunt.registerTask('test', 'Run unit tests', ['karma:test']);

  // Run tests continously for development mode
  grunt.registerTask('dev', 'Run unit tests in watch mode', ['karma:dev']);

  // Generate a coverage report in Cobertura format
  grunt.registerTask('cobertura', 'Generate Cobertura coverage report', ['karma:cobertura']);

  // Build files for production
  grunt.registerTask('build', 'Builds files for production', ['concat:build', 'ngAnnotate:main', 'uglify:build', 'clean:tmp']);

  // Travis CI task
  grunt.registerTask('travis', 'Travis CI task', ['karma:travis', 'coveralls']);
};
