# 🚀 Quizlens: Video To Quiz Generator

Want to create engaging quizzes from your video content without the hassle? **QuizLens** is your **AI-powered solution** to automatically generate interactive quizzes from any video. Simply upload your video, and let our system handle the rest! Perfect for educators, content creators, or anyone looking to enhance learning through interactive assessment.

---

## 🔥 Key Features

- 🎬 **Automatic Quiz Generation**: Effortlessly create quizzes from any video content.
- 🎤 **Audio Extraction and Transcription**: Extracts audio from your video and accurately transcribes it to text.
- 🧠 **AI-Powered Quiz Creation**: Leverages the power of Gemini API to generate relevant and insightful quiz questions from the transcribed text.
- 👨‍🏫 **User-Friendly Interface**: Provides a seamless and intuitive quiz experience for users.
- 📊 **Performance Dashboard**: Offers detailed feedback on quiz results, allowing users to track their progress and identify areas for improvement.

---

## 🧠 How It Works

1. **Video Processing**:
    - Upload your video file.
    - MoviePy extracts the audio from the video.
2. **Audio Transcription**:
    - OpenAI Whisper accurately transcribes the audio into text format.
3. **Quiz Generation**:
    - The transcribed text is sent to the Gemini API.
    - Gemini API analyzes the text and generates relevant quiz questions with multiple-choice answers.
4. **Interactive Quiz**:
    - Flask framework serves the quiz questions to the front-end.
    - React creates a dynamic and engaging user interface for the quiz.
5. **Performance Dashboard**:
    - Node.js handles user responses and provides instant feedback.
    - A comprehensive dashboard displays quiz results and performance metrics.

---

## 🛠️ Tech Stack

- **Backend**: Flask (Python)
- **Frontend**: React (JavaScript), Tailwind CSS, Shadcn/ui
- **AI/ML**: Gemini API, OpenAI Whisper
- **Video Processing**: MoviePy (Python)
- **Runtime**: Node.js (for frontend development and additional tasks)

---

## ⚡ Quick Start

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MihirMungara/QuizLens.git  # Replace with your repo URL
cd Quizlens
```

### 2️⃣ Backend Setup (Flask)

```bash
# Create a virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install backend dependencies
pip install -r requirements.txt

# Run the Flask app
python app.py
```

### 3️⃣ Frontend Setup (React)

```bash
cd client  # Navigate to the frontend directory
npm install  # Install frontend dependencies
npm start   # Start the React development server
```

### 4️⃣ Configuration

You'll need to configure API keys for Gemini and OpenAI Whisper. Refer to the project's configuration files (e.g., `.env`) for how to set these up. **Do not commit API keys directly to your repository.**

### 5️⃣ Generate
Once the backend and frontend are running, you can access the application through your web browser. Upload a video, generate the quiz.

---

## 🚀 Future Enhancements

- 📈 **Advanced Analytics**: More detailed performance metrics and insights.
- 🎯 **Customizable Quiz Settings**: Control question types, difficulty levels, and quiz length.
- 🌐 **Multilingual Support**: Expand language support for broader accessibility.
- 💾 **Quiz Saving and Sharing**: Allow users to save and share quizzes with others.
- 🔄 **Feedback Integration**: Enable users to provide feedback on generated questions.

---

🌟 **QuizLens**: Transforming video content into interactive learning experiences! 🚀
