from flask import Flask, jsonify 
from flask_cors import CORS 
 
app = Flask(__name__) 
CORS(app) 
 
@app.route("/api/auth/register", methods=["GET","POST"]) 
def register(): 
    return jsonify({"success":True,"message":"Project Success!"}), 201 
 
if __name__ == "__main__": 
    print("Backend Ready!") 
    app.run(port=8000) 
