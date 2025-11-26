import ChatInterface from '../components/ChatInterface';
import MenuBook from '../components/icons/MenuBook';
import Search from '../components/icons/Search';
import SmartToy from '../components/icons/SmartToy';
import Settings from '../components/icons/Settings';
import Palette from '../components/icons/Palette';
import SyncAlt from '../components/icons/SyncAlt';
import Stars from '../components/icons/Stars';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      {/* Navigation Buttons */}
      <a
        href="https://cameronobrien.dev"
        className="nav-btn top-5 left-5 z-50 px-4 py-2 rounded-lg text-sm font-medium hidden md:inline-block"
      >
        Back to Portfolio
      </a>
      <a
        href="https://github.com/cameronobriendev/rag-chatbot"
        className="nav-btn top-5 right-5 z-50 px-4 py-2 rounded-lg text-sm font-medium hidden md:inline-block"
      >
        View on GitHub
      </a>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">
              RAG Chatbot
            </h1>
            <p className="opacity-90">
              Retrieval-Augmented Generation with pgvector + OpenAI
            </p>
          </div>

          {/* Chat Interface */}
          <div className="glass-card rounded-lg flex flex-col overflow-hidden h-[700px]">
            <ChatInterface />
          </div>

          {/* Info Section */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MenuBook className="w-5 h-5" /> Knowledge Base
              </h3>
              <p className="text-sm opacity-80">
                Upload documents to build your custom knowledge base
              </p>
            </div>
            <div className="glass-card rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Search className="w-5 h-5" /> Smart Search
              </h3>
              <p className="text-sm opacity-80">
                Vector similarity search finds relevant context
              </p>
            </div>
            <div className="glass-card rounded-lg p-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <SmartToy className="w-5 h-5" /> AI Responses
              </h3>
              <p className="text-sm opacity-80">
                GPT-4 generates answers based on your data
              </p>
            </div>
          </div>

          {/* Tech Stack & Architecture */}
          <div className="mt-6 glass-card rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Tech Stack & Architecture
            </h2>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Backend
                </h3>
                <ul className="space-y-2 text-sm opacity-90">
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
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Palette className="w-5 h-5" /> Frontend
                </h3>
                <ul className="space-y-2 text-sm opacity-90">
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
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <SyncAlt className="w-5 h-5" /> Data Flow
              </h3>

              {/* Upload Flow */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold mb-3 opacity-90">
                  Document Upload Flow:
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="px-3 py-2 rounded font-medium bg-blue-900/60 border border-blue-700/50">
                    PDF/TXT Upload
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-purple-900/60 border border-purple-700/50">
                    Vercel Blob
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-green-900/60 border border-green-700/50">
                    Extract Text
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-yellow-900/60 border border-yellow-700/50">
                    Chunk (500 tokens)
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-orange-900/60 border border-orange-700/50">
                    Generate Embeddings
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-indigo-900/60 border border-indigo-700/50">
                    Store in Neon
                  </div>
                </div>
              </div>

              {/* Query Flow */}
              <div>
                <h4 className="text-sm font-semibold mb-3 opacity-90">
                  Query Flow:
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="px-3 py-2 rounded font-medium bg-blue-900/60 border border-blue-700/50">
                    User Question
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-orange-900/60 border border-orange-700/50">
                    Embed Query
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-indigo-900/60 border border-indigo-700/50">
                    Vector Search (pgvector)
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-green-900/60 border border-green-700/50">
                    Retrieve Top 5 Chunks
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-purple-900/60 border border-purple-700/50">
                    GPT-4 + Context
                  </div>
                  <span className="opacity-60">→</span>
                  <div className="px-3 py-2 rounded font-medium bg-yellow-900/60 border border-yellow-700/50">
                    AI Response
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Stars className="w-5 h-5" /> Key Technical Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm opacity-90">
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
