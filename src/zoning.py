# Eli Lipman, Hoang Mai, and Lindsay Ulrey
#
#
#   zoning.py
#
#
# PURPOSE: Given the Price Percentage Increase of Each House, rank them by 
#          percentile and give them a rating of 1 - 10

import numpy as np
import pandas as pd

Data = pd.read_csv('Prices_With_Coords.csv')
# Sort Data from most Price % Increase to lowest
df_sorted = Data.sort_values(by='Price Percentage Increase').reset_index(drop=True)

# Assign ranks
n = len(Data)
df_sorted['rank'] = 10 - (df_sorted.index // (n // 10))

# Adjust the last few if n is not perfectly divisible by 10
df_sorted.loc[df_sorted['rank'] < 1, 'rank'] = 1  # Handle any remainder entries

# Assign color values based on rank
conditions = [
    (df_sorted['rank'] >= 1) & (df_sorted['rank'] <= 3),
    (df_sorted['rank'] >= 4) & (df_sorted['rank'] <= 7),
    (df_sorted['rank'] >= 8) & (df_sorted['rank'] <= 10)
]
colors = ['red', 'yellow', 'green']
df_sorted['color'] = np.select(conditions, colors)
