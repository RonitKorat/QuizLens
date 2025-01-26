import os
import whisper
import google.generativeai as genai
import subprocess
import json
from pathlib import Path
import re

api_key = "AIzaSyDk59cIw8-vyuazJJRY32SfVXGyA61zqTo" 
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

def transcribe_audio(audio_path):
    """
    Transcribes audio file using Whisper model.
    """
    try:
        model = whisper.load_model("base")
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        print(f"Error transcribing audio: {e}")
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
    Generates a quiz using Google's Generative AI based on the transcription.
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
            model_name="gemini-1.5-pro-latest",
            generation_config=generation_config,
            safety_settings=safety_settings
        )

        prompt = (
            "Based on the following transcription, create a quiz with 5 multiple-choice questions. "
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
        
        return quiz_json

    except Exception as e:
        print(f"Error generating quiz: {e}")
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