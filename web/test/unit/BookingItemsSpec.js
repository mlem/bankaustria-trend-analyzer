describe('BookingItems', function () {

    describe('merge is merging in right order', function () {

        var bookingItems;
        var middleItem;
        var youngestItem;
        var oldestItem;

        beforeEach(function () {
            bookingItems = new BookingItems();
            middleItem = new BookingItem();
            middleItem.artificialId = 0;
            middleItem.accountchange = 1;
            // 21/02/2013
            middleItem.bookingdate = 1361401200000;
            middleItem.bookingtext = 'first';
            middleItem.currentbalance = 0;
            middleItem.previousbalance = 0;
            middleItem.hash = middleItem.hashCode();
            bookingItems.items = [middleItem];

            youngestItem = new BookingItem();
            youngestItem.artificialId = 1;
            youngestItem.accountchange = 2;
            // 22/02/2013
            youngestItem.bookingdate = 1361487600000;
            youngestItem.bookingtext = 'sec';
            youngestItem.currentbalance = 0;
            youngestItem.previousbalance = 0;
            youngestItem.hash = youngestItem.hashCode();

            oldestItem = new BookingItem();
            oldestItem.artificialId = 2;
            oldestItem.accountchange = 2;
            // 20/02/2013
            oldestItem.bookingdate = 1361314800000;
            oldestItem.bookingtext = 'third';
            oldestItem.currentbalance = 0;
            oldestItem.previousbalance = 0;
            oldestItem.hash = oldestItem.hashCode();

        });

        it('when new item has later date', function () {
            bookingItems.merge([youngestItem]);

            expect(bookingItems.items.length).toBe(2);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(middleItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(youngestItem.hash);
        });


        it('when new item has earlier date', function () {
            bookingItems.merge([oldestItem]);

            expect(bookingItems.items.length).toBe(2);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);
        });

        it('when new item has earlier date with multiple items', function () {
            bookingItems.merge([oldestItem, middleItem, youngestItem]);

            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(youngestItem.hash);
        });

        it('when merging a view times', function () {
            bookingItems.merge([oldestItem, middleItem]);

            expect(bookingItems.items.length).toBe(2);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);

            bookingItems.merge([middleItem, youngestItem]);
            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(youngestItem.hash);
        });

        it('when merging new items, which are in wrong sortorder', function () {
            bookingItems.items = [oldestItem];
            bookingItems.merge([youngestItem, middleItem]);
            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(youngestItem.hash);
        });

        it('when merging data which is inbetween', function() {
            bookingItems.items = [oldestItem,youngestItem];
            bookingItems.merge([middleItem]);
            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(youngestItem.hash);
        });

        it('when merging the first time', function() {
            bookingItems.items = [];
            bookingItems.merge([oldestItem]);
            expect(bookingItems.items.length).toBe(1);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
        });


    });
});