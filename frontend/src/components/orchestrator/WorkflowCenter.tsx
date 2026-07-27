import React, { useState, useEffect } from 'react';
import { orchestratorApi } from '../../services/orchestratorApi';
import { OrchestratorDashboardWidgets } from './OrchestratorDashboardWidgets';

export const WorkflowCenter: React.FC = () => {
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const res = await orchestratorApi.listWorkflows();
      setWorkflows(res.workflows);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunWorkflow = async () => {
    if (!goalInput.trim()) return;
    setLoading(true);
    try {
      await orchestratorApi.runWorkflow(goalInput);
      setGoalInput('');
      fetchWorkflows();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Multi-MCP Orchestrator</h1>
      
      <OrchestratorDashboardWidgets />

      <div className="mt-8">
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Start New Workflow</h2>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g. 'Prepare me for my Meta System Design interview'"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
            />
            <button 
              onClick={handleRunWorkflow}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Execute'}
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Execution Timeline</h2>
        <div className="flex flex-col gap-4">
          {workflows.map((wf, i) => (
            <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-blue-600 dark:text-blue-400">{wf.goal}</h4>
                <p className="text-sm text-gray-500">ID: {wf.id}</p>
              </div>
              <span className={`px-3 py-1 text-xs rounded-full ${
                wf.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 animate-pulse'
              }`}>
                {wf.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
