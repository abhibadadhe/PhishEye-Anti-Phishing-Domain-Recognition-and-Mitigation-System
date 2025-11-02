import pandas as pd
import joblib

# load model
model = joblib.load("outputs/model_random_forest.joblib")

# quick test using first row of training data
df = pd.read_csv("phishing.csv")
Xnew = df.drop(columns=['class', 'Index']).iloc[[0]]

prob = model.predict_proba(Xnew)[0, 1]
threat_percent = prob * 100

def label_from_score(p):
    if p >= 80:
        return "Phishing"
    elif p >= 60:
        return "Suspicious"
    else:
        return "Legitimate"

print("Phishing probability (0-100%):", round(threat_percent, 2))
print("Label:", label_from_score(threat_percent))
