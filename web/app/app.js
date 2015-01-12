/* App Module */

var bankaustriaTrendAnalyzer =
    angular.module('bankaustriaTrendAnalyzer',
        [
            'ngSanitize',
            'ngCsv',
            'bankaustriaTrendAnalyzer.model',
            'bankaustriaTrendAnalyzer.converter',
            'bankaustriaTrendAnalyzer.import'
        ]);
bankaustriaTrendAnalyzer.controller('BankListController', ['$scope', 'BookingItems', 'BookingItem', 'BankAustriaConverter', BankListController]);

bankaustriaTrendAnalyzer.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);