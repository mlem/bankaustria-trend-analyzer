/* Controllers */

function BankListController($scope, BookingItems, BookingItem, BankAustriaConverter, csvReaderService) {

    $scope.bookingitems = BookingItems.build();
    var bankAustriaConverter = BankAustriaConverter;

    $scope.$watch('currentbalance', function (newValue) {
        $scope.calculateFromEnd(newValue);
    });

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;

    $scope.orderProp = "artificialId";

    $scope.displayType = "number:2";

    $scope.importfiles = [];

    $scope.$watch('importfiles', function (importfiles) {
        for (var i = 0; importfiles.length > i; i++) {
            $scope.import(importfiles[i]);
        }
    });

    function appConvertAll(values) {
        var result = [];
        for (var i = 0; i < values.length; i++) {
            var obj = values[i];
            obj.accountchange = $scope.parseBalance(obj.accountchange);
            obj.currentbalance = $scope.parseBalance(obj.currentbalance);
            obj.previousbalance = $scope.parseBalance(obj.previousbalance);
            obj.bookingdate = parseInt(obj.bookingdate, 10);
            obj.artificialId = parseInt(obj.artificialId, 10);
            obj.id = parseInt(obj.id, 10);

            // nice solution from stackoverflow: http://stackoverflow.com/questions/5396560/how-do-i-convert-special-utf-8-chars-to-their-iso-8859-1-equivalent-using-javasc
            obj.bookingtext = decodeURIComponent(escape(obj.bookingtext));
            obj.hash = parseInt(obj.hash, 10);
            result.push(BookingItem.build(obj));
        }
        return result.reverse();
    }

    $scope.loadData = function (event) {
        var textFromFile = event.target.result;
        var values = csvReaderService.asObjects(textFromFile);
        if (textFromFile.indexOf("Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;") >= 0) {
            $scope.bookingitems.merge(bankAustriaConverter.convertAll(values));
            $scope.calculateFromEnd($scope.currentbalance);
        } else if (textFromFile.indexOf("artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash") >= 0) {
            $scope.bookingitems.merge(appConvertAll(values));
            $scope.currentbalance = $scope.bookingitems.items[$scope.bookingitems.items.length - 1].currentbalance;
            $scope.startingbalance = $scope.bookingitems.items[0].previousbalance;
        }
        $scope.$apply();
    };

    $scope.import = function (inputfile) {
        var reader = new FileReader();
        reader.readAsText(inputfile, 'ISO-8859-1');
        reader.onload = $scope.loadData;
        reader.onerror = function (file) {
            alert('Unable to read ' + file.fileName);
        };
    };

    $scope.parseBalance = function (balance) {
        if (balance === undefined || balance === null || balance === 0) {
            return 0;
        }
        if (Number(balance) === balance) {
            return balance;
        }
        var balanceWithDot = balance.replace(/\,/, '.');
        return parseFloat(balanceWithDot);
    };

    $scope.containsValidSpecialCharacters = function (referenceBalance) {
        if (referenceBalance === 0 || Number(referenceBalance) === referenceBalance) {
            return false;
        }
        if (typeof referenceBalance === 'undefined' || referenceBalance.length === 0) {
            return true;
        }
        if (referenceBalance === '-') {
            return true;
        }
        var lastChar = referenceBalance[referenceBalance.length - 1];
        return !!lastChar.match(/\.|,/);

    };

    $scope.calculateFromEnd = function (referenceBalance) {
        if ($scope.containsValidSpecialCharacters(referenceBalance)) {
            return;
        }
        var balance = $scope.parseBalance(referenceBalance);
        $scope.currentbalance = balance;
        for (var i = $scope.bookingitems.items.length - 1; i >= 0; i--) {
            $scope.bookingitems.items[i].currentbalance = balance;
            balance -= $scope.bookingitems.items[i].accountchange;
            balance = parseFloat(balance.toFixed(2));
            $scope.bookingitems.items[i].previousbalance = balance;
        }
        $scope.startingbalance = balance;
    };

    $scope.getColor = function (value) {
        if (value === 0) {
            return '';
        }
        return value > 0 ? 'green' : 'red';
    };

    $scope.getColorBalance = function (value) {
        return value >= 0 ? '' : 'red';
    };
}

