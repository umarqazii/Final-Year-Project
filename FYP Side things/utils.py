# utils.py

import sounddevice as sd
import numpy as np
import soundfile as sf
import speech_recognition as sr
from googletrans import Translator
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from moviepy.editor import VideoFileClip
from deepface import DeepFace
import cv2
import random
import time
import threading

is_audio_recording = False



# Function to stop audio recording
def stop_audio():
    global is_audio_recording
    if is_audio_recording:
        sd.stop()


# Function to record audio
def record_audio(duration, fs, channels, filename):
    print("Recording audio...")
    audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=channels, dtype='float32')
    sd.wait()
    print("Audio recording complete.")
    sf.write(filename, audio_data, fs)  # Save audio to file

# Function to record video
def record_video(duration, fps, resolution, filename):
    print("Recording video...")
    cap = cv2.VideoCapture(0)
    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    out = cv2.VideoWriter(filename, fourcc, fps, resolution)

    start_time = time.time()
    while (int(time.time() - start_time) < duration):
        ret, frame = cap.read()
        if ret == True:
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

def analyze_facial_emotions(video_path):
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    num_frames_to_select = min(6, total_frames)  # Ensure we don't select more frames than available

    random_frames = random.sample(range(0, total_frames), num_frames_to_select)

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

def main():
    # Define parameters
    duration = 10  # Record for 10 seconds
    fs = 44100  # Sample rate
    channels = 2  # Number of audio channels
    fps = 90  # Frames per second
    resolution = (640, 480)  # Resolution of the video

    # Define filenames
    audio_filename = "recorded_audio.wav"
    video_filename = "recorded_video.avi"

    # Create threads for audio and video recording
    audio_thread = threading.Thread(target=record_audio, args=(duration, fs, channels, audio_filename))
    video_thread = threading.Thread(target=record_video, args=(duration, fps, resolution, video_filename))

    # Start recording threads
    audio_thread.start()
    video_thread.start()

    # Wait for threads to finish
    audio_thread.join()
    video_thread.join()

    print("Audio recording saved as:", audio_filename)
    print("Video recording saved as:", video_filename)
    
    # Perform additional processing
    urdu_text = recognize_urdu_audio(audio_filename)
    print("Urdu Text:", urdu_text)
    
    english_text = translate_urdu_to_english(urdu_text)
    print("English Text:", english_text)
    
    sentiment = analyze_sentiment(english_text)
    print("Sentiment:", sentiment)
    
    emotions = analyze_facial_emotions(video_filename)
    print("Emotions:", emotions)



if __name__ == "__main__":
    main()
