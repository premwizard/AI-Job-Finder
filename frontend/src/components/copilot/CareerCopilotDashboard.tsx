import React, { useState, useEffect } from 'react';
import { copilotApi } from '../../services/copilotApi';
import { CopilotDashboardWidgets } from './CopilotDashboardWidgets';

export const CareerCopilotDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [reviewResult, setReviewResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashRes, goalsRes] = await Promise.all([
        copilotApi.getDashboard(),
        copilotApi.getGoals()
      ]);
      setDashboardData(dashRes);
      setGoals(goalsRes.goals);
    } catch (e) {
      console.error(e);
    }
  };

  const handleWeeklyReview = async () => {
    setLoading(true);
    try {
      const res = await copilotApi.runWeeklyReview();
      setReviewResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!dashboardData) return <div className="p-8">Loading Copilot...</div>;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Autonomous Career Copilot</h1>
        <button 
          onClick={handleWeeklyReview}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Generating...' : 'Run Weekly Review'}
        </button>
      </div>

      <CopilotDashboardWidgets healthScore={dashboardData.health_score} />

      {reviewResult && (
        <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow border-l-4 border-indigo-500 mb-8">
          <h2 className="text-xl font-bold mb-2">Weekly Career Review</h2>
          <p className="mb-2 text-gray-700 dark:text-gray-300">{reviewResult.summary}</p>
          <div className="flex gap-4 mt-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm">Health: {reviewResult.health_delta}</span>
          </div>
          {reviewResult.missed_opportunities?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-yellow-600">Missed Opportunities:</h4>
              <ul className="list-disc pl-5 text-sm mt-1">
                {reviewResult.missed_opportunities.map((mo: string, i: number) => <li key={i}>{mo}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Left Column: Recommendations & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-blue-500">✨</span> Proactive Recommendations
            </h2>
            <ul className="space-y-3">
              {dashboardData.recommendations.map((rec: string, i: number) => (
                <li key={i} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-100 dark:border-blue-800 flex justify-between items-center">
                  <span>{rec}</span>
                  <button className="text-sm bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1 rounded hover:bg-blue-200 dark:hover:bg-blue-700 transition">Action</button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Action Items</h2>
            <div className="space-y-3">
              {dashboardData.tasks.map((task: any) => (
                <div key={task.id} className="flex justify-between items-center p-3 border-b dark:border-gray-700 last:border-0">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600" />
                    <span className={task.status === 'In Progress' ? 'font-medium' : ''}>{task.title}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {task.priority} Priority
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Goals & Decisions */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
            <div className="space-y-4">
              {goals.map((goal: any) => (
                <div key={goal.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{goal.title}</span>
                    <span className="text-gray-500">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div className={`h-2 rounded-full ${goal.status === 'On Track' ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${goal.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">Copilot Activity Log</h2>
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {dashboardData.recent_decisions.map((decision: string, i: number) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-200 bg-white dark:bg-gray-700 shadow text-sm text-slate-600 dark:text-slate-300">
                    {decision}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
