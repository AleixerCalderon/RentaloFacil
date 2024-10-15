const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// https://search-service.fincaraiz.com.co/api/v1/properties/similar
app.post('/scrape', async (req, res) => {
   
});
// Ruta para hacer scraping en metrocuadrado.com
app.get('/scrape', async (req, res) => {
  try {
    console.log("inicio");
    // Realizaremos la petición HTTP a metrocuadrado usando axios, 
    const  responce  = await axios.get('https://www.fincaraiz.com.co/arriendo/locales/3-o-mas-banos/2-parqueaderos/estrato-3');
    console.log("inicio t");
    const html = responce.data;
    // Cargar el HTML en cheerio para hacer scraping de los datos que deseamos 
    const $ = cheerio.load(html);
    console.log("inicio 2");
    console.log($('title').text());
    let locales = [];
    console.log("inicio 3");
    // Extraer información de los primeros 10 locales (ejemplo)
    // $('.browse-results-list').each((index, element) => {
    //   console.log(element);
    //   if (index < 10) {
    //     const title = $(element).find('.sc-gPEVay').text().trim();
    //     console.log("Control ARRIENDO",title);
    //     const price = $(element).find('.ad-price').text().trim();
    //     const location = $(element).find('.ad-location').text().trim();
    //     const link = $(element).find('a').attr('href');

    //     locales.push({
    //       title,
    //       price,
    //       location,
    //       link: `https://www.metrocuadrado.com${link}`
    //     });
    //   }
    // });


    // Seleccionamos todos los elementos de lista con la clase correspondiente  //.sc-gPEVay realestate-results-list
    $('.listingCard').each((index, element) => //.sc-fMiknA .ZUMHA .card-subitem .text-black
    { 
      console.log("inicio 4");
      //console.log("Inicio:", element);
     
      const data = $(element).find('.lc-dataWrapper');
      if (index < 10) 
      { // Limitar a los primeros 10 resultados 
        const title = $(data).find('.lc-title').text().trim(); 
        const price = $(element).find('.lc-price').first().text().trim();
         const area = $(element).find('.lc-typologyTag').first().text().trim();//.eq(1).text().trim(); 
         const link = $(element).find('a').attr('href'); 
         const fullLink = `https://www.metrocuadrado.com${link}`; 
         // Agregamos el local a la lista 
         locales.push({ title, price, area, link: fullLink }); } });  

    res.json({ locales });
  } catch (error) {
    console.error('Error al hacer scraping:', error);
    res.status(500).send('Error en el scraping');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});