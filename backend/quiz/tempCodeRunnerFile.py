from flask import Flask, request, jsonify
from app import (
    extract_audio_from_youtube, 
    transcribe_audio, 
    generate_quiz, 
    save_to_file,
    cleanup_files
)
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/extract-audio', methods=['POST'])
def extract_audio():
    audio_path = None
    transcription_path = None
    try:
        data = request.json
        youtube_url = data.get('youtube_url')
        if not youtube_url:
            return jsonify({'error': 'YouTube URL is required'}), 400

        output_dir = "youtube_quiz_output"
        audio_path = extract_audio_from_youtube(youtube_url, output_dir)
        if not audio_path:
            return jsonify({'error': 'Failed to extract audio'}), 500

        transcription = transcribe_audio(audio_path)
        if not transcription:
            return jsonify({'error': 'Failed to transcribe audio'}), 500

        transcription_path = os.path.join(output_dir, "transcription.txt")
        save_to_file(transcription, transcription_path)
        
        return jsonify({'transcription': transcription}), 200
        
    finally:
        # Cleanup files after response is sent
        cleanup_files(audio_path, transcription_path)
    
@app.route('/generate-quiz', methods=['POST'])
def generate_quiz_endpoint():
    quiz_path = None
    
    try:
        data = request.json
        transcription = data.get('transcription')
        if not transcription:
            return jsonify({'error': 'Transcription is required'}), 400

        quiz = generate_quiz(transcription)
        if not quiz:
            return jsonify({'error': 'Failed to generate quiz'}), 500

        quiz_path = os.path.join("youtube_quiz_output", "quiz.json")
        save_to_file(quiz, quiz_path)
        
        return jsonify({'quiz': quiz, 'transcription': transcription})
        
    finally:
        # Cleanup quiz file after response is sent
        cleanup_files(quiz_path)

if __name__ == '__main__':
    app.run(debug=True)