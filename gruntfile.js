module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        browserify: {
            'lib/bundle.js': ['index.js'],
            'test/bundle-test.js': ['test/vcr-test.js'],
            // options: {
            //     node: '',
            //     transform: ['coverify']
            // }
        },

        shell: {
            options: {
                stderr: false
            },
            target: {
                // command: 'phantomjs tasks/phantom.js'
                command: 'phantomjs tasks/phantom.js',
            }
        },

        'http-server': {

            'dev': {

                // the server root directory 
                root: '/Users/pcanella/gitrepo/vcr/test',

                port: 8282,

                host: "0.0.0.0",

                //cache: < sec > ,
                showDir: true,
                autoIndex: true,

                // server default file extension 
                ext: "html",

                // run in parallel with other tasks 
                runInBackground: true,

                logFn: function(req, res, error) {},

                // Tell grunt task to open the browser 
                openBrowser: false

            }

        }




    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-http-server');

    grunt.registerTask('default', ['browserify', 'http-server', 'shell']);
}
