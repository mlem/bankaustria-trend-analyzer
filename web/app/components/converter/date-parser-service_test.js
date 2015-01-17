function isValidDate(d) {
    if (Object.prototype.toString.call(d) !== "[object Date]") {
        return false;
    }
    return !isNaN(d.getTime());
}


describe('DateParser', function () {

    beforeEach(module('bankaustriaTrendAnalyzer.converter.date-parse-service'));

    var dateParser;

    beforeEach(inject(function(dateParserService) {
        dateParser = dateParserService;
    }));


    it('parses 22/02/2013 correctly as day 22, month february, year 2013', function () {
        var result = dateParser.parse('22/02/2013');
        expect(isValidDate(result)).toBe(true);
        expect(result).toEqual(new Date(Date.UTC(2013, 2 - 1, 22)));

    });
    it('parses 22.02.2013 correctly as day 22, month february, year 2013', function () {
        var result = dateParser.parse('22.02.2013');
        expect(isValidDate(result)).toBe(true);
        expect(result).toEqual(new Date(Date.UTC(2013, 2 - 1, 22)));
    });


});