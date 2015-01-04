'use strict';

/* App Module */

var bankaustriaTrendAnalyzer = angular.module('bankaustria-trend-analyzer', ['ngSanitize', 'ngCsv']);
bankaustriaTrendAnalyzer.controller('bankListCtrl', ['$scope', BankListCtrl]);

bankaustriaTrendAnalyzer.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);