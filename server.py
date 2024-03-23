from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
from deepface import DeepFace
from textblob import TextBlob

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route('/save-and-analyze-frame', methods=['POST'])
def save_and_analyze_frame():
    frame_data = request.json['frame']

    
    # Decode base64 image data
    img_data = base64.b64decode(frame_data.split(',')[1])
    
    # Specify the directory to save frames
    save_dir = 'frames'
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    # Generate a unique filename
    filename = os.path.join(save_dir, f'frame_{len(os.listdir(save_dir))}.png')
    
    # Save the image to a file
    with open(filename, 'wb') as f:
        f.write(img_data)
    
    path =  filename
    # Perform emotion detection using DeepFace
    try:
        result = DeepFace.analyze(img_path=path, actions=['emotion'])
        #print(result[0]['dominant_emotion'])
        os.remove(path)
        dominant_emotion = result[0]['dominant_emotion']
        
        
        return jsonify({'emotion': dominant_emotion})
    except Exception as e:
        print('Error analyzing emotion:', str(e))
        return jsonify({'error': 'Error analyzing emotion'})
# Run the Flask app in debug mode

@app.route('/save-transcript', methods=['POST'])
def save_transcript():
    transcript = request.json.get('transcript')
    
    # Perform sentiment analysis using TextBlob
    blob = TextBlob(transcript)
    sentiment = 'positive' if blob.sentiment.polarity > 0 else 'negative' if blob.sentiment.polarity < 0 else 'neutral'
    print( transcript, sentiment)
    return jsonify({'transcript': transcript, 'sentiment': sentiment})

# GET endpoint for basic health check
@app.route('/', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})


if __name__ == '__main__':
    app.run(debug=True, port=5000)  # Run the Flask app in debug mode
