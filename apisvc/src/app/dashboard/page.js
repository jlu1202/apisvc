'use client';

import { useState } from 'react';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'default', key: 'tvly-abcdef1234567890abcdef1234567890', usage: 0, isVisible: false },
  ]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editKeyName, setEditKeyName] = useState('');
  const [copySuccess, setCopySuccess] = useState('');

  // Helper function to mask API key
  const maskApiKey = (key) => {
    return key.replace(/^(tvly-[a-zA-Z0-9]{4}).*([a-zA-Z0-9]{4})$/, '$1************************$2');
  };

  // Generate a random API key
  const generateApiKey = () => {
    const randomString = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('')
      .substring(0, 32);
    return `tvly-${randomString}`;
  };

  const handleCreateKey = (e) => {
    e.preventDefault();
    
    if (!newKeyName.trim()) {
      alert('Please enter a key name');
      return;
    }

    const newApiKey = {
      id: Date.now(),
      name: newKeyName.trim(),
      key: generateApiKey(),
      usage: 0,
      isVisible: false
    };

    setApiKeys(prevKeys => [...prevKeys, newApiKey]);
    setNewKeyName('');
    setIsCreateModalOpen(false);
  };

  const handleEditClick = (key) => {
    setEditingKey(key);
    setEditKeyName(key.name);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setApiKeys(apiKeys.map(key => {
      if (key.id === editingKey.id) {
        return { ...key, name: editKeyName };
      }
      return key;
    }));
    setIsEditModalOpen(false);
    setEditingKey(null);
    setEditKeyName('');
  };

  const handleDeleteKey = (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    }
  };

  const handleCopyClick = async (keyToCopy) => {
    try {
      await navigator.clipboard.writeText(keyToCopy);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopySuccess('Failed to copy');
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === keyId) {
        return { ...key, isVisible: !key.isVisible };
      }
      return key;
    }));
  };

  return (
    <div className="min-h-screen p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <div className="text-sm text-gray-500">
            <span>Pages</span>
            <span className="mx-2">/</span>
            <span>Overview</span>
          </div>
          <h1 className="text-3xl font-semibold">Overview</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Operational</span>
          </div>
        </div>
      </div>

      {/* Current Plan Card */}
      <div className="rounded-xl p-8 mb-8 bg-gradient-to-r from-rose-400/90 via-purple-400/90 to-blue-400/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          <div className="text-sm text-white/90 font-medium mb-2">CURRENT PLAN</div>
          <h2 className="text-3xl font-bold text-white mb-8">Researcher</h2>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white">
              <span>API Limit</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="bg-white/20 rounded-full h-2 w-full">
              <div className="bg-white rounded-full h-2 w-[0%]"></div>
            </div>
            <div className="text-white text-sm">0 / 1,000 Requests</div>
          </div>
        </div>
      </div>

      {/* API Keys Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">API Keys</h3>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-2">NAME</th>
              <th className="py-2">USAGE</th>
              <th className="py-2">KEY</th>
              <th className="py-2">OPTIONS</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((key) => (
              <tr key={key.id} className="border-t">
                <td className="py-4">{key.name}</td>
                <td className="py-4">{key.usage}</td>
                <td className="py-4 font-mono">
                  {key.isVisible ? key.key : maskApiKey(key.key)}
                </td>
                <td className="py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleKeyVisibility(key.id)}
                      className={`p-2 hover:bg-gray-100 rounded-lg ${key.isVisible ? 'text-blue-500' : ''}`}
                    >
                      {key.isVisible ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                    <button 
                      onClick={() => handleCopyClick(key.key)}
                      className="p-2 hover:bg-gray-100 rounded-lg group relative"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {copySuccess && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                          {copySuccess}
                        </span>
                      )}
                    </button>
                    <button 
                      onClick={() => handleEditClick(key)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsCreateModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white p-8 rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-3">Create a new API key</h2>
            <p className="text-gray-600 mb-6">Enter a name and limit for the new API key.</p>
            
            <form onSubmit={handleCreateKey}>
              <div className="mb-6">
                <label className="block mb-1">
                  Key Name <span className="text-gray-400">— A unique name to identify this key</span>
                </label>
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Key Name"
                  required
                  autoFocus
                />
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewKeyName('');
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsEditModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-white p-8 rounded-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold mb-3">Edit API key</h2>
            <p className="text-gray-600 mb-6">Update the name for this API key.</p>
            
            <form onSubmit={handleEditSubmit}>
              <div className="mb-6">
                <label className="block mb-1">
                  Key Name <span className="text-gray-400">— A unique name to identify this key</span>
                </label>
                <input
                  type="text"
                  value={editKeyName}
                  onChange={(e) => setEditKeyName(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Key Name"
                  required
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block mb-1">
                  API Key <span className="text-gray-400">— Your API key (read-only)</span>
                </label>
                <div className="relative">
                  <div className="w-full p-3 border rounded-xl bg-gray-50 font-mono text-gray-500 flex items-center justify-between">
                    <span>{editingKey?.isVisible ? editingKey.key : maskApiKey(editingKey.key)}</span>
                    <button
                      type="button"
                      onClick={() => setEditingKey(prev => ({
                        ...prev,
                        isVisible: !prev.isVisible
                      }))}
                      className="ml-2 p-1 hover:bg-gray-200 rounded"
                    >
                      {editingKey?.isVisible ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingKey(null);
                    setEditKeyName('');
                  }}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
