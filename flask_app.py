from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import requests
from datetime import datetime

app = Flask(__name__)
CORS(app)

print("=" * 50)
print("📱 PHONE SAFETY BACKEND")
print("✅ Running on port 8000")
print("=" * 50)

@app.route('/api/test')
def test():
    return jsonify({
        "status": "success",
        "message": "Backend is working!",
        "time": datetime.now().strftime("%H:%M:%S")
    })

@app.route('/api/radiation/search')
def search_radiation():
    location = request.args.get('location')
    if not location:
        return jsonify({'error': 'Location parameter is required'}), 400

    try:
        # Geocode the location using Nominatim
        geocode_url = f'https://nominatim.openstreetmap.org/search?format=json&q={requests.utils.quote(location)}&limit=1'
        geocode_response = requests.get(geocode_url)
        geocode_data = geocode_response.json()

        if not geocode_data:
            return jsonify({'error': 'Location not found'}), 404

        lat = float(geocode_data[0]['lat'])
        lng = float(geocode_data[0]['lon'])

        # Generate simulated radiation data
        seed = abs(lat + lng) * 1000
        random_value = (abs(hash(str(seed))) % 1000) / 1000.0  # Simple pseudo-random
        level = 0.05 + (random_value * 1.5)

        if level < 0.2:
            status = 'safe'
        elif level < 0.5:
            status = 'warning'
        else:
            status = 'danger'

        radiation_data = {
            'level': round(level, 2),
            'status': status,
            'timestamp': datetime.now().isoformat(),
            'source': 'Backend Simulation'
        }

        return jsonify({
            'location': location,
            'coordinates': {'latitude': lat, 'longitude': lng},
            'radiation': radiation_data
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return '''
    <html>
    <body style="font-family: Arial; padding: 20px;">
        <h1>Phone Safety Backend</h1>
        <p>✅ Server is running</p>
        <p>Port: 8000</p>
        <p><a href="/api/test">Test API</a></p>
        <p><a href="/api/radiation/search?location=New%20York">Test Radiation Search</a></p>
    </body>
    </html>
    '''

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=False)