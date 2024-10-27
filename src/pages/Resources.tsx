// src/pages/Resources.tsx
import React from 'react';
import SkillSection from '../components/SkillSection';
import StyleSection from '../components/StyleSection';
import PersonaList from '../components/PersonaList';

const Resources: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Resources</h1>
      <p className="mt-2 text-gray-600">
        Explore key communication skills, presentation styles, and learn from exemplary speakers.
      </p>

      {/* Existing Sections */}
      <SkillSection />

      {/* New Persona List Section */}
      <PersonaList />
    </div>
  );
};

export default Resources;
