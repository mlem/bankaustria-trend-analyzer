BookingItem = function() {
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

BookingItem.prototype.hashCode = function() {
    var result = this.bookingdate.hashCode();
    result = 31 * result + this.accountchange.hashCode();
    result = 31 * result + this.bookingtext.hashCode();
    return result;
};


BookingItems = function() {
    this.items = [];

    return this.items;
}