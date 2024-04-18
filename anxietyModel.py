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

model = joblib.load('anxiety_prediction_model.pkl')

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

'''
Note for Dani: 
- input_data is a list of dictionaries where each dictionary represents a row in the CSV file
- input_data bilkul usi tarah values store kr rha hai jesay test.ipynb mein store hai in the last cell. input_data[0], input_data[1] etc display kara k dekh lay beshak
- hum test.ipynb mein jo code likha hai woh yahan likhna hai anxiety analysis k liye
- test.ipynb mein hum sirf 1 row de rahay thay tou humein 1 Yes/No output mil raha tha. Yahan hum 10 rows de rahay hain tou humein 10 Yes/No outputs chahiye
- filhal meinay output_data array mein randomly Yes/No values store kar di hain jo populate_output_data() function k through hua hai
- tu nay iss ki jaga asal mein 10 rows ki 10 Yes/No values calculate karni hain.
- output_data array mein 10 Yes/No values store krni hain
- analyze_output_data() function mein output_data array pass karna hai aur woh function return karega k patient ko anxiety hai ya nahi
- baaqi database mein store krnay k liye bhi pipeline tyaar hai. bus tu nay Model say 10 Yes/No values leni hain
'''

def populate_output_data():
    output_data.clear()
    # Load the trained model
    model = joblib.load('anxiety_prediction_model.pkl')  # Replace 'model.pkl' with the path to your trained model file
    
    # Define the column transformer for one-hot encoding
    categorical_cols = ['Emotion1', 'Emotion2', 'Emotion3', 'Emotion4', 'Emotion5', 'Emotion6', 'Emotion7', 'Emotion8', 'Emotion9', 'Emotion10', 'Sentiment']
    preprocessor = ColumnTransformer(
        transformers=[('cat', OneHotEncoder(), categorical_cols)],
        remainder='passthrough'
    )
    
    for data_row in input_data:
        # Preprocess the input data
        input_data_row = [data_row['Emotion1'], data_row['Emotion2'], data_row['Emotion3'], data_row['Emotion4'], data_row['Emotion5'],
                          data_row['Emotion6'], data_row['Emotion7'], data_row['Emotion8'], data_row['Emotion9'], data_row['Emotion10'],
                          data_row['Sentiment'], data_row['GADscore'], data_row['HeartRate'], data_row['OxygenLevel']]
        input_data_encoded = preprocessor.transform([input_data_row])
        
        # Make predictions using the trained model
        prediction = model.predict(input_data_encoded)
        
        # Append the prediction to the output data
        output_data.append(prediction[0])  # Assuming prediction is a list with a single element
        
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

    output_data = populate_output_data()
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
