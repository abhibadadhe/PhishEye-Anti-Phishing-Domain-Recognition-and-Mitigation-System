# explore.py
print("Script started")  
import pandas as pd
df = pd.read_csv("phishing.csv")
print("Shape:", df.shape)
print("Columns:", df.columns.tolist())
print("\nHead:\n", df.head())
print("\nDtypes:\n", df.dtypes)
print("\nMissing values per column:\n", df.isna().sum())
print("\nClass value counts:\n", df['class'].value_counts())
