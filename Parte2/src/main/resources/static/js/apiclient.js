var apiclient = (function () {

    return {
        getBlueprintsByAuthor: function (authname, callback) {
            $.get("/blueprints/" + authname, function (data) {
                callback(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("Error getting blueprints for author:", authname, textStatus, errorThrown);
                callback(null);
            });
        },

        getBlueprintsByNameAndAuthor: function (authname, bpname, callback) {
            $.get("/blueprints/" + authname + "/" + bpname, function (data) {
                callback(data);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                console.log("Error getting blueprint:", authname, bpname, textStatus, errorThrown);
                callback(null);
            });
        }
    };

})();