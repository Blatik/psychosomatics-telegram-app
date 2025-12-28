from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Загрузка данных
def load_data():
    with open('../data/psychosomatics_data.json', 'r', encoding='utf-8') as f:
        return json.load(f)

data = load_data()

@app.route('/')
def index():
    return send_from_directory('../src', 'index.html')

@app.route('/api/diseases')
def get_diseases():
    return jsonify(data)

@app.route('/api/search')
def search_diseases():
    query = request.args.get('q', '').lower()
    
    if not query:
        return jsonify(data)
    
    filtered_data = [
        item for item in data
        if query in item['Болезнь'].lower() or
           query in item['Причина'].lower() or
           query in item['Аффирмации'].lower()
    ]
    
    return jsonify(filtered_data)

@app.route('/api/disease/<int:disease_id>')
def get_disease(disease_id):
    if 0 <= disease_id < len(data):
        return jsonify(data[disease_id])
    return jsonify({'error': 'Болезнь не найдена'}), 404

@app.route('/api/stats')
def get_stats():
    return jsonify({
        'total_diseases': len(data),
        'categories': len(set(item['Болезнь'] for item in data))
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
