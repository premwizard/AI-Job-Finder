import React, { useState, useEffect } from 'react';
import { salaryApi } from '../../services/salaryApi';
import { SalaryDashboardWidgets } from './SalaryDashboardWidgets';

export const SalaryIntelligenceCenter: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await salaryApi.getOffers();
      setOffers(res.offers);
    } catch (e) {
      console.error(e);
    }
  };

  const runSimulation = async (offerId: string) => {
    try {
      const res = await salaryApi.simulateDecision(offerId, { increase: '10%' });
      setSimulationResult(res.simulated_roi);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Salary Intelligence & Offer Negotiation</h1>
      
      <SalaryDashboardWidgets />

      <div className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            className={`py-2 px-4 ${activeTab === 'dashboard' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Offer Dashboard
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'simulator' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            Decision Simulator
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl">{offer.company}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{offer.role}</p>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    offer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Base Salary</p>
                    <p className="font-semibold">${offer.base_salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Equity (Total)</p>
                    <p className="font-semibold">${offer.equity.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500">Total Annual Compensation</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">${offer.total_compensation.toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <button className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
                    Generate Negotiation Strategy
                  </button>
                  <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm">
                    Analyze ROI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Career Decision Simulator</h2>
            <p className="mb-4 text-gray-600 dark:text-gray-300">Run "What-if" scenarios to project your long-term career ROI.</p>
            
            {offers.length > 0 && (
              <div className="flex gap-4 items-end mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Select Offer</label>
                  <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    {offers.map(o => <option key={o.id} value={o.id}>{o.company} - {o.role}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Scenario</label>
                  <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600">
                    <option>What if base salary increases by 10%?</option>
                    <option>What if equity doubles?</option>
                  </select>
                </div>
                <button 
                  onClick={() => runSimulation(offers[0].id)}
                  className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Simulate
                </button>
              </div>
            )}

            {simulationResult && (
              <div className="bg-white dark:bg-gray-700 p-6 rounded border-l-4 border-green-500 text-center">
                <h3 className="font-bold text-lg mb-2">Projected 5-Year Career ROI</h3>
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">{simulationResult}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
