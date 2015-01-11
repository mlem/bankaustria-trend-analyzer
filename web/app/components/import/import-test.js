describe('import', function() {
    describe('contains', function() {

        beforeEach(module('bankaustriaTrendAnalyzer.import'));

        it('file import directive',function() {
            var fileImportDirective = angular.module('bankaustriaTrendAnalyzer.import.fileimport-directive');
            expect(fileImportDirective).toBeDefined();
        });
    });
});