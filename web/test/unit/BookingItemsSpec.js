describe('BookingItems', function () {

    describe('merge is merging in right order', function () {

        var bookingItems;
        var firstItem;
        var secondItem;
        var thirdItem;

        beforeEach(function() {
            bookingItems = new BookingItems();
            firstItem = new BookingItem();
            firstItem.artificialId = 0;
            firstItem.accountchange = 1;
            // 21/02/2013
            firstItem.bookingdate = 1361401200000;
            firstItem.bookingtext = 'first';
            firstItem.currentbalance = 0;
            firstItem.previousbalance = 0;
            firstItem.hash = firstItem.hashCode();
            bookingItems.items = [firstItem];

            secondItem = new BookingItem();
            secondItem.artificialId = 1;
            secondItem.accountchange = 2;
            // 22/02/2013
            secondItem.bookingdate = 1361487600000;
            secondItem.bookingtext = 'sec';
            secondItem.currentbalance = 0;
            secondItem.previousbalance = 0;
            secondItem.hash = secondItem.hashCode();

            thirdItem = new BookingItem();
            thirdItem.artificialId = 2;
            thirdItem.accountchange = 2;
            // 22/02/2013
            thirdItem.bookingdate = 1361314800000;
            thirdItem.bookingtext = 'third';
            thirdItem.currentbalance = 0;
            thirdItem.previousbalance = 0;
            thirdItem.hash = thirdItem.hashCode();

        });

        it('when new item has later date', function () {
            bookingItems.merge([secondItem]);

            expect(bookingItems.items.length).toBe(2);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(secondItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(firstItem.hash);
        });


        it('when new item has earlier date', function () {
            bookingItems.merge([thirdItem]);

            expect(bookingItems.items.length).toBe(2);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(firstItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(thirdItem.hash);
        });

        it('when new item has earlier date with multiple items', function () {
            bookingItems.merge([thirdItem, firstItem, secondItem]);

            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(secondItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(firstItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(thirdItem.hash);
        });

        it('when merging a view times', function () {
            bookingItems.merge([thirdItem, firstItem]);

            expect(bookingItems.items.length).toBe(2);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(firstItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(thirdItem.hash);

            bookingItems.merge([firstItem, secondItem]);
            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(secondItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(firstItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(thirdItem.hash);
        });
    });
});