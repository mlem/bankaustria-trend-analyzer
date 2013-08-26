function BankAustriaConverter() {
    this.parser = new DateParser();

    this.convert = function(value) {
        var datum = this.parser.parse(value['Buchungsdatum']);
        var betrag = value['Betrag'];
        var parsedBetrag = betrag.replace(/\,/, '.');
        var accountchange = parseFloat(parsedBetrag);
        return {'bookingdate': datum.getTime(), 'accountchange': accountchange, 'bookingtext': value['Buchungstext']};
    }

    this.convertAll = function(data) {
        var values = [];
        for(var key in data) {
            values.push(this.convert(data[key]));
        }
        return values;
    }
}

function DateParser() {
    this.parse = function(dateString) {
        var parts = dateString.split('/');
        var year = parseInt(parts[2]);
        var month = parseInt(parts[1]) - 1;
        var days = parseInt(parts[0]);

        //console.log('result: ' + year + '-' + month + '-'+ days)
        return new Date(year, month, days);
    };
};

function CsvReader(values) {

    var values = values;

    this.asObjects = function () {
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