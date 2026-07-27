import React, { useEffect, useState } from 'react';
import { copilotApi } from '../../services/copilotApi';

interface Props {
  healthScore: number;
}

export const CopilotDashboardWidgets: React.FC<Props> = ({ healthScore }) => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    copilotApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading Copilot Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Career Health</h3>
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold text-green-500">{healthScore}</p>
          <span className="text-sm text-gray-400 pb-1">/ 100</span>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Goals Completed</h3>
        <p className="text-2xl font-bold">{stats.goals_completed}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Copilot Actions</h3>
        <p className="text-2xl font-bold text-purple-500">{stats.automation_usage}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Recommendations Taken</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.recommendations_accepted}</p>
      </div>
    </div>
  );
};
