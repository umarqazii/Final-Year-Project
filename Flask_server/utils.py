# utils.py

import speech_recognition as sr
from googletrans import Translator
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from moviepy.editor import VideoFileClip
from deepface import DeepFace
import cv2
import random

# Function to extract audio and save as WAV
def extract_audio_and_save_as_wav(input_video_path, output_audio_path):
    video_clip = VideoFileClip(input_video_path)
    audio_clip = video_clip.audio

    audio_clip.write_audiofile(output_audio_path, codec='pcm_s16le', fps=44100)

    video_clip.close()

# Function to recognize Urdu audio
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

# Function to translate Urdu text to English
def translate_urdu_to_english(urdu_text):
    translator = Translator()
    translation = translator.translate(urdu_text, src='ur', dest='en')
    return translation.text

# Function for sentiment analysis
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

# Function for analyzing facial emotions
def analyze_facial_emotions(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    random_frames = random.sample(range(0, total_frames, total_frames // 3), 3)

    emotions = []

    for frame_num in random_frames:
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_num)
        ret, frame = cap.read()

        if not ret:
            print(f"Error reading frame {frame_num}")
            continue

        result = DeepFace.analyze(frame, actions=['emotion'])
        dominant_emotion = result[0]['dominant_emotion']
        emotions.append(dominant_emotion)

    cap.release()

    return emotions
