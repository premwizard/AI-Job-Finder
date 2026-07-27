import React, { useState, useEffect } from 'react';
import { atsMcpApi } from '../../services/atsMcpApi';
import { AtsDashboardWidgets } from './AtsDashboardWidgets';

export const ApplicationPipelineCenter: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await atsMcpApi.getApplications();
      setApplications(res.applications);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    try {
      await atsMcpApi.syncProviders();
      fetchApplications();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Group applications by stage for the Kanban view
  const stages = ['Applied', 'Recruiter Screen', 'Technical Interview', 'Final Interview', 'Offer'];
  
  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ATS Pipeline Center</h1>
        <button 
          onClick={handleSync}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Syncing Providers...' : 'Sync ATS Providers'}
        </button>
      </div>
      
      <AtsDashboardWidgets />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Kanban Pipeline</h2>
        
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => {
            const appsInStage = applications.filter(a => a.stage === stage);
            
            return (
              <div key={stage} className="flex-1 min-w-[300px] bg-gray-100 dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-bold border-b border-gray-300 dark:border-gray-600 pb-2 mb-4">
                  {stage} ({appsInStage.length})
                </h3>
                
                <div className="flex flex-col gap-3">
                  {appsInStage.map((app, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm border-l-4 border-blue-500">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm">{app.role}</h4>
                        <span className="text-xs px-2 bg-gray-200 dark:bg-gray-600 rounded">{app.provider}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{app.company}</p>
                    </div>
                  ))}
                  
                  {appsInStage.length === 0 && (
                    <div className="text-center text-sm text-gray-400 py-4">No applications</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
