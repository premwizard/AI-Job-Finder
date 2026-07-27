import React, { useEffect, useState } from 'react';
import { driveMcpApi } from '../../services/driveMcpApi';

export const DriveDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    driveMcpApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading Drive Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Indexed Documents</h3>
        <p className="text-2xl font-bold">{stats.documents_indexed}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Resume Versions</h3>
        <p className="text-2xl font-bold text-purple-500">{stats.resume_versions}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Portfolio Growth</h3>
        <p className="text-2xl font-bold text-green-500">{stats.portfolio_growth}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">AI Recommendations</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.ai_recommendations}</p>
      </div>
    </div>
  );
};
