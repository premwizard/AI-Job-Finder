import React, { useState } from 'react';
import { gmailMcpApi } from '../../services/gmailMcpApi';
import { GmailDashboardWidgets } from './GmailDashboardWidgets';

export const CareerInbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState('smart-inbox');
  const [draftContent, setDraftContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateDraft = async () => {
    setLoading(true);
    try {
      const res = await gmailMcpApi.generateDraft("Thank you for the interview");
      setDraftContent(res.content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">Career Inbox (Gmail Intelligence)</h1>
      
      <GmailDashboardWidgets />

      <div className="mt-8">
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button 
            className={`py-2 px-4 ${activeTab === 'smart-inbox' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('smart-inbox')}
          >
            Smart Inbox
          </button>
          <button 
            className={`py-2 px-4 ${activeTab === 'draft-center' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
            onClick={() => setActiveTab('draft-center')}
          >
            Draft Center
          </button>
        </div>

        {activeTab === 'smart-inbox' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Smart Inbox</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Connect your Gmail account to view categorized job applications, recruiter outreach, and interview emails.
            </p>
            <div className="flex flex-col gap-4">
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Interview Invitation: Google</h4>
                  <p className="text-sm text-gray-500">Recruiter: Jane Doe</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">Interview</span>
              </div>
              <div className="p-4 bg-white dark:bg-gray-700 rounded shadow-sm flex justify-between items-center">
                <div>
                  <h4 className="font-bold">Offer Letter Attached: Microsoft</h4>
                  <p className="text-sm text-gray-500">Action Required by Friday</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Offer</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'draft-center' && (
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Smart Draft Generation</h2>
            <button 
              onClick={handleGenerateDraft}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Generating Draft...' : 'Generate Follow-up Draft'}
            </button>

            {draftContent && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Draft Preview:</h3>
                <textarea 
                  className="w-full h-32 p-3 border rounded dark:bg-gray-700 dark:border-gray-600"
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                />
                <button className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                  Send via Gmail
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
