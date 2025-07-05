# Video Transcription Troubleshooting Guide

## Common Issues and Solutions

### 1. Transcription is Empty or Incorrect

**Symptoms:**
- Transcription returns empty or very short text
- Transcription contains gibberish or incorrect words
- Quiz generation fails due to poor transcription

**Solutions:**

#### A. Check Video File Format
- Ensure your video file is in a supported format: MP4, AVI, MOV, MKV, WMV, FLV, WEBM, M4V
- Try converting your video to MP4 format using a tool like HandBrake or FFmpeg

#### B. Check Audio Quality
- Make sure the video has clear audio
- Avoid videos with background music that's louder than speech
- Ensure the video has speech content (not just music)

#### C. Test with Different Whisper Models
The system now automatically tries different Whisper models:
- Base model (default)
- Small model (if base produces poor results)
- Tiny model (fallback)

### 2. Audio Extraction Fails

**Symptoms:**
- Error: "Failed to extract audio from video"
- Audio file is empty or corrupted

**Solutions:**

#### A. Check FFmpeg Installation
```bash
# Test if FFmpeg is installed
ffmpeg -version

# If not installed, install it:
# Windows: Download from https://ffmpeg.org/download.html
# macOS: brew install ffmpeg
# Ubuntu/Debian: sudo apt install ffmpeg
```

#### B. Check Video File Integrity
```bash
# Test if the video file is valid
ffprobe your_video.mp4
```

### 3. File Upload Issues

**Symptoms:**
- File upload fails
- "Unsupported video format" error

**Solutions:**

#### A. Check File Size
- Maximum file size: 100MB
- Try compressing your video if it's too large

#### B. Check File Extension
- Ensure the file has a proper video extension
- Rename files with incorrect extensions

### 4. Server Errors

**Symptoms:**
- 500 Internal Server Error
- Connection refused errors

**Solutions:**

#### A. Check Server Logs
Look at the console output when running the Flask server for detailed error messages.

#### B. Check Dependencies
```bash
# Install required Python packages
pip install flask flask-cors openai-whisper google-generativeai python-dotenv
```

#### C. Check API Keys
- Ensure your Google Generative AI API key is set in environment variables
- Set the API_KEY environment variable

## Testing Your Setup

### 1. Use the Test Script
```bash
cd backend/quiz
python test_transcription.py /path/to/your/video.mp4
```

This script will:
- Test audio extraction
- Test transcription
- Save the transcription to a file for inspection
- Provide detailed logging

### 2. Check Browser Console
- Open browser developer tools (F12)
- Look at the Console tab for error messages
- Check the Network tab for failed requests

### 3. Check Server Console
- Look at the Flask server console output
- Check for Python errors and FFmpeg output

## Debugging Steps

### Step 1: Verify Video File
1. Check if the video plays correctly in a media player
2. Verify the video has audio
3. Check file size and format

### Step 2: Test Audio Extraction
1. Run the test script with your video
2. Check if audio extraction succeeds
3. Verify the extracted audio file is not empty

### Step 3: Test Transcription
1. Check if Whisper model loads correctly
2. Verify transcription output
3. Try different Whisper models if needed

### Step 4: Check API Integration
1. Verify Google Generative AI API key is valid
2. Check if quiz generation works with manual transcription

## Common Error Messages

### "Failed to extract audio from video"
- Check FFmpeg installation
- Verify video file format
- Check video file integrity

### "Failed to transcribe audio"
- Check audio file size
- Verify Whisper installation
- Try different Whisper models

### "Unsupported video format"
- Convert video to supported format
- Check file extension
- Verify file is actually a video

### "File size must be less than 100MB"
- Compress video file
- Use a shorter video
- Convert to lower quality

## Performance Tips

1. **Use shorter videos** (under 10 minutes) for better performance
2. **Ensure good audio quality** with clear speech
3. **Use MP4 format** for best compatibility
4. **Avoid videos with heavy background music**
5. **Check internet connection** for API calls

## Getting Help

If you're still experiencing issues:

1. Run the test script and share the output
2. Check server logs and share error messages
3. Provide details about your video file (format, size, duration)
4. Share browser console errors if applicable 