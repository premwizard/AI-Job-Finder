import React, { useEffect, useState } from 'react';
import { calendarMcpApi } from '../../services/calendarMcpApi';

export const CalendarDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    calendarMcpApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading Calendar Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Upcoming Interviews</h3>
        <p className="text-2xl font-bold text-indigo-500">{stats.interviews_scheduled}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Study Hours (Week)</h3>
        <p className="text-2xl font-bold">{stats.study_hours}h</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-red-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Approaching Deadlines</h3>
        <p className="text-2xl font-bold text-red-500">{stats.deadlines_managed}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Active Reminders</h3>
        <p className="text-2xl font-bold">{stats.reminders_triggered}</p>
      </div>
    </div>
  );
};
