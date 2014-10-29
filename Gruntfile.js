'use strict';
module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-*', '!grunt-template-jasmine-istanbul']
    });

    grunt.initConfig({
        meta: {
            package: grunt.file.readJSON('package.json'),
            src: {
                main: {
                    html: "src/",
                    js: "src/js",
                    css: "src/css",
                    img: "src/img",
                    vendor: "src/vendor"
                },
                test: 'tests'
            },
            build: {
                html: "www/",
                js: "www/js",
                css: "www/css",
                img: "www/img",
                vendor: "www/vendor"
            },
            bin: {
                coverage: 'reports/coverage'
            }
        },

        clean: {
            test: [
                "<%= meta.src.main.js %>/**/*.js",
                "<%= meta.src.main.js %>/**/*.js.map",
                "<%= meta.src.test %>/**/*.js",
                "<%= meta.src.test %>/**/*.js.map",
                "<%= meta.src.main.vendor %>",
                "reports",
                "_SpecRunner.html"
            ],
            build: [
                "<%= meta.build.html %>"
            ]
        },

        jasmine: {
            coverage: {
                src: ['<%= meta.src.main.js %>/*.js'],
                options: {
                    specs: '<%= meta.src.test %>/*.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
                        template: require('grunt-template-jasmine-teamcity'),
                        templateOptions: {
                            output: '<%= meta.bin.coverage %>/html/jasmine.teamcity.log'
                        },
                        coverage: '<%= meta.bin.coverage %>/coverage.json',
                        report: [
                            {
                                type: 'html',
                                options: {
                                    dir: '<%= meta.bin.coverage %>/html'
                                }
                            },
                            {
                                type: 'cobertura',
                                options: {
                                    dir: '<%= meta.bin.coverage %>/cobertura'
                                }
                            },
                            {
                                type: 'text-summary'
                            }
                        ]
                    }
                }
            }
        },

        bower: {
            test: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    install: true,
                    copy: true,
                    targetDir: "<%= meta.src.main.vendor %>"
                }
            },
            build: {
                options: {
                    cleanTargetDir: true,
                    cleanBowerDir: true,
                    install: true,
                    copy: true,
                    targetDir: "<%= meta.build.vendor %>"
                }
            }
        },

        coffee: {
            build: {
                options: {
                    bare: true,
                    sourceMap: true
                },
                expand: true,
                cwd: '<%= meta.src.main.js %>',
                src: ['**/*.coffee'],
                dest: '<%= meta.build.js %>',
                ext: '.js'
            },

            test: {
                options: {
                    bare: true,
                    sourceMap: true
                },
                expand: true,
                cwd: '<%= meta.src.test %>',
                src: ['*Spec.coffee'],
                dest: '<%= meta.src.test %>',
                ext: '.js'
            },

            testsrc: {
                cwd: '<%= meta.src.main.js %>',
                expand: true,
                src: ['*.coffee'],
                dest: '<%= meta.src.main.js %>',
                ext: '.js'
            }
        },

        sass: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'styles',
                    src: ['<%= meta.src.main.css %>/*.scss'],
                    dest: '<%= meta.build.css %>',
                    ext: '.css'
                }]
            }
        },

        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'www/index.html': '<%= meta.src.main.html %>/index.html',     // 'destination': 'source'
                    'www/pages/login.html': '<%= meta.src.main.html %>/pages/login.html',
                    'www/pages/main.html': '<%= meta.src.main.html %>/pages/main.html'
                }
            }
        },

        cordovacli: {
            options: {
                path: './'
            },
            cordova: {
                options: {
                    command: ['plugin','build'],
                    platforms: ['ios','android'],
                    plugins: [],
                    path: './',
                    id: 'io.cordova.hellocordova',
                    name: 'HelloCordova'
                }
            },
            add_plugins: {
                options: {
                    command: 'plugin',
                    action: 'add',
                    plugins: [
                        'battery-status',
                        'device-orientation',
                        'dialogs',
                        'file',
                        'geolocation',
                        'network-information',
                        'splashscreen'
                    ]
                }
            },
            run_android: {
                options: {
                    command: 'run',
                    platforms: ['android'],
                    args: ['--target','myAndroid']
                }
            },
            run_ios: {
                options: {
                    command: 'run',
                    platforms: ['ios']
                }
            }
        },

        connect: {
            buildServer: {
                options: {
                    keepalive: true,
                    port: 9000,
                    base: '<%= meta.build.index %>'
                }
            }
        },

        open : {
            build: {
                path: 'http://127.0.0.1:9000/',
                app: 'Google Chrome'
            },
            report: {
                path: '<%= meta.bin.coverage %>/html/index.html',
                app: 'Firefox'
            }
        },

        ftpush: {
            build: {
                auth: {
                    host: 'svenklemmer.de',
                    port: 21,
                    authKey: 'spacequadrat'
                },
                src: '<%= meta.bin.coverage %>',
                dest: '/',
                /*exclusions: ['path/to/source/folder*//**//*.DS_Store', 'path/to/source/folder*//**//*Thumbs.db', 'dist/tmp'],*/
                keep: ['/.ftpquota'],
                simple: false,
                useList: false
            }
        },

        mailgun: {
            mailer: {
                options: {
                    key: 'key-472c6b3605b830c401a2fb4edc6907e4',
                    sender: 'reports@mosaic4cap.de',
                    recipient: 'mosaic142@gmail.com',
                    subject: 'Deployed Mosaic4Cap-Mobileapp reports',
                    body: 'Teamcity build successfull! You can watch all reports at http://svenklemmer.de/mosaic/html/'
                }
            }
        }
    });


    /**
     * TODO: minify css and javascript in buildprocess
     * see https://github.com/gruntjs/grunt-contrib-uglify for javascript
     * see https://github.com/gruntjs/grunt-contrib-cssmin for css
     */

    /**
     * TODO: make another template for grunt-jasmine task to produce a report containing test run report and coverage report
     * see https://github.com/gruntjs/grunt-contrib-jasmine/wiki/Jasmine-Templates for template hints
     */

    /*grunt.registerTask('test', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test']);*/
    grunt.registerTask('test', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test', 'jasmine', 'open:report']);

    grunt.registerTask('testcity', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test', 'jasmine', 'ftpush', 'mailgun']);

    grunt.registerTask('build', ['clean:build', 'bower:build', 'coffee:build', 'htmlmin', 'sass']);

    grunt.registerTask('dev', ['test', 'build', 'open:build', 'connect']);

    grunt.registerTask('cleanup', ['clean:test', 'clean:build']);

    grunt.registerTask('server', ['cordovacli', 'open:build', 'connect']);


    grunt.registerTask('default', ['test', 'build', 'server']);
};