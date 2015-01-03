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

            expect(scope.bookingitems[0]['previousBalance']).toBe(1.73);
            expect(scope.bookingitems[0]['currentbalance']).toBe(-1);
            expect(scope.bookingitems[1]['previousBalance']).toBe(-1);
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

    });
});
