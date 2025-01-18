import { NextResponse } from 'next/server';
import { Persona } from '../../../types/persona';

export async function POST(request: Request) {
  try {
    await request.json(); // Parse request body but not using description yet

    // TODO: Replace with actual OpenAI API call using the description
    // For now, generate a mock persona
    const mockPersona: Persona = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Generated User',
      age: 30,
      occupation: 'Software Developer',
      demographics: {
        location: 'San Francisco, CA',
        education: "Bachelor's in Computer Science",
        income: '$120,000/year',
        familyStatus: 'Single'
      },
      goals: [
        'Improve coding skills',
        'Learn new technologies',
        'Achieve work-life balance'
      ],
      behaviors: [
        'Early adopter of new tools',
        'Active in tech communities',
        'Remote work focused'
      ],
      painPoints: [
        'Information overload',
        'Project deadlines',
        'Technical debt management'
      ],
      motivations: [
        'Building impactful products',
        'Professional growth',
        'Learning new skills'
      ],
      personalityTraits: [
        'Analytical',
        'Problem-solver',
        'Team player'
      ],
      preferredChannels: [
        'Slack',
        'GitHub',
        'Stack Overflow',
        'Discord'
      ],
      background: 'A passionate developer with 5 years of experience in full-stack development. Started coding in college and has been continuously learning new technologies since then.'
    };

    return NextResponse.json(mockPersona);
  } catch (error) {
    console.error('Error generating persona:', error);
    return NextResponse.json(
      { error: 'Failed to generate persona' },
      { status: 500 }
    );
  }
}
