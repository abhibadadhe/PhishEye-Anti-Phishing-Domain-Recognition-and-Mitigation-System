# import re
# import socket
# import requests
# import whois
# from urllib.parse import urlparse
# from datetime import datetime
# from bs4 import BeautifulSoup

# # --- Helper functions ---

# def using_ip(url):
#     return 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', url) else 0

# def long_url(url):
#     return 1 if len(url) >= 75 else 0

# def short_url(url):
#     return 1 if re.search(r'bit\.ly|goo\.gl|tinyurl\.com|t\.co', url) else 0

# def symbol_at(url):
#     return 1 if "@" in url else 0

# def redirecting(url):
#     return 1 if url.count("//") > 1 else 0

# def prefix_suffix(url):
#     return 1 if "-" in urlparse(url).netloc else 0

# def sub_domains(url):
#     return 1 if urlparse(url).netloc.count('.') > 2 else 0

# def https(url):
#     return 1 if urlparse(url).scheme == 'https' else 0

# def domain_reg_len(domain):
#     try:
#         w = whois.whois(domain)
#         if w.expiration_date:
#             exp_date = w.expiration_date
#             if isinstance(exp_date, list):
#                 exp_date = exp_date[0]
#             return 1 if (exp_date - datetime.now()).days <= 365 else -1
#     except:
#         pass
#     return -1

# def favicon(url):
#     try:
#         resp = requests.get(url, timeout=3)
#         soup = BeautifulSoup(resp.text, 'html.parser')
#         icon = soup.find("link", rel=lambda r: r and "icon" in r.lower())
#         if icon and "://" in icon.get("href", ""):
#             return 1
#     except:
#         pass
#     return -1

# # --- Main feature extractor ---

# def extract_features(url):
#     parsed = urlparse(url)
#     domain = parsed.netloc

#     features = {
#         "UsingIP": using_ip(url),
#         "LongURL": long_url(url),
#         "ShortURL": short_url(url),
#         "SymbolAt": symbol_at(url),
#         "Redirecting": redirecting(url),
#         "PrefixSuffix": prefix_suffix(url),
#         "SubDomains": sub_domains(url),
#         "HTTPS": https(url),
#         "DomainRegLen": domain_reg_len(domain),
#         "Favicon": favicon(url),

#         # Default placeholder features (set as -1 when unknown)
#         "NonStdPort": -1,
#         "HTTPSDomainURL": -1,
#         "RequestURL": -1,
#         "AnchorURL": -1,
#         "LinksInScriptTags": -1,
#         "ServerFormHandler": -1,
#         "InfoEmail": -1,
#         "AbnormalURL": -1,
#         "WebsiteForwarding": -1,
#         "StatusBarCust": -1,
#         "DisableRightClick": -1,
#         "UsingPopupWindow": -1,
#         "IframeRedirection": -1,
#         "AgeofDomain": -1,
#         "DNSRecording": -1,
#         "WebsiteTraffic": -1,
#         "PageRank": -1,
#         "GoogleIndex": -1,
#         "LinksPointingToPage": -1,
#         "StatsReport": -1
#     }

#     return features

import re
import socket
import requests
import whois
from urllib.parse import urlparse
from datetime import datetime
from bs4 import BeautifulSoup
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import asyncio

# =====================================
# 🔹 Initialize FastAPI App
# =====================================
app = FastAPI(title="PhishEye Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# 🔹 Helper Functions
# =====================================
def using_ip(url):
    return 1 if re.search(r'(\d{1,3}\.){3}\d{1,3}', url) else 0

def long_url(url):
    return 1 if len(url) >= 75 else 0

def short_url(url):
    return 1 if re.search(r'bit\.ly|goo\.gl|tinyurl\.com|t\.co', url) else 0

def symbol_at(url):
    return 1 if "@" in url else 0

def redirecting(url):
    return 1 if url.count("//") > 1 else 0

def prefix_suffix(url):
    return 1 if "-" in urlparse(url).netloc else 0

def sub_domains(url):
    return 1 if urlparse(url).netloc.count('.') > 2 else 0

def https(url):
    return 1 if urlparse(url).scheme == 'https' else 0

def domain_reg_len(domain):
    try:
        w = whois.whois(domain)
        if w.expiration_date:
            exp_date = w.expiration_date
            if isinstance(exp_date, list):
                exp_date = exp_date[0]
            return 1 if (exp_date - datetime.now()).days <= 365 else -1
    except Exception:
        pass
    return -1

def favicon(url):
    try:
        resp = requests.get(url, timeout=3)
        soup = BeautifulSoup(resp.text, 'html.parser')
        icon = soup.find("link", rel=lambda r: r and "icon" in r.lower())
        if icon and "://" in icon.get("href", ""):
            return 1
    except Exception:
        pass
    return -1

# =====================================
# 🔹 Request Schema
# =====================================
class ScanRequest(BaseModel):
    url: str

# =====================================
# 🔹 WebSocket Manager
# =====================================
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for conn in list(self.active_connections):
            try:
                await conn.send_json(message)
            except Exception:
                self.active_connections.remove(conn)

manager = ConnectionManager()

# =====================================
# 🔹 Threat Score Logic (Replace with ML model if available)
# =====================================
def compute_threat_score(url):
    u = url.lower()
    score = 0
    red_flags = ["-", "login", "verify", "secure", "update", "wallet", "bank",
                 "gift", "free", "promo", "offer", "prize", "support", "help"]

    for w in red_flags:
        if w in u:
            score += 8
    if u.startswith("http://"):
        score += 10
    if (u.count('.') > 3):
        score += 12
    if len(u) > 45:
        score += 6
    if re.search(r'\d{5,}', u):
        score += 10
    if "xn--" in u:
        score += 7

    score = min(100, round(score))
    label = "High" if score >= 70 else "Medium" if score >= 40 else "Low"
    result = "Phishing" if label == "High" else "Suspicious" if label == "Medium" else "Legitimate"
    return score, label, result

# =====================================
# 🔹 Real-Time Scan Endpoint
# =====================================
@app.post("/api/scan")
async def scan_url(req: ScanRequest):
    try:
        url = req.url.strip()
        parsed = urlparse(url)
        domain = parsed.netloc or url

        features = {
            "UsingIP": using_ip(url),
            "LongURL": long_url(url),
            "ShortURL": short_url(url),
            "SymbolAt": symbol_at(url),
            "Redirecting": redirecting(url),
            "PrefixSuffix": prefix_suffix(url),
            "SubDomains": sub_domains(url),
            "HTTPS": https(url),
            "DomainRegLen": domain_reg_len(domain),
            "Favicon": favicon(url)
        }

        score, label, result = compute_threat_score(url)

        record = {
            "url": url,
            "score": score,
            "label": label,
            "result": result,
            "time": datetime.now().strftime("%Y-%m-%d %H:%M"),
        }

        # Broadcast to dashboard clients
        asyncio.create_task(manager.broadcast(record))

        return record

    except Exception as e:
        return {"error": str(e)}

# =====================================
# 🔹 WebSocket for Real-Time Updates
# =====================================
@app.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()  # Keep alive
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# =====================================
# 🔹 Real-Time Statistics Endpoint
# =====================================
scan_stats = {"total": 0, "phishing": 0, "legit": 0, "suspicious": 0}

@app.get("/api/stats")
async def get_stats():
    return scan_stats
