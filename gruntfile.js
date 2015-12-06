module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            'bundle.js': ['index.js']
            all: {
                src: 'index.js',
                dest: 'bundle.js'
                // options: {
                //     transform: ['debowerify', 'decomponentify', 'deamdify', 'deglobalify'],
                // }
            }
        }

    });

    grunt.loadNpmTasks('grunt-browserify');

      grunt.registerTask('default', ['browserify']);
}
