angular.module('bankaustriaTrendAnalyzer.model.bookingitem', [])

    .factory('BookingItem', function () {
        "use strict";
        function BookingItem(artificialId, bookingdate, accountchange, bookingtext, currentbalance, previousbalance) {
            this.artificialId = artificialId;
            this.bookingdate = bookingdate;
            this.accountchange = accountchange;
            this.bookingtext = bookingtext;
            this.currentbalance = currentbalance;
            this.previousbalance = previousbalance;
            this.hash = hashCode(this);
        }

        String.prototype.hashCode = function () {
            var hash = 0, i, chr, len;
            if (this.length === 0) {
                return hash;
            }
            for (i = 0, len = this.length; i < len; i++) {
                chr = this.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                // Convert to 32bit integer
                hash |= 0;
            }
            return hash;
        };

        Number.prototype.hashCode = function () {
            var hash = 0;
            hash = ((hash << 5) - hash) + this;
            // Convert to 32bit integer
            hash |= 0;
            return hash;
        };

        var hashCode = function (item) {
            var result = item.bookingdate.hashCode();
            result = 31 * result + item.accountchange.hashCode();
            result = 31 * result + item.bookingtext.hashCode();
            return result;
        };

        BookingItem.build = function (data) {
            return new BookingItem(
                data.artificialId,
                data.bookingdate,
                data.accountchange,
                data.bookingtext,
                data.currentbalance,
                data.previousbalance);
        };

        return BookingItem;

    });