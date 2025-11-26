'use client';

import { useState, useRef, useEffect } from 'react';

// Generate or retrieve session ID (client-side only)
function getSessionId() {
  // Only run in browser
  if (typeof window === 'undefined') return null;

  let sessionId = localStorage.getItem('rag_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('rag_session_id', sessionId);
  }
  return sessionId;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize session ID on mount (client-side only)
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Fetch documents on mount
  useEffect(() => {
    if (sessionId) {
      fetchDocuments();
    }
  }, [sessionId]);

  // Removed auto-scroll - let user control scrolling manually

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  async function handleClearData() {
    if (!confirm('Are you sure you want to delete all your uploaded documents? This cannot be undone.')) {
      return;
    }

    try {
      // Get CSRF token
      const csrfRes = await fetch('/api/csrf-token');
      const { csrfToken } = await csrfRes.json();

      // Clear session data
      const res = await fetch('/api/clear-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({ sessionId })
      });

      const data = await res.json();

      if (res.ok) {
        // Clear localStorage
        localStorage.removeItem('rag_session_id');

        // Show success message
        setMessages([{
          role: 'system',
          content: `✅ ${data.message}. Refreshing...`
        }]);

        // Reload page after 1 second
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Failed to clear data: ${data.error}`,
          error: true
        }]);
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Failed to clear data: ${error.message}`,
        error: true
      }]);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!input.trim() || loading || !sessionId) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          sessionId: sessionId
        })
      });

      const data = await res.json();

      if (res.ok) {
        const assistantMessage = {
          role: 'assistant',
          content: data.response,
          sources: data.sources,
          metadata: data.metadata
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          role: 'assistant',
          content: `Error: ${data.error || 'Failed to get response'}`,
          error: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Error: Failed to connect to server',
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file || !sessionId) return;

    // Validate file size (Digital Ocean handles up to 25MB)
    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      setMessages(prev => [...prev, {
        role: 'system',
        content: `File too large: ${(file.size / 1024 / 1024).toFixed(2)}MB. Maximum size is 25MB.`,
        error: true
      }]);
      e.target.value = ''; // Reset file input
      return;
    }

    setUploading(true);

    try {
      // Show uploading message
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Uploading "${file.name}"...`
      }]);

      // Convert file to base64 for JSON transport
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );

      // Upload to external service (supports larger files than Vercel's 4.5MB limit)
      const uploadUrl = process.env.NEXT_PUBLIC_UPLOAD_URL || '/api/upload';
      const res = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileData: base64,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          sessionId: sessionId
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Remove uploading message
        setMessages(prev => prev.filter(m => !m.content.includes('Uploading')));

        // Add success message
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Document "${data.document.name}" uploaded successfully! (${data.document.chunkCount} chunks created)`
        }]);
        // Refresh documents list
        fetchDocuments();
      } else {
        setMessages(prev => [...prev, {
          role: 'system',
          content: `Upload failed: ${data.error}`,
          error: true
        }]);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Upload failed: ${error.message}`,
        error: true
      }]);
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset file input
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Session Privacy Indicator */}
      {sessionId && (
        <div className="bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800 px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-700 dark:text-green-400">🔒</span>
              <span className="text-green-800 dark:text-green-300 font-medium">
                Private Session
              </span>
              <span className="text-green-600 dark:text-green-400 font-mono text-xs">
                {sessionId.substring(0, 20)}...
              </span>
            </div>
            <span className="text-green-700 dark:text-green-400 text-xs">
              Your data is isolated and secure
            </span>
          </div>
        </div>
      )}

      {/* Document Upload Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Documents ({documents.length})
            </h3>
            {documents.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {documents.slice(0, 3).map(d => d.name).join(', ')}
                {documents.length > 3 && ` +${documents.length - 3} more`}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {documents.length > 0 && (
              <button
                onClick={handleClearData}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Clear My Data
              </button>
            )}
            <label className={`px-4 py-2 bg-blue-500 text-white rounded-lg transition-colors ${!sessionId || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}`}>
              {uploading ? 'Uploading...' : 'Upload File'}
              <input
                type="file"
                accept=".pdf,.txt"
                onChange={handleFileUpload}
                disabled={uploading || !sessionId}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-20">
            <p className="text-lg mb-2">👋 Welcome to RAG Chatbot!</p>
            <p className="text-sm">Upload documents and ask questions about them.</p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : msg.role === 'system'
                  ? msg.error
                    ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
                    : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
                  : msg.error
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-sm font-semibold mb-2">Sources:</p>
                  {msg.sources.map((source, i) => (
                    <div key={i} className="text-xs mb-2 opacity-90">
                      <span className="font-medium">[{source.index}]</span>{' '}
                      {source.documentName}{' '}
                      <span className="opacity-75">
                        (similarity: {(source.similarity * 100).toFixed(1)}%)
                      </span>
                      <p className="mt-1 italic">{source.preview}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Metadata */}
              {msg.metadata && (
                <div className="mt-2 text-xs opacity-75">
                  ⏱️ {msg.metadata.totalTime}ms
                  {msg.metadata.chunksRetrieved && ` • ${msg.metadata.chunksRetrieved} chunks`}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your documents..."
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !sessionId}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
