module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 8000,
                    protocol: 'http',
                    hostname: 'localhost',
                    base: '../web/'
                }
            }
        },

        uglify: {
            compile: {
                files: {
                    '../web/js/main.min.js': ['js/*.js'],
                    '../web/js/vendor.min.js': ['js/vendor/*.js']
                }
            }
        },

        compass: {
            compile: {
                options: {
                    sassDir: 'scss',
                    cssDir: '../web/css',
                    imagesDir: 'img',
                    fontsDir: 'fonts',
                    generatedImagesDir: '../web/img'
                }
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true
                },
                files: {
                    '../web/index.html': 'index.html'
                }
            }
        },

        watch: {
            options: {
                livereload: true
            },

            scripts: {
                files: ['js/**/*.js'],
                tasks: ['uglify'],
                options: {
                    interrupt: true
                }
            },

            compass: {
                files: ['scss/**/*.scss'],
                tasks: ['compass'],
                options: {
                    interrupt: true
                }
            },

            html: {
                files: ['**/*.html'],
                tasks: ['htmlmin'],
                options: {
                    interrupt: true
                }
            }
        }
    });

    grunt.registerTask('default', ['connect', 'watch']);

};
