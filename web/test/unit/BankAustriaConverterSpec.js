describe('Convert', function () {
    describe('BankAustria Data to Chart Data', function () {
        var converter;
        var recentDate;
        var olderDate;

        beforeEach(function () {
            converter = new BankAustriaConverter();

            var parser = new DateParser();
            recentDate = parser.parse('05.07.2013');
            olderDate = parser.parse('29.05.2013');
        });

        it('can convert a single object', function () {
            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Valutadatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Interne Notiz': '',
                    'W�hrung': 'EUR',
                    'Betrag': '-2,73',
                    'Belegdaten': 'LASTSCHRIFT'
                });

            expect(result.bookingdate).toBe(1361401200000);
            expect(result.accountchange).toBe(-2.73);
            expect(result.bookingtext).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
        });

        it('can calculate correct hashcode for numbers', function() {

            var result = converter.convert(
                {   'Buchungsdatum': '21/02/2013',
                    'Valutadatum': '21/02/2013',
                    'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                    'Interne Notiz': '',
                    'W�hrung': 'EUR',
                    'Betrag': '-2,73',
                    'Belegdaten': 'LASTSCHRIFT'
                });
            expect(result.hash).toBe(-98707301412);
            var number = 1;
            expect(number.hashCode()).toBe(1);
            number = 2;
            expect(number.hashCode()).toBe(2);
            number = -2;
            expect(number.hashCode()).toBe(-2);
        });

        it('can convert a set of objects', function () {
            var obj1 = {   'Buchungsdatum': '22/02/2013',
                'Valutadatum': '22/02/2013',
                'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                'Interne Notiz': '',
                'W�hrung': 'EUR',
                'Betrag': '2,00',
                'Belegdaten': 'LASTSCHRIFT'
            };
            var obj2 = {'Buchungsdatum': '21/02/2013',
                'Valutadatum': '21/02/2013',
                'Buchungstext ': 'SPAR DANKT  0554P K4 20.02.UM 12.64',
                'Interne Notiz': '',
                'W�hrung': 'EUR',
                'Betrag': '-2,73',
                'Belegdaten': 'LASTSCHRIFT'
            };

            var data = {obj1: obj1, obj2: obj2};
            var result = converter.convertAll(data);


            expect(result.length).toBe(2);
            expect(result[0].bookingdate).toBe(1361401200000);
            expect(result[0].accountchange).toBe(-2.73);
            expect(result[0].id).toBe(2);
            expect(result[0].hash).toBe(-98707301412);
            expect(result[1].bookingdate).toBe(1361487600000);
            expect(result[1].accountchange).toBe(2);
            expect(result[1].id).toBe(1);
            expect(result[1].hash).toBe(-15676901288);
        });

        it('30.01.2013 should have a higher value than 01.01.2013', function () {
            expect(new Date(2013, 1 - 1, 30).getTime()).toBeGreaterThan(new Date(2013, 1 - 1, 1).getTime());
            expect(recentDate.getTime()).toBeGreaterThan(olderDate.getTime());
        });

        it('sorter should sort 05.07.2013 and 29.05.2013 correctly', function () {
            var sortedArray = converter.sortByBookingdate([
                {'bookingdate': recentDate.getTime()},
                {'bookingdate': olderDate.getTime()}
            ]);
            expect(sortedArray[0].bookingdate).toEqual(olderDate.getTime());
            expect(sortedArray[1].bookingdate).toEqual(recentDate.getTime());
        });
        it('sorter should sort 05.07.2013, 05.07.2013 and 29.05.2013 correctly', function () {
            var sortedArray = converter.sortByBookingdate([
                {'bookingdate': recentDate.getTime(), number: 1},
                {'bookingdate': recentDate.getTime(), number: 2},
                {'bookingdate': olderDate.getTime(), number: 3}
            ]);
            expect(sortedArray[0].number).toBe(3);
            expect(sortedArray[1].number).toBe(2);
            expect(sortedArray[2].number).toBe(1);
        });
    });

});
