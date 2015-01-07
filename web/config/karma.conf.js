module.exports = function (config) {
    config.set({
        basePath: '../../',

        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/ng-csv/build/ng-csv.js',
            'bower_components/angular-charts/dist/angular-charts.js',
            'bower_components/jquery-csv/src/jquery.csv.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'web/app/components/**/*.js',
            'web/app/display-data/*.js',
            'web/app/mainpage/*.js',
            'web/app/app.js',
            'web/app/app-controller.js',
            'web/test/unit/**/*.js'
        ],

        frameworks: ["jasmine"],

        autoWatch: true,

        browsers: ['Chrome'],

        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};


