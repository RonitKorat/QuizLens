from flask import Flask, request, jsonify
from temp import extract_audio_from_youtube, transcribe_audio, generate_quiz
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/extract-audio', methods=['POST'])
def extract_audio():
    data = request.json
    youtube_url = data.get('youtube_url')
    if not youtube_url:
        return jsonify({'error': 'YouTube URL is required'}), 400

    audio_path = extract_audio_from_youtube(youtube_url)
    if audio_path:
        transcription = transcribe_audio(audio_path)
        return jsonify({'audio_path': audio_path, 'transcription': transcription})
    else:
        return jsonify({'error': 'Failed to extract audio'}), 500

@app.route('/generate-quiz', methods=['POST'])
def generate_quiz_endpoint():
    data = request.json
    transcription = data.get('transcription')
    if not transcription:
        return jsonify({'error': 'Transcription is required'}), 400

    quiz = generate_quiz(transcription)
    if quiz:
        return jsonify({'quiz': quiz})
    else:
        return jsonify({'error': 'Failed to generate quiz'}), 500

if __name__ == '__main__':
    app.run(debug=True)