import React from 'react';
import { Persona } from '../types/persona';

interface PersonaCardProps {
  persona: Persona;
  onClick: () => void;
}

export default function PersonaCard({ persona, onClick }: PersonaCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
    >
      <h2 className="text-xl font-semibold mb-2">{persona.name}</h2>
      <p className="text-gray-600">{persona.occupation}</p>
      <p className="text-gray-500">{persona.age} years old</p>
    </div>
  );
}
