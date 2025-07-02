from flask import Flask, request, jsonify, render_template
import joblib
import numpy as np
from flask_cors import CORS  # import CORS

app = Flask(__name__)
CORS(app)  # enable CORS for all routes

# Load the trained model
model = joblib.load('heart_disease_prediction_model.joblib')

@app.route('/')
def home():
    return render_template('index.html')  # this route serves index.html

@app.route('/predict', methods=['POST']) #acepts json data via post
def predict():
    try:
        # reads json data
        data = request.get_json(force=True)
        # key features are extracted from data
        age = float(data['age'])
        chol = float(data['chol'])
        trestbps = float(data['trestbps'])
       
        sex=1
        cp=0
        fbs=0
        restecg=0
        thalach= 150
        exang =0
        oldpeak =1.0
        slope =1
        ca =0
        thal= 2
        # Prepare features for prediction
        input_features = np.array([[age, sex, cp, trestbps, chol, fbs, restecg,
                                thalach, exang, oldpeak, slope, ca, thal]])
        
        # Make prediction
        prediction = model.predict(input_features)
        # Convert prediction to readable result
        result = 'Heart Disease' if prediction[0] == 1 else 'No Heart Disease'

        # Send result as JSON response 
        # sending response to frontend
        return jsonify({'result': result})

    except Exception as e:
        
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=5000, debug=True)


