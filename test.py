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
from sklearn.exceptions import NotFittedError
import pandas as pd
import numpy as np

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
def write_to_csv(data, headers):
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

# Load the trained model
model = joblib.load('anxiety_prediction_model.pkl')

# function to get the first 10 rows from the csv file
def get_input_data():
    input_data = []
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
    return input_data

# function to populate output data
def populate_output_data(input_data):
    output_data = []
    # Define the column transformer for one-hot encoding
    categorical_cols = ['Emotion1', 'Emotion2', 'Emotion3', 'Emotion4', 'Emotion5', 'Emotion6', 'Emotion7', 'Emotion8', 'Emotion9', 'Emotion10', 'Sentiment']
    preprocessor = ColumnTransformer(
        transformers=[('cat', OneHotEncoder(), categorical_cols)],
        remainder='passthrough'
    )

    # Fit the ColumnTransformer to the input data
    try:
        preprocessor.fit(input_data)
    except Exception as e:
        print(f"Error occurred while fitting the ColumnTransformer: {e}")
        return None

    for data_row in input_data:
        # Preprocess the input data
        # input_data_row = [data_row['Emotion1'], data_row['Emotion2'], data_row['Emotion3'], data_row['Emotion4'], data_row['Emotion5'],
        #                   data_row['Emotion6'], data_row['Emotion7'], data_row['Emotion8'], data_row['Emotion9'], data_row['Emotion10'],
        #                   data_row['Sentiment'], data_row['GADscore'], data_row['HeartRate'], data_row['OxygenLevel']]
        
        input_df = pd.DataFrame([data_row])
        
        input_data_encoded = preprocessor.transform(input_df)
        print(data_row)

        # Make predictions using the trained model
        prediction = model.predict(input_data_encoded)
        # Append the prediction to the output data
        print(prediction[0])
        output_data.append(prediction[0])  # Assuming prediction is a list with a single element

    return output_data

def dani1(single_row):
    categorical_cols = ['Emotion1', 'Emotion2', 'Emotion3', 'Emotion4', 'Emotion5', 'Emotion6', 'Emotion7', 'Emotion8', 'Emotion9', 'Emotion10', 'Sentiment']
    
    # Preprocess the categorical columns using OneHotEncoder
    one_hot_encoder = OneHotEncoder()
    # Reshape each categorical value into a 2D array before encoding
    one_hot_encoded_data = one_hot_encoder.fit_transform([[single_row[col]] for col in categorical_cols]).toarray()

    # Combine one-hot encoded data with remaining numerical data
    numerical_data = np.array([single_row['GADscore'], single_row['HeartRate'], single_row['OxygenLevel']])
    
    # Check if shapes match for concatenation
    if one_hot_encoded_data.shape[1] + numerical_data.shape[0] == 13:  # 13 is the total number of features expected
        input_encoded = np.concatenate([one_hot_encoded_data.flatten(), numerical_data])
    else:
        print("Shapes of one-hot encoded data and numerical data do not match!")
        return None

    # Make predictions using the trained model
    prediction = model.predict(input_encoded.reshape(1, -1))

    return prediction[0]


def dani(single_row):
    
    categorical_cols = ['Emotion1', 'Emotion2', 'Emotion3', 'Emotion4', 'Emotion5', 'Emotion6', 'Emotion7', 'Emotion8', 'Emotion9', 'Emotion10', 'Sentiment']
    preprocessor = ColumnTransformer(
        transformers=[('cat', OneHotEncoder(), categorical_cols)],
        remainder='passthrough'
    )
    print(single_row)
    input_data_row = [single_row['Emotion1'], single_row['Emotion2'], single_row['Emotion3'], single_row['Emotion4'], single_row['Emotion5'],
                      single_row['Emotion6'], single_row['Emotion7'], single_row['Emotion8'], single_row['Emotion9'], single_row['Emotion10'],
                      single_row['Sentiment'], single_row['GADscore'], single_row['HeartRate'], single_row['OxygenLevel']]
    input_df = pd.DataFrame([single_row])
    # Preprocess the input data
    input_encoded = preprocessor.transform(input_df)

# Make predictions using the trained model
    prediction = model.predict(input_encoded)

    #prediction = model.predict(input_data_df)
    return prediction[0]


# function to analyze output data
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
    write_to_csv(data, headers)

    # Get the first 10 rows from the CSV file
    input_data = get_input_data()

    # Populate output data
    #output_data = populate_output_data(input_data)
    output_data = dani1(input_data[0])

    if output_data is not None:
        print(output_data)

        # Analyze output data
        result = analyze_output_data(output_data)
        print(result)

        # Write the result in the database. The result will be used to determine if the patient has anxiety or not
        # find the patient using the patientID and update the hasAnxiety field with the result
        collection.find_one_and_update({'patientID': patientID}, {'$set': {'hasAnxiety': result}})

        # Return success message
        return jsonify({'success': 'Data written to CSV successfully'})
    else:
        return jsonify({'error': 'Model has not been fitted yet. Please fit the model before making predictions.'})

if __name__ == '__main__':
    app.run(port=8888)
