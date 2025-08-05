from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def ai_score(text):
    score = 0
    text_lower = text.lower()
    if "password" in text_lower: score += 30
    if "login" in text_lower: score += 20
    if "verify" in text_lower: score += 10
    return min(score, 100)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    html = data.get("html", "")
    score = ai_score(html)
    verdict = "Safe"
    if score > 60:
        verdict = "High Risk"
    elif score > 30:
        verdict = "Caution"
    return jsonify({"score": score, "verdict": verdict})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)