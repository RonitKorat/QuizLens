import os
import whisper
import google.generativeai as genai
import subprocess
import json
from pathlib import Path
import re
from dotenv import load_dotenv

api_key = os.getenv("API_KEY")
genai.configure(api_key=api_key)

def cleanup_files(*file_paths):
    """
    Cleanup multiple files and handle any errors.
    """
    for file_path in file_paths:
        try:
            if file_path and os.path.exists(file_path):
                os.remove(file_path)
                print(f"Cleaned up file: {file_path}")
        except Exception as e:
            print(f"Error cleaning up {file_path}: {e}")

def extract_audio_from_youtube(youtube_url, output_dir="temp"):
    """
    Extracts audio from a YouTube video and saves it as MP3.
    """
    Path(output_dir).mkdir(exist_ok=True)
    audio_output_path = os.path.join(output_dir, "output_audio.mp3")

    try:
        command = [
            "yt-dlp",
            "-x",
            "--audio-format", "mp3",
            "-o", audio_output_path,
            youtube_url
        ]
        subprocess.run(command, check=True)
        return audio_output_path
    except subprocess.CalledProcessError as e:
        print(f"Error downloading audio: {e}")
        cleanup_files(audio_output_path)
        return None

def extract_audio_from_local_video(local_video_path, output_dir="temp"):
    """
    Extracts audio from a local video file and saves it as MP3.
    """
    Path(output_dir).mkdir(exist_ok=True)
    audio_output_path = os.path.join(output_dir, "output_audio.mp3")
    
    try:
        print(f"Extracting audio from: {local_video_path}")
        print(f"Output audio path: {audio_output_path}")
        
        # First, let's check if the video file is valid
        probe_command = [
            "ffprobe",
            "-v", "quiet",
            "-print_format", "json",
            "-show_format",
            "-show_streams",
            local_video_path
        ]
        
        try:
            probe_result = subprocess.run(probe_command, check=True, capture_output=True, text=True)
            print(f"Video file info: {probe_result.stdout[:500]}...")
        except subprocess.CalledProcessError as e:
            print(f"Error probing video file: {e}")
            print(f"FFprobe stderr: {e.stderr}")
            return None
        
        command = [
            "ffmpeg",
            "-i", local_video_path,
            "-vn",  # No video
            "-acodec", "mp3",
            "-ar", "16000",  # Sample rate 16kHz for better Whisper performance
            "-ac", "1",      # Mono audio
            "-b:a", "128k",  # Bitrate
            "-y",            # Overwrite output file
            audio_output_path
        ]
        
        print(f"Running command: {' '.join(command)}")
        result = subprocess.run(command, check=True, capture_output=True, text=True)
        print(f"FFmpeg stdout: {result.stdout}")
        print(f"FFmpeg stderr: {result.stderr}")
        
        if os.path.exists(audio_output_path):
            file_size = os.path.getsize(audio_output_path)
            print(f"Audio file created successfully. Size: {file_size} bytes")
            
            # Verify the audio file is not empty and has content
            if file_size > 0:
                return audio_output_path
            else:
                print("Audio file is empty")
                cleanup_files(audio_output_path)
                return None
        else:
            print("Audio file was not created")
            return None
            
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg error: {e}")
        print(f"FFmpeg stdout: {e.stdout}")
        print(f"FFmpeg stderr: {e.stderr}")
        cleanup_files(audio_output_path)
        return None
    except Exception as e:
        print(f"Error extracting audio: {e}")
        cleanup_files(audio_output_path)
        return None

def transcribe_audio(audio_path):
    """
    Transcribes audio file using Whisper model.
    """
    try:
        print(f"Starting transcription of: {audio_path}")
        
        if not os.path.exists(audio_path):
            print(f"Audio file does not exist: {audio_path}")
            return None
            
        file_size = os.path.getsize(audio_path)
        print(f"Audio file size: {file_size} bytes")
        
        if file_size == 0:
            print("Audio file is empty")
            return None
        
        print("Loading Whisper model...")
        model = whisper.load_model("base")
        print("Whisper model loaded successfully")
        
        print("Starting transcription...")
        result = model.transcribe(audio_path)
        transcription = result["text"]
        
        print(f"Transcription completed. Length: {len(transcription)} characters")
        print(f"Transcription preview: {transcription[:200]}...")
        
        # Check if transcription is meaningful
        if len(transcription.strip()) < 10:
            print("Transcription seems too short, trying with larger model...")
            try:
                model_large = whisper.load_model("small")
                result_large = model_large.transcribe(audio_path)
                transcription_large = result_large["text"]
                if len(transcription_large.strip()) > len(transcription.strip()):
                    print("Using transcription from larger model")
                    return transcription_large
            except Exception as e:
                print(f"Failed to use larger model: {e}")
        
        return transcription
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        import traceback
        traceback.print_exc()
        
        # Try with a different model as fallback
        try:
            print("Trying fallback transcription with 'tiny' model...")
            model_tiny = whisper.load_model("tiny")
            result_tiny = model_tiny.transcribe(audio_path)
            transcription_tiny = result_tiny["text"]
            print(f"Fallback transcription completed. Length: {len(transcription_tiny)} characters")
            return transcription_tiny
        except Exception as fallback_error:
            print(f"Fallback transcription also failed: {fallback_error}")
            return None

def extract_json_from_response(response_text):
    """
    Extracts JSON from the response text, handling potential formatting issues.
    """
    try:
        json_match = re.search(r'\[.*\]', response_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(0)
            return json.loads(json_str)
        return json.loads(response_text)
    except Exception as e:
        print(f"Error extracting JSON: {e}")
        return None

def generate_quiz(transcription):
    """
    Generates a quiz and a title using Google's Generative AI based on the transcription.
    """
    try:
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
        }

        safety_settings = [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        ]

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        # Generate quiz questions
        prompt = (
            "Based on the following transcription, create a quiz with 10 multiple-choice questions. "
            "Return ONLY a JSON array with no additional text. Each object in the array should have "
            "these exact keys: 'question', 'choice1', 'choice2', 'choice3', 'choice4', and 'answer' "
            "(where answer is a number 1-4).\n\n"
            f"Transcription:\n{transcription}\n\n"
            "Response format:\n"
            """[
                {
                    "question": "Question text here?",
                    "choice1": "First option",
                    "choice2": "Second option",
                    "choice3": "Third option",
                    "choice4": "Fourth option",
                    "answer": 1
                },
                ...
            ]"""
        )

        response = model.generate_content(prompt)
        quiz_json = extract_json_from_response(response.text)
        
        if not quiz_json:
            print("Failed to generate valid quiz JSON. Retrying with simplified format...")
            simple_prompt = (
                f"Create 5 multiple choice questions about this content:\n{transcription}\n"
                "Format as JSON array. Each question should have: question, choice1-4, and answer (1-4)."
            )
            response = model.generate_content(simple_prompt)
            quiz_json = extract_json_from_response(response.text)
        
        # Generate a title for the quiz
        title_prompt = (
            "Based on the following transcription, generate a short, catchy, and relevant title for a quiz. "
            "Return ONLY the title as plain text, no extra formatting.\n\n"
            f"Transcription:\n{transcription}\n"
        )
        title_response = model.generate_content(title_prompt)
        title = title_response.text.strip().replace('"', '')

        return {"title": title, "questions": quiz_json}

    except Exception as e:
        print(f"Error generating quiz or title: {e}")
        return None

def save_to_file(content, filename):
    """
    Saves content to a file.
    """
    try:
        with open(filename, 'w', encoding='utf-8') as file:
            if isinstance(content, str):
                file.write(content)
            else:
                json.dump(content, file, indent=4)
        return True
    except Exception as e:
        print(f"Error saving to {filename}: {e}")
        return False

def main():
    output_dir = "youtube_quiz_output"
    Path(output_dir).mkdir(exist_ok=True)
    
    audio_path = None
    transcription_path = None
    quiz_path = None
    
    try:
        youtube_url = input("Enter the YouTube video link: ")
        
        audio_path = extract_audio_from_youtube(youtube_url, output_dir)
        if not audio_path:
            print("Failed to download audio. Please check the URL and try again.")
            return

        print("Transcribing audio...")
        transcription = transcribe_audio(audio_path)
        if not transcription:
            print("Failed to transcribe audio.")
            return

        transcription_path = os.path.join(output_dir, "transcription.txt")
        if save_to_file(transcription, transcription_path):
            print(f"Transcription saved to {transcription_path}")

        print("Generating quiz...")
        quiz_data = generate_quiz(transcription)        
        if quiz_data:
            quiz_path = os.path.join(output_dir, "quiz.json")
            if save_to_file(quiz_data, quiz_path):
                print(f"Quiz saved to {quiz_path}")
                print("Quiz generation completed successfully!")
        else:
            print("Failed to generate quiz.")

    finally:
        # Cleanup all generated files
        cleanup_files(audio_path, transcription_path, quiz_path)
        print("All temporary files have been cleaned up.")

if __name__ == "__main__":
    main()