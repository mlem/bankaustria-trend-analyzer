var sourcePreprocessors = 'coverage';
function isDebug(argument) {
    return argument === '--debug';
}
if (process.argv.some(isDebug)) {
    sourcePreprocessors = [];
}


module.exports = function (config) {
    config.set({
        basePath: '.',

        files: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-sanitize/angular-sanitize.js',
            'bower_components/ng-csv/build/ng-csv.js',
            'bower_components/angular-charts/dist/angular-charts.js',
            'bower_components/jquery-csv/src/jquery.csv.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'web/app/components/**/*module.js',
            'web/app/components/**/*.js',
            'web/app/view*/**/*.js',
            'web/app/app.js',
            'web/app/app-controller.js',
            'web/test/unit/**/*.js'
        ],

        preprocessors: { 'web/app/**/*.js': sourcePreprocessors },

        frameworks: ["jasmine"],

        autoWatch: true,

        browsers: ['PhantomJS'],

        junitReporter: {
            outputFile: 'build/reports/unit/unit.xml',
            suite: 'unit'
        },

        reporters: ['progress', 'coverage', 'junit'],

        coverageReporter: {
            // specify a common output directory
            dir: 'build/reports/coverage',
            reporters: [
                // reporters not supporting the `file` property
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
                { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
                { type: 'text', subdir: '.', file: 'text.txt' },
                { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
            ]
        }
    });
};


