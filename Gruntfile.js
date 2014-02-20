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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');

};
