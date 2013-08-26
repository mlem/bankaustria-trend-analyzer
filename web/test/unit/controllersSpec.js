'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function() {
  describe('BankListCtrl', function() {
    it('shows a list of account changes', function() {
        var scope = {};
        var controller = new BankListCtrl(scope);
        expect(scope.bookingitems.length).toBe(2);
        expect(scope.bookingitems[0]['accountchange']).toBe(-2.73);
    });
  });
});
