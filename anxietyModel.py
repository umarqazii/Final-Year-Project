from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import csv
import random
import os
from bson import ObjectId
from dotenv import load_dotenv
import joblib
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
import pandas as pd
import pickle

app = Flask(__name__)
CORS(app)

# Load environment variables from .env file
load_dotenv()


# Retrieve MongoDB connection URI from environment variables
MONGODB_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client['FYP']  # Replace 'FYP' with your actual database name
collection = db['emotions']

# Define CSV file path
csv_file = 'temp.csv'

# Define column headers
headers = ['PatientID', 'Question No', 'Emotion1', 'Emotion2', 'Emotion3', 'Emotion4', 'Emotion5', 'Emotion6', 'Emotion7', 'Emotion8', 'Emotion9', 'Emotion10', 'Sentiment', 'GADscore', 'HeartRate', 'OxygenLevel']

# Function to write data to CSV
def write_to_csv(data):
    with open(csv_file, 'w', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=headers)
        writer.writeheader()
        for entry in [data]:
            for i in range(10):
                row = {
                    'PatientID': str(entry['patientID']),
                    'Question No': i + 1,
                    'Emotion1': entry['emotionsArray'][i*15],
                    'Emotion2': entry['emotionsArray'][i*15 + 1],
                    'Emotion3': entry['emotionsArray'][i*15 + 2],
                    'Emotion4': entry['emotionsArray'][i*15 + 3],
                    'Emotion5': entry['emotionsArray'][i*15 + 4],
                    'Emotion6': entry['emotionsArray'][i*15 + 5],
                    'Emotion7': entry['emotionsArray'][i*15 + 6],
                    'Emotion8': entry['emotionsArray'][i*15 + 7],
                    'Emotion9': entry['emotionsArray'][i*15 + 8],
                    'Emotion10': entry['emotionsArray'][i*15 + 9],
                    'Sentiment': entry.get('Sentiment', ''),
                    'GADscore': entry.get('GADscore', ''),
                    'HeartRate': entry['HeartRate'][i],
                    'OxygenLevel': entry['OxygenLevel'][i]
                }
                writer.writerow(row)
    print("CSV file created successfully!")


input_data = []
output_data = []

def get_input_data():
    input_data.clear()
    with open(csv_file, 'r', newline='') as file:
        reader = csv.DictReader(file)
        for row in reader:
            data_row = {
                'Emotion1': row['Emotion1'],
                'Emotion2': row['Emotion2'],
                'Emotion3': row['Emotion3'],
                'Emotion4': row['Emotion4'],
                'Emotion5': row['Emotion5'],
                'Emotion6': row['Emotion6'],
                'Emotion7': row['Emotion7'],
                'Emotion8': row['Emotion8'],
                'Emotion9': row['Emotion9'],
                'Emotion10': row['Emotion10'],
                'Sentiment': row['Sentiment'],
                'GADscore': int(row['GADscore']),  # Convert to int
                'HeartRate': int(row['HeartRate']),  # Convert to int
                'OxygenLevel': int(row['OxygenLevel'])  # Convert to int
            }
            input_data.append(data_row)
    print("Data loaded successfully!")
    print(input_data)


def make_predictions(input_data_list):
    # Load the model from the pickle file
    with open('model.pkl', 'rb') as file:
        loaded_model = pickle.load(file)
    
    # List to store predictions
    #predictions = []
    output_data.clear()
    
    # Loop through each input data dictionary in the list
    for input_data in input_data_list:
        # Create a DataFrame from the single input data
        input_df = pd.DataFrame([input_data])
        
        # Make a prediction using the loaded model
        prediction = loaded_model.predict(input_df)
        
        # Append the prediction to the predictions list
        output_data.append(prediction[0])
    
    return output_data




def analyze_output_data(output):
    count_yes = output.count("Yes")
    count_no = output.count("No")
    
    if count_yes > 5:
        return "Yes"
    elif count_no > 5:
        return "No"
    else:
        return "Undetermined"

    


@app.route('/anxiety-analysis', methods=['POST'])
def anxiety_analysis():
    # Retrieve patientID from the request
    patientID = request.json.get('patientID')

    # turn the patientID into an ObjectId
    patientID = ObjectId(patientID)

    #search for the patient data in the database using the patientID
    data = collection.find_one({'patientID': patientID})


    # Check if patient data exists
    if not data:
        print("Patient data not found")
        return jsonify({'error': 'Patient data not found'})

    # Write data to CSV
    write_to_csv(data)

    # Get the first 10 rows from the CSV file
    get_input_data()

    output_data = make_predictions(input_data)
    print(output_data)

    result = analyze_output_data(output_data)
    print(result)

    # Write the result in the database. The result will be used to determine if the patient has anxiety or not
    # find the patient using the patientID and update the hasAnxiety field with the result
    collection.find_one_and_update({'patientID': patientID}, {'$set': {'hasAnxiety': result}})

    # Return success message
    return jsonify({'success': 'Data written to CSV successfully'})


if __name__ == '__main__':
    app.run(port=8888)  
