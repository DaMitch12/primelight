// src/components/StyleSection.tsx
import React, { useState } from 'react';

interface Individual {
  name: string;
  bio: string;
}

interface Style {
  id: string;
  name: string;
  description: string;
  implications: string[];
  individuals: Individual[];
}

const styles: Style[] = [
  {
    id: 'storyteller',
    name: 'The Storyteller',
    description:
      'Engages the audience through narratives, creating emotional connections and memorable messages.',
    implications: [
      'Emotional Tone: Assess emotional resonance.',
      'Audience Engagement: Likely high due to storytelling.',
      'Speech Clarity: Emphasis on expressive language.',
    ],
    individuals: [
      {
        name: 'Oprah Winfrey',
        bio: 'Known for her captivating storytelling and ability to connect emotionally with her audience.',
      },
    ],
  },
  // ... Add other styles as needed
];

const StyleSection: React.FC = () => {
  const [activeStyleId, setActiveStyleId] = useState<string | null>(null);
  const [activeIndividual, setActiveIndividual] = useState<Individual | null>(null);

  const activeStyle = styles.find((style) => style.id === activeStyleId);

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Presentation Styles</h2>
      <div className="flex flex-wrap gap-4">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => {
              setActiveStyleId(style.id);
              setActiveIndividual(null);
            }}
            className={`px-4 py-2 rounded ${
              activeStyleId === style.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            {style.name}
          </button>
        ))}
      </div>
      {activeStyle && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="text-xl font-semibold">{activeStyle.name}</h3>
          <p className="mt-2">{activeStyle.description}</p>
          <h4 className="mt-4 font-medium">Implications on Analysis:</h4>
          <ul className="list-disc list-inside">
            {activeStyle.implications.map((implication, index) => (
              <li key={index}>{implication}</li>
            ))}
          </ul>
          <h4 className="mt-4 font-medium">Examples:</h4>
          <div className="flex flex-wrap gap-4 mt-2">
            {activeStyle.individuals.map((individual) => (
              <button
                key={individual.name}
                onClick={() => setActiveIndividual(individual)}
                className="px-4 py-2 bg-gray-100 rounded"
              >
                {individual.name}
              </button>
            ))}
          </div>
          {activeIndividual && (
            <div className="mt-4 p-4 bg-gray-50 border rounded">
              <h5 className="text-lg font-semibold">{activeIndividual.name}</h5>
              <p className="mt-2">{activeIndividual.bio}</p>
              <button
                onClick={() => setActiveIndividual(null)}
                className="mt-2 text-indigo-600"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default StyleSection;
