import React, { useEffect, useState } from 'react';
import { gmailMcpApi } from '../../services/gmailMcpApi';

export const GmailDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    gmailMcpApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading Gmail Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Unread Career Emails</h3>
        <p className="text-2xl font-bold">{stats.unread_messages}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Upcoming Interviews</h3>
        <p className="text-2xl font-bold text-indigo-500">{stats.interviews}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Offer Alerts</h3>
        <p className="text-2xl font-bold text-green-500">{stats.offers}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Pending Replies</h3>
        <p className="text-2xl font-bold text-yellow-500">{stats.pending_replies}</p>
      </div>
    </div>
  );
};
