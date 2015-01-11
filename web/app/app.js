/* App Module */

var bankaustriaTrendAnalyzer = angular.module('bankaustriaTrendAnalyzer', ['ngSanitize', 'ngCsv']);
bankaustriaTrendAnalyzer.controller('BankListController', ['$scope', BankListController]);

bankaustriaTrendAnalyzer.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);