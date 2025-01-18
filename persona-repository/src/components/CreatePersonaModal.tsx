'use client';

import React, { useState } from 'react';
import PersonaCard from './PersonaCard';
import { Persona } from '../types/persona';

interface CreatePersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => void;
}

export default function CreatePersonaModal({
  isOpen,
  onClose,
  onSave,
}: CreatePersonaModalProps) {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPersona, setGeneratedPersona] = useState<Persona | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-persona', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate persona');
      }

      const generatedPersona = await response.json();
      setGeneratedPersona(generatedPersona);
    } catch (error) {
      console.error('Error generating persona:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegeneratePersona = () => {
    handleGenerate();
  };

  const handleSavePersona = () => {
    if (generatedPersona) {
      onSave(generatedPersona);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Create New Persona</h2>
        
        {!generatedPersona ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe the user you want to create a persona for:
              </label>
              <textarea
                className="w-full h-32 p-2 border rounded-md"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., A young professional in tech who struggles with work-life balance..."
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!description.trim() || isGenerating}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Persona'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <PersonaPreview persona={generatedPersona} />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRegeneratePersona}
                className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
              >
                Regenerate
              </button>
              <button
                onClick={handleSavePersona}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Save Persona
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PersonaPreview({ persona }: { persona: Persona }) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xl font-semibold">{persona.name}</h3>
        <p className="text-gray-600">{persona.occupation}, {persona.age} years old</p>
      </div>
      
      <div>
        <h4 className="font-medium">Demographics</h4>
        <p className="text-gray-700">
          {persona.demographics.location} • {persona.demographics.education} • 
          {persona.demographics.income} • {persona.demographics.familyStatus}
        </p>
      </div>

      <div>
        <h4 className="font-medium">Goals</h4>
        <ul className="list-disc list-inside">
          {persona.goals.map((goal, index) => (
            <li key={index} className="text-gray-700">{goal}</li>
          ))}
        </ul>
      </div>

      {/* Preview of other sections */}
      <div className="text-gray-500 text-sm">
        Full persona details will be visible on the card after saving.
      </div>
    </div>
  );
}
