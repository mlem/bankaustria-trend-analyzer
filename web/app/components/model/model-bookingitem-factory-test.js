describe('BookingItem', function() {

    var itemFactory;

    beforeEach(module('bankaustriaTrendAnalyzer.model.bookingitem'));

    beforeEach(inject(function(BookingItem) {
        itemFactory = BookingItem;
    }));

    it('calculates hash for the object', function() {
        var item = itemFactory.build({
            bookingdate: 0,
            accountchange: 1,
            bookingtext: ''
        });

        expect(item.hash).toBe(31);
    });
});