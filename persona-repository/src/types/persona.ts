export interface Persona {
  id: string;
  name: string;
  age: number;
  occupation: string;
  demographics: {
    location: string;
    education: string;
    income: string;
    familyStatus: string;
  };
  goals: string[];
  behaviors: string[];
  painPoints: string[];
  motivations: string[];
  personalityTraits: string[];
  preferredChannels: string[];
  background: string;
  avatar?: string;
}

export const samplePersona: Persona = {
  id: '1',
  name: 'Sarah Chen',
  age: 32,
  occupation: 'Digital Marketing Manager',
  demographics: {
    location: 'San Francisco Bay Area',
    education: "Master's in Marketing",
    income: '$95,000/year',
    familyStatus: 'Married, no children'
  },
  goals: [
    'Streamline marketing workflows',
    'Stay ahead of digital trends',
    'Improve work-life balance'
  ],
  behaviors: [
    'Early adopter of new technologies',
    'Heavy mobile device user',
    'Prefers video content for learning'
  ],
  painPoints: [
    'Difficulty managing multiple marketing platforms',
    'Struggles with data analysis',
    'Limited time for strategic planning'
  ],
  motivations: [
    'Career advancement',
    'Professional development',
    'Making meaningful impact'
  ],
  personalityTraits: [
    'Analytical',
    'Creative',
    'Detail-oriented'
  ],
  preferredChannels: [
    'Slack',
    'LinkedIn',
    'Email',
    'Virtual meetings'
  ],
  background: 'Sarah has worked in digital marketing for 8 years, starting as a content writer before moving into management. She values data-driven decision making and is always looking for ways to optimize campaigns.'
}
