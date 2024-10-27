// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Brain, BarChart2, Trophy } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-xl font-bold text-[#6366F1]">
              CommSkill
            </Link>
            <div className="flex items-center space-x-8">
              <Link 
                to="/resources" 
                className="text-gray-600 hover:text-[#6366F1] transition-colors"
              >
                Resources
              </Link>
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-[#6366F1] transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg hover:bg-[#5558E5] transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#6366F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Master Your Communication
              <span className="block mt-2">With AI-Powered Feedback</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-white/90">
              Enhance your presentation skills with real-time analysis of your body language,
              voice patterns, and delivery style.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-[#6366F1] rounded-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105"
              >
                Try Now
              </Link>
              <Link
                to="/learn-more"
                className="px-8 py-4 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        <div className="relative mt-20">
          <svg className="w-full h-24 fill-white" viewBox="0 0 1440 74" preserveAspectRatio="none">
            <path d="M0 24.7778C240 99.1111 480 99.1111 720 24.7778C960 -49.5556 1200 -49.5556 1440 24.7778V74H0V24.7778Z"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Camera />}
              title="Video Analysis"
              description="Record or upload videos for instant communication feedback"
            />
            <FeatureCard
              icon={<Brain />}
              title="AI-Powered Insights"
              description="Get real-time analysis of your body language and speech patterns"
            />
            <FeatureCard
              icon={<BarChart2 />}
              title="Detailed Metrics"
              description="Track your progress with comprehensive performance analytics"
            />
            <FeatureCard
              icon={<Trophy />}
              title="Skill Development"
              description="Improve your communication skills with actionable feedback"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <StepCard
              number="1"
              title="Record Your Presentation"
              description="Use your webcam or upload an existing video for analysis"
            />
            <StepCard
              number="2"
              title="AI Analysis"
              description="Our AI analyzes your communication patterns in real-time"
            />
            <StepCard
              number="3"
              title="Get Feedback"
              description="Receive detailed insights and actionable recommendations"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#6366F1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to improve your communication skills?
          </h2>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-[#6366F1] rounded-lg font-medium hover:bg-gray-50 transition-all transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-[#6366F1] transition-all hover:shadow-lg">
    <div className="w-12 h-12 bg-[#6366F1]/10 rounded-lg flex items-center justify-center text-[#6366F1] mb-4 
                    group-hover:bg-[#6366F1] group-hover:text-white transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const StepCard: React.FC<{
  number: string;
  title: string;
  description: string;
}> = ({ number, title, description }) => (
  <div className="text-center group">
    <div className="w-12 h-12 bg-[#6366F1]/10 text-[#6366F1] rounded-full flex items-center justify-center 
                    text-xl font-semibold mx-auto mb-4 group-hover:bg-[#6366F1] group-hover:text-white transition-colors">
      {number}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default Home;