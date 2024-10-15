export const encuentralo =/*html*/ `
<!-- Navegación de Tabs -->
 
<div class="row">    
<form id="localRequirementsForm" class="col offset-m1 s12 m10 offset-l1 l10">
    <!-- Paso dos -->
<div class="card form-step"  id="step-2">
<div class="card-content">
    <h4>Encuentra tu local  </h4>
    <div class="row">
        <div class="input-field col s10 m6 l9">
            <select id="inputSelect" required>
                <option value="" disabled selected>Elige una opción</option>               
                <option value="1">Tienda de ropa</option>
                <option value="2">Cafetería o pastelería</option>
                <option value="3">Librería</option>
                <option value="4">Tienda de electrónica</option>
                <option value="5">Restaurante o bar</option>
                <option value="6">Tienda de artículos para el hogar</option>
                <option value="7">Tienda de juguetes</option>
                <option value="8">Salón de belleza o barbería</option>
                <option value="9">Tienda de productos ecológicos</option>
                <option value="10">Tienda de deportes</option>
                <option value="11">Boutique de moda</option>
                <option value="12">Tienda de mascotas</option>
                <option value="13">Tienda de artesanías</option>
                <option value="14">Centro de bienestar (yoga, pilates, etc.)</option>
                <option value="15">Tienda de productos tecnológicos (gadgets, accesorios, etc.)</option>
            </select>
            <label for="planta">Busco local para:</label>
        </div>
        <div class="center-align">
        <div  class="col s1 hidden" id="pnlBtnBuscar">
              <button class="btn-icon-p" id="btnBuscarLocales">   <i class="small material-icons">find_in_page</i> </button>
              <br> <p> Buscar </p>               
            </div>
            <div  class="col s1">
              <button class="btn-icon-p" id="btnFiltros">   <i class="small material-icons">filter_list</i> </button>
              <br> <p>filtros </p>               
            </div>
</div>
    </div>

    <div class="hidden" id="pnlMasFiltros">
    <div class="row">
        <div class="input-field col s12 m6 l10">
            <input id="tamañoLocal" type="number" class="validate" required>
            <label for="tamañoLocal">Tamaño del Local (m²)</label>
        </div>
    </div>
    
    <div class="row">
        <div class="input-field col s12 m6 l5">
            <input id="rangoPrecioDesde" type="number" class="validate" required>
            <label for="rangoPrecioDesde">Rango de Precio Mensual Desde ($)</label>
        </div>
        <div class="input-field col s12 m6 l5">
            <input id="rangoPrecioHasta" type="number" class="validate" required>
            <label for="rangoPrecioHasta">Rango de Precio Mensual Hasta ($)</label>
        </div>
    </div>
    
    <div class="row">
        <div class="input-field col s12 m6 l10">
            <input id="ubicacion" type="text" class="validate" required>
            <label for="ubicacion">Ubicación Preferida</label>
        </div>
    </div>


    <div class="row">
        <div class="input-field col s12 m6 l10">
            <select id="planta" required>
                <option value="" disabled selected>Elige una opción</option>
                <option value="plantaBaja">Planta Baja</option>
                <option value="superior">Planta Superior</option>
                <option value="noImporta">No Importa</option>
            </select>
            <label for="planta">Planta Baja o Superior</label>
        </div>
    </div>
</div>

<div class="center-align" >
<div class="row">
<table id="results-table" class="striped col offset-m1 m10 offset-l1 l10">
     
      <tbody id="results-body"></tbody>
    </table>   
    </div>
</div>
</div>
</form> 
`;