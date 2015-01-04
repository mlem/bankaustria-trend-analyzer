'use strict';

/* Controllers */

function BankListCtrl($scope) {

    $scope.bookingitems = new BookingItems();

    $scope.$watch('currentbalance', function (newValue) {
        $scope.calculateFromEnd(newValue);
    });

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;

    $scope.orderProp = "artificialId";

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
            var convertedItems = convertFileToData(textFromFile);
            $scope.bookingitems.merge(convertedItems);
            $scope.calculateFromEnd($scope.currentbalance);
            $scope.$apply();
        }
        if (textFromFile.indexOf("artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash") >= 0) {
            var reader = new CsvReader();
            var values = reader.asObjects(textFromFile);
            values.every(function(obj) {
                obj.accountchange =  $scope.parseBalance(obj.accountchange);
                obj.currentbalance = $scope.parseBalance(obj.currentbalance);
                obj.previousbalance = $scope.parseBalance(obj.previousbalance);
                obj.bookingdate = parseInt(obj.bookingdate);
                obj.artificialId = parseInt(obj.artificialId);
                obj.id = parseInt(obj.id);
                obj.bookingdate = parseInt(obj.bookingdate);
                obj.hash = parseInt(obj.hash);
            });
            $scope.bookingitems.merge(values);
            $scope.currentbalance = $scope.bookingitems.items[$scope.bookingitems.items.length-1].currentbalance;
            $scope.startingbalance = $scope.bookingitems.items[0].previousbalance;
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
        if(Number(balance) === balance) {
            return balance;
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
        for (var i = $scope.bookingitems.items.length - 1; i >= 0; i--) {
            $scope.bookingitems.items[i].currentbalance = balance;
            balance -= $scope.bookingitems.items[i].accountchange;
            balance = parseFloat(balance.toFixed(2));
            $scope.bookingitems.items[i].previousbalance = balance;
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

