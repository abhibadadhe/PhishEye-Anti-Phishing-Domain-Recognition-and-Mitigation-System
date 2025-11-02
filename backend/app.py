# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import joblib
# import pandas as pd
# from datetime import datetime
# from feature_extraction import extract_features

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# # Load trained model
# model = joblib.load("outputs/model_random_forest.joblib")

# @app.route('/api/scan', methods=['POST'])
# def scan_url():
#     try:
#         data = request.get_json(force=True)
#         print("\n📥 Incoming Request:", data)

#         url = data.get('url')
#         if not url:
#             print("❌ Missing URL in request")
#             return jsonify({'error': 'URL missing in request'}), 400

#         print(f"🔍 Scanning URL: {url}")

#         # --- Feature Extraction ---
#         features = extract_features(url)
#         print("🧩 Extracted Features:", features)

#         df = pd.DataFrame([features])
#         print("📊 DataFrame Columns:", list(df.columns))

#         # --- Align features with model expectations ---
#         if hasattr(model, "feature_names_in_"):
#             expected_features = list(model.feature_names_in_)
#             print("🧠 Model expects:", expected_features)

#             # Add missing columns
#             for col in expected_features:
#                 if col not in df.columns:
#                     df[col] = 0
#                     print(f"⚠️ Added missing column: {col}")

#             # Keep correct order
#             df = df[expected_features]

#         # --- Prediction ---
#         prob = float(model.predict_proba(df)[:, 1][0])
#         score = int(prob * 100)

#         # --- Classification Logic ---
#         if score >= 80:
#             label = "High"
#             result_text = "Phishing"
#         elif score >= 60:
#             label = "Medium"
#             result_text = "Suspicious"
#         else:
#             label = "Low"
#             result_text = "Legitimate"

#         result = {
#             'url': url,
#             'score': score,
#             'label': label,
#             'result': result_text,
#             'time': datetime.now().strftime('%Y-%m-%d %H:%M'),
#             'id': hash(url + str(datetime.now()))
#         }

#         print("✅ Final Response:", result)
#         return jsonify(result)

#     except Exception as e:
#         print("💥 Error during scan:", str(e))
#         import traceback
#         traceback.print_exc()
#         return jsonify({'error': str(e)}), 400



# @app.route('/api/stats', methods=['GET'])
# def get_stats():
#     """
#     Return mock statistics — you can replace these with dynamic values later.
#     """
#     return jsonify({
#         'total_scans': 100,
#         'phishing_detected': 35,
#         'legitimate_sites': 55,
#         'suspicious_sites': 10,
#         'avg_score': 45
#     })


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=8000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
from datetime import datetime
import os
from feature_extraction import extract_features

# ===============================================
# Flask App Setup
# ===============================================
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Paths
MODEL_PATH = "outputs/model_random_forest.joblib"
LOG_FILE = "outputs/scan_results.csv"

# Load trained model
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"❌ Model not found at: {MODEL_PATH}")
model = joblib.load(MODEL_PATH)


# ===============================================
# API: URL Scan Endpoint
# ===============================================
@app.route('/api/scan', methods=['POST'])
def scan_url():
    try:
        data = request.get_json(force=True)
        url = data.get('url')
        if not url:
            return jsonify({'error': 'URL missing in request'}), 400

        print(f"🔍 Scanning URL: {url}")

        # --- Feature Extraction ---
        features = extract_features(url)
        df = pd.DataFrame([features])

        # --- Align with model expected features ---
        if hasattr(model, "feature_names_in_"):
            expected_features = list(model.feature_names_in_)
            for col in expected_features:
                if col not in df.columns:
                    df[col] = 0
            df = df[expected_features]

        # --- Prediction ---
        prob = float(model.predict_proba(df)[:, 1][0])
        score = int(prob * 100)

        if score >= 80:
            label, result_text = "High", "Phishing"
        elif score >= 60:
            label, result_text = "Medium", "Suspicious"
        else:
            label, result_text = "Low", "Legitimate"

        result = {
            'url': url,
            'score': score,
            'label': label,
            'result': result_text,
            'time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

        # --- Save to CSV (for live dashboard stats) ---
        save_result_to_csv(result)

        print("✅ Scan completed:", result)
        return jsonify(result)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 400


# ===============================================
# Helper: Save Scan Result
# ===============================================
def save_result_to_csv(result):
    """Append each scan result to a CSV file for dashboard analytics."""
    df = pd.DataFrame([result])
    os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

    if not os.path.exists(LOG_FILE):
        df.to_csv(LOG_FILE, index=False)
    else:
        df.to_csv(LOG_FILE, mode='a', header=False, index=False)


# ===============================================
# API: Get Live Stats
# ===============================================
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Return real-time scan statistics."""
    if not os.path.exists(LOG_FILE):
        return jsonify({
            'total_scans': 0,
            'phishing_detected': 0,
            'legitimate_sites': 0,
            'suspicious_sites': 0,
            'avg_score': 0
        })

    df = pd.read_csv(LOG_FILE)

    total_scans = len(df)
    phishing = (df['result'] == 'Phishing').sum()
    legitimate = (df['result'] == 'Legitimate').sum()
    suspicious = (df['result'] == 'Suspicious').sum()
    avg_score = round(df['score'].mean(), 2)

    stats = {
        'total_scans': total_scans,
        'phishing_detected': phishing,
        'legitimate_sites': legitimate,
        'suspicious_sites': suspicious,
        'avg_score': avg_score
    }

    return jsonify(stats)


# ===============================================
# API: Get Scan History (Optional for Dashboard Table)
# ===============================================
@app.route('/api/history', methods=['GET'])
def get_scan_history():
    """Return all scanned URLs for dashboard history view."""
    if not os.path.exists(LOG_FILE):
        return jsonify([])

    df = pd.read_csv(LOG_FILE)
    history = df.to_dict(orient='records')
    return jsonify(history)


# ===============================================
# Run Flask App
# ===============================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

