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
}

BookingItems.prototype.merge = function (arrayToMerge) {
    var hashes = this.items.map(function (item) {
        return item.hash;
    });
    for (var itemKey in arrayToMerge) {
        var item = arrayToMerge[itemKey];
        var itemHash = item.hash;
        var found = false;
        for (var hash in hashes) {
            if (hashes[hash] === itemHash) {
                found = true;
            }
        }
        if (!found) {
            if(this.items.length === 0) {
                this.items.push(item);
            } else if (this.items[0].bookingdate > item.bookingdate) {
                this.items.push(item);
            } else {
                this.items.unshift(item);
            }
        }
    }

    for (var i = 0; i < this.items.length; i++) {
        this.items[i].artificialId = i;
    }
}