// src/pages/HowItWorks.tsx
import React from 'react';

const HowItWorks = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">How Our AI-Powered Communication Coach Works</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Unlock Your Communication Potential</h2>
        <p className="text-lg">
          Our platform provides personalized coaching to help you elevate your communication skills.
          Using the power of AI and machine learning, we analyze your videos to provide actionable feedback,
          offering insights into both your strengths and growth areas.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Step-by-Step Process</h2>
        <ol className="list-decimal list-inside text-lg space-y-4">
          <li>
            <strong>Record Your Practice Session</strong>
            <p>
              Start by recording a video where you practice your speech, presentation, or communication scenario.
              You can upload videos directly to our platform or use our integrated recorder for seamless access.
            </p>
          </li>
          <li>
            <strong>AI-Powered Analysis</strong>
            <p>
              Our AI models, powered by Google's Vertex AI, analyze each aspect of your communication.
              We assess elements like eye contact, voice clarity, gestures, and pacing, as well as
              deeper qualities such as empathy, confidence, and audience engagement.
            </p>
          </li>
          <li>
            <strong>Personalized Feedback</strong>
            <p>
              Based on our assessment, you'll receive feedback across five areas:
            </p>
            <ul className="list-disc list-inside ml-6">
              <li>Speech and Language Clarity</li>
              <li>Empathy and Active Listening</li>
              <li>Audience Engagement</li>
              <li>Emotional and Tone Alignment</li>
              <li>Confidence and Pacing</li>
            </ul>
          </li>
          <li>
            <strong>Track Your Progress and Develop Skills</strong>
            <p>
              Whether you're working to enhance your natural communication style or targeting a specific archetype,
              our platform lets you choose a path to develop your skills. You'll see your progress over time and
              receive tips and exercises to help you grow.
            </p>
          </li>
          <li>
            <strong>Discover Your Communication Archetype</strong>
            <p>
              We use a blend of machine learning algorithms to assign you one (or more) communication archetypes
              based on your style and tendencies. As you improve, you may find yourself gravitating toward new archetypes.
            </p>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-lg">
          Discover how you can improve with each practice session and become a more confident, effective communicator!
        </p>
      </section>
    </div>
  );
};

export default HowItWorks;