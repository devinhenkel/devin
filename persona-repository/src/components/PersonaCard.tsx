import React from 'react';
import Image from 'next/image';
import { Persona } from '../types/persona';

interface PersonaCardProps {
  persona: Persona;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center mb-4">
        {persona.avatar && (
          <Image
            src={persona.avatar}
            alt={persona.name}
            width={64}
            height={64}
            className="rounded-full mr-4"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{persona.name}</h2>
          <p className="text-gray-600">{persona.occupation}</p>
          <p className="text-gray-500">{persona.age} years old</p>
        </div>
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="font-semibold text-lg mb-2">Demographics</h3>
          <div className="text-gray-700">
            <p>Location: {persona.demographics.location}</p>
            <p>Education: {persona.demographics.education}</p>
            <p>Income: {persona.demographics.income}</p>
            <p>Family Status: {persona.demographics.familyStatus}</p>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Goals</h3>
          <ul className="list-disc list-inside text-gray-700">
            {persona.goals.map((goal, index) => (
              <li key={index}>{goal}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Behaviors</h3>
          <ul className="list-disc list-inside text-gray-700">
            {persona.behaviors.map((behavior, index) => (
              <li key={index}>{behavior}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Pain Points</h3>
          <ul className="list-disc list-inside text-gray-700">
            {persona.painPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Motivations</h3>
          <ul className="list-disc list-inside text-gray-700">
            {persona.motivations.map((motivation, index) => (
              <li key={index}>{motivation}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Personality Traits</h3>
          <div className="flex flex-wrap gap-2">
            {persona.personalityTraits.map((trait, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Preferred Channels</h3>
          <div className="flex flex-wrap gap-2">
            {persona.preferredChannels.map((channel, index) => (
              <span
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                {channel}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-lg mb-2">Background</h3>
          <p className="text-gray-700">{persona.background}</p>
        </section>
      </div>
    </div>
  );
}
