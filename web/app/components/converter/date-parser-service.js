angular.module('bankaustriaTrendAnalyzer.converter.date-parse-service', [])
    .service('dateParserService', function () {

        function splitDateString(dateString) {
            if (dateString.indexOf('/') > 0) {
                return dateString.split('/');
            }
            if (dateString.indexOf('.') > 0) {
                return dateString.split('.');
            }
            return [];
        }

        this.parse = function (dateString) {
            var parts = splitDateString(dateString);
            var year = parts[2];
            var month = parts[1] - 1;
            var days = parts[0];
            return new Date(Date.UTC(year, month, days));
        };
    });