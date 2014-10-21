module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        uglify: {
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
        }
    });

    // Load required modules
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // Task definitions
    grunt.registerTask('default', ['uglify']);
};
