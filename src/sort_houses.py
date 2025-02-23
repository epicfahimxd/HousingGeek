# Eli Lipman and Hoang Mai
#
#
#   sort_house.py
#
#
# PURPOSE: Given the Housing Data of A Particular Area, calculate the Expected Price
#          and return the Price Differences. Using this data, we'll group
#          these house in a location module to determine 

# Libra
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import pandas as pd
from sklearn.decomposition import TruncatedSVD
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from mpl_toolkits.mplot3d import Axes3D
import seaborn as sns

# display all the rows
pd.set_option('display.max_rows', None)  

# Read in housing data as pandas data frame called houses
houses = pd.read_csv('medford_rentals_final.csv')

# set variable names to other columns
description = "Description"
info = "Info4"
landlord = "Name"
address = "Content"

# remove the target column and variables from the data set
df = houses.drop(columns = [description, address, info, landlord])

# create a column of all the addresses
address = houses[address]

# remove the target column and variables from the data set
df = houses.drop(columns = [description, address, info, landlord])



# Only Keep the Bed, Bath, price and Square Footage values
# For the Price, remove the commas and only keep the integer value
df['Bed_number'] = df['Bed_number'].str.extract(r'(\d+)').astype(float)
df['Bath_number'] = df['Bath_number'].str.extract(r'(\d+\.?\d*)').astype(float)
df['Square_foot'] = df['Square_foot'].str.replace(',', '').str.extract(r'(\d+)').astype(float)
df['Price'] = df['Price'].str.replace(',','').str.extract(r'(\d+\.?\d*)').astype(float)

# Drop the rows that contain NaN
df_cleaned = df.dropna()
# Drop the rows with too high square foot 
df_cleaned = df_cleaned[df_cleaned['Square_foot'] < 9999.0]


# Set the price column as the target
target_column = "Price"
# Column of All the Prices of the House
Y = df_cleaned[target_column]
# remove the Price column since the other variables affect the Price
df_cleaned = df_cleaned.drop(columns = [target_column])
# Define features (X) and target (Y)
X = df_cleaned[['Bed_number', 'Bath_number', 'Square_foot']]


# Train model to compute a general equation for Expected Price of a House
model = LinearRegression()
# Y is the column of the prices
model.fit(X, Y)
# Get feature importance (coefficients)
feature_importance = pd.Series(model.coef_, index=X.columns)
print(feature_importance)


# Store regression values in price per item variables
# Price = pricePerBed * Bed_Number + pricePerBath * Bath_number + pricePerSquareFoot * Square_Foot 
pricePerBed, pricePerBath, pricePerSquareFoot = feature_importance
# Add price back to our dataframe
df_cleaned['Price'] = Y
# Create column for expected price
df_cleaned['Expected Price'] = (
    df_cleaned['Bed_number'] * pricePerBed +
    df_cleaned['Square_foot'] * pricePerSquareFoot +
    df_cleaned['Bath_number'] * pricePerBath
)
# Price difference: The Higher the difference, the worse the deal
df_cleaned['Price Difference'] = df_cleaned['Price'] - df_cleaned['Expected Price']
# Add the addresses back so we can compute them in the location grouping module
df_cleaned['Address'] = address

# Export to a CSV file of our Data
df_cleaned.to_csv('Prices_Cleaned.csv', index=False)


# Step 0: Create a location function that turns an address to latitute/ longitude coords
        # - This will determine the prices for a certain given area
        # - That way, we can group certain data points with each other
# Step 1: To color code areas for the entirety of the medford Area , we would
#       base it off of the average price difference of a neighborhood
# Step 2: Compare these price differences amongst all the other neighborhoods in
#       the total area.
# Step 3: Now compute using a z distribution ranking

# plot the linear regression
# Square footage v price
# Scatter plot with regression line
plt.figure(figsize=(10,6))
sns.regplot(x=df_cleaned['Square_foot'], y = Y, scatter_kws={'alpha':0.5}, line_kws={'color':'red'})

# Labels
plt.xlabel('Square Footage')
plt.ylabel('Price')
plt.title('Linear Regression: Square Footage vs Price')

plt.show()

