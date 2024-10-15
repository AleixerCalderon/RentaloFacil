from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
# import urllib3
from bs4 import BeautifulSoup
import pandas as pd
import json

app = Flask(__name__)
CORS(app)
def scrape_fincaraiz_detalle(url):
    print(url)
    headers = {        
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }        
    # Realizar la solicitud HTTP con los encabezados
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return None    
    # Parsear el contenido HTML
    soup = BeautifulSoup(response.content, 'html.parser')   
    # Encontrar todos los elementos de propiedades
    script = soup.find('script', type='application/ld+json')
    if script:
        json_contenido = script.string
        json_data = json.loads(json_contenido)
        latitude = json_data["object"]["geo"]["latitude"]
        longitude = json_data["object"]["geo"]["longitude"]
        print(latitude, longitude)
        return {'latitude':latitude, 'longitude':longitude}


def scrape_fincaraiz(search_term):
    url = f"https://www.fincaraiz.com.co/arriendo/locales/bogota/bogota-dc/{search_term}?&IDmoneda=4"
    # ={search_term}
    # Realizar la solicitud HTTP
    headers = {        
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }        
    # Realizar la solicitud HTTP con los encabezados
    response = requests.get(url, headers=headers)
    # response = requests.get(url)
    # print(" consultar ",response.content)
    # Comprobar si la solicitud fue exitosa
    if response.status_code != 200:
        return {"error": "Error al acceder a la página"}
   
    # Parsear el contenido HTML
    soup = BeautifulSoup(response.content, 'html.parser')
   
    # Encontrar todos los elementos de propiedades
    properties = soup.find_all('div', class_='listingCard')
    
    results = []
   
    for prop in properties:
        try:
            # print(" Lista listingCard:",prop)
            # Extraer la información requerida
            urlDetalles = prop.find('a', class_='lc-cardCover')
            if urlDetalles:
                urlDetalle = 'https://www.fincaraiz.com.co' + urlDetalles.get('href')
                resultsDetalle = scrape_fincaraiz_detalle(urlDetalle)  
            else:
                resultsDetalle = None                           
            name = prop.find('span', class_='lc-title').text.strip()                      
            area = prop.find('div', class_='lc-typologyTag').text.strip()    #, text=lambda t: 'm²' in t).text.strip()            
            price = prop.find('span', class_='price').text.strip()    #, text=lambda t: '$' in t).text.strip()            
            location = prop.find('strong', class_='lc-location').text.strip()    #, text=lambda t: ',' in t).text.strip()            
            img_tag = prop.find('img') 
            if img_tag:
                img = img_tag['src']
            else:
                img: None            
            results.append({
                'Nombre': name,
                'Área': area,
                'Precio': price,
                'Ubicación': location,
                'Img':img,
                'Tipo':1,
                'Geo':resultsDetalle
            })
        except:
            continue
   
    # Retornar los resultados como un JSON
    return results



@app.route('/scrape', methods=['GET'])
def scrape():
    search_term = request.args.get('search_term')    
    if not search_term:
        return jsonify({"error": "Parámetro 'search_term' es requerido"}), 400    
    results = scrape_fincaraiz(search_term)     
    with open('data.json', 'w', encoding='utf-8') as json_file:
        json.dump(results, json_file, ensure_ascii=False, indent=4)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)