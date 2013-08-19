describe('DateFormatter', function() {
    it('formats 22/02/2013 correctly as day 22, month february, year 2013', function() {
        var formatter = new DateFormatter();
        var result = formatter.format('22/02/2013');

        expect(result).toEqual(new Date(2013, 2-1, 22));

    });
});