
    
from flask import Flask, request, jsonify
import json
import requests
import os
import time
import requests
# import urllib3
from bs4 import BeautifulSoup
import pandas as pd
import json
 
def obtener_lugar_mas_reseñado_por_coordenadas(latitud, longitud, api_key):
    # print(f"\nBuscando lugares cerca de latitud: {latitud}, longitud: {longitud}")
    # Aumentamos el radio de búsqueda a 5000 metros (5 km)
    url = ("https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        f"?location={latitud},{longitud}&radius=5000&key={api_key}"
    )
 
    try:
        response = requests.get(url)
        data = response.json()
        # Imprimir el estado y contenido de la respuesta para depuración
        # print(f"Estado de la respuesta: {response.status_code}")
        # print("Contenido de la respuesta:")
        # print(json.dumps(data, indent=2))
 
        if response.status_code == 200:
            if data.get('status') == 'OK' and 'results' in data and len(data['results']) > 0:
                lugares = data['results']
                lugar_mas_reseñado = None
                max_reseñas_totales = -1  # Iniciamos con -1 para asegurarnos de que cualquier valor positivo sea mayor
                
                for lugar in lugares:
                    # Obtenemos el número de reseñas y la calificación si están disponibles
                    user_ratings_total = lugar.get('user_ratings_total')
                    rating = lugar.get('rating', 0)
 
                    if user_ratings_total is not None:
                        # Si encontramos un lugar con más reseñas totales, lo seleccionamos
                        if user_ratings_total > max_reseñas_totales:
                            max_reseñas_totales = user_ratings_total
                            lugar_mas_reseñado = {
                                'nombre': lugar.get('name'),
                                'calificacion': rating,
                                'reseñas_totales': user_ratings_total,
                                'ubicacion': lugar.get('geometry', {}).get('location', {}),
                                'place_id': lugar.get('place_id')
                            }
                        # En caso de empate en reseñas totales, seleccionamos el de mayor calificación
                        elif user_ratings_total == max_reseñas_totales:
                            if rating > lugar_mas_reseñado.get('calificacion', 0):
                                lugar_mas_reseñado = {
                                    'nombre': lugar.get('name'),
                                    'calificacion': rating,
                                    'reseñas_totales': user_ratings_total,
                                    'ubicacion': lugar.get('geometry', {}).get('location', {}),
                                    'place_id': lugar.get('place_id')
                                }
 
                if lugar_mas_reseñado:
                    print(f"Lugar más reseñado encontrado: {lugar_mas_reseñado['nombre']} con {lugar_mas_reseñado['reseñas_totales']} reseñas")
                    return lugar_mas_reseñado
                else:
                    print("No se encontraron lugares con reseñas en esta ubicación.")
                    return None
            else:
                # Mostrar el mensaje de estado de la API
                print(f"La API devolvió un estado: {data.get('status')}")
                if 'error_message' in data:
                    print(f"Mensaje de error de la API: {data['error_message']}")
                return None
        else:
            print(f"Error en la solicitud: {response.status_code}")
            return None
 
    except Exception as e:
        print(f"Excepción al realizar la solicitud a la API: {e}")
        return None
 
def obtener_localidad_por_coordenadas(latitud, longitud, api_key):
    url = ("https://maps.googleapis.com/maps/api/geocode/json"
        f"?latlng={latitud},{longitud}&key={api_key}"
    )
    response = requests.get(url)
    data = response.json()
 
    if response.status_code == 200 and data.get('status') == 'OK':
        results = data.get('results', [])
        for result in results:
            for component in result.get('address_components', []):
                print(component)
                if 'locality' in component.get('types', []) and component.get('long_name') != "Bogotá":
                    return component.get('long_name')
                # Algunas localidades pueden estar clasificadas como 'political' y 'administrative_area_level_2'
                if 'administrative_area_level_2' in component.get('types', [])  and component.get('long_name') != "Bogotá":
                    return component.get('long_name')
        print("No se pudo encontrar la localidad para las coordenadas dadas.")
        return None
    else:
        print(f"Error al obtener la localidad: {data.get('status')}")
        return None
 
def obtener_puntaje_seguridad(localidad):
    print(localidad)
    # Diccionario de localidades y sus puntajes de seguridad
    localidades_seguridad = {
        'Usaquén': 4.5,
        'Chapinero': 4.0,
        'Santa Fe': 2.5,
        'San Cristóbal': 2.0,
        'Usme': 2.0,
        'Tunjuelito': 2.5,
        'Bosa': 2.0,
        'Kennedy': 2.5,
        'Fontibón': 3.0,
        'Engativá': 3.0,
        'Suba': 4.0,
        'Barrios Unidos': 3.0,
        'Teusaquillo': 4.5,
        'Los Mártires': 1.5,
        'Antonio Nariño': 2.5,
        'Puente Aranda': 3.0,
        'La Candelaria': 3.5,
        'Rafael Uribe Uribe': 2.0,
        'Ciudad Bolívar': 1.5,
        'Sumapaz': 4.0
    }
 
    # Normalizamos el nombre de la localidad para mejorar la coincidencia
    localidad_normalizada = localidad.strip().title()
 
    # Buscamos la localidad en el diccionario
    puntaje = localidades_seguridad.get(localidad_normalizada)
 
    if puntaje is not None:
        return puntaje
    else:
        # Si no se encuentra, informar al usuario
        print(f"La localidad '{localidad}' no se encuentra en la tabla de seguridad.")
        return None
  
def obtener_lugares_mas_reseñados_desde_json(archivo_json, api_key):
    # Leer el archivo JSON
    with open(archivo_json, encoding="utf8") as file:
        data = json.load(file)
 
    # Lista para almacenar los lugares más reseñados
    lugares_mas_reseñados = []
 
    # Extraer las coordenadas
    for idx, prop in enumerate(data):
        try:
            latitud = prop['Geo']['latitude']
            longitud = prop['Geo']['longitude']
            # Llamar al método para obtener el lugar más reseñado cercano
            lugar_mas_reseñado = obtener_lugar_mas_reseñado_por_coordenadas(latitud, longitud, api_key)
            if lugar_mas_reseñado:
                prop["OpinionUsuarios"] = lugar_mas_reseñado["calificacion"]
                prop["Popularidad"] = lugar_mas_reseñado["reseñas_totales"]  
                localidad = obtener_localidad_por_coordenadas(latitud, longitud, api_key)
                if localidad:               
                    prop["SeguridadSector"] = obtener_puntaje_seguridad(localidad)           
                # lugares_mas_reseñados.append({
                #     'propiedad': prop,
                #     'lugar_mas_reseñado_cercano': lugar_mas_reseñado
                # })
            else:
                print(f"No se encontró un lugar con reseñas cerca de la propiedad {idx}.")
            # Añadir una pausa para respetar las cuotas de la API
            time.sleep(1)
        except Exception as e:
            print(f"Error al procesar la propiedad {idx}: {e}")
            continue
 
    return data


if __name__ == "__main__":    
    api_key = "AIzaSyBA6pM_xbKlxqACuLcLz9u9g5dRMXWppCI"# os.getenv('GOOGLE_MAPS_API_KEY', 'YOUR_API_KEY')
    if api_key != 'AIzaSyBA6pM_xbKlxqACuLcLz9u9g5dRMXWppCI':
        print("Por favor, proporciona una clave de API válida.")
    else:
        archivo_json = "data.json"
        lugares_mas_reseñados = obtener_lugares_mas_reseñados_desde_json(archivo_json, api_key)
    with open('data.json', 'w', encoding='utf-8') as json_file:
        json.dump(lugares_mas_reseñados, json_file, ensure_ascii=False, indent=4)    
        # Imprimir los resultados
        # for resultado in lugares_mas_reseñados:
        #     print("\nPropiedad:")
        #     print(resultado)            