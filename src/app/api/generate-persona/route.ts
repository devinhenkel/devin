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
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating persona:', error);
    return NextResponse.json(
      { error: 'Failed to generate persona' },
      { status: 500 }
    );
  }
}
