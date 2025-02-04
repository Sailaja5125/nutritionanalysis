# flask app use PIL image library for loading the static images not image urls 
from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
genai.configure(api_key="Your Own API key")

@app.route('/recognize', methods=['POST'])
def recognize_food():
    image_url = request.json.get('image_url')
    if not image_url:
        return jsonify({"error": "No image URL provided"}), 400    
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(f"Recognize the food or bakery item in given image {image_url} and say only the food item")
        return jsonify({"food_item": response.text.strip()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
