import React, { useEffect, useState } from 'react';
import { atsMcpApi } from '../../services/atsMcpApi';

export const AtsDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    atsMcpApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading ATS Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Applications in Progress</h3>
        <p className="text-2xl font-bold">{stats.applications_in_progress}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Upcoming Interviews</h3>
        <p className="text-2xl font-bold text-purple-500">{stats.upcoming_interviews}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Pipeline Health</h3>
        <p className="text-2xl font-bold text-green-500">{stats.pipeline_health}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg Stage Duration</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.average_stage_duration}</p>
      </div>
    </div>
  );
}; 