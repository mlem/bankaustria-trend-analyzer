describe('Convert', function () {
    describe('BankAustria Data to Chart Data', function () {
        var converter;
        var recentDate;
        var olderDate;

        beforeEach(module('bankaustriaTrendAnalyzer'));

        beforeEach(inject(function (BankAustriaConverter) {
            converter = BankAustriaConverter;

            var parser = new DateParser();
            recentDate = parser.parse('05.07.2013');
            olderDate = parser.parse('29.05.2013');
        }));

        it('can convert a single object', function () {
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Valutadatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Interne Notiz': '',
                    'Währung': 'EUR',
                    'Betrag': '-2,73',
                    'Belegdaten': 'LASTSCHRIFT'
                });

            expect(result.bookingdate).toBe(1361404800000);
            expect(result.accountchange).toBe(-2.73);
            expect(result.bookingtext).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
        });


        it('can convert accountchange with comma correctly', function () {
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Betrag': '-2,73'
                });
            expect(result.accountchange).toBe(-2.73);
        });


        it('can convert accountchange with comma and thousand-dot correctly', function () {
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Betrag': '-2.000,73'
                });
            expect(result.accountchange).toBe(-2000.73);
        });


        it('can convert accountchange with dot correctly', function () {
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Betrag': '-2.73'
                });
            expect(result.accountchange).toBe(-2.73);
        });

        it('can convert accountchange with dot and thousand-comma correctly', function () {
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Betrag': '-2,000.73'
                });
            expect(result.accountchange).toBe(-2000.73);
        });

        it('can calculate correct hashcode', function() {

            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Valutadatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Interne Notiz': '',
                    'Währung': 'EUR',
                    'Betrag': '-2,73',
                    'Belegdaten': 'LASTSCHRIFT'
                });
            expect(result.hash).toBe(-95247701412);
        });

        it('can convert a set of objects', function () {
            var obj1 = {   'Buchungsdatum': '22/02/2013',
                'Valutadatum': '22/02/2013',
                'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                'Interne Notiz': '',
                'Währung': 'EUR',
                'Betrag': '2,00',
                'Belegdaten': 'LASTSCHRIFT'
            };
            var obj2 = {'Buchungsdatum': '21/02/2013',
                'Valutadatum': '21/02/2013',
                'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                'Interne Notiz': '',
                'Währung': 'EUR',
                'Betrag': '-2,73',
                'Belegdaten': 'LASTSCHRIFT'
            };

            var data = {obj1: obj1, obj2: obj2};
            var result = converter.convertAll(data);

            expect(result.length).toBe(2);

            var firstResult = result[0];
            var secondResult = result[1];
            expect(firstResult.bookingdate).toBe(1361491200000);
            expect(firstResult.accountchange).toBe(2);
            expect(firstResult.id).toBe(1);
            expect(firstResult.hash).toBe(-12217301288);
            expect(secondResult.bookingdate).toBe(1361404800000);
            expect(secondResult.accountchange).toBe(-2.73);
            expect(secondResult.id).toBe(2);
            expect(secondResult.hash).toBe(-95247701412);
        });

        it('30.01.2013 should have a higher value than 01.01.2013', function () {
            expect(new Date(2013, 1 - 1, 30).getTime()).toBeGreaterThan(new Date(2013, 1 - 1, 1).getTime());
            expect(recentDate.getTime()).toBeGreaterThan(olderDate.getTime());
        });

    });

});
