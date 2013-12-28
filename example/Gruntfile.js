
module.exports = function(grunt) {
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),
    shell: {
      debug: {
        modules: [
          'lockit',
          'lockit-couchdb-adapter',
          'lockit-delete-account',
          'lockit-forgot-password',
          'lockit-login',
          'lockit-mongodb-adapter',
          'lockit-sendmail',
          'lockit-signup',
          'lockit-utils'
        ].join(','),
        options: {
          stdout: true,
          stderr: true
        },
        command: 'DEBUG=<%= shell.debug.modules %> node app.js'
      },
      default: {
        options: {
          stdout: true,
          stderr: true
        },
        command: 'node app.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('debug', ['shell:debug']);
  grunt.registerTask('default', ['shell:default']);
};