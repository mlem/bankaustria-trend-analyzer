'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
    describe('BankListCtrl', function () {

        var scope;
        var controller;
        beforeEach(function () {
            scope = {};
            controller = new BankListCtrl(scope);
        })

        it('shows a list of account changes', function () {
            expect(scope.bookingitems.length).toBe(2);
            expect(scope.bookingitems[0]['accountchange']).toBe(-2.73);

            expect(scope.currentbalance).toBe(0);
            expect(scope.startingbalance).toBe(0);
        });

        it('calculates with reference account balance', function () {
            scope.calculateFromBegin('1');

            expect(scope.bookingitems[0]['currentbalance']).toBe(-1.73);
            expect(scope.bookingitems[1]['currentbalance']).toBe(0.27);
            expect(scope.currentbalance).toBe(0.27);
            expect(scope.startingbalance).toBe(1);
        });

        it('calculates with reference account balance', function () {
            scope.calculateFromEnd('1');

            expect(scope.bookingitems[0]['currentbalance']).toBe(-1);
            expect(scope.bookingitems[1]['currentbalance']).toBe(1);
            expect(scope.currentbalance).toBe(1);
            expect(scope.startingbalance).toBe(1.73);
        });
    });
});
