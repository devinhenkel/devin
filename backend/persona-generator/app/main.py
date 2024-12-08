from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import json
import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class ProductDescription(BaseModel):
    description: str

class Persona(BaseModel):
    name: str
    age: int
    gender: str
    occupation: str
    location: str
    bio: str
    goals: List[str]
    frustrations: List[str]

app = FastAPI()

# Disable CORS. Do not remove this for full-stack development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/healthz")
async def healthz():
    return {"status": "ok"}

@app.post("/generate-persona")
async def generate_persona(product: ProductDescription) -> Persona:
    if not openai.api_key:
        raise HTTPException(status_code=500, detail="OpenAI API key not configured")

    try:
        # Create a detailed prompt for the LLM
        prompt = f"""Generate a detailed UX persona for the following product:
{product.description}

Provide the information in the following JSON format:
{{
    "name": "Full Name",
    "age": number,
    "gender": "Gender",
    "occupation": "Job Title",
    "location": "City, Country",
    "bio": "2-3 sentences about the person",
    "goals": ["goal1", "goal2", "goal3"],
    "frustrations": ["frustration1", "frustration2", "frustration3"]
}}

Make sure the persona is realistic and relevant to the product. Include specific details in the bio and make goals and frustrations relevant to their profession and the product."""

        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a UX researcher creating detailed user personas."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Parse the response
        try:
            content = response.choices[0].message.content
            persona_data = json.loads(content)
            return Persona(**persona_data)
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to parse LLM response: {str(e)}"
            )

    except openai.error.OpenAIError as e:
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI API error: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Unexpected error: {str(e)}"
        )
