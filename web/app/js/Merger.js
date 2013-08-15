function Merger() {
    this.merge = function (a, b) {
        var array =  a.slice(0);
        return array.concat(b.slice(1));
    }
};

function Dictionary() {
};