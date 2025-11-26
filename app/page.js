export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              RAG Chatbot
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Retrieval-Augmented Generation with pgvector + OpenAI
            </p>
          </div>

          {/* Chat Interface Placeholder */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Chat Interface
              </h2>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 mb-4 min-h-[400px]">
                <p className="text-gray-500 dark:text-gray-400 text-center mt-40">
                  Chat interface coming soon...
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about your documents..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled
                />
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Document Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Upload Documents
            </h2>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Document upload coming soon...
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Upload PDFs, text files, or paste web content
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
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
