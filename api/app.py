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