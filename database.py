import json
import os
import sys
from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS

print("🚀 Starting RadSafe Database Server...")
print(f"🐍 Python version: {sys.version}")

app = Flask(__name__)
CORS(app, origins=["http://localhost:3001"], methods=["GET", "POST", "PUT", "OPTIONS"], supports_credentials=True)

# Database file
DB_FILE = os.path.join(os.path.dirname(__file__), 'radsafe_database.json')
PORT = 3002  # ADD THIS LINE
print(f"💾 Database file: {DB_FILE}")

# Initialize database if not exists
def init_database():
    if not os.path.exists(DB_FILE):
        default_data = {
            "users": [
                {
                    "id": 1,
                    "name": "Alex Johnson",
                    "email": "alex@example.com",
                    "profilePhoto": "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                    "role": "user",
                    "phone": "+1234567890",
                    "createdAt": datetime.now().isoformat()
                }
            ],
            "profiles": [],
            "readings": [],
            "alerts": [],
            "settings": []
        }
        save_database(default_data)
        print("✅ Created new database file")

# Load database
def load_database():
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️  Error loading database: {e}")
        return {"users": [], "profiles": [], "readings": [], "alerts": [], "settings": []}

# Save database
def save_database(data):
    try:
        with open(DB_FILE, 'w') as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"❌ Error saving database: {e}")

# Get next ID
def get_next_id(items):
    ids = [item.get('id', 0) for item in items if isinstance(item, dict)]
    return max(ids, default=0) + 1

# ========== HOME PAGE ==========
@app.route('/')
def home():
    return f'''
    <!DOCTYPE html>
    <html>
    <head>
        <title>RadSafe Database Server</title>
        <style>
            body {{ font-family: Arial; margin: 40px; background: #1e293b; color: white; }}
            .container {{ max-width: 800px; margin: 0 auto; padding: 30px; background: #0f172a; border-radius: 20px; }}
            h1 {{ color: #60a5fa; }}
            .endpoint {{ background: #334155; padding: 15px; margin: 10px 0; border-radius: 10px; }}
            .method {{ display: inline-block; background: #3b82f6; color: white; padding: 5px 10px; border-radius: 5px; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ RadSafe Database Server</h1>
            <p>Server is running on port {PORT}</p>
            
            <h2>Test Endpoints:</h2>
            <div class="endpoint">
                <span class="method">GET</span> 
                <a href="/api/test" style="color: #60a5fa; margin-left: 10px;">/api/test</a>
                <p style="color: #94a3b8; margin-top: 5px;">Test if server is working</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> 
                <a href="/api/health" style="color: #60a5fa; margin-left: 10px;">/api/health</a>
                <p style="color: #94a3b8; margin-top: 5px;">Health check</p>
            </div>
            
            <div class="endpoint">
                <span class="method">GET</span> 
                <a href="/api/users" style="color: #60a5fa; margin-left: 10px;">/api/users</a>
                <p style="color: #94a3b8; margin-top: 5px;">List all users</p>
            </div>
            
            <h2>Quick Test:</h2>
            <p>Open browser console and run:</p>
            <pre style="background: #334155; padding: 10px; border-radius: 5px;">
fetch('http://localhost:{PORT}/api/test')
  .then(r => r.json())
  .then(data => console.log(data))</pre>
        </div>
    </body>
    </html>
    '''

# ========== TEST ENDPOINT ==========
@app.route('/api/test', methods=['GET', 'OPTIONS'])
def test():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        "success": True,
        "message": "✅ RadSafe Database is working perfectly!",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "GET /api/health": "Health check",
            "GET /api/test": "This test page",
            "GET /api/users": "List all users",
            "GET /api/users/<id>": "Get specific user",
            "PUT /api/users/<id>": "Update user",
            "GET /api/profiles": "List all profiles",
            "GET /api/profiles/user/<id>": "Get user profile"
        },
        "status": "operational"
    })

# ========== HEALTH CHECK ==========
@app.route('/api/health', methods=['GET', 'OPTIONS'])
def health_check():
    if request.method == 'OPTIONS':
        return '', 200
    
    return jsonify({
        "status": "healthy",
        "service": "RadSafe Database API",
        "database_file": DB_FILE,
        "timestamp": datetime.now().isoformat(),
        "users_count": len(load_database().get('users', [])),
        "profiles_count": len(load_database().get('profiles', []))
    })

# ========== AUTHENTICATION ROUTES ==========
@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.json
        if not data or not data.get('email') or not data.get('password') or not data.get('full_name'):
            return jsonify({"error": "Missing required fields: email, password, full_name"}), 400

        db = load_database()

        # Check if user already exists
        existing_user = next((u for u in db.get('users', []) if u.get('email') == data['email']), None)
        if existing_user:
            return jsonify({"error": "User already exists with this email"}), 409

        # Create new user
        user = {
            "id": get_next_id(db.get('users', [])),
            "name": data['full_name'],
            "email": data['email'],
            "password": data['password'],  # In production, hash this!
            "role": "user",
            "profilePhoto": f"https://api.dicebear.com/7.x/avataaars/svg?seed={data['email']}",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }

        db['users'].append(user)
        save_database(db)

        # Return user without password
        user_response = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": user_response
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200

    try:
        data = request.json
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({"error": "Missing email or password"}), 400

        db = load_database()

        # Find user by email
        user = next((u for u in db.get('users', []) if u.get('email') == data['email']), None)
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        # Check password (in production, use proper password hashing)
        if user.get('password') != data['password']:
            return jsonify({"error": "Invalid email or password"}), 401

        # Return user without password
        user_response = {k: v for k, v in user.items() if k != 'password'}
        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": user_response,
            "access_token": f"token_{user['id']}_{datetime.now().timestamp()}",  # Simple token
            "token_type": "bearer"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== USER ROUTES ==========
@app.route('/api/users', methods=['GET', 'OPTIONS'])
def get_users():
    if request.method == 'OPTIONS':
        return '', 200

    db = load_database()
    # Return users without passwords
    users = [{k: v for k, v in u.items() if k != 'password'} for u in db.get('users', [])]
    return jsonify(users)

@app.route('/api/users/<int:user_id>', methods=['GET', 'OPTIONS'])
def get_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    db = load_database()
    user = next((u for u in db.get('users', []) if u.get('id') == user_id), None)
    if user:
        return jsonify(user)
    return jsonify({"error": "User not found"}), 404

@app.route('/api/users/<int:user_id>', methods=['PUT', 'OPTIONS'])
def update_user(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        db = load_database()
        user_data = request.json
        
        for i, user in enumerate(db.get('users', [])):
            if user.get('id') == user_id:
                # Update user
                db['users'][i].update(user_data)
                db['users'][i]['updatedAt'] = datetime.now().isoformat()
                
                # Also save to profiles collection
                profile = next((p for p in db.get('profiles', []) if p.get('userId') == user_id), None)
                if profile:
                    profile.update(user_data)
                    profile['updatedAt'] = datetime.now().isoformat()
                else:
                    db['profiles'].append({
                        **user_data,
                        "id": get_next_id(db.get('profiles', [])),
                        "userId": user_id,
                        "createdAt": datetime.now().isoformat(),
                        "updatedAt": datetime.now().isoformat()
                    })
                
                save_database(db)
                return jsonify({
                    "success": True, 
                    "message": f"User {user_id} updated",
                    "user": db['users'][i]
                })
        
        return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ========== PROFILE ROUTES ==========
@app.route('/api/profiles', methods=['GET', 'POST', 'OPTIONS'])
def profiles():
    if request.method == 'OPTIONS':
        return '', 200
    
    if request.method == 'GET':
        db = load_database()
        return jsonify(db.get('profiles', []))
    
    elif request.method == 'POST':
        try:
            db = load_database()
            profile_data = request.json
            
            profile = {
                "id": get_next_id(db.get('profiles', [])),
                **profile_data,
                "createdAt": datetime.now().isoformat(),
                "updatedAt": datetime.now().isoformat()
            }
            
            db['profiles'].append(profile)
            save_database(db)
            return jsonify({"success": True, "profile": profile})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route('/api/profiles/user/<int:user_id>', methods=['GET', 'OPTIONS'])
def get_user_profile(user_id):
    if request.method == 'OPTIONS':
        return '', 200
    
    db = load_database()
    profile = next((p for p in db.get('profiles', []) if p.get('userId') == user_id), None)
    if profile:
        return jsonify(profile)
    return jsonify({})

# ========== DEBUG ROUTE ==========
@app.route('/api/debug', methods=['GET'])
def debug():
    db = load_database()
    return jsonify({
        "database": db,
        "file_exists": os.path.exists(DB_FILE),
        "file_size": os.path.getsize(DB_FILE) if os.path.exists(DB_FILE) else 0,
        "current_time": datetime.now().isoformat()
    })

# ========== MAIN ==========
if __name__ == '__main__':
    print("=" * 60)
    print("🔥 RADSAFE DATABASE SERVER")
    print("=" * 60)
    
    init_database()
    
    print(f"✅ Database initialized")
    print(f"🌐 Server starting on: http://localhost:{PORT}")
    print(f"📊 Home page: http://localhost:{PORT}")
    print(f"🧪 Test: http://localhost:{PORT}/api/test")
    print(f"👤 Users: http://localhost:{PORT}/api/users")
    print("=" * 60)
    print("Press Ctrl+C to stop\n")
    
    try:
        app.run(host='0.0.0.0', port=PORT, debug=False, threaded=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Try: pip install flask flask-cors")