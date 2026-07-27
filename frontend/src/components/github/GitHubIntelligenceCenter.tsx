import React, { useEffect, useState } from 'react';
import { githubMcpApi } from '../../services/githubMcpApi';
import { GitHubDashboardWidgets } from './GitHubDashboardWidgets';

export const GitHubIntelligenceCenter: React.FC = () => {
  const [username, setUsername] = useState('demo-user');
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await githubMcpApi.analyzeGithub(username);
      const data = await githubMcpApi.generatePortfolio(username);
      setPortfolio(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">GitHub Career Intelligence</h1>
      
      <GitHubDashboardWidgets />

      <div className="mt-8 bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Analyze Profile</h2>
        <div className="flex gap-4 mb-4">
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full dark:bg-gray-700 dark:border-gray-600"
            placeholder="GitHub Username"
          />
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        {portfolio && (
          <div className="mt-6">
            <h3 className="text-xl font-bold">Portfolio Overview</h3>
            <p className="mt-2">Portfolio Score: <span className="font-bold text-green-500">{portfolio.portfolio_score}</span></p>
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Top Technologies:</h4>
              <ul className="list-disc ml-5 mt-2">
                {portfolio.top_technologies?.map((tech: string, i: number) => (
                  <li key={i}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Engineering Insights</h2>
          <p className="text-gray-600 dark:text-gray-400">Run an analysis to generate engineering insights.</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Resume Recommendations</h2>
          <p className="text-gray-600 dark:text-gray-400">Run an analysis to generate resume suggestions.</p>
        </div>
      </div>
    </div>
  );
};
