'use strict';

/* Controllers */

function BankListCtrl($scope) {

    $scope.setFile = function(element) {
        $scope.$apply(function($scope) {
            $scope.import(element.files[0])
        });
    };

    $scope.loadData = function(event){
        $scope.$apply(function() {

        var csv = event.target.result;
        var reader = new CsvReader(csv);
        var values = reader.asObjects();
        var converter = new BankAustriaConverter();
        $scope.bookingitems = converter.convertAll(values);
        });
    };

    $scope.import = function(inputfile) {
        console.log(inputfile.name);
        var reader = new FileReader();
        reader.readAsText(inputfile);
        reader.onload = $scope.loadData;
        reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
    };

    $scope.bookingitems = [{'bookingdate': 1361401200000, 'accountchange': -2.73, 'bookingtext': 'SPAR DANKT'},
        {'bookingdate': 1361487600000, 'accountchange': 2, 'bookingtext': 'MCDONALDS BLABLABLA'}];

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;

    $scope.parseBalance = function(balance) {
        if(balance == undefined || balance == null) {
            return 0;
        }
        return parseFloat(balance);
    }

    $scope.calculateFromBegin = function(referenceBalance) {
        var balance = $scope.parseBalance(referenceBalance);
        $scope.startingbalance = balance;
        for(var i = 0; i < $scope.bookingitems.length; i++) {
            balance += $scope.bookingitems[i]['accountchange'];
            balance = parseFloat(balance.toFixed(2));
            $scope.bookingitems[i]['currentbalance'] = balance;
        }
        $scope.currentbalance = balance;
    }

    $scope.calculateFromEnd = function(referenceBalance) {
        var balance = $scope.parseBalance(referenceBalance);
        $scope.currentbalance = balance;
        for(var i = $scope.bookingitems.length-1; i >= 0; i--) {
            $scope.bookingitems[i]['currentbalance'] = balance;
            balance -= $scope.bookingitems[i]['accountchange'];
            balance = parseFloat(balance.toFixed(2));
        }
        $scope.startingbalance = balance;
    }
}