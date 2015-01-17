angular.module('bankaustriaTrendAnalyzer.converter.csv-reader-service', [])

.service('csvReaderService', function() {
        this.asObjects = function (values) {
            return jQuery.csv.toObjects(values, {"separator": ";"});
        };
    });