function isValidDate(d) {
    if ( Object.prototype.toString.call(d) !== "[object Date]" )
        return false;
    return !isNaN(d.getTime());
}


describe('DateParser', function() {
    it('parses 22/02/2013 correctly as day 22, month february, year 2013', function() {
        var parser = new DateParser();
        var result = parser.parse('22/02/2013');
        expect(isValidDate(result)).toBe(true);
        expect(result).toEqual(new Date(2013, 2-1, 22));

    });
});