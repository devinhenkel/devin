'use client';

import { useState } from 'react';
import PersonaCard from '../components/PersonaCard';
import CreatePersonaModal from '../components/CreatePersonaModal';
import { Persona, samplePersona } from '../types/persona';

export default function Home() {
  const [personas, setPersonas] = useState<Persona[]>([samplePersona]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPersona = () => {
    setIsModalOpen(true);
  };

  const handleSavePersona = (persona: Persona) => {
    setPersonas([...personas, persona]);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">User Personas</h1>
          <button
            onClick={handleAddPersona}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span className="text-2xl">+</span>
            Add Persona
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {personas.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>

        <CreatePersonaModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePersona}
        />
      </div>
    </main>
  );
}
