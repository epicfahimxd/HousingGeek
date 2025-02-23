# Eli Lipman and Hoang Mai
#
#
#   location.py
#
#
# PURPOSE: Given the logistics of houses, return the longitude and lattitude
#          for frontend use, and then classify neighborhoods based on color

import pandas as pd
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

# Display all the rows
pd.set_option('display.max_rows', None)  

# Initialize geolocator
geolocator = Nominatim(user_agent="geoapi")

# get_lat_long
#
# Purpose: Given the address of a particular row, convert to Longitude/Latitude
#
# Parameters: Address Column
def get_lat_long(address):
    try:
        location = geolocator.geocode(address, timeout=10)
        if location:
            return pd.Series([location.latitude, location.longitude])
            print ("Got the address")
        else:
            return pd.Series([None, None])  # Handle failed lookups
    except GeocoderTimedOut:
        return pd.Series([None, None])  # Handle timeout errors
    
# get dataframe from our csv file of homes
Data = pd.read_csv('Prices_Cleaned.csv')

# get rid of units in addresses
Data['Address'] = Data['Address'].str.replace(r'Unit \d+', '', regex=True).str.strip()

# get all of the latitude and longitude data
Data[['Latitude', 'Longitude']] = Data['Address'].apply(get_lat_long)