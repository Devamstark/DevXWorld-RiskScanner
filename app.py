from flask import Flask, request, jsonify
import random

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    html = data.get('html', '')
    model = data.get('model', 'fast')

    print(f"[MODEL SELECTED] {model}")

    if model == 'deep':
        score = random.randint(60, 100)
    else:
        score = random.randint(30, 80)

    if score > 75:
        verdict = "Safe"
    elif score > 50:
        verdict = "Caution"
    else:
        verdict = "High Risk"

    return jsonify({
        'score': score,
        'verdict': verdict
    })
