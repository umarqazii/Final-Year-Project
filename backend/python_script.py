import cv2
import os

def extract_frames(video_path, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video file.")
        return

    frame_count = 0

    # Read until the end of the video
    while True:
        # Read a frame from the video
        ret, frame = cap.read()

        # If no frame is retrieved, we've reached the end of the video
        if not ret:
            break

        # Save the frame as a WebP image
        frame_path = os.path.join(output_folder, f"frame_{frame_count:04d}.webp")
        cv2.imwrite(frame_path, frame, [cv2.IMWRITE_WEBP_QUALITY, 100])
        
        frame_count += 1

    cap.release()

    print(f"Frames extracted: {frame_count}")

if __name__ == "__main__":
    # Path to the WebM video file
    video_path = "C:\\Users\\Sys\\Desktop\\Final-Year-Project\\backend\\temp\\video.mp4"  # Replace this with the actual path to your WebM video file
    
    # Output folder to save the frames
    output_folder = "C:\\Users\\Sys\\Desktop\\Final-Year-Project\\backend\\temp\\output"  # Replace this with the desired output folder path

    extract_frames(video_path, output_folder)
