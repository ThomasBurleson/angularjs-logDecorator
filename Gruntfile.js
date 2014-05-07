module.exports = function(grunt) {

    /**
     * Load required Grunt tasks. These are installed based on the versions listed
     * in `package.json` when you do `npm install` in this directory.
     */
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-urequire');


    var buildDir = "/release";
    var devDir   = "/src";

    /**
     * This is the configuration object Grunt uses to give each plugin its
     * instructions.
     */
    var taskConfig = {

        /**
         * We read in our `package.json` file so we can access the package name and version. It's already there, so
         * we don't repeat ourselves here.
         */
        pkg: grunt.file.readJSON("package.json"),

        /**
         * The banner is the comment that is placed at the top of our compiled source files. It is first processed
         * as a Grunt template, where the `<%=` pairs are evaluated based on this very configuration object.
         */
        meta: {
            banner: '/**\n' +
                ' * @appName    <%= pkg.name %>\n' +
                ' * @version    <%= pkg.version %>\n' +
                ' * @date       <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * @homepage   <%= pkg.homepage %>\n' +
                ' * @copyright  <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
                ' */\n'
        },

         /**
         * The directories to delete when `grunt clean` is executed.
         */
        clean: {
            src: [
                '<%= buildDir %>/*.js'
            ],
            options: {
                force: true
            }
        },

        /**
         * The `copy` task just copies files from A to B. We use it here to copy our project assets
         * (images, fonts, etc.) and javascripts into `buildDir`, and then to copy the assets to `compileDir`.
         */
        copy: {
            release: {
                files: [
                    {
                        src: './release/amd/angular-logX.js',
                        dest: './demos/webroot/assets/vendor/angular-logX/release/amd/angular-logX.js'
                    }
                ]
            },
            releaseMin: {
                files: [
                    {
                        src: './release/amd/angular-logX.min.js',
                        dest: './demos/webroot/assets/vendor/angular-logX/release/amd/angular-logX.min.js'
                    }
                ]
            }
        },

        /**
         * Minifies RJS files and makes it production ready
         * Build files are minified and encapsulated using RJS Optimizer plugin
         */
        requirejs: {
            compile: {

                options: {
                    baseUrl: "./src",
                    paths   :
                    {
                        // Configure alias to full paths; relative to `baseURL`
                        'logger': 'mindspace/logger',
                        'utils' : 'mindspace/utils'

                    },
                    out: './release/amd/angular-logX.js',
                    name: 'angular-logX',

                    preserveLicenseComments: true,
                    optimize: "none"
                }
            },
            compileMin: {

                options: {
                    baseUrl: "./src",
                    paths   :
                    {
                        // Configure alias to full paths; relative to `baseURL`
                        'logger': 'mindspace/logger',
                        'utils' : 'mindspace/utils'

                    },
                    out: './release/amd/angular-logX.min.js',
                    name: 'angular-logX',

                    preserveLicenseComments: false,
                    optimize: "uglify"
                }
            }
        },

        bump: {
            scripts: {
                files: ["src/*.js"],
                    updateConfigs: ["pkg"],
                    commitFiles: ["-a"],
                    push: false
            }
        },

        urequire:{
            LibAsUMD: {
                template: "UMD", // default, can be ommited
                path: "./src",
                dstPath: "./release/common/src"
            },

            LibCombinedToWorkEverywhere: {
                template:'combined',
                path: "./src",
                main: 'angular-logX',
                dstPath: "./release/common/angular-logX.all.js"
            },

            _defaults: {
                verbose: false,
                scanAllow: true,
                allNodeRequires: true,
                noRootExports: false
            }
        }

    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initialize with configuration
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    grunt.initConfig( taskConfig );

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Register Tasks
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    grunt.registerTask( "release", [

          'clean:src'
        , "requirejs:compile"    // concatenate and do NOT minify all the logDecorator source AMDs
        , "copy:release"
    ]);


    grunt.registerTask( "release.min", [

          "requirejs:compileMin" // concatenate and minify all the logDecorator source AMDs
        , "copy:releaseMin"
    ]);

    grunt.registerTask('default', ['release','release.min']);

};
