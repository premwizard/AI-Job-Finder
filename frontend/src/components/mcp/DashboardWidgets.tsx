import React, { useEffect, useState } from 'react';
import { mcpApi } from '../../services/mcpApi';

export const MCPDashboardWidgets: React.FC = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    mcpApi.getStatistics().then(setStats);
  }, []);

  if (!stats) return <div className="p-4 text-center">Loading MCP Widgets...</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Connected Servers</h3>
        <p className="text-2xl font-bold">{stats.connected_servers}</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-purple-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Available Tools</h3>
        <p className="text-2xl font-bold">{stats.available_tools}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Health Status</h3>
        <p className="text-2xl font-bold capitalize text-green-500">{stats.health_status}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
        <h3 className="text-sm text-gray-500 dark:text-gray-400">Avg Latency</h3>
        <p className="text-2xl font-bold">{stats.average_latency_ms.toFixed(1)} ms</p>
      </div>
    </div>
  );
};
