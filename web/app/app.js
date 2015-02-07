/* App Module */

    angular.module('bankaustriaTrendAnalyzer',
        [
            'ngSanitize',
            'ngCsv',
            'bankaustriaTrendAnalyzer.model',
            'bankaustriaTrendAnalyzer.converter',
            'bankaustriaTrendAnalyzer.import',
            'bankaustriaTrendAnalyzer.controller.BankListController'
        ])
        .config(['$compileProvider', function ($compileProvider) {
            $compileProvider.debugInfoEnabled(true);
        }]);