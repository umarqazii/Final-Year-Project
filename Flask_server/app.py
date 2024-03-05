# app.py

from flask import Flask, request, jsonify
from utils import extract_audio_and_save_as_wav, recognize_urdu_audio, translate_urdu_to_english, analyze_sentiment,analyze_facial_emotions
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/', methods=['GET'])
def index():
    return 'Welcome to my Flask application'

@app.route('/analyze-video', methods=['POST'])
def analyze_video():
    print("POST request received at /analyze-video")
    # Receive video file from the request
    #video_file = request.files['video']

    # Save the video file
    video_path = 'C:\\Users\\Sys\\Desktop\\Final-Year-Project\\backend\\temp\\video.webm'
    #video_file.save(video_path)
    
    
    print("POST request received at /analyze-video")

    # Extract audio from video
    output_audio_path = 'output_audio.wav'
    extract_audio_and_save_as_wav(video_path, output_audio_path)

    # Recognize Urdu audio
    urdu_text = recognize_urdu_audio(output_audio_path)

    # Translate Urdu text to English
    english_text = translate_urdu_to_english(urdu_text)

    # Analyze sentiment of English text
    sentiment = analyze_sentiment(english_text)

    # analyze facial emotion
    facial_emotion = analyze_facial_emotions(video_path)

    # Perform facial emotion analysis
    # Print the result
    print("Urdu Text:", urdu_text)
    print("English Translation:", english_text)
    print("Sentiment:", sentiment)

    # Return the results as JSON
    return jsonify({
        'sentiment': sentiment,
        'facial_emotion':facial_emotion
    })
if __name__ == '__main__':
    app.run(debug=True)