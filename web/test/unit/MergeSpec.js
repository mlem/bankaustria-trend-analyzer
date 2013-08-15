describe('array', function() {
    describe('Merger', function() {
        it('should be able to merge two arrays without duplication', function() {
            var mergedResult = new Merger().merge([1, 2], [2, 3]);
            expect(mergedResult).toEqual([1,2,3]);
        });


        it('should be able to merge two maps', function() {
            var mergedResult = new Merger().merge([{1:1}, {2:2}], [{2:2}, {3:3}]);
            expect(mergedResult).toEqual([{1:1}, {2:2}, {3:3}]);
        });

        xit('should be able to merge two maps with more elements', function() {
            var mergedResult = new Merger().merge([{1:1}, {2:2}, {3:3}], [{2:2}, {3:3}, {4:4}]);
            expect(mergedResult).toEqual([{1:1}, {2:2}, {3:3}, {4:4}]);
        });
    });

    describe('dictionary', function() {
        it('should be able to save a map in dictionary and find it again', function() {
            var dict = {}
            var map = {1: 1};
            dict[map] = map;

            expect(dict[map]).toEqual(map);
        })
    });
});