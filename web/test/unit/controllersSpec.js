/* jasmine specs for controllers go here */

function browserCompatibleBlobCreator(appFile, mimeString) {
    var blob;
    try {
        blob = new Blob([appFile], {type: mimeString});
    } catch (e) {
        // The BlobBuilder API has been deprecated in favour of Blob, but older
        // browsers don't know about the Blob constructor
        // IE10 also supports BlobBuilder, but since the `Blob` constructor
        //  also works, there's no need to add `MSBlobBuilder`.
        var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        var bb = new BlobBuilder();
        bb.append(appFile);
        blob = bb.getBlob(mimeString);
    }
    return blob;
}
describe('controllers', function () {

    describe('BankListController', function () {

        var scope;
        var controller;
        var bookingItemsFactory;

        beforeEach(module('bankaustriaTrendAnalyzer.controller.BankListController'));

        beforeEach(inject(function ($rootScope, $controller, _BookingItems_, _BookingItem_, _BankAustriaConverter_) {
            bookingItemsFactory = _BookingItems_;
            scope = $rootScope.$new();
            controller = $controller('BankListController', {
                $scope: scope,
                BookingItems: bookingItemsFactory,
                BankAustriaConverter: _BankAustriaConverter_
            });

            scope.bookingitems = _BookingItems_.build();
            scope.bookingitems.addItem({
                'bookingdate': 1361401200000,
                'accountchange': -2.73,
                'bookingtext': 'SPAR DANKT'
            });
            scope.bookingitems.addItem({
                'bookingdate': 1361487600000,
                'accountchange': 2,
                'bookingtext': 'MCDONALDS BLABLABLA'
            });
        }));

        it('shows a list of account changes', function () {
            expect(scope.bookingitems.items.length).toBe(2);
            expect(scope.bookingitems.items[0].accountchange).toBe(-2.73);

            expect(scope.currentbalance).toBe(0);
            expect(scope.startingbalance).toBe(0);
        });

        it('calculates with reference account balance', function () {
            scope.calculateFromEnd('1');


            expect(scope.bookingitems.items[0].previousbalance).toBe(1.73);
            expect(scope.bookingitems.items[0].currentbalance).toBe(-1);
            expect(scope.bookingitems.items[1].previousbalance).toBe(-1);
            expect(scope.bookingitems.items[1].currentbalance).toBe(1);
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

        it('can import files correctly', function () {
            var smallCsvText = 'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;Währung;Betrag;Belegdaten;\r\n' +
                '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-10,55;"";';

            var bigCsvText = 'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;Währung;Betrag;Belegdaten;\r\n' +
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
                'UM 15.34 UHR Kaiser Straße PK BANKCARD 4;;EUR;-60,00;"";\r\n';

            var event = {target: {result: smallCsvText}};
            scope.bookingitems = bookingItemsFactory.build();
            scope.loadData(event);
            expect(scope.bookingitems.items.length).toBe(1);
            expect(scope.bookingitems.items[0].currentbalance).toBe(0);
            expect(scope.bookingitems.items[0].previousbalance).toBe(10.55);
            expect(scope.bookingitems.items[0].bookingdate).toBe(1361491200000);
            expect(scope.bookingitems.items[0].accountchange).toBe(-10.55);
            expect(scope.bookingitems.items[0].bookingtext).toBe('MCDONALDS 66 0066  K4 22.02.UM 15.26     O');

            event = {target: {result: bigCsvText}};
            scope.loadData(event);
            expect(scope.bookingitems.items.length).toBe(3);
            expect(scope.bookingitems.items[2].currentbalance).toBe(0);
            expect(scope.bookingitems.items[2].previousbalance).toBe(10.55);
            expect(scope.bookingitems.items[2].bookingdate).toBe(1361491200000);
            expect(scope.bookingitems.items[2].accountchange).toBe(-10.55);
            expect(scope.bookingitems.items[2].bookingtext).toBe('MCDONALDS 66 0066  K4 22.02.UM 15.26     O');
            expect(scope.bookingitems.items[1].currentbalance).toBe(10.55);
            expect(scope.bookingitems.items[1].previousbalance).toBe(13.28);
            expect(scope.bookingitems.items[1].bookingdate).toBe(1361404800000);
            expect(scope.bookingitems.items[1].accountchange).toBe(-2.73);
            expect(scope.bookingitems.items[1].bookingtext).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
            expect(scope.bookingitems.items[0].currentbalance).toBe(13.28);
            expect(scope.bookingitems.items[0].previousbalance).toBe(73.28);
            expect(scope.bookingitems.items[0].bookingdate).toBe(1361318400000);
            expect(scope.bookingitems.items[0].accountchange).toBe(-60.00);
            expect(scope.bookingitems.items[0].bookingtext).toBe('ABHEBUNG AUTOMAT NR. 12705 AM 20.02. ' +
            'UM 15.34 UHR Kaiser Straße PK BANKCARD 4');

        });


        it('can import files with different titles', function () {
            var smallCsvText = 'EZ;Buchungsdatum;Valutadatum;Buchungstext;Interne Notiz;Währung;Betrag;Belegdaten;Belegnummer;Auftraggebername;Auftraggeberkonto;Auftraggeber BIC;Empfängername;Empfängerkonto;Empfänger BIC;Zahlungsgrund;\r\n'+
            '28.02.2020;28.02.2020; SEPA Lastschrift a/Hutchison Drei Austria GmbH                                                                                                                                                                                                                ;;EUR;-20,25;SEPA LASTSCHRIFT                                             Belegnr.: 123.123.123                                            28.02.2020                EUR    1234 123 123 123  Zahlungspfl.: mlem                                           !                SomeAddress 123/123, AT-1320,Wien,Aus                    !          IBAN: AT1234567897                 BIC: BLABLUB     !            ID:                                                           !                                                                          ! Zahlungsgrund:                                                           !                                                                          !                                                                          !  Zahlungsref.:                                                           !   Mandatsref.: 2025                                          ! Zahlungsempf.: Hutchison Drei Austria GmbH                               !                                                                          !          IBAN: AT893100000400292896                 BIC: RZBAATWW        ! Valuta:28.02            ID:                                                           !                                                                          !           CID: AT34ZZZ00000018433 SEPA                                   ! Betrag:     EUR Zahlungszweck:                                                           !           20,25;\'123456789797;Hutchison Drei Austria GmbH                                                                                                                                                                             ;AT1234565456              ;BLUBBST   ;mlem                       SomeAddress 123/123, AT-1320,Wien,Aus                                                                                                                            ;AT1234123123             ;BLABLUB;                                                                                                                                                                                                                                                ;';

            var event = {target: {result: smallCsvText}};
            scope.bookingitems = bookingItemsFactory.build();
            scope.loadData(event);
            expect(scope.bookingitems.items.length).toBe(1);
            expect(scope.bookingitems.items[0].currentbalance).toBe(0);
            expect(scope.bookingitems.items[0].previousbalance).toBe(20.25);
            expect(scope.bookingitems.items[0].bookingdate).toBe(1582848000000);
            expect(scope.bookingitems.items[0].accountchange).toBe(-20.25);
            expect(scope.bookingitems.items[0].bookingtext).toBe('SEPA Lastschrift a/Hutchison Drei Austria GmbH');

        });

        it('is not parsing anymore if it has already a number', function () {
            var parseBalance = scope.parseBalance(-123.45);
            expect(parseBalance).toBe(-123.45);
        });

        it('can import exported file with one dataset correctly', function () {
            var smallCsvText = 'artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash;id\r\n' +
                '0;1369000800000;-2.47;BILLA DANKT  1610  K4 18.05.UM 08.21     O;-123.82;-121.35;-1050225974289;113';

            var event = {target: {result: smallCsvText}};
            scope.bookingitems = bookingItemsFactory.build({items: []});
            scope.loadData(event);
            expect(scope.bookingitems.items.length).toBe(1);
            expect(scope.bookingitems.items[0].currentbalance).toBe(-123.82);
            expect(scope.bookingitems.items[0].previousbalance).toBe(-121.35);
            expect(scope.bookingitems.items[0].bookingdate).toBe(1369000800000);
            expect(scope.bookingitems.items[0].accountchange).toBe(-2.47);
            expect(scope.bookingitems.items[0].bookingtext).toBe('BILLA DANKT  1610  K4 18.05.UM 08.21     O');
        });


        describe('can import exported utf-8 file', function () {

            var appFile = 'artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash;id\r\n' +
                '0;1361404800000;-2.5;SPAR DANKT  0554P K4 20.02.UM 12.64;1;3.5;-95247701412;3\r\n' +
                '1;1361491200000;-2;MCDONALDS äöü66 0066  K4 22.02.UM 15.26     O;0;1;-14546483804;2\r\n' +
                '2;1361491200000;-1;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;0;1;-14546483773;1';
            beforeEach(function (done) {
                scope.bookingitems = bookingItemsFactory.build({items: []});

                var blob = browserCompatibleBlobCreator(appFile, 'text/csv;charset=utf-8;');

                var oldLoadData = scope.loadData;
                scope.loadData = function (event) {
                    oldLoadData(event);
                    done();
                };
                scope.import(blob);
            });

            it('async assertions', function (done) {
                expect(scope.bookingitems.items.length).toBe(3);

                expect(scope.bookingitems.items[0].bookingdate).toBe(1361404800000);
                expect(scope.bookingitems.items[0].accountchange).toBe(-2.5);
                expect(scope.bookingitems.items[0].bookingtext).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
                expect(scope.bookingitems.items[0].hash).toBe(-95247701412);

                expect(scope.bookingitems.items[1].bookingdate).toBe(1361491200000);
                expect(scope.bookingitems.items[1].accountchange).toBe(-2);
                expect(scope.bookingitems.items[1].bookingtext).toBe('MCDONALDS äöü66 0066  K4 22.02.UM 15.26     O');
                expect(scope.bookingitems.items[1].hash).toBe(-14165366243);

                expect(scope.bookingitems.items[2].bookingdate).toBe(1361491200000);
                expect(scope.bookingitems.items[2].accountchange).toBe(-1);
                expect(scope.bookingitems.items[2].bookingtext).toBe('MCDONALDS 66 0066  K4 22.02.UM 15.26     O');
                expect(scope.bookingitems.items[2].hash).toBe(-14546483804);

                expect(scope.bookingitems.items[0].accountchange).toBe(-2.5);
                expect(scope.bookingitems.items[1].accountchange).toBe(-2);
                expect(scope.bookingitems.items[2].accountchange).toBe(-1);
                done();
            });

        });

        describe('can import exported iso file', function () {
            var smallCsvText = 'artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash;id\r\n' +
                '0;1361404800000;-2.5;SPAR DANKT  0554P K4 20.02.UM 12.64;1;3.5;-95247701412;3\r\n' +
                '1;1361491200000;-1;MCDONALDSöäü 66 0066  K4 22.02.UM 15.26     O;0;1;-14546483804;2\r\n' +
                '2;1369000800000;-2.47;BILLA DANKT  1610  K4 18.05.UM 08.21     O;-123.82;-121.35;-1050225974289;1';

            beforeEach(function (done) {
                scope.bookingitems = bookingItemsFactory.build({items: []});

                var blob = browserCompatibleBlobCreator(smallCsvText, 'text/csv;charset=ISO-8859-1;');

                var oldLoadData = scope.loadData;
                scope.loadData = function (event) {
                    oldLoadData(event);
                    done();
                };
                scope.import(blob);
            });

            it('async assertions', function (done) {
                expect(scope.bookingitems.items.length).toBe(3);
                expect(scope.bookingitems.items[0].bookingdate).toBe(1361404800000);
                expect(scope.bookingitems.items[0].accountchange).toBe(-2.5);
                expect(scope.bookingitems.items[0].bookingtext).toBe('SPAR DANKT  0554P K4 20.02.UM 12.64');
                expect(scope.bookingitems.items[0].hash).toBe(-95247701412);
                expect(scope.bookingitems.items[1].bookingdate).toBe(1361491200000);
                expect(scope.bookingitems.items[1].accountchange).toBe(-1);
                expect(scope.bookingitems.items[1].bookingtext).toBe('MCDONALDSöäü 66 0066  K4 22.02.UM 15.26     O');
                expect(scope.bookingitems.items[1].hash).toBe(-12182367868);
                expect(scope.bookingitems.items[2].bookingdate).toBe(1369000800000);
                expect(scope.bookingitems.items[2].accountchange).toBe(-2.47);
                expect(scope.bookingitems.items[2].bookingtext).toBe('BILLA DANKT  1610  K4 18.05.UM 08.21     O');
                expect(scope.bookingitems.items[2].hash).toBe(-1050225974289);
                done();
            });

        });

        it('can merge bank-file and app-file correctly', function () {
            var bankFile = 'Buchungsdatum;Valutadatum;Buchungstext ;Interne Notiz;Währung;Betrag;Belegdaten;\r\n' +
                '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-1,00;"";\r\n' +
                '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-2,00;"";\r\n' +
                '21/02/2013;21/02/2013;SPAR DANKT  0554P K4 20.02.UM 12.64;;EUR;-2,50;"";';
            var appFile = 'artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash;id\r\n' +
                '0;1361404800000;-2.5;SPAR DANKT  0554P K4 20.02.UM 12.64;1;3.5;-95247701412;3\r\n' +
                '1;1361491200000;-2;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;0;1;-14546483804;2\r\n' +
                '2;1361491200000;-1;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;0;1;-14546483773;1';
            scope.bookingitems = bookingItemsFactory.build({items: []});
            scope.loadData({target: {result: bankFile}});
            expect(scope.bookingitems.items.length).toBe(3);

            scope.loadData({target: {result: appFile}});
            expect(scope.bookingitems.items.length).toBe(3);
            expect(scope.bookingitems.items[0].accountchange).toBe(-2.5);
            expect(scope.bookingitems.items[1].accountchange).toBe(-2);
            expect(scope.bookingitems.items[2].accountchange).toBe(-1);
        });

        it('can merge bank-file without space and app-file correctly', function () {
            var bankFile = 'Buchungsdatum;Valutadatum;Buchungstext;Interne Notiz;Währung;Betrag;Belegdaten;\r\n' +
                '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-1,00;"";\r\n' +
                '22/02/2013;22/02/2013;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;;EUR;-2,00;"";\r\n' +
                '21/02/2013;21/02/2013;SPAR DANKT  0554P K4 20.02.UM 12.64;;EUR;-2,50;"";';
            var appFile = 'artificialId;bookingdate;accountchange;bookingtext;currentbalance;previousbalance;hash;id\r\n' +
                '0;1361404800000;-2.5;SPAR DANKT  0554P K4 20.02.UM 12.64;1;3.5;-95247701412;3\r\n' +
                '1;1361491200000;-2;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;0;1;-14546483804;2\r\n' +
                '2;1361491200000;-1;MCDONALDS 66 0066  K4 22.02.UM 15.26     O;0;1;-14546483773;1';
            scope.bookingitems = bookingItemsFactory.build({items: []});
            scope.loadData({target: {result: bankFile}});
            expect(scope.bookingitems.items.length).toBe(3);

            scope.loadData({target: {result: appFile}});
            expect(scope.bookingitems.items.length).toBe(3);
            expect(scope.bookingitems.items[0].accountchange).toBe(-2.5);
            expect(scope.bookingitems.items[1].accountchange).toBe(-2);
            expect(scope.bookingitems.items[2].accountchange).toBe(-1);
        });

        describe('can import multiple files', function () {


            it("asynchronosly by model watching", function () {
                var fileList = [
                    {},
                    {}
                ];
                var callCount = 0;
                scope.import = function () {
                    callCount++;
                };
                scope.importfiles = fileList;
                scope.$apply();
                expect(callCount).toBe(2);
            });

        });

    });
});
