/**
 * laCuentaMozaico.js
 */
function initIngresoPlatoId(){
  $("#platoId").val('');
  $("#precioId").val('');
  $("#esALaRomanaId").prop('checked', false);

  $("#platoId").focus();
}

function limpiarDivsDeProcesamiento(){
  $("#dividirTicketId").empty();
  $("#totalTicketId").empty();
  $("#totalesComensalesId").empty();
}

/**
 * Elimina un plato de la lista de platos disponibles
 */
function btnEliminarPlato(e){
  $("#tableListadoDePlatosId tbody #" + $(e.currentTarget).attr("data")).remove();
  limpiarDivsDeProcesamiento();
}

/**
 * Elimina los platos de la lista de platos disponibles
 */
function limpiarListadoDePlatos(){
  $("#tableListadoDePlatosId tbody").empty();
}

/**
 * Agrega un plato a la lista de platos disponibles
 */
function btnAddPlatoClick(){
  if($("#platoId").val().trim().length == 0){
    alert("Debe completar el campo plato");
    return;
  }

  if($("#precioId").val().trim().length == 0){
    alert("Debe completar el campo precio");
    return;
  }

  var fuente = $("#platoTemplate").html();
  var plantilla = Handlebars.compile(fuente);

  var contexto = {
    "nuevoPlatoId":$("#platoId").val().trim().replace(" ", "_"),
    "nuevoPlato":$("#platoId").val().trim(),
    "nuevoPrecio":$("#precioId").val().trim(),
    "esALaRomana":$("#esALaRomanaId").is(":checked") ? "Si" : "No"
  };

  var nuevaLinea = plantilla(contexto);
  $("#tableListadoDePlatosId tbody").append(nuevaLinea);

  $("#eliminarPlatoId_" + contexto["nuevoPlatoId"] + "_" + contexto["nuevoPrecio"]).on("click", btnEliminarPlato);

  limpiarDivsDeProcesamiento();

  initIngresoPlatoId();
}

/**
 * Inicializa la cantidad de comensales
 */
function inicializarCantidadDeComensales(){
  $("#cantidadComensales").val(2);
}

/**
 * Establece la cantidad de comensales
 */
function btnEstablecerComensalesClick(){

  if($("#tableListadoDePlatosId tbody tr").length <= 0){
    alert("Debe agregar platos");
    return;
  }

  limpiarDivsDeProcesamiento();

  var fuente = $("#ticketComensalTemplate").html();
  var plantilla = Handlebars.compile(fuente);

  var cantidadComensales = $("#cantidadComensales").val();

  var platos = [];

  $("#tableListadoDePlatosId tbody tr").each(function(indice){

    if($(this).find("td.esALaRomana").text() == "No"){
      platos.push({
        "plato": $(this).find("td.plato").text(),
        "precio": $(this).find("span.precio").text(),
        "esEditable": true
      });
    } else {
      var precioAux = $(this).find("span.precio").text();
      platos.push({
        "plato": $(this).find("td.plato").text(),
        "precio": precioAux / cantidadComensales,
        "esEditable": false
      });
    }

  });

  for(i = 0; i < cantidadComensales; i++){
    var unComensal = {
      "nroComensal": i+1,
      "platos": platos
    };

    var nuevaTabla = plantilla(unComensal);

    $("#dividirTicketId").append(nuevaTabla);
  }

  $(".inputSpinnerPlato").inputSpinner({"groupClass": "input-group-inline"});
}

/**
 * Presenta el total del ticket
 */
function presentarTotalTicket(ticket){
  var fuente = $("#totalTicketTemplate").html();
  var plantilla = Handlebars.compile(fuente);

  var nuevaTabla = plantilla(ticket);

  $("#totalTicketId").empty(); //vacio el div

  $("#totalTicketId").append(nuevaTabla);
}

/**
 * Presenta el total de cada comensal
 */
function presentarTotalTicketPorComensal(tickets){
  var fuente = $("#totalTicketComensalTemplate").html();
  var plantilla = Handlebars.compile(fuente);

  $("#totalesComensalesId").empty(); //vacio el div

  for(i = 0; i < tickets.length; i++){
    var unComensal = {
      "nroComensal": i+1,
      "ticket": tickets[i]
    };

    var nuevaTabla = plantilla(unComensal);

    $("#totalesComensalesId").append(nuevaTabla);
  }
}

/**
 * Procesar los platos de los comensales
 */
function btnProcesarClick(){
  if($("#dividirTicketId div.table-responsive").length <= 0){
    alert("Debe establecer los comensales");
    return;
  }

  var ticketsComensales = [];

  $("#dividirTicketId div.table-responsive").each(
    function(indice){
      $(this).find("table").each(
        function(indice){

          var ticket = {
            "totalPlatos": 0,
            "propina10": 0,
            "totalPropina10": 0,
            "propina20": 0,
            "totalPropina20": 0
          };

          $(this).find("tbody tr").each(
            function(indice){
              if($(this).find("td .checkTicket").is(":checked")){
                var precio = $(this).find("td .precioTicket").text();
                var cantidad = $(this).find("td input.form-control.inputSpinnerPlato").val()

                ticket["totalPlatos"] = ticket["totalPlatos"] + (precio*cantidad);
              }
            }
          );

          ticket["propina10"] = ticket["totalPlatos"] * 0.1;
          ticket["totalPropina10"] = ticket["totalPlatos"] + ticket["propina10"];
          ticket["propina20"] = ticket["totalPlatos"] * 0.2;
          ticket["totalPropina20"] = ticket["totalPlatos"] + ticket["propina20"];

          ticketsComensales.push(ticket);
        }
      );
    }
  );

  if(ticketsComensales.length <= 0){
    alert("Debe seleccionar los platos de los comensales");
    return;
  }

  var ticketTotal = {
    "totalPlatos": 0,
    "propina10": 0,
    "totalPropina10": 0,
    "propina20": 0,
    "totalPropina20": 0
  };

  for(i = 0; i < ticketsComensales.length; i++){
    ticketTotal["totalPlatos"] = ticketTotal["totalPlatos"] + ticketsComensales[i]["totalPlatos"];
  }

  ticketTotal["propina10"] = ticketTotal["totalPlatos"] * 0.1;
  ticketTotal["totalPropina10"] = ticketTotal["totalPlatos"] + ticketTotal["propina10"];
  ticketTotal["propina20"] = ticketTotal["totalPlatos"] * 0.2;
  ticketTotal["totalPropina20"] = ticketTotal["totalPlatos"] + ticketTotal["propina20"];

  presentarTotalTicket(ticketTotal);
  presentarTotalTicketPorComensal(ticketsComensales);
}

function formatearPrecio(precio){
  return parseFloat(precio).toFixed(2);
}

function btnLimpiarClick(){
  limpiarDivsDeProcesamiento()
  initIngresoPlatoId();
  limpiarListadoDePlatos();
  inicializarCantidadDeComensales();
}
