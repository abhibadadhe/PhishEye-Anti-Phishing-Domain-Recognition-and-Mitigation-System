# 🛡️ PhishEye: Anti-Phishing Domain Recognition & Mitigation System

PhishEye is an intelligent phishing-detection platform that identifies malicious domains, fake websites, and phishing URLs in real-time using AI/ML-driven analysis.  
It evaluates domain features like SSL, WHOIS, domain age, DNS records, entropy, and suspicious keywords and generates a threat probability score to protect users from credential theft and fraud attacks.

---

## 🚀 Features

| Category | Feature |
|--------|--------|
🔍 Detection | Real-time URL scanning and threat scoring  
🤖 AI/ML Models | Random Forest, Decision Tree, Neural Networks  
📡 Data Intelligence | WHOIS lookup, SSL verification, DNS analysis  
📊 Admin Dashboard | Live logs, threat history, analytics, reports  
⚠️ Alerts | Real-time malicious URL alerts  
🔄 Automation | Automatic takedown request trigger for malicious domains  
🧠 Smart Scoring | Probability-based threat scoring (not just safe/unsafe)  
☁️ Deployment | Scalable cloud-ready architecture  

---

## 🏗️ System Architecture

**Frontend:** React.js  
**Backend API:** FastAPI, Python, Node.js 
**ML Engine:** Python (Sk-Learn, Neural Networks)  
**Database:** SQL / Cloud Storage  
**Other Integrations:** WHOIS APIs, DNS lookups, PhishTank/APWG feeds  

### 🔧 Architecture Workflow
1. User submits URL  
2. System extracts features  
3. ML model classifies URL & assigns threat score  
4. Dashboard updates logs & alerts users  
5. Optionally triggers takedown requests  

---



## ⚙️ Installation & Setup

### ✅ Clone Repo
```bash
git clone https://github.com/abhibadadhe/PhishEye-Anti-Phishing-Domain-Recognition-and-Mitigation-System.git
cd PhishEye


✅ Backend Setup (Node.js)
    cd backend
    npm install
    npm start


📊 Machine Learning Pipeline

Dataset from PhishTank, APWG, Alexa Top Sites
Domain & URL feature extraction:
WHOIS age
SSL certificate validation
Domain name entropy
URL length & patterns
DNS record analysis

Model Training:
Random Forest
Decision Tree
Neural Network

Metrics: Accuracy, precision, recall, F1-score

🧪 Testing

Run phishing URL tests using:

✔️ Real phishing feed (APWG / PhishTank)
✔️ Custom malicious sample set
✔️ Legitimate domain dataset

🛠️ Future Enhancements

Browser extension for instant warnings
AI-powered email phishing detection
Blockchain-based verification
Cloud threat intelligence network

⚖️ License & Copyright

This work is protected under Indian Copyright Act, 1957 & international IP laws.
Unauthorized commercial use, reproduction, or distribution is prohibited.

© 2025 PhishEye Project Team — All Rights Reserved
