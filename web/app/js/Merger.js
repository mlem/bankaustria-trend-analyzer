function Merger() {
    this.merge = function (a, b) {
        var result = a.slice(0);
        for (var bKey in b) {
            result[bKey] = b[bKey];
        }
        return result;

        //var array =  a.slice(0);
        //return array.concat(b.slice(1));
    }
};

function Dictionary() {
};