from moviepy.editor import VideoFileClip
from flask import Flask, request
import whisper
import google.generativeai as genai
import json

with open('filename.json', 'r') as json_file:
    data = json.load(json_file)
  
video_path_content = data['fileName']

video = VideoFileClip("C:\\Users\\mihir\\Desktop\\hackathons\\csi_hackathon\\hacknuthon5.0\\daily routine.mp4")
audio = video.audio

audio.write_audiofile("output_audio.mp3")
audio_file= open("output_audio.mp3", "rb")
model = whisper.load_model("base")
result = model.transcribe("output_audio.mp3")
transcribed_text = result['text']
print(result['text'])
with open("transcription.txt", "w") as text_file:
    text_file.write(transcribed_text)

genai.configure(api_key="AIzaSyDl2dpL2n037ceHc2TWjcisIBVwBSxr9SU")

# Set up the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 0,
  "max_output_tokens": 8192,
}

safety_settings = [
  {
    "category": "HARM_CATEGORY_HARASSMENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_HATE_SPEECH",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
  {
    "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
    "threshold": "BLOCK_MEDIUM_AND_ABOVE"
  },
]

model = genai.GenerativeModel(model_name="gemini-1.5-pro-latest",
                              generation_config=generation_config,
                              safety_settings=safety_settings)

convo = model.start_chat(history=[])

with open('transcription.txt', 'r') as file:
    file_content = file.read()

convo.send_message( file_content + " generate quiz conating 5 questions and answers in mcq json data format having question on a first line with key question and it's four options having key choice1 , choice2 respectively and last line having correct choice number that is 1 ,2, 3 ,4 with key answer and do this for every question combine into a single json array ")
x = convo.last.text

def remove_backticks(text):
    return text.replace('```', '')

def remove_json(text):
    return text.replace('json', '')

x = remove_backticks(x)
x = remove_json(x)

textFile = convo.last.text.strip()
textFile = convo.last.text[8:-5]
with open('quiz_data.json', 'w') as jsonFile:
        jsonFile.write(textFile)

