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
            You are an AI assistant analyzing study session data to provide actionable feedback.

            You will receive a JSON object with:

            - timeStarted, timeEnded
            - touchedFace: timestamps
            - distracted: [startTime, endTime] pairs
            - breaks: [startTime, endTime] pairs
            - score: number

            Task:

            1. Compute total study time.
            2. Comment on positive behaviors (long focus, few distractions, good breaks).
            3. Identify patterns (face touches, total distraction time, break usage).
            4. Give 2-3 encouraging, actionable tips for improvement.
            5. treat score as a percentage of how well they studied.

            Rules:

            - Give a 3 strings
            - Always output a JSON array of strings.
            - Do not include any text outside the JSON array.

            Example output:

            [
            "You touched your face 12 times today",
            "Your focus improves significantly after the first 15 minutes. Consider starting with easier tasks.",
            "Peak productivity detected between 2:30-3:15 PM."
            ]

            Session data:
            {session_json}

            Return only the JSON array of tips.
            """


    
    response = model.generate_content(prompt)
    
    response_text = response.text.strip()

    if response_text.startswith('```'):
        match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', response_text, re.DOTALL)
        if match:
            response_text = match.group(1).strip()

    tips = json.loads(response_text)
    return tips
