import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { description, field, currentPersona } = body;

    const response = await fetch(`${BACKEND_URL}/generate-persona`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        field,
        current_persona: currentPersona,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();

    // Generate profile picture if we have a complete persona
    if (!field && data.name) {
      try {
        const imageResponse = await fetch(`${BACKEND_URL}/generate-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.name,
            age: data.age,
            gender: data.gender,
            occupation: data.occupation,
            bio: data.bio
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          data.profilePicture = imageData.url;
        }
      } catch (imageError) {
        console.error('Error generating profile picture:', imageError);
        // Continue without profile picture if generation fails
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating persona:', error);
    return NextResponse.json(
      { error: 'Failed to generate persona' },
      { status: 500 }
    );
  }
}
