BookingItem = function () {
    this.artificialId = 0;
    this.bookingdate = 0;
    this.accountchange = 0.0;
    this.bookingtext = '';
    this.currentbalance = 0.0;
    this.previousbalance = 0.0;
    this.hash = 0;
}

String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

Number.prototype.hashCode = function () {
    var hash = 0;
    hash = ((hash << 5) - hash) + this;
    hash |= 0; // Convert to 32bit integer
    return hash;
};

BookingItem.prototype.hashCode = function () {
    var result = this.bookingdate.hashCode();
    result = 31 * result + this.accountchange.hashCode();
    result = 31 * result + this.bookingtext.hashCode();
    return result;
};


BookingItems = function () {
    this.items = [];
};

BookingItems.prototype.isBookingdateInTheMiddleOfArray = function (item) {
    return item.bookingdate > this.items[0].bookingdate && item.bookingdate < this.items[this.items.length - 1].bookingdate;
};
BookingItems.prototype.isBookingdateYounger = function (item) {
    return item.bookingdate > this.items[this.items.length - 1].bookingdate;
};
BookingItems.prototype.isBookingdateOlder = function (item) {
    return item.bookingdate <= this.items[0].bookingdate;
};
BookingItems.prototype.addItem = function (item) {
    if (this.items.length === 0) {
        this.items.push(item);
    } else if (this.isBookingdateInTheMiddleOfArray(item)) {
        this.innerMerge(item);
    } else if (this.isBookingdateYounger(item)) {
        this.items.push(item);
    } else if (this.isBookingdateOlder(item)) {
        this.items.unshift(item);
    }
};
BookingItems.prototype.innerMerge = function (item) {
    for (var i = 0; i < this.items.length; i++) {
        var firstTimeInArrayWhereItemIsOlder = item.bookingdate < this.items[i].bookingdate;
        if (firstTimeInArrayWhereItemIsOlder) {
            var laterPart = this.items.splice(i);
            this.items.push(item);
            this.items.push.apply(this.items, laterPart);
            return;
        }
    }
};
BookingItems.prototype.resetArtificialIds = function () {
    for (var i = 0; i < this.items.length; i++) {
        this.items[i].artificialId = i;
    }
}
BookingItems.prototype.itemExists = function (hashes, item) {
    for (var hashKey in hashes) {
        if (hashes[hashKey] === item.hash) {
            return true;
        }
    }
    return false;
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
    for (var itemKey in arrayToMerge) {
        var item = arrayToMerge[itemKey];
        if (!this.itemExists(hashes, item)) {
            this.addItem(item);
        }
    }
    this.resetArtificialIds();
};