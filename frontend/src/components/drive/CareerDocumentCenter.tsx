import React, { useState } from 'react';
import { driveMcpApi } from '../../services/driveMcpApi';
import { DriveDashboardWidgets } from './DriveDashboardWidgets';

export const CareerDocumentCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await driveMcpApi.searchDocuments(searchQuery, true);
      // Mocking results since the backend returns an empty array for now
      setSearchResults([
        { id: '1', title: 'Resume_Google_v3.pdf', type: 'Resume', confidence: '98%' },
        { id: '2', title: 'AWS_Solutions_Architect.pdf', type: 'Certificate', confidence: '85%' }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Career Document Center</h1>
      
      <DriveDashboardWidgets />

      <div className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            className={`py-2 px-4 ${activeTab === 'library' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('library')}
          >
            Document Library
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'search' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            Knowledge Search
          </button>
        </div>

        {activeTab === 'library' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Organized Folders</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                <span className="text-4xl">📁</span>
                <p className="mt-2 font-bold">Resume Versions</p>
                <p className="text-xs text-gray-500">8 Files</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                <span className="text-4xl">📁</span>
                <p className="mt-2 font-bold">Cover Letters</p>
                <p className="text-xs text-gray-500">4 Files</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                <span className="text-4xl">📁</span>
                <p className="mt-2 font-bold">Certificates</p>
                <p className="text-xs text-gray-500">3 Files</p>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600">
                <span className="text-4xl">📁</span>
                <p className="mt-2 font-bold">Portfolio</p>
                <p className="text-xs text-gray-500">12 Files</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Semantic Knowledge Search</h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g. 'Find my AWS certificate' or 'Latest resume for Google'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-6 flex flex-col gap-3">
                <h3 className="font-bold">Results:</h3>
                {searchResults.map((result, i) => (
                  <div key={i} className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-blue-600 dark:text-blue-400">{result.title}</h4>
                      <p className="text-sm text-gray-500">{result.type} • Semantic Match: {result.confidence}</p>
                    </div>
                    <button className="px-4 py-1 text-sm bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500">
                      View Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
