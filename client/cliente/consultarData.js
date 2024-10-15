export const formView = `
  <div class="section">
  
    <h4>Buscar Local Comercial</h4>
    <img class="aab-img" src="./assets/d.jpeg" alt="">
    <form id="search-form">
      <div class="input-field col s12">
        <select id="select-option">
          <option value="" disabled selected>Elige una opción</option>
          <option value="1">Local pequeño</option>
          <option value="2">Local mediano</option>
          <option value="3">Local grande</option>
        </select>
        <label>Selecciona el tamaño del local</label>
      </div>
      <div class="row">
      <div class="input-field col s12 m6 l10">
          <input id="precioDesdeHasta" type="text" class="validate">
          <label for="precioDesdeHasta">Precio desde hasta (desde-1000000/hasta-2000000?&IDmoneda=4)</label>
      </div>
  </div>
      <div class="input-field col s12">
        <button id="search-btn" class="btn waves-effect waves-light">Buscar</button>
      </div>
    </form>
    <table id="results-table" class="striped">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Ubicación</th>
          <th>Enlace</th>
        </tr>
      </thead>
      <tbody id="results-body"></tbody>
    </table>
  </div>
`;

