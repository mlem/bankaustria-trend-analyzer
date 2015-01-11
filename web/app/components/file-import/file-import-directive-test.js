describe('File Reader Directive', function() {
    var $compile;
    var $rootScope;

    beforeEach(module('fileReaderModule'));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $rootScope.myfiles = [];
    }));

    it('Replaces the element with the appropriate content', function() {
        var element = $compile('<input type="file" fileread="myfiles"/>')($rootScope);

        expect(element.change).toBeDefined();

        var event = angular.element.Event('change');
        event.target = { files: [1,2] };
        element.trigger(event);

        expect($rootScope.myfiles.length).toBe(2);
    });
});