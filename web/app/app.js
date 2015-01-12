/* App Module */

var bankaustriaTrendAnalyzer =
    angular.module('bankaustriaTrendAnalyzer',
        [
            'ngSanitize',
            'ngCsv',
            'bankaustriaTrendAnalyzer.model',
            'bankaustriaTrendAnalyzer.bankaustria-converter',
            'bankaustriaTrendAnalyzer.import'
        ]);
bankaustriaTrendAnalyzer.controller('BankListController', ['$scope', 'BookingItems', 'BankAustriaConverter', BankListController]);

bankaustriaTrendAnalyzer.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);