'use strict';

/* Controllers */

function BankListCtrl($scope) {

    $scope.bookingitems = [
        {'bookingdate': 1361401200000, 'accountchange': -2.73, 'bookingtext': 'SPAR DANKT'},
        {'bookingdate': 1361487600000, 'accountchange': 2, 'bookingtext': 'MCDONALDS BLABLABLA'}
    ];

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;

    $scope.orderProp = "-'bookingdate'"

    $scope.setFile = function (element) {
        $scope.$apply(function ($scope) {
            $scope.import(element.files[0])
        });
    };

    $scope.loadData = function (event) {
        $scope.$apply(function () {

            var csv = event.target.result;
            var reader = new CsvReader(csv);
            var values = reader.asObjects();
            var converter = new BankAustriaConverter();
            $scope.bookingitems = converter.convertAll(values);
        });
    };

    $scope.import = function (inputfile) {
        console.log(inputfile.name);
        var reader = new FileReader();
        reader.readAsText(inputfile);
        reader.onload = $scope.loadData;
        reader.onerror = function () {
            alert('Unable to read ' + file.fileName);
        };
    };

    $scope.parseBalance = function (balance) {
        if (balance == undefined || balance == null) {
            return 0;
        }
        var balanceWithDot = balance.replace(/\,/, '.');
        return parseFloat(balanceWithDot);
    }

    $scope.calculateFromBegin = function (referenceBalance) {
        if ($scope.containsValidSpecialCharacters(referenceBalance)) return;
        var balance = $scope.parseBalance(referenceBalance);
        $scope.startingbalance = balance;
        for (var i = 0; i < $scope.bookingitems.length; i++) {
            balance += $scope.bookingitems[i]['accountchange'];
            balance = parseFloat(balance.toFixed(2));
            $scope.bookingitems[i]['currentbalance'] = balance;
        }
        $scope.currentbalance = balance;
    }

    $scope.containsValidSpecialCharacters = function(referenceBalance) {
        if (referenceBalance == '-')
            return true;
        var lastChar = referenceBalance[referenceBalance.length - 1];
        if (lastChar.match(/\.|,/))
            return true;
        return false;
    }

    $scope.calculateFromEnd = function (referenceBalance) {
        if ($scope.containsValidSpecialCharacters(referenceBalance)) return;
        var balance = $scope.parseBalance(referenceBalance);
        $scope.currentbalance = balance;
        for (var i = $scope.bookingitems.length - 1; i >= 0; i--) {
            $scope.bookingitems[i]['currentbalance'] = balance;
            balance -= $scope.bookingitems[i]['accountchange'];
            balance = parseFloat(balance.toFixed(2));
        }
        $scope.startingbalance = balance;
    }

    $scope.getColor = function (value) {
        if (value == 0) {
            return '';
        }
        return value > 0 ? 'green' : 'red'
    }


    $scope.getColorBalance = function (value) {
        return value >= 0 ? '' : 'red'
    }
}