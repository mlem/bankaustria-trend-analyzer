angular.module('bankaustriaTrendAnalyzer.model.bookingitems', [
        'bankaustriaTrendAnalyzer.model.bookingitem'])

    .factory('BookingItems', ['BookingItem', function (BookingItem) {
        "use strict";

        var bookingItemFactory = BookingItem;

        function BookingItems() {
            this.items = [];
        }

        var isBookingdateInTheMiddleOfArray = function (item, itemArray) {
            return item.bookingdate >= itemArray[0].bookingdate && item.bookingdate <= itemArray[itemArray.length - 1].bookingdate;
        };
        var isBookingdateYounger = function (item, itemArray) {
            return item.bookingdate > itemArray[itemArray.length - 1].bookingdate;
        };
        var isBookingdateOlder = function (item, itemArray) {
            return item.bookingdate <= itemArray[0].bookingdate;
        };
        var innerMerge = function (item, itemArray) {
            for (var i = 0; i < itemArray.length; i++) {
                var firstTimeInArrayWhereItemIsOlder = item.bookingdate < itemArray[i].bookingdate;
                if (firstTimeInArrayWhereItemIsOlder) {
                    var laterPart = itemArray.splice(i);
                    itemArray.push(item);
                    itemArray.push.apply(itemArray, laterPart);
                    return;
                }
            }
            itemArray.unshift(item);
        };
        var resetArtificialIds = function (itemArray) {
            for (var i = 0; i < itemArray.length; i++) {
                itemArray[i].artificialId = i;
            }
        };
        var itemExists = function (hashes, item) {
            for (var hashKey in hashes) {
                if (hashes[hashKey] === item.hash) {
                    return true;
                }
            }
            return false;
        };
        BookingItems.prototype.addItem = function (data) {
            var item;
            if (data instanceof BookingItem) {
                item = data;
            } else {
                item = bookingItemFactory.build(data);
            }
            if (this.items.length === 0) {
                this.items.push(item);
            } else if (isBookingdateInTheMiddleOfArray(item, this.items)) {
                innerMerge(item, this.items);
            } else if (isBookingdateYounger(item, this.items)) {
                this.items.push(item);
            } else if (isBookingdateOlder(item, this.items)) {
                this.items.unshift(item);
            }
        };
        /**
         * 3 kinds of merging:
         * * aligning items at the beginning of the array (old data)
         * * aligning items at the end of the array (new data)
         * * aligning items in the middle of the array (most complex - some data)
         * @param new items
         */
        BookingItems.prototype.merge = function (arrayToMerge) {
            var hashes = this.items.map(function (item) {
                return item.hash;
            });
            for (var i = 0; i < arrayToMerge.length; i++) {
                var item = arrayToMerge[i];
                if (!itemExists(hashes, item)) {
                    this.addItem(item);
                }
            }
            resetArtificialIds(this.items);
        };

        BookingItems.build = function () {
            return new BookingItems();
        };

        return BookingItems;
    }]);


