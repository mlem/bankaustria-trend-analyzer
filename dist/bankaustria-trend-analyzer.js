(function(window, document) {
'use strict';
// Source: web/app/components/account-calculations/BookingItems.js
var BookingItem = function () {
    this.artificialId = 0;
    this.bookingdate = 0;
    this.accountchange = 0.0;
    this.bookingtext = '';
    this.currentbalance = 0.0;
    this.previousbalance = 0.0;
    this.hash = 0;
};

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

Number.prototype.hashCode = function () {
    var hash = 0;
    hash = ((hash << 5) - hash) + this;
    hash |= 0; // Convert to 32bit integer
    return hash;
};

BookingItem.prototype.hashCode = function () {
    var result = this.bookingdate.hashCode();
    result = 31 * result + this.accountchange.hashCode();
    result = 31 * result + this.bookingtext.hashCode();
    return result;
};


var BookingItems = function () {
    this.items = [];
};

BookingItems.prototype.isBookingdateInTheMiddleOfArray = function (item) {
    return item.bookingdate > this.items[0].bookingdate && item.bookingdate < this.items[this.items.length - 1].bookingdate;
};
BookingItems.prototype.isBookingdateYounger = function (item) {
    return item.bookingdate > this.items[this.items.length - 1].bookingdate;
};
BookingItems.prototype.isBookingdateOlder = function (item) {
    return item.bookingdate <= this.items[0].bookingdate;
};
BookingItems.prototype.addItem = function (item) {
    if (this.items.length === 0) {
        this.items.push(item);
    } else if (this.isBookingdateInTheMiddleOfArray(item)) {
        this.innerMerge(item);
    } else if (this.isBookingdateYounger(item)) {
        this.items.push(item);
    } else if (this.isBookingdateOlder(item)) {
        this.items.unshift(item);
    }
};
BookingItems.prototype.innerMerge = function (item) {
    for (var i = 0; i < this.items.length; i++) {
        var firstTimeInArrayWhereItemIsOlder = item.bookingdate < this.items[i].bookingdate;
        if (firstTimeInArrayWhereItemIsOlder) {
            var laterPart = this.items.splice(i);
            this.items.push(item);
            this.items.push.apply(this.items, laterPart);
            return;
        }
    }
};
BookingItems.prototype.resetArtificialIds = function () {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].artificialId = i;
    }
};
BookingItems.prototype.itemExists = function (hashes, item) {
    for (var hashKey in hashes) {
        if (hashes[hashKey] === item.hash) {
            return true;
        }
    }
    return false;
};
/**
 * 3 kinds of merging:
 * * aligning items at the beginning of the array (old data)
 * * aligning items at the end of the array (new data)
 * * aligning items in the middle of the array (most complex - some data)
 * @param new items
 */
BookingItems.prototype.merge = function (arrayToMerge) {
    var hashes = this.items.map(function (item) {
        return item.hash;
    });
    for (var itemKey in arrayToMerge) {
        var item = arrayToMerge[itemKey];
        if (!this.itemExists(hashes, item)) {
            this.addItem(item);
        }
    }
    this.resetArtificialIds();
};// Source: web/app/components/account-calculations/account-cacluations.js
// Source: web/app/components/csv-parse/csv-parse.js
// Source: web/app/components/csv-parse/utils.js
function BankAustriaConverter() {
    this.parser = new DateParser();

    function parseAmount(value) {
        var amount = value.Betrag;
        var amountWithoutThousand = amount.replace(/\./, '');
        var parsedAmount = amountWithoutThousand.replace(/\,/, '.');
        return parsedAmount;
    }


    this.convert = function (value) {
        var date = this.parser.parse(value.Buchungsdatum);
        var parsedAmount = parseAmount(value);
        var accountChange = parseFloat(parsedAmount);
        var object = new BookingItem();
        object.bookingdate = date.getTime();
        object.accountchange = parseFloat(accountChange.toFixed(2));
        object.bookingtext = value['Buchungstext '];
        object.hash = object.hashCode();
        return  object;
    };

    this.convertAll = function (data) {
        var values = [];
        for (var key in data) {
            var item = this.convert(data[key]);
            values.push(item);
            item.artificialId = values.length;
            item.id = values.length;
        }
        return values;
    };
}

function DateParser() {
    function splitDateString(dateString) {
        if (dateString.indexOf('/') > 0) {
            return dateString.split('/');
        }
        if (dateString.indexOf('.') > 0) {
            return dateString.split('.');
        }
        return [];
    }

    this.parse = function (dateString) {
        var parts = splitDateString(dateString);
        var year = parseInt(parts[2], 10);
        var month = parseInt(parts[1], 10) - 1;
        var days = parseInt(parts[0], 10);
        return new Date(year, month, days);
    };
}

function CsvReader() {
    this.asObjects = function (values) {
        return $.csv.toObjects(values, {"separator": ";"});
    };
}// Source: web/app/components/file-import/file-import.js
// Source: web/app/display-data/display-data-controller.js
// Source: web/app/display-data/display-data-controller_test.js
// Source: web/app/mainpage/controllers.js
/* Controllers */

function BankListController($scope) {

    $scope.bookingitems = new BookingItems();

    $scope.$watch('currentbalance', function (newValue) {
        $scope.calculateFromEnd(newValue);
    });

    $scope.currentbalance = 0;
    $scope.startingbalance = 0;

    $scope.orderProp = "artificialId";

    $scope.displayType = "number:2";

    $scope.setFile = function (element) {
        $scope.import(element.files[0]);
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
            values.every(function (obj) {
                obj.accountchange = $scope.parseBalance(obj.accountchange);
                obj.currentbalance = $scope.parseBalance(obj.currentbalance);
                obj.previousbalance = $scope.parseBalance(obj.previousbalance);
                obj.bookingdate = parseInt(obj.bookingdate, 10);
                obj.artificialId = parseInt(obj.artificialId, 10);
                obj.id = parseInt(obj.id, 10);
                obj.bookingdate = parseInt(obj.bookingdate, 10);
                obj.hash = parseInt(obj.hash, 10);
            });
            $scope.bookingitems.merge(values);
            $scope.currentbalance = $scope.bookingitems.items[$scope.bookingitems.items.length - 1].currentbalance;
            $scope.startingbalance = $scope.bookingitems.items[0].previousbalance;
            $scope.$apply();
        }
    };

    $scope.import = function (inputfile) {
        console.log(inputfile.name);
        var reader = new FileReader();
        reader.readAsText(inputfile);
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
        if (typeof referenceBalance === 'undefined' || referenceBalance.length === 0)
            return true;
        if (referenceBalance == '-')
            return true;
        var lastChar = referenceBalance[referenceBalance.length - 1];
        if (lastChar.match(/\.|,/))
            return true;
        return false;
    };

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


BankListController.$inject = ['$scope'];

// Source: web/app/app.js
/* App Module */

var bankaustriaTrendAnalyzer = angular.module('bankaustriaTrendAnalyzer', ['ngSanitize', 'ngCsv']);
bankaustriaTrendAnalyzer.controller('BankListController', ['$scope', BankListController]);

bankaustriaTrendAnalyzer.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.debugInfoEnabled(true);
}]);// Source: web/app/app-controller.js
// Source: web/app/app.suffix
})(window, document);