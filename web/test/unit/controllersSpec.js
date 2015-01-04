'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {

    describe('BankListCtrl', function () {

        var scope;
        var controller;

        beforeEach(module('bankaustria-trend-analyzer'));

        beforeEach(inject(function ($rootScope, $controller) {

            scope = $rootScope.$new();
            controller = $controller(BankListCtrl, {$scope: scope});

            scope.bookingitems = [
                {'bookingdate': 1361401200000, 'accountchange': -2.73, 'bookingtext': 'SPAR DANKT'},
                {'bookingdate': 1361487600000, 'accountchange': 2, 'bookingtext': 'MCDONALDS BLABLABLA'}
            ];
        }));

        it('shows a list of account changes', function () {
            expect(scope.bookingitems.length).toBe(2);
            expect(scope.bookingitems[0]['accountchange']).toBe(-2.73);

            expect(scope.currentbalance).toBe(0);
            expect(scope.startingbalance).toBe(0);
        });

        it('calculates with reference account balance', function () {
            scope.calculateFromEnd('1');


            expect(scope.bookingitems[0]['previousbalance']).toBe(1.73);
            expect(scope.bookingitems[0]['currentbalance']).toBe(-1);
            expect(scope.bookingitems[1]['previousbalance']).toBe(-1);
            expect(scope.bookingitems[1]['currentbalance']).toBe(1);
            expect(scope.currentbalance).toBe(1.00);
            expect(scope.startingbalance).toBe(1.73);
        });

        it('can calculate color for an account change', function () {
            expect(scope.getColor(0)).toBe('');
            expect(scope.getColor(-1)).toBe('red');
            expect(scope.getColor(1)).toBe('green');

        });

        it('can calculate color for a balance', function () {
            expect(scope.getColorBalance(0)).toBe('');
            expect(scope.getColorBalance(-1)).toBe('red');
            expect(scope.getColorBalance(1)).toBe('');

        });

        it('allows input of minus as first symbol', function () {
            var f = scope.containsValidSpecialCharacters;
            expect(f('-')).toBe(true);
            expect(f('1-')).toBe(false);
            expect(f('.')).toBe(true);
            expect(f('.0')).toBe(false);
            expect(f('1.')).toBe(true);
            expect(f('1.0')).toBe(false);
            expect(f('-.')).toBe(true);
            expect(f('-.1')).toBe(false);
            expect(f(',')).toBe(true);
            expect(f(undefined)).toBe(true);
        });

        it('can import files correctly', function() {
            var smallCsvText = 'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;W�hrung;Betrag;Belegdaten;\r\n' +
                '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-10,55;"";';

            var bigCsvText = 'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;W�hrung;Betrag;Belegdaten;\r\n' +
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
                'UM 15.34 UHR Kaiser Stra�e PK BANKCARD 4;;EUR;-60,00;"";\r\n';

            var event = {target: {result: smallCsvText}};
            scope.bookingitems = [];
            scope.loadData(event);
            expect(scope.bookingitems.length).toBe(1);
            expect(scope.bookingitems[0].currentbalance).toBe(0);
            expect(scope.bookingitems[0].previousbalance).toBe(10.55);
            expect(scope.bookingitems[0].bookingdate).toBe(1361487600000);
            expect(scope.bookingitems[0].accountchange).toBe(-10.55);
            expect(scope.bookingitems[0].bookingtext).toBe('MCDONALDS 66 0066  K4 22.02.UM 15.26     O');


            event = {target: {result: bigCsvText}};
            scope.loadData(event);
            expect(scope.bookingitems.length).toBe(3);
            expect(scope.bookingitems[2].currentbalance).toBe(0);
            expect(scope.bookingitems[2].previousbalance).toBe(10.55);
            expect(scope.bookingitems[2].bookingdate).toBe(1361487600000);
            expect(scope.bookingitems[2].accountchange).toBe(-10.55);
            expect(scope.bookingitems[2].bookingtext).toBe('MCDONALDS 66 0066  K4 22.02.UM 15.26     O');
            expect(scope.bookingitems[1].currentbalance).toBe(10.55);
            expect(scope.bookingitems[1].previousbalance).toBe(13.28);
            expect(scope.bookingitems[1].bookingdate).toBe(1361401200000);
            expect(scope.bookingitems[1].accountchange).toBe(-2.73);
            expect(scope.bookingitems[1].bookingtext).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
            expect(scope.bookingitems[0].currentbalance).toBe(13.28);
            expect(scope.bookingitems[0].previousbalance).toBe(73.28);
            expect(scope.bookingitems[0].bookingdate).toBe(1361314800000);
            expect(scope.bookingitems[0].accountchange).toBe(-60.00);
            expect(scope.bookingitems[0].bookingtext).toBe('ABHEBUNG AUTOMAT NR. 12705 AM 20.02. ' +
                'UM 15.34 UHR Kaiser Stra�e PK BANKCARD 4');

        })

    });
});
