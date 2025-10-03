var app = (function () {

    
    var selectedAuthor = "";
    var blueprintsList = [];
    
    // Configuración del API - cambiar entre apimock y apiclient con una línea
    var api = apiclient; 

    // Función privada para calcular el total de puntos
    var calculateTotalPoints = function (blueprints) {
        return blueprints.reduce(function (total, blueprint) {
            return total + blueprint.points;
        }, 0);
    };

    // Función privada para limpiar la tabla
    var clearTable = function () {
        $("#blueprintsTableBody").empty();
    };

    // Función privada para limpiar el canvas
    var clearCanvas = function () {
        var canvas = document.getElementById("blueprintCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $("#currentBlueprintName").text("None selected");
    };

    // Función privada para dibujar en el canvas
    var drawBlueprint = function (points, blueprintName) {
        var canvas = document.getElementById("blueprintCanvas");
        var ctx = canvas.getContext("2d");
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!points || points.length === 0) {
            $("#currentBlueprintName").text("No points to draw");
            return;
        }
        
        // Configurar el estilo de dibujo
        ctx.strokeStyle = "#007bff";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        // Comenzar el path
        ctx.beginPath();
        
        // Mover al primer punto
        ctx.moveTo(points[0].x, points[0].y);
        
        // Dibujar líneas consecutivas a cada punto
        for (var i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        
        // Ejecutar el dibujo
        ctx.stroke();
        
        // Dibujar puntos como círculos
        ctx.fillStyle = "#dc3545";
        for (var j = 0; j < points.length; j++) {
            ctx.beginPath();
            ctx.arc(points[j].x, points[j].y, 3, 0, 2 * Math.PI);
            ctx.fill();
        }
        
        // Actualizar el nombre del plano actual
        $("#currentBlueprintName").text(blueprintName);
    };

    var updateDOM = function (author, blueprints) {
        $("#selectedAuthor").text(author);
        
        // Limpiar la tabla y canvas antes de agregar nuevos datos
        clearTable();
        clearCanvas();
        
        // Agregar cada blueprint a la tabla
        blueprints.forEach(function (blueprint) {
            var row = "<tr>" +
                      "<td class='text-center'>" + blueprint.name + "</td>" +
                      "<td class='text-center'>" + blueprint.points + "</td>" +
                      "<td class='text-center'>" +
                          "<button class='btn btn-success btn-sm open-blueprint' " +
                          "data-author='" + author + "' data-blueprint='" + blueprint.name + "'>" +
                          "<span class='glyphicon glyphicon-eye-open'></span> Open" +
                          "</button>" +
                      "</td>" +
                      "</tr>";
            $("#blueprintsTableBody").append(row);
        });
        
        // Calcular y mostrar el total de puntos
        var totalPoints = calculateTotalPoints(blueprints);
        $("#totalPoints").text(totalPoints);
    };

    return {
        setSelectedAuthor: function (author) {
            selectedAuthor = author;
        },

        getSelectedAuthor: function () {
            return selectedAuthor;
        },

        updateBlueprintsList: function (author) {
            selectedAuthor = author;
            
            api.getBlueprintsByAuthor(author, function (data) {
                // Validación para evitar errores
                if (data) {
                    // Aplicar map para convertir los elementos a objetos con solo nombre y número de puntos
                    blueprintsList = data.map(function (blueprint) {
                        return {
                            name: blueprint.name,
                            points: blueprint.points.length // número de puntos = longitud del array points
                        };
                    });
                    
                    updateDOM(author, blueprintsList);
                } else {
                    // Si no hay datos, limpiar la vista
                    blueprintsList = [];
                    updateDOM(author, []);
                }
            });
        },

        drawSpecificBlueprint: function (author, blueprintName) {
            api.getBlueprintsByNameAndAuthor(author, blueprintName, function (data) {
                if (data && data.points) {
                    // Dibujar el blueprint en el canvas
                    drawBlueprint(data.points, blueprintName);
                }
            });
        },

        getBlueprintsList: function () {
            return blueprintsList;
        },

        init: function () {
            // Asociar el evento click del botón principal
            $("#getBlueprintsBtn").click(function () {
                var author = $("#authorInput").val().trim();
                
                // Llamar a la función para actualizar los blueprints
                app.updateBlueprintsList(author);
            });

            // Asociar eventos de los botones "Open" usando delegación de eventos
            $(document).on("click", ".open-blueprint", function () {
                var author = $(this).data("author");
                var blueprintName = $(this).data("blueprint");
                
                // Llamar a la función para dibujar el blueprint específico
                app.drawSpecificBlueprint(author, blueprintName);
            });
        }
    };

})();

$(document).ready(function () {
    app.init();
});