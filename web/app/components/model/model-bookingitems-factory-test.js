describe('BookingItems', function () {

    describe('merge is merging in right order', function () {

        var bookingItems;
        var middleItem;
        var youngestItem;
        var anOtherYoungItem;
        var anOtherOldItem;
        var oldestItem;

        beforeEach(module('bankaustriaTrendAnalyzer.model'));

        beforeEach(inject(function (_BookingItems_, _BookingItem_) {
            var bookingItemsFactory = _BookingItems_;
            var bookingItemFactory = _BookingItem_;
            bookingItems = bookingItemsFactory.build({items: []});
            middleItem = {};
            middleItem.artificialId = 0;
            middleItem.accountchange = 1;
            // 21/02/2013
            middleItem.bookingdate = 1361401200000;
            middleItem.bookingtext = 'first';
            middleItem.currentbalance = 0;
            middleItem.previousbalance = 0;
            middleItem = bookingItemFactory.build(middleItem);
            bookingItems.items = [middleItem];

            youngestItem = {};
            youngestItem.artificialId = 1;
            youngestItem.accountchange = 2;
            // 22/02/2013
            youngestItem.bookingdate = 1361487600000;
            youngestItem.bookingtext = 'sec';
            youngestItem.currentbalance = 0;
            youngestItem.previousbalance = 0;
            youngestItem = bookingItemFactory.build(youngestItem);
            
            anOtherYoungItem = {};
            anOtherYoungItem.artificialId = 4;
            anOtherYoungItem.accountchange = 2;
            // 22/02/2013
            anOtherYoungItem.bookingdate = 1361487600000;
            anOtherYoungItem.bookingtext = 'sec-number2';
            anOtherYoungItem.currentbalance = 0;
            anOtherYoungItem.previousbalance = 0;
            anOtherYoungItem = bookingItemFactory.build(anOtherYoungItem);

            oldestItem = {};
            oldestItem.artificialId = 2;
            oldestItem.accountchange = 2;
            // 20/02/2013
            oldestItem.bookingdate = 1361314800000;
            oldestItem.bookingtext = 'third';
            oldestItem.currentbalance = 0;
            oldestItem.previousbalance = 0;
            oldestItem = bookingItemFactory.build(oldestItem);

            anOtherOldItem = {};
            anOtherOldItem.artificialId = 3;
            anOtherOldItem.accountchange = 3;
             // 20/02/2013
            anOtherOldItem.bookingdate = 1361314800000;
            anOtherOldItem.bookingtext = 'fourth';
            anOtherOldItem.currentbalance = 0;
            anOtherOldItem.previousbalance = 0;
            anOtherOldItem = bookingItemFactory.build(anOtherOldItem);

        }));

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
        it('when merging new items, and then newest first', function () {
            bookingItems.items = [anOtherOldItem, oldestItem];
            bookingItems.merge([youngestItem, anOtherYoungItem, middleItem]);
            expect(bookingItems.items.length).toBe(5);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(anOtherOldItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(middleItem.hash);
            expect(bookingItems.items[3].artificialId).toBe(3);
            expect(bookingItems.items[3].hash).toBe(youngestItem.hash);
            expect(bookingItems.items[4].artificialId).toBe(4);
            expect(bookingItems.items[4].hash).toBe(anOtherYoungItem.hash);
        });

        it('when merging data which is inbetween', function () {
            bookingItems.items = [oldestItem, youngestItem];
            bookingItems.merge([middleItem]);
            expect(bookingItems.items.length).toBe(3);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
            expect(bookingItems.items[1].artificialId).toBe(1);
            expect(bookingItems.items[1].hash).toBe(middleItem.hash);
            expect(bookingItems.items[2].artificialId).toBe(2);
            expect(bookingItems.items[2].hash).toBe(youngestItem.hash);
        });

        it('when merging the first time', function () {
            bookingItems.items = [];
            bookingItems.merge([oldestItem]);
            expect(bookingItems.items.length).toBe(1);
            expect(bookingItems.items[0].artificialId).toBe(0);
            expect(bookingItems.items[0].hash).toBe(oldestItem.hash);
        });


    });
});