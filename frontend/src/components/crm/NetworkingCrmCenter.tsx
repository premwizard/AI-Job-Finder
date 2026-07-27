import React, { useState, useEffect } from 'react';
import { crmApi } from '../../services/crmApi';
import { CrmDashboardWidgets } from './CrmDashboardWidgets';

export const NetworkingCrmCenter: React.FC = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('contacts');
  const [goal, setGoal] = useState('');
  const [plan, setPlan] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await crmApi.getContacts();
      setContacts(res.contacts);
    } catch (e) {
      console.error(e);
    }
  };

  const generatePlan = async () => {
    if (!goal) return;
    setLoading(true);
    try {
      const res = await crmApi.generateNetworkPlan(goal);
      setPlan(res.plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Recruiter CRM & Networking</h1>
      
      <CrmDashboardWidgets />

      <div className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            className={`py-2 px-4 ${activeTab === 'contacts' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Professional Contacts
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'planner' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('planner')}
          >
            Networking Planner
          </button>
        </div>

        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{contact.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    contact.relationship_strength === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {contact.relationship_strength}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{contact.role}</p>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{contact.company}</p>
                <button className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-sm transition">
                  View Relationship Graph
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">AI Networking Planner</h2>
            <div className="flex gap-2 mb-6">
              <input 
                type="text" 
                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g. 'I want to break into AI startups in San Francisco'"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <button 
                onClick={generatePlan}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Planning...' : 'Generate Plan'}
              </button>
            </div>

            {plan.length > 0 && (
              <div className="bg-white dark:bg-gray-700 p-4 rounded border-l-4 border-purple-500">
                <h3 className="font-bold mb-3">Recommended Actions:</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {plan.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
