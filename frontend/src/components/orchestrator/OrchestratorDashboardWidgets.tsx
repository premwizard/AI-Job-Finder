import React, { useEffect, useState } from 'react';
import { orchestratorApi } from '../../services/orchestratorApi';

export const OrchestratorDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    orchestratorApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading Orchestrator Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Workflows Run</h3>
        <p className="text-2xl font-bold">{stats.workflow_count}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Success Rate</h3>
        <p className="text-2xl font-bold text-green-500">{stats.success_rate}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Average Execution</h3>
        <p className="text-2xl font-bold text-purple-500">{stats.average_execution_time_sec}s</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Failed / Retried</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.failures} / {stats.retries}</p>
      </div>
    </div>
  );
};
