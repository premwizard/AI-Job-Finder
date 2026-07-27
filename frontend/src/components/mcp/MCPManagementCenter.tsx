import React, { useEffect, useState } from 'react';
import { mcpApi } from '../../services/mcpApi';

export const MCPManagementCenter: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    mcpApi.getStatus().then(setStatus);
    mcpApi.getStatistics().then(setStats);
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-4">MCP Management Center</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">System Status</h2>
          {status ? (
            <div>
              <p>Status: <span className="text-green-500 font-bold">{status.status}</span></p>
              <p>{status.message}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Statistics</h2>
          {stats ? (
            <ul>
              <li>Connected Servers: {stats.connected_servers}</li>
              <li>Available Tools: {stats.available_tools}</li>
              <li>Available Resources: {stats.available_resources}</li>
              <li>Available Prompts: {stats.available_prompts}</li>
              <li>Health Status: <span className="text-green-500 font-bold">{stats.health_status}</span></li>
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Connected Servers</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow text-center">
          <p className="text-gray-500 dark:text-gray-400">No servers connected yet.</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Add New Server
          </button>
        </div>
      </div>
    </div>
  );
};
