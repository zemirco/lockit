
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        expr: true
      },
      files: ['Gruntfile.js', 'index.js', 'test/*.js']
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/test.js']
      }
    }
  });

  // load tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');

  // register tasks
  grunt.registerTask('hint', ['jshint']);
  grunt.registerTask('mocha', ['mochaTest']);
  grunt.registerTask('default', ['jshint', 'mochaTest']);

};