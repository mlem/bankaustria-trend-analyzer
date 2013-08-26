describe('Convert', function () {
    describe('BankAustria Data to Chart Data', function () {
        it('can convert a single object', function () {
            var converter = new BankAustriaConverter();
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Valutadatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Interne Notiz': '',
                    'W�hrung': 'EUR',
                    'Betrag': '-2,73',
                    'Belegdaten': 'LASTSCHRIFT'
                });

            expect(result['bookingdate']).toBe(1361401200000);
            expect(result['accountchange']).toBe(-2.73);
            expect(result['bookingtext']).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
        });

        it('can convert a set of objects', function () {
            var converter = new BankAustriaConverter();
            var obj1 = {'Buchungsdatum': '21/02/2013',
                'Valutadatum': '21/02/2013',
                'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                'Interne Notiz': '',
                'W�hrung': 'EUR',
                'Betrag': '-2,73',
                'Belegdaten': 'LASTSCHRIFT'
            };
            var obj2 = {   'Buchungsdatum': '22/02/2013',
                'Valutadatum': '22/02/2013',
                'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                'Interne Notiz': '',
                'W�hrung': 'EUR',
                'Betrag': '2,00',
                'Belegdaten': 'LASTSCHRIFT'
            };

            var data = {obj1: obj1, obj2: obj2};
            var result = converter.convertAll(data);

            expect(result.length).toBe(2);
            expect(result[0]['bookingdate']).toBe(1361401200000);
            expect(result[0]['accountchange']).toBe(-2.73);
            expect(result[1]['bookingdate']).toBe(1361487600000);
            expect(result[1]['accountchange']).toBe(2);
        });
    });

});
