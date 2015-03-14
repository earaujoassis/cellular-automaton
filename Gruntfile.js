module.exports = function (grunt) {

    grunt.initConfig({
        connect: {
            server : {
                options: {
                    port: 9000,
                    base: 'source',
                    keepalive: true
                }
            }
        },

        copy: {
            main: {
                expand: true,
                cwd: 'source/',
                src: '**',
                dest: 'site/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');

};
