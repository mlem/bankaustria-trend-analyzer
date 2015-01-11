/* App Module */

var bankaustriaTrendAnalyzer =
    angular.module('bankaustriaTrendAnalyzer',
        [
            'ngSanitize',
            'ngCsv',
            'fileReaderModule'
        ]);
bankaustriaTrendAnalyzer.controller('BankListController', ['$scope', BankListController]);

bankaustriaTrendAnalyzer.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);