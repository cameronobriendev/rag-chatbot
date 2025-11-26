import ChatInterface from '../components/ChatInterface';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex flex-col flex-1">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
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
        </div>
      </div>
    </main>
  );
}
