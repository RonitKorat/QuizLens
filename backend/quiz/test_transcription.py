#!/usr/bin/env python3
"""
Test script to debug transcription issues with local video files.
Run this script to test the transcription process step by step.
"""

import os
import sys
from pathlib import Path

# Add the current directory to the path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import extract_audio_from_local_video, transcribe_audio, cleanup_files

def test_video_transcription(video_path):
    """
    Test the transcription process for a given video file.
    """
    print("=" * 60)
    print(f"Testing transcription for: {video_path}")
    print("=" * 60)
    
    if not os.path.exists(video_path):
        print(f"Error: Video file does not exist: {video_path}")
        return False
    
    # Check file size
    file_size = os.path.getsize(video_path)
    print(f"Video file size: {file_size} bytes")
    
    if file_size == 0:
        print("Error: Video file is empty")
        return False
    
    audio_path = None
    try:
        # Step 1: Extract audio
        print("\n1. Extracting audio...")
        audio_path = extract_audio_from_local_video(video_path, "test_output")
        
        if not audio_path:
            print("Failed to extract audio")
            return False
        
        # Step 2: Transcribe audio
        print("\n2. Transcribing audio...")
        transcription = transcribe_audio(audio_path)
        
        if not transcription:
            print("Failed to transcribe audio")
            return False
        
        # Step 3: Display results
        print("\n3. Transcription Results:")
        print("-" * 40)
        print(f"Transcription length: {len(transcription)} characters")
        print(f"Transcription preview: {transcription[:500]}...")
        print("-" * 40)
        
        # Save transcription to file for inspection
        output_file = "test_transcription.txt"
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(transcription)
        print(f"\nTranscription saved to: {output_file}")
        
        return True
        
    except Exception as e:
        print(f"Error during testing: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        # Cleanup
        if audio_path:
            cleanup_files(audio_path)

def main():
    """
    Main function to run the test.
    """
    if len(sys.argv) != 2:
        print("Usage: python test_transcription.py <path_to_video_file>")
        print("Example: python test_transcription.py /path/to/your/video.mp4")
        return
    
    video_path = sys.argv[1]
    success = test_video_transcription(video_path)
    
    if success:
        print("\n✅ Test completed successfully!")
    else:
        print("\n❌ Test failed!")

if __name__ == "__main__":
    main() 