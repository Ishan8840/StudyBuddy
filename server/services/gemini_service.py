import json
import os
import re
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.5-flash')

def generate_summary(session_json: dict) -> str:

    prompt = f"""
            You are an AI assistant analyzing study session data to provide actionable, encouraging feedback.

            You will receive a JSON object containing study session metrics with ISO 8601 datetime strings:

            - timeStarted: When the session began
            - timeEnded: When the session ended
            - touchedFace: Array of timestamps when the user touched their face
            - distracted: Array of [startTime, endTime] pairs showing periods of distraction
            - breaks: Array of [startTime, endTime] pairs showing scheduled break periods

            Rules:

            1. Recognize total study time.
            2. Comment on positive behaviors:
            - Long focus stretches
            - Few distractions
            - Good use of breaks
            3. Identify patterns:
            - Face-touching frequency
            - Total distraction time and when it happened
            - Break timing and duration
            - If distractions overlap with breaks, still report them separately
            4. Provide 2-3 actionable tips for improvement
            5. Maintain an encouraging, conversational tone
            6. Always output a **JSON array of strings**, one tip per string. Example:

            [
            "You touched your face 3 times today. Try taking a deep breath when you feel distracted.",
            "Your focus was strong for the first 15 minutes!",
            "Consider taking slightly shorter breaks to maintain momentum."
            ]

            Session data:
            {session_json}

            Generate the JSON array of tips now. Do not include any text outside the array.
            """

    
    response = model.generate_content(prompt)
    
    response_text = response.text.strip()

    if response_text.startswith('```'):
        match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', response_text, re.DOTALL)
        if match:
            response_text = match.group(1).strip()

    tips = json.loads(response.text)
    return tips
