'use client';

import { useState, useRef, useEffect } from 'react';
import { put } from '@vercel/blob/client';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function fetchDocuments() {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
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
    if (!file) return;

    setUploading(true);

    try {
      // Step 1: Upload file to Vercel Blob (no size limit)
      setMessages(prev => [...prev, {
        role: 'system',
        content: `Uploading "${file.name}" to storage...`
      }]);

      // Get token from environment
      const token = process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN;

      if (!token) {
        throw new Error('NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN is not configured');
      }

      const blob = await put(file.name, file, {
        access: 'public',
        token: token,
      });

      // Step 2: Send blob URL to backend for processing
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'Processing document...'
      }]);

      // Get CSRF token
      const csrfRes = await fetch('/api/csrf-token');
      const { csrfToken } = await csrfRes.json();

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        body: JSON.stringify({
          blobUrl: blob.url,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Remove temporary messages
        setMessages(prev => prev.filter(m =>
          !m.content.includes('Uploading') && !m.content.includes('Processing')
        ));

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
          <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors">
            {uploading ? 'Uploading...' : 'Upload File'}
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
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
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
