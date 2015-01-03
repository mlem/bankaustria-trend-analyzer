describe('csv file reader', function () {
    describe('with objects', function () {

        var smallReader;
        var bigReader;
        var objectArray;

        beforeEach(function () {
            smallReader = new CsvReader(
                'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;W�hrung;Betrag;Belegdaten;\r\n' +
                    '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-10,55;"";',
                $
            );

            bigReader = new CsvReader(
                'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;W�hrung;Betrag;Belegdaten;\r\n' +
                    '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-10,55;"";\r\n' +
                    '21/02/2013;21/02/2013;SPAR DANKT  0554P K4 20.02.UM 12.64;;EUR;-2,73;"LASTSCHRIFT\r\n' +
                    'Belegnr.: 130624.666.462.043\r\n' +
                    '21.02.2013                       60322 555 200\r\n' +
                    'Zahlungspfl.:\r\n' +
                    'Zahlungsempf.:\r\n' +
                    'Kontonummer: 00700 256 550 Bankleitzahl: 12000\r\n' +
                    'Zahlungsgrund:\r\n' +
                    'Betrag:\r\n' +
                    '----------\r\n' +
                    'EUR            2,73";\r\n' +
                    '20/02/2013;20/02/2013;ABHEBUNG AUTOMAT NR. 12705 AM 20.02. ' +
                    'UM 15.34 UHR Kaiser Stra�e PK BANKCARD 4;;EUR;-60,00;"";\r\n',
                $
            );


            objectArray = smallReader.asObjects();

        });

        it('result is not undefined', function () {
            expect(objectArray).not.toBeUndefined();
        });

        it('result has one item in object', function () {
            expect(objectArray.length).toBe(1);
        });

        it('has keys "Buchungsdatum", "Valutadatum", "Buchugnstext ", "Interne Notiz", "W?hrung", "Betrag", "Belegdaten"', function () {
            var iterationKeys = Object.keys(objectArray);
            var firstObject = objectArray[iterationKeys[0]];
            var keys = Object.keys(firstObject);
            expect(keys.length).toBeGreaterThan(0);
            expect(keys.length).toBe(8);
            expect(keys).toEqual([ 'Buchungsdatum', 'Valutadatum', 'Buchungstext ', 'Interne Notiz', 'W�hrung', 'Betrag', 'Belegdaten', '' ]);
        });


        it('can read object', function () {
            var iterationKeys = Object.keys(objectArray);
            var firstObject = objectArray[iterationKeys[0]];
            expectFirstDatasetToEqual(firstObject);
        });

        function expectFirstDatasetToEqual(firstObject) {
            expect(firstObject['Buchungsdatum'], 'Buchungsdatum').toBe('22/02/2013');
            expect(firstObject['Valutadatum'], 'Valutdatum').toBe('22/02/2013');
            expect(firstObject['Buchungstext '], 'Buchungstext').toBe('MCDONALDS 66 0066  K4 22.02.UM 15.26     O');
            expect(firstObject['Interne Notiz']).toBe('');
            expect(firstObject['W�hrung']).toBe('EUR');
            expect(firstObject['Betrag']).toBe('-10,55');
            expect(firstObject['Belegdaten']).toBe('');
        };

        function expectSecondDatasetToEqual(secondObject) {
            expect(secondObject['Buchungsdatum'], 'Buchungsdatum').toBe('21/02/2013');
            expect(secondObject['Valutadatum'], 'Valutdatum').toBe('21/02/2013');
            expect(secondObject['Buchungstext '], 'Buchungstext').toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
            expect(secondObject['Interne Notiz']).toBe('');
            expect(secondObject['W�hrung']).toBe('EUR');
            expect(secondObject['Betrag']).toBe('-2,73');
            expect(secondObject['Belegdaten']).toBe('LASTSCHRIFT\r\n' +
                'Belegnr.: 130624.666.462.043\r\n' +
                '21.02.2013                       60322 555 200\r\n' +
                'Zahlungspfl.:\r\n' +
                'Zahlungsempf.:\r\n' +
                'Kontonummer: 00700 256 550 Bankleitzahl: 12000\r\n' +
                'Zahlungsgrund:\r\n' +
                'Betrag:\r\n' +
                '----------\r\n' +
                'EUR            2,73');
        }

        it('can read multi line data', function () {
            var objectArray = bigReader.asObjects();
            expect(objectArray.length).toBe(3);
            var iterationKeys = Object.keys(objectArray);
            var secondObject = objectArray[iterationKeys[1]];
            expectSecondDatasetToEqual(secondObject);
        });

        it('can merge data with new data', function () {
            var objectArray = smallReader.asObjects();
            expect(objectArray.length).toBe(1);
            var bigObjectArray = bigReader.asObjects();
            expect(bigObjectArray.length).toBe(3);
            var resultObject = new Merger().merge(objectArray, bigObjectArray);
            expect(resultObject.length).toBe(3);
            var keys = Object.keys(resultObject);
            expectFirstDatasetToEqual(resultObject[keys[0]]);
            expectSecondDatasetToEqual(resultObject[keys[1]]);
        });
    });
});