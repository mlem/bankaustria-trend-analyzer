module.exports = function (config) {
    config.set({
        basePath: '../',

        files: [
            'app/lib/flot/excanvas.js',   // this ordering is needed
            'app/lib/flot/jquery.js',
            'app/lib/flot/jquery.flot.js',
            'app/lib/**/*.js',
            'test/lib/**/*.js',
            'app/js/**/*.js',
            'test/unit/**/*.js'
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


