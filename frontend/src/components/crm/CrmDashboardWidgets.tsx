import React, { useEffect, useState } from 'react';
import { crmApi } from '../../services/crmApi';

export const CrmDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    crmApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading CRM Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Total Contacts</h3>
        <p className="text-2xl font-bold">{stats.contacts_total}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Recruiters Tracked</h3>
        <p className="text-2xl font-bold text-purple-500">{stats.recruiters}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Networking Score</h3>
        <p className="text-2xl font-bold text-green-500">{stats.networking_score}/100</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Recent Follow-ups</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.recent_follow_ups}</p>
      </div>
    </div>
  );
};
