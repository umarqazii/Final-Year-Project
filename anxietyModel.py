from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import csv
import os
from bson import ObjectId
from dotenv import load_dotenv


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

# function to get the first 10 rows from the csv file in the following format
'''
input_data = {
    [
    'Emotion1': 'sad',
    'Emotion2': 'happy',
    'Emotion3': 'happy',
    'Emotion4': 'sad',
    'Emotion5': 'happy',
    'Emotion6': 'happy',
    'Emotion7': 'happy',
    'Emotion8': 'happy',
    'Emotion9': 'neutral',
    'Emotion10': 'happy',
    'Sentiment': 'neutral',
    'GADscore': 104,
    'HeartRate': 76,
    'OxygenLevel': 84
    ],
    [
    'Emotion1': 'sad',
    'Emotion2': 'happy',
    'Emotion3': 'happy',
    'Emotion4': 'sad',
    'Emotion5': 'happy',
    'Emotion6': 'happy',
    'Emotion7': 'happy',
    'Emotion8': 'happy',
    'Emotion9': 'neutral',
    'Emotion10': 'happy',
    'Sentiment': 'neutral',
    'GADscore': 104,
    'HeartRate': 76,
    'OxygenLevel': 84
    ],
    .
    .
    .
}
'''
input_data = []

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

    # Return success message
    return jsonify({'success': 'Data written to CSV successfully'})


if __name__ == '__main__':
    app.run(port=8888)  
