from flask import Flask, jsonify, request
import threading
from flask_cors import CORS
import sounddevice as sd
import numpy as np
import soundfile as sf
import speech_recognition as sr
from googletrans import Translator
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from deepface import DeepFace
import cv2
import random
import time

app = Flask(__name__)
CORS(app)

# Global variables to control the audio and video recording
audio_thread = None
video_thread = None
audio_filename = "recorded_audio.wav"
video_filename = "recorded_video.avi"


def record_audio(duration, fs, channels):
    print("Recording audio...")
    audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=channels, dtype='float32')
    sd.wait()
    print("Audio recording complete.")
    sf.write(audio_filename, audio_data, fs)  # Save audio to file


def record_video(duration, fps, resolution):
    print("Recording video...")
    cap = cv2.VideoCapture(0)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(video_filename, fourcc, fps, resolution)

    start_time = time.time()
    while int(time.time() - start_time) < duration:
        ret, frame = cap.read()
        if ret:
            out.write(frame)
            cv2.imshow('frame', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        else:
            break

    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print("Video recording complete.")


def stop_audio():
    # Nothing to stop for audio recording in this example
    pass


def stop_video():
    # Nothing to stop for video recording in this example
    pass


def recognize_urdu_audio(audio_path):
    recognizer = sr.Recognizer()

    with sr.AudioFile(audio_path) as source:
        audio_data = recognizer.record(source)

    try:
        text = recognizer.recognize_google(audio_data, language="ur-PK")  # Recognizing Urdu
        return text
    except sr.UnknownValueError:
        return "Google Web Speech API could not understand the audio."
    except sr.RequestError as e:
        return f"Could not request results from Google Web Speech API; {e}"


def translate_urdu_to_english(urdu_text):
    translator = Translator()
    translation = translator.translate(urdu_text, src='ur', dest='en')
    return translation.text


def analyze_sentiment(english_text):
    analyzer = SentimentIntensityAnalyzer()
    sentiment_scores = analyzer.polarity_scores(english_text)

    # Interpret the compound score
    if sentiment_scores['compound'] >= 0.05:
        return "Positive"
    elif sentiment_scores['compound'] <= -0.05:
        return "Negative"
    else:
        return "Neutral"


def analyze_facial_emotions(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    num_frames_to_select = min(6, total_frames)  # Ensure we don't select more frames than available

    random_frames = random.sample(range(0, total_frames), num_frames_to_select)

    emotions = []

    for frame_num in random_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()

        if ret:
            result = DeepFace.analyze(frame, actions=['emotion'])
            dominant_emotion = result[0]['dominant_emotion']
            emotions.append(dominant_emotion)
        else:
            print(f"Error reading frame {frame_num}")

    cap.release()

    return emotions


@app.route('/start_recording', methods=['POST'])
def start_recording():
    global audio_thread
    global video_thread

    # Check if audio or video is already recording
    if (audio_thread and audio_thread.is_alive()) or (video_thread and video_thread.is_alive()):
        return jsonify({"message": "Audio or video is already recording"})

    # Get audio and video parameters from the request data
    data = request.json
    audio_duration = data.get('audio_duration', 10)
    audio_fs = data.get('audio_fs', 44100)
    audio_channels = data.get('audio_channels', 2)

    video_duration = data.get('video_duration', 10)
    video_fps = data.get('video_fps', 30)
    video_resolution = data.get('video_resolution', (640, 480))

    # Start audio and video recording in separate threads
    audio_thread = threading.Thread(target=record_audio, args=(audio_duration, audio_fs, audio_channels))
    video_thread = threading.Thread(target=record_video, args=(video_duration, video_fps, video_resolution))

    audio_thread.start()
    video_thread.start()

    return jsonify({"message": "Audio and video recording started"})


@app.route('/stop_recording', methods=['POST'])
def stop_recording():
    global audio_thread
    global video_thread

    # Stop audio and video recording if they are currently recording
    if audio_thread and audio_thread.is_alive():
        audio_thread.join()  # Wait for audio recording to finish
    if video_thread and video_thread.is_alive():
        video_thread.join()  # Wait for video recording to finish

    return jsonify({"message": "Audio and video recording stopped and saved"})


@app.route('/process_recordings', methods=['POST'])
def process_recordings():
    urdu_text = recognize_urdu_audio("recorded_audio.wav")
    english_text = translate_urdu_to_english(urdu_text)
    sentiment = analyze_sentiment(english_text)    
    emotions = analyze_facial_emotions("recorded_video.avi")
    print(emotions)
    print(sentiment)
    return jsonify({
        "Sentiment": sentiment,
        "emotions":emotions     
    })


if __name__ == '__main__':
    app.run(debug=True)
