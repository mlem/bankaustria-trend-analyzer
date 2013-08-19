function DateFormatter() {
    this.format = function(dateString) {
        var parts = dateString.split('\\');
        return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
    };
};