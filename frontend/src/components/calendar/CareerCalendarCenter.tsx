import React, { useState } from 'react';
import { calendarMcpApi } from '../../services/calendarMcpApi';
import { CalendarDashboardWidgets } from './CalendarDashboardWidgets';

export const CareerCalendarCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const res = await calendarMcpApi.optimizeSchedule(['Prepare for mock interviews']);
      setRecommendations(res.recommendations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Career Calendar Center</h1>
      
      <CalendarDashboardWidgets />

      <div className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            className={`py-2 px-4 ${activeTab === 'upcoming' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming Milestones
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'optimize' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('optimize')}
          >
            AI Schedule Optimizer
          </button>
        </div>

        {activeTab === 'upcoming' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Interviews & Deadlines</h2>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm border-l-4 border-blue-500">
                <h4 className="font-bold">System Design Interview</h4>
                <p className="text-sm text-gray-500">Tomorrow at 10:00 AM - Meta</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm border-l-4 border-red-500">
                <h4 className="font-bold">Application Deadline</h4>
                <p className="text-sm text-gray-500">Friday at 5:00 PM - OpenAI Backend Role</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm border-l-4 border-green-500">
                <h4 className="font-bold">Study Session</h4>
                <p className="text-sm text-gray-500">Saturday at 9:00 AM - Dynamic Programming</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'optimize' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">AI Schedule Optimizer</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Let the Planning Engine analyze your free time, preferred hours, and upcoming deadlines to suggest the perfect study and interview slots.
            </p>
            <button 
              onClick={handleOptimize}
              disabled={loading}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Optimizing...' : 'Optimize Schedule'}
            </button>

            {recommendations.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Recommendations:</h3>
                <ul className="list-disc ml-5 mt-2">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="text-gray-700 dark:text-gray-300">{rec}</li>
                  ))}
                </ul>
                <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Apply to Calendar
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
