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
            },
            apk: {
                ios: 'platforms/ios/build/HelloCordova.build',
                android: 'platforms/android/ant-build/',
                wmp8: '',
                firefox: '',
                platforms: 'platforms/'
            }
        },

        clean: {
            test: [
                "<%= meta.src.test %>/**/*.js",
                "<%= meta.src.test %>/**/*.js.map",
                "<%= meta.src.main.js %>/**/*.js",
                "<%= meta.src.main.js %>/**/*.js.map",
                "<%= meta.src.main.css %>/**/*.css",
                "<%= meta.src.main.css %>/**/*.css.map",
                "<%= meta.src.main.vendor %>",
                "reports",
                "_SpecRunner.html"
            ],
            build: [
                "<%= meta.build.html %>",
                "<%= meta.apk.platforms %>"
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
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.src.main.css %>',
                    src: ['**/*.sass'],
                    dest: '<%= meta.build.css %>',
                    ext: '.css'
                }]
            }
        },

        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.build.css %>',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= meta.build.css %>',
                    ext: '.css'
                }]
            }
        },

        htmlmin: {                                     // Task
            build: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyJS: true,
                    minifyCSS: true
                },
                files: {                                   // Dictionary of files
                    'www/index.html': '<%= meta.src.main.html %>/index.html',     // 'destination': 'source'
                    'www/pages/login.html': '<%= meta.src.main.html %>/pages/login.html',
                    'www/pages/main.html': '<%= meta.src.main.html %>/pages/main.html'
                }
            }
        },

        uglify: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= meta.build.js %>',
                    src: '**/*.js',
                    dest: '<%= meta.build.js %>'
                }]
            }
        },

        cordovacli: {
            options: {
                path: './'
            },
            cordova: {
                options: {
                    command: ['plugin', 'build'],
                    platforms: ['ios', 'android'],
                    plugins: [],
                    path: './',
                    id: 'io.cordova.hellocordova',
                    name: 'HelloCordova'
                }
            },
            add_platforms: {
                options: {
                    command: 'platform',
                    action: 'add',
                    platforms: ['ios', 'android']
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
            build_android_release: {
                options: {
                    command: 'build',
                    platforms: ['android'],
                    args: ['--release']
                }
            },
            build_ios_release: {
                options: {
                    command: 'build',
                    platforms: ['ios'],
                    args: ['--release']
                }
            },
            run_android: {
                options: {
                    command: 'run',
                    platforms: ['android'],
                    args: ['--target', 'myAndroid']
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

        open: {
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
            report: {
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
            },

            /** change destination packages to release directory in app **/
            deploy_ios: {
                auth: {
                    host: 'svenklemmer.de',
                    port: 21,
                    authKey: 'spacequadrat'
                },
                src: '<%= meta.apk.ios %>',
                dest: '/testrelease',
                /*exclusions: ['path/to/source/folder*//**//*.DS_Store', 'path/to/source/folder*//**//*Thumbs.db', 'dist/tmp'],*/
                /*keep: ['/.ftpquota'],*/
                simple: false,
                useList: false
            },

            /** change destination packages to release directory in app **/
            deploy_android: {
                auth: {
                    host: 'svenklemmer.de',
                    port: 21,
                    authKey: 'spacequadrat'
                },
                src: '<%= meta.apk.android %>',
                dest: '/testrelease',
                keep: ['<%= meta.apk.android %>/**/*', '<%= meta.apk.android %>/*.xml*', '<%= meta.apk.android %>/*.dex*', '<%= meta.apk.android %>/*.txt'],
                /*keep: ['/.ftpquota'],*/
                simple: false,
                useList: false
            }
        },

        mailgun: {
            jasmine_mailer: {
                options: {
                    key: 'key-472c6b3605b830c401a2fb4edc6907e4',
                    sender: 'reports@mosaic4cap.de',
                    recipient: 'mosaic142@gmail.com',
                    subject: 'Deployed Mosaic4Cap-Mobileapp reports',
                    body: 'Teamcity build successfull! You can watch all reports at http://svenklemmer.de/mosaic/html/'
                }
            },
            release_mailer_ios: {
                options: {
                    key: 'key-472c6b3605b830c401a2fb4edc6907e4',
                    sender: 'reports@mosaic4cap.de',
                    recipient: 'mosaic142@gmail.com',
                    subject: 'Deployed Mosaic4Cap-Mobileapp for iOS',
                    body: 'Successfully Deployed iOS App, watch release @ Mosaic4Cap Page'
                }
            },
            release_mailer_android: {
                options: {
                    key: 'key-472c6b3605b830c401a2fb4edc6907e4',
                    sender: 'reports@mosaic4cap.de',
                    recipient: 'mosaic142@gmail.com',
                    subject: 'Deployed Mosaic4Cap-Mobileapp for Android',
                    body: 'Successfully Deployed Android App, watch release @ Mosaic4Cap Page'
                }
            }
        }
    });


    /**
     * TODO: make another template for grunt-jasmine task to produce a report containing test run report and coverage report
     * see https://github.com/gruntjs/grunt-contrib-jasmine/wiki/Jasmine-Templates for template hints
     */

    /**
     * TODO: for deploying apps use deploy_<platform> and build_<platform>_release tasks
     * first copy .apk or ios build to seperate folder and upload it to server
     * make folder for every release
     * REMEBER: ftpush will delete all direcoties so try to keep all existing dirs on ftp folder
     * send mail after upload finished
     */

    /*grunt.registerTask('test', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test']);*/
    grunt.registerTask('cleanup', ['clean:test', 'clean:build']);


    grunt.registerTask('test', ['clean:test', 'bower:test', 'coffee:testsrc', 'coffee:test', 'jasmine', 'open:report']);
    grunt.registerTask('testcity', [
        'clean:test',
        'bower:test',
        'coffee:testsrc',
        'coffee:test',
        'jasmine',
        'ftpush:report',
        'mailgun:jasmine_mailer'
    ]);

    grunt.registerTask('build', ['clean:build', 'html', 'js', 'css', 'app']);


    grunt.registerTask('html', ['bower:build', 'htmlmin:build']);
    grunt.registerTask('css', ['sass:build', 'cssmin:build']);
    grunt.registerTask('js', ['coffee:build', 'uglify:build']);
    grunt.registerTask('app', ['cordovacli:add_platforms', 'cordovacli:add_plugins', 'cordovacli:cordova']);


    grunt.registerTask('server', ['open:build', 'connect']);

    grunt.registerTask('dev', ['test', 'build', 'open:build', 'connect']);
    grunt.registerTask('deploy', [
        'test',
        'build',
        'cordovacli:build_android_release',
        'ftpush:deploy_android',
        'mailgun:release_mailer_android',
        'cordovacli:build_ios_release',
        'ftpush:deploy_ios',
        'mailgun:release_mailer_ios'
    ]);


    grunt.registerTask('default', ['test', 'build', 'server']);
};