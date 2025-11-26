import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              RAG Chatbot
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Retrieval-Augmented Generation with pgvector + OpenAI
            </p>
          </div>

          {/* Chat Interface */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col overflow-hidden h-[700px]">
            <ChatInterface />
          </div>

          {/* Info Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                📚 Knowledge Base
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Upload documents to build your custom knowledge base
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                🔍 Smart Search
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vector similarity search finds relevant context
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
                🤖 AI Responses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                GPT-4 generates answers based on your data
              </p>
            </div>
          </div>

          {/* Tech Stack & Architecture */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Tech Stack & Architecture
            </h2>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <span className="mr-2">⚙️</span> Backend
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Next.js 16</strong> - Serverless API routes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Neon PostgreSQL + pgvector</strong> - Vector database with HNSW indexing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>OpenAI Embeddings</strong> - text-embedding-3-small (1536 dimensions)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Vercel Blob</strong> - Document storage (bypasses 4.5MB upload limit)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                  <span className="mr-2">🎨</span> Frontend
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>React 19</strong> - Modern UI with hooks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>Tailwind CSS</strong> - Responsive styling + dark mode</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>CSRF Protection</strong> - Secure state-changing operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span><strong>PDF/TXT Support</strong> - Upload files up to 25MB</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Flow Diagram */}
            <div>
              <h3 className="font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <span className="mr-2">🔄</span> Data Flow
              </h3>

              {/* Upload Flow */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Document Upload Flow:
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded text-blue-800 dark:text-blue-100 font-medium">
                    PDF/TXT Upload
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-purple-100 dark:bg-purple-900 px-3 py-2 rounded text-purple-800 dark:text-purple-100 font-medium">
                    Vercel Blob
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-green-100 dark:bg-green-900 px-3 py-2 rounded text-green-800 dark:text-green-100 font-medium">
                    Extract Text
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded text-yellow-800 dark:text-yellow-100 font-medium">
                    Chunk (500 tokens)
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-orange-100 dark:bg-orange-900 px-3 py-2 rounded text-orange-800 dark:text-orange-100 font-medium">
                    Generate Embeddings
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-indigo-100 dark:bg-indigo-900 px-3 py-2 rounded text-indigo-800 dark:text-indigo-100 font-medium">
                    Store in Neon
                  </div>
                </div>
              </div>

              {/* Query Flow */}
              <div>
                <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  Query Flow:
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="bg-blue-100 dark:bg-blue-900 px-3 py-2 rounded text-blue-800 dark:text-blue-100 font-medium">
                    User Question
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-orange-100 dark:bg-orange-900 px-3 py-2 rounded text-orange-800 dark:text-orange-100 font-medium">
                    Embed Query
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-indigo-100 dark:bg-indigo-900 px-3 py-2 rounded text-indigo-800 dark:text-indigo-100 font-medium">
                    Vector Search (pgvector)
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-green-100 dark:bg-green-900 px-3 py-2 rounded text-green-800 dark:text-green-100 font-medium">
                    Retrieve Top 5 Chunks
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-purple-100 dark:bg-purple-900 px-3 py-2 rounded text-purple-800 dark:text-purple-100 font-medium">
                    GPT-4 + Context
                  </div>
                  <span className="text-gray-400">→</span>
                  <div className="bg-yellow-100 dark:bg-yellow-900 px-3 py-2 rounded text-yellow-800 dark:text-yellow-100 font-medium">
                    AI Response
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">
                🎯 Key Technical Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>HNSW Indexing:</strong> Fast approximate nearest neighbor search</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>Semantic Chunking:</strong> 500 tokens with 50-token overlap</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>Cosine Similarity:</strong> &lt;=&gt; operator for vector distance</span>
                </div>
                <div className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span><strong>Source Citations:</strong> Track which documents answered questions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
