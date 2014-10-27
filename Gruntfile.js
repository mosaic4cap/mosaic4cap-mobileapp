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
                coffee: 'www',
                index: 'www',
                vendor: 'www/vendor',
                css: 'www/css'
            },
            bin: {
                coverage: 'reports/coverage'
            }
        },

        clean: {
            test: [
                "<%= meta.src.main.js %>/*.js",
                "<%= meta.src.main.js %>/*.js.map",
                "<%= meta.src.test %>/*.js",
                "<%= meta.src.test %>/*.js.map",
                "<%= meta.src.main.vendor %>",
                "reports",
                "_SpecRunner.html"
            ],
            build: [
            ]
        },

        jasmine: {
            coverage: {
                src: ['<%= meta.src.main.js %>/*.js'],
                options: {
                    specs: '<%= meta.src.test %>/*.js',
                    template: require('grunt-template-jasmine-istanbul'),
                    templateOptions: {
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
                    sourceMap: true,
                    joined: true
                },
                expand: true,
                cwd: '<%= meta.src.main.js %>',
                src: ['*.coffee'],
                dest: '<%= meta.build.coffee %>',
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
        }
    });


    /*grunt.registerTask('test', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test']);*/
    grunt.registerTask('test', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test', 'jasmine', 'open:report']);

    grunt.registerTask('build', ['clean:build', 'bower:build', 'coffee:build', 'htmlmin', 'sass']);

    grunt.registerTask('dev', ['test', 'build', 'open:build', 'connect']);

    grunt.registerTask('cleanup', ['clean:test', 'clean:build']);

    grunt.registerTask('server', ['cordovacli', 'open:build', 'connect']);


    grunt.registerTask('default', ['test', 'build', 'server']);
};