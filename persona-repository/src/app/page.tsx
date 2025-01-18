'use client';

import { useState } from 'react';
import PersonaCard from '../components/PersonaCard';
import CreatePersonaModal from '../components/CreatePersonaModal';
import ViewPersonaModal from '../components/ViewPersonaModal';
import { Persona, samplePersona } from '../types/persona';

export default function Home() {
  const [personas, setPersonas] = useState<Persona[]>([samplePersona]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleAddPersona = () => {
    setIsCreateModalOpen(true);
  };

  const handleSavePersona = (persona: Persona) => {
    setPersonas([...personas, persona]);
  };

  const handleViewPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedPersona(null);
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <PersonaCard
              key={persona.id}
              persona={persona}
              onClick={() => handleViewPersona(persona)}
            />
          ))}
        </div>

        <CreatePersonaModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleSavePersona}
        />

        <ViewPersonaModal
          isOpen={isViewModalOpen}
          persona={selectedPersona}
          onClose={handleCloseViewModal}
        />
      </div>
    </main>
  );
}
