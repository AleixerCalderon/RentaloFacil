export const  viabilidad = /*html*/`
<div class="row center-aab">         
     <form id="breakEvenForm" class="col s12 m6 l10">
     <div class="card">         
     <div class="card-content">
     <h4>Análisis de viabilidad</h4>
     <div class="row">
         <div class="input-field col s12 m6 l10">
             <input id="renta" type="number" class="validate" required>
             <label for="renta">Costo de Renta Mensual ($)</label>
         </div>
     </div>

     <!-- Costos Fijos Adicionales -->
     <div class="row">
         <div class="input-field col s12 m6 l10">
             <input id="costosFijos" type="number" class="validate" required>
             <label for="costosFijos">Costos Fijos Adicionales Mensuales ($)</label>
         </div>
     </div>

     <!-- Costo por Unidad Vendida -->
     <div class="row">
         <div class="input-field col s12 m6 l10">
             <input id="costoUnidad" type="number" class="validate" required>
             <label for="costoUnidad">Costo por Unidad de Producto o Servicio ($)</label>
         </div>
     </div>

     <!-- Precio por Unidad Vendida -->
     <div class="row">
         <div class="input-field col s12 m6 l10">
             <input id="precioUnidad" type="number" class="validate" required>
             <label for="precioUnidad">Precio de Venta por Unidad ($)</label>
         </div>
     </div>

     <!-- Ventas Esperadas -->
     <div class="row">
         <div class="input-field col s12 m6 l10">
             <input id="ventasEsperadas" type="number" class="validate" required>
             <label for="ventasEsperadas">Ventas Esperadas Mensuales (Unidades)</label>
         </div>
     </div>

     <!-- Botón para Calcular -->
     <div class="row">
         <div class="col s12 m6 l10">
             <button id="btnBreakEven" class="btn waves-effect waves-light">Calcular Punto de Equilibrio</button>
         </div>
     </div>

     <!-- Resultado -->
     <div id="resultado" class="row">
         <div class="col s12 m6 l10">
             <h6 class="center-aab">Resultado del Cálculo:</h6>
             <p id="breakEvenOutput" class="center-aab"></p>
         </div>
     </div>
     </div>
 </form>
</div>

`;