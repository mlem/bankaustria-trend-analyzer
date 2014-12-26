module.exports = function (config) {
    config.set({
        basePath: '../../',

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-charts/dist/angular-charts.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery-csv/src/jquery.csv.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'web/app/js/**/*.js',
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


