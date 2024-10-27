// src/components/SkillSection.tsx
import React, { useState } from 'react';

interface AssessmentMethod {
  title: string;
  description: string;
}

interface Skill {
  id: string;
  name: string;
  summary: string;
  whatItIs: string;
  howWeAssessIt: AssessmentMethod[]; // Updated type
  whyItsImportant: string;
  howToDevelop: string[];
}


const skills: Skill[] = [
  {
    id: 'speechClarity',
    name: 'Speech and Language Clarity',
    summary:
      'The ability to articulate words clearly, use appropriate vocabulary, and minimize filler words.',
    whatItIs:
      'Speech and Language Clarity refers to your ability to articulate words clearly, use appropriate vocabulary, and minimize filler words like "um," "like," and "you know." It\'s about making your message understandable and engaging to your audience.',
    howWeAssessIt: [
      '<strong>Speech-to-Text Transcription:</strong> Using Google\'s Speech-to-Text API, we transcribe your spoken words into text with high accuracy.',
      '<strong>Filler Word Detection:</strong> We analyze the transcribed text to identify and count filler words and unnecessary repetitions.',
      '<strong>Articulation Analysis:</strong> By examining phonetic pronunciation patterns, we assess the clarity of your speech.',
      '<strong>Vocabulary Usage:</strong> We evaluate the complexity and appropriateness of your vocabulary based on the context of your speech.',
    ],
    whyItsImportant:
      'Clear speech enhances comprehension and keeps your audience engaged. Eliminating filler words and improving articulation can make you appear more confident and professional. This skill is crucial in presentations, interviews, and everyday conversations.',
    howToDevelop: [
      'Practice speaking slowly to improve clarity and give yourself time to think.',
      'Regularly record and listen to yourself to identify areas for improvement.',
      'Expand your vocabulary by reading widely and learning new words.',
      'Be mindful of filler words and pause instead of filling silence with unnecessary words.',
    ],
  },
  {
    id: 'empathyActiveListening',
    name: 'Empathy and Active Listening',
    summary:
      'Understanding and responding to your audience’s needs, emotions, and feedback, creating a two-way communication flow.',
    whatItIs:
      'Empathy and Active Listening involve understanding and responding to your audience\'s needs, emotions, and feedback, creating a two-way communication flow.',
    howWeAssessIt: [
      '**Response Analysis:** While direct audience interaction may be limited in recorded videos, we assess how you anticipate and address audience concerns.',
      '**Language Usage:** We analyze your speech for empathetic language, acknowledgments, and validations.',
      '**Facial Expression Synchrony:** We examine if your expressions reflect understanding and concern.',
    ],
    whyItsImportant:
      'Demonstrating empathy builds trust and rapport with your audience. Active listening ensures that you address their needs and can adapt your message accordingly, making your communication more effective.',
    howToDevelop: [
      'Research your audience to understand their background and expectations.',
      'Use inclusive language like "we" and "us" to connect with your audience.',
      'Acknowledge potential audience reactions and address them proactively.',
      'Stay open-minded and be willing to adjust your message based on feedback.',
    ],
  },
  {
    id: 'confidencePacing',
    name: 'Confidence and Pacing',
    summary:
      'Delivering your message with self-assurance and controlling the speed and rhythm of your speech.',
    whatItIs:
      'Confidence and Pacing involve delivering your message with self-assurance and controlling the speed and rhythm of your speech to enhance understanding and impact.',
    howWeAssessIt: [
      '**Speech Rate Measurement:** We calculate your words per minute (WPM) to assess if you\'re speaking too quickly or slowly.',
      '**Volume Consistency:** Analyzing audio levels helps us determine if you maintain an appropriate and consistent volume.',
      '**Pausing Patterns:** We identify natural pauses and their effectiveness in emphasizing points.',
      '**Posture and Stance:** Using video analysis, we evaluate your body posture as an indicator of confidence.',
    ],
    whyItsImportant:
      'A confident delivery persuades and convinces your audience. Proper pacing ensures your message is digestible and impactful, preventing misunderstandings and keeping the audience engaged.',
    howToDevelop: [
      'Practice public speaking to build confidence.',
      'Record and review your presentations to analyze pacing and make adjustments.',
      'Use deep breathing techniques to control nerves and pacing.',
      'Engage in positive visualization to boost confidence before speaking.',
    ],
  },
    {
    id: 'emotionalTone',
    name: 'Emotional and Tone Alignment',
    summary:
      'Matching your facial expressions, voice tone, and emotional state to the content of your message.',
    whatItIs:
      'Emotional and Tone Alignment involves matching your facial expressions, voice tone, and emotional state to the content of your message and the expectations of your audience.',
    howWeAssessIt: [
      '**Facial Expression Analysis:** Utilizing Google\'s Video Intelligence API, we detect facial expressions to interpret emotional states such as happiness, sadness, surprise, or anger.',
      '**Sentiment Analysis:** We analyze your speech content to determine the sentiment and ensure it aligns with your facial expressions.',
      '**Tone Detection:** By examining pitch, volume, and speech rate, we assess the emotional tone of your voice.',
    ],
    whyItsImportant:
      'Aligning your emotions with your message enhances credibility and helps build a connection with your audience. It ensures that your message is received as intended and can influence how your audience feels and reacts.',
    howToDevelop: [
      'Practice emotional expression by rehearsing your speech with different emotional tones.',
      'Get feedback from others to gain insights into how your tone is perceived.',
      'Study effective speakers and observe how they use emotion and tone.',
      'Be mindful of your emotional state and how it affects your communication.',
    ],
  },
  {
    id: 'audienceEngagement',
    name: 'Audience Engagement',
    summary:
      'Capturing and maintaining the attention of your audience through eye contact, body language, and interactive elements.',
    whatItIs:
      'Audience Engagement refers to your ability to capture and maintain the attention of your audience through eye contact, body language, and interactive elements like rhetorical questions or storytelling.',
    howWeAssessIt: [
      '**Eye Contact Detection:** Using facial recognition technology, we analyze your gaze direction to determine how often you make eye contact with the camera.',
      '**Body Language Analysis:** We assess gestures, posture, and movement to gauge how engaging your physical presence is.',
      '**Engagement Cues:** By analyzing speech patterns, we identify the use of storytelling elements, questions, and audience-directed language.',
    ],
    whyItsImportant:
      'Engaging the audience keeps them attentive and makes your message more memorable. Strong audience engagement can lead to better understanding, retention, and influence.',
    howToDevelop: [
      'Maintain eye contact by practicing looking at the camera as if it\'s your audience.',
      'Use expressive gestures to emphasize points.',
      'Include stories and examples to enhance your message.',
      'Encourage interaction by asking questions or inviting feedback.',
    ],
  },];

const SkillSection: React.FC = () => {
  const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold mb-4">Main Communication Skills</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {skills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => setActiveSkill(skill)}
            className="cursor-pointer border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
            <p className="text-sm text-gray-600">{skill.summary}</p>
          </div>
        ))}
      </div>

      {activeSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white max-w-3xl w-full mx-4 p-6 rounded-lg overflow-y-auto max-h-screen relative">
            <button
              onClick={() => setActiveSkill(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold mb-4">{activeSkill.name}</h3>
            <h4 className="text-xl font-semibold mb-2">What It Is</h4>
            <p className="mb-4">{activeSkill.whatItIs}</p>
            <h4 className="text-xl font-semibold mb-2">How We Assess It</h4>
              <ul className="list-disc list-inside mb-4 space-y-2">
                {activeSkill.howWeAssessIt.map((method, index) => (
                <li key={index} className="text-gray-700">
              <strong>{method.title}</strong> {method.description}
              </li>
                ))}
              </ul>
            <h4 className="text-xl font-semibold mb-2">Why It's Important</h4>
            <p className="mb-4">{activeSkill.whyItsImportant}</p>
            <h4 className="text-xl font-semibold mb-2">How to Develop This Skill</h4>
            <ul className="list-disc list-inside space-y-2">
              {activeSkill.howToDevelop.map((item, index) => (
                <li key={index} className="text-gray-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default SkillSection;
