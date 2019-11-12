

$(document).ready(function ()
{  
   
    window.addEventListener('beforeunload', cerrarSession);

    jQuery.validator.setDefaults({       
        success: "valid"
    });
    
    $('#formLogin').validate({
        errorClass: "error-class",
        rules: {
            cedula: {
                required: true
            },
            password: {
                required: true
            },
        },
        errorLabelContainer: '#errores'
    });           
     

    /*--- Obtener Multas --- */
    $('#btnObtenerMultasInspector').click(function (e) {        
        $('#dtMultas').DataTable().columns(0).search($('#ddlFamiliaMulta').val().trim());

        if ($('#div_cruces_boleta').is(':visible')) {
            $('#dtMultas').DataTable().columns(3).search($('#ddlCruceBoleta').val());
        } else {
            $('#dtMultas').DataTable().columns(3).search($('#ddlCruce').val());
        }

        if ($('#div_infraccion_boleta').is(':visible')) {
            $('#dtMultas').DataTable().columns(1).search($('#ddlTipoInfraccionBoleta').val());
        } else {
            $('#dtMultas').DataTable().columns(1).search($('#ddlTipoInfraccion').val());
        }

        $('#dtMultas').DataTable().columns(10).search($('#ddlAutosEmbarcado').val());

        $('#dtMultas').DataTable().draw();
    });
    
    $('#btnObtenerMultasSupervisor').click(function (e) {        
        $('#dtMultas').DataTable().columns(0).search($('#ddlFamiliaMulta').val());
        $('#dtMultas').DataTable().columns(1).search($('#ddlTipoInfraccionBoleta').val());
        
        if ($('#div_cruces_boleta').is(':visible')) {
            $('#dtMultas').DataTable().columns(3).search($('#ddlCruceBoleta').val());
        } else {
            $('#dtMultas').DataTable().columns(3).search($('#ddlCruce').val());
        }

        $('#dtMultas').DataTable().columns(4).search($('#fecha_desde').val() + ";" + $('#fecha_hasta').val());        
        $('#dtMultas').DataTable().columns(2).search($('#ddlEstado').val());
        $('#dtMultas').DataTable().columns(5).search($('#matricula').val().trim());
        $('#dtMultas').DataTable().columns(7).search($('#Nro_inspector').val());
        $('#dtMultas').DataTable().columns(8).search($('#contiene_matricula_checkbox').is(':checked'));
        $('#dtMultas').DataTable().columns(9).search($('#comienza_matricula_checkbox').is(':checked'));
        $('#dtMultas').DataTable().columns(10).search($('#ddlAutosEmbarcado').val());
        $('#dtMultas').DataTable().draw();
    });
    
    $('#btnObtenerMultasApelacion').click(function (e) {        
        $('#dtMultas').DataTable().columns(5).search($('#matricula').val().trim());
        $('#dtMultas').DataTable().columns(6).search($('#codigo').val().trim());        
        $('#dtMultas').DataTable().draw();
    });

    $('#btnReporte').click(function (e) {      
        $('#dtMultas').DataTable().columns(0).search($("#tipoMulta").val());
        $('#dtMultas').DataTable().columns(1).search($("#sitio").val());
        $('#dtMultas').DataTable().columns(2).search($("#fechaDesde").val());
        $('#dtMultas').DataTable().columns(3).search($("#fechaHasta").val());
        
        dibujarChart();

        $('#dtMultas').DataTable().draw();
    });

    $('#btnLimpiar').click(function (e) {
        $('#matricula').val('');
        $('#codigo').val('');
    });
});


function cerrarSession()
{
    $.ajax({
        type: "POST",
        url: "Home/Logout",
    });
}


function dibujarChart()
{

    $('#ChartMeses').remove(); // this is my <canvas> element
    $('#contenedorGraficoStack').append('<canvas id="ChartMeses" width="500" height="200"></canvas>');

    var c = document.getElementById("ChartMeses");
    var ctx = c.getContext("2d");
    var tData = $.getValues("GetDataGraficoPorMes", $("#fechaDesde").val(), $("#fechaHasta").val(), $("#sitio").val(), $("#tipoMulta").val());

    myBarChart = new Chart(ctx, {
        type: 'bar',
        data: tData,
        options: {
            scales: {
                xAxes: [{
                    stacked: true
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });

    $('#ChartEstados').remove(); // this is my <canvas> element
    $('#contenedorGraficoPie').append('<canvas id="ChartEstados" width="500" height="300"></canvas>');

    var c = document.getElementById("ChartEstados");
    var ctx = c.getContext("2d");
    var tData = $.getValues("GetDataGraficoPorEstado", $("#fechaDesde").val(), $("#fechaHasta").val(), $("#sitio").val(), $("#tipoMulta").val());    
    myPieChart = new Chart(ctx, {
        type: 'pie',
        data: tData,
        options: {
            responsive: false
        }
    });
    
    $('#ChartHoras').remove(); // this is my <canvas> element
    $('#contenedorGraficoLine').append('<canvas id="ChartHoras" width="500" height="200"></canvas>');

    var c = document.getElementById("ChartHoras");
    var ctx = c.getContext("2d");
    var tData = $.getValues("GetDataGraficoPorHoraTipoMulta", $("#fechaDesde").val(), $("#fechaHasta").val(), $("#sitio").val(), $("#tipoMulta").val());    
    myLineChart = new Chart(ctx, {
        type: 'line',
        data: tData,
        options: {
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Horas'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Cantidad Multas'
                    }
                }]
            }
        }
    });
}

jQuery.extend({
    getValues: function (url, fechaDesde, fechaHasta, sitios, tipos_multa) {
        var result = null;

        if (tipos_multa != null)
            var tipos_multa_aux = String(tipos_multa).replace(",", ":")

        if (sitios != null)
            var sitios_aux = String(sitios).replace(",", ":")
        
        $.ajax({
            url: url,
            type: 'POST',
            cache: false,
            data:
            {
                lista_tipos_multa: tipos_multa_aux,
                lista_cruces: sitios_aux,
                fecha_desde_seleccionada: fechaDesde,
                fecha_hasta_seleccionada: fechaHasta,
            },                 
            async: false,
            success: function (data) {
                result = data;
            }
        });
        return result;
    }
});