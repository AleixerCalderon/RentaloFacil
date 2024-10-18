import { encuentralo } from './view/encuentralo.js';
import { home } from './view/home.js';
import { about } from './view/about.js';
import { viabilidad } from './view/viabilidad.js';
import { formView } from './consultarData.js';
import { detalle } from './view/detalle.js';
import { partner } from './view/partner.js';
import { cesion } from './view/cesion.js';

const views = {
    home: home,
    about: about,
    encuentralo: encuentralo,
    viabilidad: viabilidad,
    form: formView,
    detalle: detalle
};

// Función para renderizar las vistas
function renderView(view) {
    const viewContainer = document.getElementById('view-container');
    viewContainer.innerHTML = views[view] || `<p>Vista no encontrada</p>`;

    if (view === 'encuentralo') {
        initEncuentralo();
    }
}
function imprimirEstrellas(puntaje) {
    const maxEstrellas = 5;
    let estrellas = "";
    for (let i = 1; i <= maxEstrellas; i++) {
        if (puntaje >= i) {
            estrellas += '★';
        } else if (puntaje >= i - .5) {
            estrellas += '☆';
        } else {
            estrellas += '✩';
        }
    }
    return estrellas; //⭐⭐⭐
}


function darDetalleLocal(local) {
    renderView("detalle");
    const resultsBody = document.getElementById('results-body-detalle');
    const row = document.createElement('tr');
    row.innerHTML = `                    
                <td>                
                <img class="img-table-detalle" src="${local.Img}">              
                </td>                   
                <td>
                  <table>
                      <tr> <td class="precio"><span>Arriendo:</span> ${local.Precio}</td>     </tr>
                      <tr> <td>Área: ${local.Área}</td>                                       </tr>
                      <tr> <td> Votación de percepción del sector:  ${local.OpinionUsuarios} ${imprimirEstrellas(local.OpinionUsuarios)}</td>                                     </tr>
                      <tr> <td> Seguridad del sector:  ${local.SeguridadSector}  ${imprimirEstrellas(local.SeguridadSector)}</td>                               </tr>
                      <tr> <td> Popularidad del sector: ${local.Popularidad} ${imprimirEstrellas(local.Popularidad)}</td>                                       </tr>
                  </table>
                </td>
                <td><div class="map-detalle" id="map"></div></td>                   
              `;
    resultsBody.appendChild(row);

    const btnRetornar = document.getElementById("btnRetornar");
    btnRetornar.addEventListener('click', function (event) {
        event.preventDefault();
        renderView("encuentralo");
        darLocales(1);
    });



    const btnViabilidad = document.getElementById("btnViabilidad");
    btnViabilidad.addEventListener('click', function (event) {
        event.preventDefault();
        const vista = document.getElementById('pnlGeneralPlus');
        vista.innerHTML = viabilidad;
        darData();
    });

    const btnPartner = document.getElementById("btnPartner");
    btnPartner.addEventListener('click', function (event) {
        event.preventDefault();
        const vista = document.getElementById('pnlGeneralPlus');
        vista.innerHTML = partner;
    });

    //btnCesion cesion
    const btnCesion = document.getElementById("btnCesion");
    btnCesion.addEventListener('click', function (event) {
        event.preventDefault();
        const vista = document.getElementById('pnlGeneralPlus');
        vista.innerHTML = cesion;
    });
}
// Función para inicializar la navegación
function initNavigation() {
    // Añadir evento click a cada enlace de navegación
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const view = event.target.getAttribute('data-view');
            renderView(view);
            if (view === "form") {
                pruebaScrape();
            }
        });
    });



}


function initEncuentralo() {
    var elems = document.querySelectorAll('select');
    if (elems.length > 0) {
        var instances = M.FormSelect.init(elems);
    }

    document.getElementById('btnFiltros').addEventListener('click', function (event) {
        event.preventDefault();

        if (document.getElementById('pnlMasFiltros').classList.contains('hidden')) {
            document.getElementById('pnlMasFiltros').classList.remove('hidden');
            document.getElementById('pnlBtnBuscar').classList.remove('hidden');
        } else {
            document.getElementById('pnlMasFiltros').classList.add('hidden');
            document.getElementById('pnlBtnBuscar').classList.add('hidden');
        }


    });

    // document.getElementById('btnBuscarLocales').addEventListener('click', function (event) {
    //     event.preventDefault();    
    //     const tipo = document.getElementById('inputSelect').value;
    //     darLocales(tipo);
    // });
    document.getElementById('inputSelect').addEventListener('change', function (event) {
        event.preventDefault();
        const tipo = document.getElementById('inputSelect').value;
        darLocales(tipo);
    });
}


// Renderizar la vista por defecto ( encuentralo , Home)
renderView('encuentralo');

// Inicializar la navegación al cargar la página
document.addEventListener('DOMContentLoaded', initNavigation);

function darData() {

    document.getElementById('btnBreakEven').addEventListener('click', function (e) {
        e.preventDefault();

        // Obtener los valores ingresados por el usuario
        const renta = parseFloat(document.getElementById('renta').value);
        const costosFijos = parseFloat(document.getElementById('costosFijos').value);
        const costoUnidad = parseFloat(document.getElementById('costoUnidad').value);
        const precioUnidad = parseFloat(document.getElementById('precioUnidad').value);

        // Validar que el precio de venta sea mayor al costo por unidad
        if (precioUnidad <= costoUnidad) {
            document.getElementById('breakEvenOutput').innerText = "El precio de venta debe ser mayor al costo por unidad.";
            return;
        }

        // Calcular el punto de equilibrio
        const costosFijosTotales = renta + costosFijos;
        const margenContribucion = precioUnidad - costoUnidad;
        const puntoEquilibrio = (costosFijosTotales / margenContribucion).toFixed(2);

        // Mostrar el resultado
        document.getElementById('breakEvenOutput').innerText = "Necesitas vender al menos (" + puntoEquilibrio + ") unidades para alcanzar el punto de equilibrio.";
    });
}

function displayLocales(localesF) {
    // Renderizar los resultados en la tabla
    const resultsBody = document.getElementById('results-body');
    resultsBody.innerHTML = ''; // Limpiar la tabla antes de mostrar nuevos resultados
    let index = 0;
    localesF.forEach(local => {
        const row = document.createElement('tr');
        row.innerHTML = `                    
                    <td class="precio"><span>Arriendo:</span> ${local.Precio}                   
                    <img class="img-table" src="${local.Img}"> </td>                   
                    <td>
                      <table>                      
                        <tr> <td>Área: ${local.Área}</td>                                       </tr>
                        <tr> <td> Votación de percepción del sector:  ${local.OpinionUsuarios} ${imprimirEstrellas(local.OpinionUsuarios)}</td>                                     </tr>
                        <tr> <td> Seguridad del sector:  ${local.SeguridadSector}  ${imprimirEstrellas(local.SeguridadSector)}</td>                               </tr>
                        <tr> <td> Popularidad del sector: ${local.Popularidad} ${imprimirEstrellas(local.Popularidad)}</td>    
                      </table>
                    </td>
                    <td><div class="map-detalle" id="map${index}"></div></td>                   
                  `;
        row.addEventListener('click', () => {
            darDetalleLocal(local);
        });
        resultsBody.appendChild(row);
        index++;
    });
    index = 0;
    localesF.forEach(local => {
        initMap(local.Geo.latitude, local.Geo.longitude, index);
        index++;
    });
}
async function darLocalesDb() {
    try {

        const response = await fetch('./data/data.json');
        const locales = await response.json();
        return locales;

    } catch (error) {
        return [];
    }
}
async function darLocales(tipo) {
    try {
        const locales = await darLocalesDb();
        const localesF = locales.filter(l => l.Tipo == tipo);
        displayLocales(localesF);

    } catch (error) {

    }
}

function initMap(la, lo, i) {
    const center = { lat: la, lng: lo };
    // Crear el mapa
    const map = new google.maps.Map(document.getElementById('map' + i), {
        zoom: 13,
        center: center
    });
    console.log(map);

    // Añadir la capa de tráfico
    const trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
}

function pruebaScrape() {
    // document.addEventListener('DOMContentLoaded', function () {
    const elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);

    document.getElementById('search-btn').addEventListener('click', async function (e) {
        e.preventDefault();
        // Llamar al backend para hacer el scraping

        const search_term = document.getElementById("precioDesdeHasta").value;// "desde-1000000/hasta-2000000?&IDmoneda=4"
        console.log(search_term);
        try {
            const response = await fetch(`http://127.0.0.1:5000/scrape?search_term=${search_term}`);
            const data = await response.json();
            console.log(data);
            // Renderizar los resultados en la tabla
            const resultsBody = document.getElementById('results-body');
            resultsBody.innerHTML = ''; // Limpiar la tabla antes de mostrar nuevos resultados

            data.forEach(local => {
                const row = `
                <tr>
                  <td>${local.Nombre}</td>
                  <td>${local.Precio}</td>
                  <td>${local.Ubicación}</td>
                  <td>${local.Área}</td>
                </tr>
              `;
                resultsBody.innerHTML += row;
            });
        } catch (error) {
            console.error('Error al buscar locales:', error);
        }
    });
    //   });
}