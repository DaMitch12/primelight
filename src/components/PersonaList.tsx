// src/components/PersonaList.tsx
import React, { useState } from 'react';

interface Persona {
  id: string;
  title: string;
  summary: string;
  attributes: string[];
  keyPeople: string[];
  imageUrl: string;
}

// Export personas array to be used in other components, such as Dashboard
export const personas: Persona[] = [
  {
    id: 'empatheticListener',
    title: 'The Empathetic Listener',
    summary: "The Empathetic Listener prioritizes understanding others' feelings and perspectives. They excel at active listening and create a safe space for open dialogue.",
    attributes: [
      'Highly attentive and patient',
      'Excellent active listening skills',
      'Compassionate and understanding',
      'Builds strong, trusting relationships',
      'Provides thoughtful feedback',
    ],
    keyPeople: ['Oprah Winfrey', 'Dalai Lama'],
    imageUrl: 'https://via.placeholder.com/150?text=Empathetic+Listener',
  },
  {
    id: 'assertiveCommunicator',
    title: 'The Assertive Communicator',
    summary: 'The Assertive Communicator expresses thoughts and feelings confidently and directly while respecting others.',
    attributes: [
      'Confident and self-assured',
      'Direct and honest communication',
      'Respects personal boundaries',
      'Good at negotiation',
      'Balances speaking and listening',
    ],
    keyPeople: ['Sheryl Sandberg', 'Martin Luther King Jr.'],
    imageUrl: 'https://via.placeholder.com/150?text=Assertive+Communicator',
  },
  {
    id: 'analyticalThinker',
    title: 'The Analytical Thinker',
    summary: 'The Analytical Thinker approaches communication logically, valuing data and facts.',
    attributes: [
      'Logical and methodical',
      'Detail-oriented',
      'Prefers structured dialogue',
      'Values evidence-based discussions',
      'Thoughtful and precise',
    ],
    keyPeople: ['Bill Gates', 'Angela Merkel'],
    imageUrl: 'https://via.placeholder.com/150?text=Analytical+Thinker',
  },
  {
    id: 'storyteller',
    title: 'The Storyteller',
    summary: 'The Storyteller uses engaging narratives to connect emotionally and convey messages effectively.',
    attributes: [
      'Expressive and engaging',
      'Uses anecdotes and metaphors',
      'Connects emotionally with the audience',
      'Creative and imaginative',
      'Simplifies complex ideas',
    ],
    keyPeople: ['Steve Jobs', 'J.K. Rowling'],
    imageUrl: 'https://via.placeholder.com/150?text=Storyteller',
  },
  {
    id: 'inspirer',
    title: 'The Inspirer',
    summary: 'The Inspirer motivates others through passionate and enthusiastic communication, rallying people around a vision or cause.',
    attributes: [
      'Charismatic and enthusiastic',
      'Visionary and forward-thinking',
      'Encourages and uplifts others',
      'Communicates passion effectively',
      'Builds strong team spirit',
    ],
    keyPeople: ['Nelson Mandela', 'Malala Yousafzai'],
    imageUrl: 'https://via.placeholder.com/150?text=Inspirer',
  },
  {
    id: 'directCommunicator',
    title: 'The Direct Communicator',
    summary: 'The Direct Communicator values efficiency and clarity, getting straight to the point.',
    attributes: [
      'Straightforward and concise',
      'Values time and efficiency',
      'Clear and unambiguous',
      'May be perceived as blunt',
      'Results-oriented',
    ],
    keyPeople: ['Simon Cowell', 'Gordon Ramsay'],
    imageUrl: 'https://via.placeholder.com/150?text=Direct+Communicator',
  },
  {
    id: 'diplomat',
    title: 'The Diplomat',
    summary: 'The Diplomat excels at navigating social complexities and mediating conflicts.',
    attributes: [
      'Tactful and considerate',
      'Skilled mediator',
      'Values harmony and consensus',
      'Excellent listener',
      'Sensitive to others’ perspectives',
    ],
    keyPeople: ['Kofi Annan', 'Jacinda Ardern'],
    imageUrl: 'https://via.placeholder.com/150?text=Diplomat',
  },
  {
    id: 'visionary',
    title: 'The Visionary',
    summary: 'The Visionary communicates big ideas, inspiring others with possibilities of the future.',
    attributes: [
      'Innovative and creative',
      'Future-oriented',
      'Inspires with ideas',
      'Thinks outside the box',
      'May overlook immediate details',
    ],
    keyPeople: ['Elon Musk', 'Walt Disney'],
    imageUrl: 'https://via.placeholder.com/150?text=Visionary',
  },
  {
    id: 'coach',
    title: 'The Coach',
    summary: 'The Coach empowers others through guidance, focusing on personal development.',
    attributes: [
      'Supportive and encouraging',
      'Asks insightful questions',
      'Focuses on growth',
      'Provides constructive feedback',
      'Good at active listening',
    ],
    keyPeople: ['Phil Jackson', 'Brené Brown'],
    imageUrl: 'https://via.placeholder.com/150?text=Coach',
  },
  {
    id: 'collaborator',
    title: 'The Collaborator',
    summary: 'The Collaborator values teamwork and open communication, fostering a shared purpose.',
    attributes: [
      'Team-oriented',
      'Encourages participation',
      'Values collective input',
      'Facilitates open dialogue',
      'Builds consensus',
    ],
    keyPeople: ['Satya Nadella', 'Desmond Tutu'],
    imageUrl: 'https://via.placeholder.com/150?text=Collaborator',
  },
];

const PersonaList: React.FC = () => {
  const [expandedPersonaId, setExpandedPersonaId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPersonaId(expandedPersonaId === id ? null : id);
  };

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Communication Personas</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className="persona-box border rounded-lg overflow-hidden shadow-md"
          >
            <div
              className="persona-header cursor-pointer"
              onClick={() => toggleExpand(persona.id)}
            >
              <img
                src={persona.imageUrl}
                alt={persona.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 bg-gray-100 hover:bg-gray-200">
                <h3 className="text-xl font-bold">{persona.title}</h3>
              </div>
            </div>
            {expandedPersonaId === persona.id && (
              <div className="persona-content p-4 bg-white">
                <p className="mb-4">{persona.summary}</p>
                <h4 className="font-semibold mb-2">Core Attributes:</h4>
                <ul className="list-disc list-inside mb-4">
                  {persona.attributes.map((attribute, idx) => (
                    <li key={idx}>{attribute}</li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-2">Key People:</h4>
                <ul className="list-disc list-inside">
                  {persona.keyPeople.map((person, idx) => (
                    <li key={idx}>{person}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PersonaList;
