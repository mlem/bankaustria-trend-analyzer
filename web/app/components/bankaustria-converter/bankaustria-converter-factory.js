angular.module('bankaustriaTrendAnalyzer.bankaustria-converter.bankaustria-converter-factory', [
    'bankaustriaTrendAnalyzer.model'])

    .service('BankAustriaConverter', function (BookingItem) {

        var bookingItemFactory = BookingItem;

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
                var object = {};
                object.bookingdate = date.getTime();
                object.accountchange = parsedAmount;
                object.bookingtext = value['Buchungstext '];
                return  bookingItemFactory.build(object);
            };

            this.convertAll = function (data) {
                var values = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var item = this.convert(data[key]);
                        values.push(item);
                        item.artificialId = values.length;
                        item.id = values.length;
                    }
                }
                return values;
            };

        }

        return new BankAustriaConverter();
    });