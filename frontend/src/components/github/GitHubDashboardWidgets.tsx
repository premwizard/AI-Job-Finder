import React, { useEffect, useState } from 'react';
import { githubMcpApi } from '../../services/githubMcpApi';

export const GitHubDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    githubMcpApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading GitHub Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Repositories Analyzed</h3>
        <p className="text-2xl font-bold">{stats.repositories_analyzed}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Portfolio Score</h3>
        <p className="text-2xl font-bold text-green-500">{stats.portfolio_score}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Engineering Score</h3>
        <p className="text-2xl font-bold">{stats.engineering_score}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Career Readiness</h3>
        <p className="text-2xl font-bold capitalize text-blue-500">{stats.career_readiness}</p>
      </div>
    </div>
  );
};
