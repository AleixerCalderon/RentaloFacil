import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_fincaraiz(search_term):
    url = f"https://www.fincaraiz.com.co/inmuebles/venta?ubicacion={search_term}"
    
    # Realizar la solicitud HTTP
    response = requests.get(url)
    
    # Comprobar si la solicitud fue exitosa
    if response.status_code != 200:
        print("Error al acceder a la página")
        return None
    
    # Parsear el contenido HTML
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Encontrar todos los elementos de propiedades
    properties = soup.find_all('div', class_='MuiCardContent-root')
    
    results = []
    
    for prop in properties:
        # Extraer la información requerida
        name = prop.find('h2', class_='MuiTypography-root').text.strip()
        area = prop.find('p', class_='MuiTypography-root', text=lambda t: 'm²' in t).text.strip()
        price = prop.find('p', class_='MuiTypography-root', text=lambda t: '$' in t).text.strip()
        location = prop.find('p', class_='MuiTypography-root', text=lambda t: ',' in t).text.strip()
        
        results.append({
            'Nombre': name,
            'Área': area,
            'Precio': price,
            'Ubicación': location
        })
    
    # Crear un DataFrame con los resultados
    df = pd.DataFrame(results)
    
    return df


# Uso del scraper
search_term = input("Ingrese el término de búsqueda: ")
results_df = scrape_fincaraiz(search_term)

if results_df is not None:
    print(results_df)
    # Opcionalmente, guardar en un archivo CSV
    results_df.to_csv('resultados_fincaraiz.csv', index=False)



# Supongamos que 'mejor_lugar' tiene una clave 'ubicacion' con latitud y longitud
# Necesitamos obtener la localidad correspondiente a esas coordenadas
 
import requests
 
def obtener_localidad_por_coordenadas(latitud, longitud, api_key):
    url = (
"https://maps.googleapis.com/maps/api/geocode/json"
        f"?latlng={latitud},{longitud}&key={api_key}"
    )
    response = requests.get(url)
    data = response.json()
 
    if response.status_code == 200 and data.get('status') == 'OK':
        results = data.get('results', [])
        for result in results:
            for component in result.get('address_components', []):
                if 'locality' in component.get('types', []):
                    return component.get('long_name')
                # Algunas localidades pueden estar clasificadas como 'political' y 'administrative_area_level_2'
                if 'administrative_area_level_2' in component.get('types', []):
                    return component.get('long_name')
        print("No se pudo encontrar la localidad para las coordenadas dadas.")
        return None
    else:
        print(f"Error al obtener la localidad: {data.get('status')}")
        return None
 
# Ejemplo de uso
if __name__ == "__main__":
    api_key = os.getenv('GOOGLE_MAPS_API_KEY', 'YOUR_API_KEY')
    if api_key == 'YOUR_API_KEY':
        print("Por favor, proporciona una clave de API válida.")
    else:
        # Supongamos que tienes las coordenadas del mejor lugar
        latitud = mejor_lugar['ubicacion']['lat']
        longitud = mejor_lugar['ubicacion']['lng']
 
        localidad = obtener_localidad_por_coordenadas(latitud, longitud, api_key)
        if localidad:
            puntaje_seguridad = obtener_puntaje_seguridad(localidad)
            if puntaje_seguridad is not None:
                print(f"El puntaje de seguridad de {localidad} es: {puntaje_seguridad}")
            else:
                print("No se encontró el puntaje de seguridad para la localidad obtenida.")