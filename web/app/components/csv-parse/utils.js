function BankAustriaConverter() {
    this.parser = new DateParser();

    function parseAmount(value) {
        var amount = value.Betrag;
        var amountWithoutDelimiters = amount.replace(/\./, '').replace(/\,/, '');
        return parseInt(amountWithoutDelimiters, 10) / 100;
    }

    this.convert = function (value) {
        var date = this.parser.parse(value.Buchungsdatum);
        var parsedAmount = parseAmount(value);
        var object = new BookingItem();
        object.bookingdate = date.getTime();
        object.accountchange = parsedAmount;
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
        var year = parts[2];
        var month = parts[1] - 1;
        var days = parts[0];
        return new Date(Date.UTC(year, month, days));
    };
}

function CsvReader() {
    this.asObjects = function (values) {
        return $.csv.toObjects(values, {"separator": ";"});
    };
}