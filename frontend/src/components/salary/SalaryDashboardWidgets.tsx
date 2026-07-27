import React, { useEffect, useState } from 'react';
import { salaryApi } from '../../services/salaryApi';

export const SalaryDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    salaryApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading Salary Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Offers Analyzed</h3>
        <p className="text-2xl font-bold">{stats.offers_analyzed}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Negotiations Generated</h3>
        <p className="text-2xl font-bold text-purple-500">{stats.negotiations_generated}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Average Increase</h3>
        <p className="text-2xl font-bold text-green-500">{stats.average_comp_increase}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Negotiation Success</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.negotiation_success_rate}</p>
      </div>
    </div>
  );
};