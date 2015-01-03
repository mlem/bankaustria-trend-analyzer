'use strict';

/* Controllers */

function BankListCtrl($scope) {

    $scope.bookingitems = {};

    $scope.$watch('currentbalance', function (newValue) {
        $scope.calculateFromEnd(newValue);
    });

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;

    $scope.orderProp = "-id";

    $scope.displayType = "number:2";

    $scope.setFile = function (element) {
        $scope.import(element.files[0])
        $scope.$apply();
    };

    function convertFileToData(textFromFile) {
        var reader = new CsvReader();
        var values = reader.asObjects(textFromFile);
        var converter = new BankAustriaConverter();
        return converter.convertAll(values);
    }

    $scope.loadData = function (event) {
        var textFromFile = event.target.result;
        if (textFromFile.indexOf("Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;") >= 0) {
            $scope.bookingitems = convertFileToData(textFromFile);
            //localStorage["bookingitems"] = JSON.stringify($scope.bookingitems);
            $scope.calculateFromEnd($scope.currentbalance);
            $scope.$apply();
        }
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
        if (balance === undefined || balance == null || balance === 0) {
            return 0;
        }
        var balanceWithDot = balance.replace(/\,/, '.');
        return parseFloat(balanceWithDot);
    }

    $scope.containsValidSpecialCharacters = function (referenceBalance) {
        if (referenceBalance === 0 || Number(referenceBalance) === referenceBalance) {
            return false;
        }
        if (typeof referenceBalance === 'undefined' || referenceBalance.length == 0)
            return true;
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
            $scope.bookingitems[i]['previousBalance'] = balance;
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


BankListCtrl.$inject = ['$scope'];

