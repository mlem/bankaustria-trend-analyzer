'use strict';

/* Controllers */

function BankListCtrl($scope) {

    $scope.bookingitems = [{'bookingdate': 1361401200000, 'accountchange': -2.73, 'bookingtext': 'SPAR DANKT'},
        {'bookingdate': 1361487600000, 'accountchange': 2, 'bookingtext': 'MCDONALDS BLABLABLA'}];

    $scope.pos = 'calculateFromBegin';

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;


    $scope.calculate = function(referenceBalance) {
        if($scope.pos == 'calculateFromEnd') {
            $scope.calculateFromEnd(referenceBalance);
        }
        if($scope.pos == 'calculateFromBegin') {
            $scope.calculateFromBegin(referenceBalance);
        }
        console.log('wrong pos: ' + $scope.pos);
    }

    $scope.calculateFromBegin = function(referenceBalance) {
        var balance = parseFloat(referenceBalance);
        $scope.startingbalance = balance;
        for(var i = 0; i < $scope.bookingitems.length; i++) {
            balance += $scope.bookingitems[i]['accountchange'];
            $scope.bookingitems[i]['currentbalance'] = balance;
        }
        $scope.currentbalance = balance;
    }

    $scope.calculateFromEnd = function(referenceBalance) {
        var balance = parseFloat(referenceBalance);
        $scope.currentbalance = balance;
        for(var i = $scope.bookingitems.length-1; i >= 0; i--) {
            $scope.bookingitems[i]['currentbalance'] = balance;
            balance -= $scope.bookingitems[i]['accountchange'];
        }
        $scope.startingbalance = balance;
    }
}