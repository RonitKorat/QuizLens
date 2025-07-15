from flask import Flask, request, jsonify
from flask_talisman import Talisman
from server import (
    extract_audio_from_youtube, 
    extract_audio_from_local_video,
    transcribe_audio, 
    generate_quiz, 
    save_to_file,
    cleanup_files
)
from flask_cors import CORS
import os
csp = {
    'default-src': '\'self\'',
    'style-src': ['\'self\'', 'https://fonts.googleapis.com'],
    'font-src': ['\'self\'', 'https://fonts.gstatic.com']
}

app = Flask(__name__)

Talisman(app, content_security_policy=csp)
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
        
        print("[extract-audio] Transcription:", transcription)
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

@app.route('/upload-video', methods=['POST'])
def upload_video():
    audio_path = None
    transcription_path = None
    uploaded_file_path = None
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file provided'}), 400
        video_file = request.files['video']
        if video_file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        print(f"Received video file: {video_file.filename}")
        print(f"File content type: {video_file.content_type}")

        # Validate file extension
        allowed_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v'}
        file_extension = os.path.splitext(video_file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            return jsonify({
                'error': f'Unsupported video format. Supported formats: {", ".join(allowed_extensions)}'
            }), 400

        output_dir = "youtube_quiz_output"
        os.makedirs(output_dir, exist_ok=True)
        uploaded_file_path = os.path.join(output_dir, video_file.filename)
        video_file.save(uploaded_file_path)
        
        print(f"Video file saved to: {uploaded_file_path}")
        file_size = os.path.getsize(uploaded_file_path)
        print(f"Video file size: {file_size} bytes")

        # Extract audio from the uploaded video file
        audio_path = extract_audio_from_local_video(uploaded_file_path, output_dir)
        if not audio_path:
            return jsonify({'error': 'Failed to extract audio from video'}), 500

        transcription = transcribe_audio(audio_path)
        if not transcription:
            return jsonify({'error': 'Failed to transcribe audio'}), 500

        transcription_path = os.path.join(output_dir, "transcription.txt")
        save_to_file(transcription, transcription_path)

        print("[upload-video] Transcription:", transcription)
        return jsonify({'transcription': transcription}), 200
    except Exception as e:
        print(f"Error in upload_video endpoint: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        # Cleanup files after response is sent
        cleanup_files(audio_path, transcription_path, uploaded_file_path)

if __name__ == '__main__':
    app.run(debug=True)