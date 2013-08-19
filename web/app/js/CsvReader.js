function CsvReader(values) {

    var values = values;

    this.asObjects = function () {
        return $.csv.toObjects(values, {"separator": ";"});
    }
}