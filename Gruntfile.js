module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'js/app.js': [
                        "src/octokit.js",
                        "bower_components/angular/angular.min.js",
                        "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
                        "bower_components/angular-route/angular-route.min.js",
                        "bower_components/angular-touch/angular-touch.min.js",
                        "bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.min.js",
                        "src/app.js"
                    ]
                }
            }
        },
        
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ["bower_components/mobile-angular-ui/dist/css/mobile-angular-ui-base.min.css"],
                dest: 'css/app.css'
            }
        }
    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Task definitions
    grunt.registerTask('default', ['uglify', 'concat']);
};
