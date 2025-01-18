'use client';

import React from 'react';
import Image from 'next/image';
import { Persona } from '../types/persona';

interface ViewPersonaModalProps {
  isOpen: boolean;
  persona: Persona | null;
  onClose: () => void;
}

export default function ViewPersonaModal({
  isOpen,
  persona,
  onClose,
}: ViewPersonaModalProps) {
  if (!isOpen || !persona) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{persona.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center">
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
              <p className="text-gray-600">{persona.occupation}</p>
              <p className="text-gray-500">{persona.age} years old</p>
            </div>
          </div>

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
    </div>
  );
}
