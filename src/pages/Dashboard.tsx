// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { Line, Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { BarChart3, TrendingUp, Target, User, ArrowUp, ArrowDown } from 'lucide-react';
import NLXChat from '../components/NLXChat';
import VideoRecorder from '../components/VideoRecorder';
import { personas } from '../components/PersonaList';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SkillMetrics {
  eyeContact: number;
  posture: number;
  gestures: number;
  voiceClarity: number;
  pace: number;
  engagement: number;
}

interface AnalysisResults extends SkillMetrics {}

interface TrendData {
  label: string;
  value: number;
  change: number;
  previousValue: number;
}

interface SessionData {
  id: string;
  date: string;
  metrics: SkillMetrics;
}

const Dashboard = () => {
  const [showRecorder, setShowRecorder] = useState(false);
  const [metrics, setMetrics] = useState<SkillMetrics>({
    eyeContact: 85,
    posture: 75,
    gestures: 80,
    voiceClarity: 70,
    pace: 65,
    engagement: 78,
  });
  
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [totalSessions, setTotalSessions] = useState(12);
  const [latestScore, setLatestScore] = useState(85);
  const [scoreImprovement, setScoreImprovement] = useState(7);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [sessionHistory, setSessionHistory] = useState<SessionData[]>([]);

  const [trends, setTrends] = useState<TrendData[]>([
    { label: 'Eye Contact', value: 85, change: 5, previousValue: 80 },
    { label: 'Posture', value: 75, change: -2, previousValue: 77 },
    { label: 'Gestures', value: 80, change: 8, previousValue: 72 },
    { label: 'Voice Clarity', value: 70, change: 3, previousValue: 67 },
    { label: 'Pace', value: 65, change: 0, previousValue: 65 },
    { label: 'Engagement', value: 78, change: 4, previousValue: 74 }
  ]);

  // Top persona match calculations
  const topPersonaMatch = personas[0].title;

  // Progress data over time (Line Chart)
  const progressData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Overall Score',
        data: [65, 72, 78, latestScore],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Skills breakdown data (Radar Chart)
  const skillBreakdown = {
    labels: [
      'Eye Contact',
      'Posture',
      'Gestures',
      'Voice Clarity',
      'Pace',
      'Engagement',
    ],
    datasets: [
      {
        label: 'Current Skills',
        data: [
          metrics.eyeContact,
          metrics.posture,
          metrics.gestures,
          metrics.voiceClarity,
          metrics.pace,
          metrics.engagement,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: 'rgb(99, 102, 241)',
      },
    ],
  };

  // Recent sessions data (Bar Chart)
  const recentSessions = {
    labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5'],
    datasets: [
      {
        label: 'Eye Contact',
        data: [75, 82, 78, 85, metrics.eyeContact],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
      {
        label: 'Posture',
        data: [65, 70, 75, 72, metrics.posture],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
      },
      {
        label: 'Gestures',
        data: [70, 75, 72, 80, metrics.gestures],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  // Handle metrics updates
  const handleMetricsUpdate = (newMetrics: SkillMetrics) => {
    setMetrics((prevMetrics) => {
      const updatedMetrics = { ...prevMetrics, ...newMetrics };

      // Calculate new overall score
      const newScore = Object.values(updatedMetrics).reduce(
        (sum, value) => sum + value,
        0
      ) / Object.values(updatedMetrics).length;

      // Update trends
      setTrends(prev => 
        prev.map(trend => {
          const metricKey = trend.label.toLowerCase().replace(' ', '') as keyof SkillMetrics;
          const newValue = updatedMetrics[metricKey];
          return {
            ...trend,
            value: newValue,
            previousValue: trend.value,
            change: newValue - trend.value
          };
        })
      );

      // Update session history
      const newSession: SessionData = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        metrics: updatedMetrics
      };
      setSessionHistory(prev => [...prev, newSession]);

      // Update other stats
      setScoreImprovement(Math.round(newScore - latestScore));
      setLatestScore(Math.round(newScore));
      setTotalSessions(prev => prev + 1);

      return updatedMetrics;
    });
  };

  // Handle analysis completion
  const handleAnalysisComplete = (results: AnalysisResults) => {
    handleMetricsUpdate(results);
    setIsChatOpen(true);
  };

  // Find top skill
  const getTopSkill = () => {
    const skillEntries = Object.entries(metrics);
    const topSkill = skillEntries.reduce(
      (max, [skill, value]) => value > (max[1] || 0) ? [skill, value] : max,
      ['', 0]
    );
    return {
      name: topSkill[0].replace(/([A-Z])/g, ' $1').trim(),
      value: topSkill[1],
    };
  };

  const topSkill = getTopSkill();

  // Calculate persona percentages
  const personaPercentages = personas.map((persona) => ({
    id: persona.id,
    title: persona.title,
    percentage: Math.floor(Math.random() * 100),
    imageUrl: persona.imageUrl,
  }));

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      <div className={`transition-all duration-300 ${isChatOpen ? 'mr-96' : 'mr-0'}`}>
        <div className="max-w-5xl mx-auto p-4 overflow-y-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md text-sm flex flex-col items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600 mb-1" />
                <h3 className="font-semibold text-sm text-center">Latest Score</h3>
                <div className="flex items-center">
                  <p className="text-xl font-bold text-indigo-600 mt-2">{latestScore}%</p>
                  {scoreImprovement !== 0 && (
                    <span className={`ml-2 text-sm ${scoreImprovement > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {scoreImprovement > 0 ? '+' : ''}{scoreImprovement}%
                    </span>
                  )}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-sm flex flex-col items-center justify-center">
                <Target className="w-5 h-5 text-indigo-600 mb-1" />
                <h3 className="font-semibold text-sm text-center">Sessions</h3>
                <p className="text-xl font-bold text-indigo-600 mt-2">{totalSessions}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-sm flex flex-col items-center justify-center">
                <BarChart3 className="w-5 h-5 text-indigo-600 mb-1" />
                <h3 className="font-semibold text-sm text-center">Top Skill</h3>
                <p className="text-xl font-bold text-indigo-600 mt-2">{topSkill.name}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md text-sm flex flex-col items-center justify-center">
                <User className="w-5 h-5 text-indigo-600 mb-1" />
                <h3 className="font-semibold text-sm text-center">Top Persona Match</h3>
                <p className="text-xl font-bold text-indigo-600 mt-2">{topPersonaMatch}</p>
              </div>
            </div>

            {/* Skills Breakdown */}
            <div className="bg-white p-4 rounded-lg shadow-md text-sm">
              <h2 className="text-lg font-semibold mb-2">Skills Breakdown</h2>
              <Radar data={skillBreakdown} options={radarOptions} />
            </div>

            {/* Progress Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md text-sm">
              <h2 className="text-lg font-semibold mb-2">Progress Over Time</h2>
              <Line data={progressData} options={chartOptions} />
            </div>

            {/* Recent Sessions */}
            <div className="bg-white p-4 rounded-lg shadow-md text-sm h-full">
              <h2 className="text-lg font-semibold mb-2">Recent Sessions</h2>
              <Bar data={recentSessions} options={{ ...chartOptions, aspectRatio: 2 }} />
            </div>
          </div>

          {/* Trends Section */}
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Skill Trends</h2>
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm"
              >
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
                <option value="year">Past Year</option>
              </select>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {trends.map(trend => (
                <div key={trend.label} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{trend.label}</span>
                    <div className="flex items-center">
                      {trend.change !== 0 && (
                        trend.change > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                        )
                      )}
                      <span className={`text-sm font-bold ${
                        trend.change > 0 ? 'text-green-600' : 
                        trend.change < 0 ? 'text-red-600' : 
                        'text-gray-600'
                      }`}>
                        {trend.change > 0 ? '+' : ''}{trend.change}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div 
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${trend.value}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-gray-500">{trend.previousValue}%</span>
                    <span className="text-sm text-gray-500">{trend.value}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

{/* Persona Percentages */}
<div className="bg-white p-4 rounded-lg shadow-md text-sm mt-4">
            <h2 className="text-lg font-semibold mb-2">Persona Percentages</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {personaPercentages.map((persona) => (
                <div key={persona.id} className="flex items-center gap-2 p-2 border rounded-lg shadow-md">
                  <img src={persona.imageUrl} alt={persona.title} className="w-6 h-6 rounded-full" />
                  <span className="text-xs font-semibold">{persona.title}</span>
                  <span className="ml-auto text-indigo-600 font-bold">{persona.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Chat Component */}
      <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transform transition-all duration-300 ${
        isChatOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <NLXChat 
          onMetricsUpdate={handleMetricsUpdate}
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          currentAnalysis={metrics}
        />
      </div>
    </div>
  );
};

export default Dashboard;