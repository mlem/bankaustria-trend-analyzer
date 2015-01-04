String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
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

function hashCode(object) {
    var result = object.bookingdate.hashCode();
    result = 31 * result + object.accountchange.hashCode();
    result = 31 * result + object.bookingtext.hashCode();
    return result;
};




function BankAustriaConverter() {
    this.parser = new DateParser();

    function parseAmount(value) {
        var amount = value['Betrag'];
        var amountWithoutThousand = amount.replace(/\./, '');
        var parsedAmount = amountWithoutThousand.replace(/\,/, '.');
        return parsedAmount;
    }



    this.convert = function(value) {
        var date = this.parser.parse(value['Buchungsdatum']);
        var parsedAmount = parseAmount(value);
        var accountChange = parseFloat(parsedAmount);
        var object = {'bookingdate': date.getTime(), 'accountchange': parseFloat(accountChange.toFixed(2)), 'bookingtext': value['Buchungstext ']};
        var hash = hashCode(object);
        object.hash = hash;
        return  object;
    }

    this.sortByBookingdate = function(values) {
        var sortedValues = values.sort(function(a, b) {
            a = a['bookingdate'];
            b = b['bookingdate'];
            if(a === b) {
                return 1;
            }

            return a - b;
        });
        return sortedValues;
    }

    this.convertAll = function(data) {
        var values = [];
        for(var key in data) {
            var item = this.convert(data[key]);
            values.push(item);
            item['id']=values.length;
        }
        values = this.sortByBookingdate(values);
        return values;
    }
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

    this.parse = function(dateString) {
        var parts = splitDateString(dateString);
        var year = parseInt(parts[2]);
        var month = parseInt(parts[1]) - 1;
        var days = parseInt(parts[0]);

        //console.log('result: ' + year + '-' + month + '-'+ days)
        return new Date(year, month, days);
    };
};

function CsvReader() {
    this.asObjects = function (values) {
        return $.csv.toObjects(values, {"separator": ";"});
    }
};

function Merger() {
    this.merge = function (a, b) {
        var result = a.slice(0);
        for (var bKey in b) {
            result[bKey] = b[bKey];
        }
        return result;

    }
};