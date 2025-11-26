# RAG Chatbot

A production-ready **Retrieval-Augmented Generation (RAG)** chatbot built with Next.js, PostgreSQL (pgvector), and OpenAI.

Upload documents and ask questions - the AI answers based on your custom knowledge base, not generic training data.

## What is RAG?

RAG combines document retrieval with AI generation to create chatbots that answer questions based on your specific documents. Instead of relying on the AI's training data:

1. **Store** your documents in a vector database
2. **Retrieve** relevant chunks when you ask questions
3. **Generate** accurate answers grounded in your actual data

## Features

- 📚 **Custom Knowledge Base** - Upload PDFs and text files
- 🔍 **Vector Similarity Search** - Fast semantic search with pgvector
- 🤖 **AI-Powered Responses** - GPT-4o generates contextual answers
- 📊 **Document Management** - Track and manage uploaded documents
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS
- ⚡ **Fast Responses** - 3-5 second query time with concise answers
- 🔒 **Secure** - Built with security best practices from day one

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Node.js serverless functions
- **Database**: PostgreSQL with pgvector extension (HNSW indexing)
- **AI/ML**: OpenAI Embeddings API (text-embedding-3-small) + GPT-4o
- **Text Processing**: pdf-parse for document extraction

## How It Works

### Document Upload & Indexing

1. Extract text from uploaded PDFs/TXT files
2. Split text into semantic chunks (500 tokens with 50-token overlap)
3. Generate 1536-dimension embeddings via OpenAI
4. Store chunks + embeddings in PostgreSQL with pgvector

### RAG Query Flow

1. User asks a question
2. Generate embedding for the question
3. Vector similarity search (cosine distance) finds top 3 relevant chunks
4. Build prompt with retrieved context + user question
5. GPT-4o generates concise answer (2-3 sentences)
6. Return response with source citations

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database with pgvector extension enabled
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone https://github.com/cameronobriendev/rag-chatbot.git
cd rag-chatbot

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials
```

### Environment Variables

Required variables in `.env.local`:

```bash
# PostgreSQL with pgvector
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Optional: Session secret for CSRF protection
SESSION_SECRET=your-secret-here-min-32-chars
```

### Database Setup

Enable pgvector extension in your PostgreSQL database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Run the schema migration to create required tables:
- `documents` - Document metadata
- `chunks` - Text chunks with embeddings
- `query_history` - Query logs and performance metrics

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
rag-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/          # RAG query endpoint
│   │   ├── documents/     # Document management
│   │   └── csrf-token/    # CSRF protection
│   ├── layout.js          # Root layout
│   ├── page.js            # Chat interface
│   └── globals.css        # Global styles
├── components/
│   └── ChatInterface.js   # Main chat UI component
├── lib/
│   ├── db.js             # Database connection
│   └── embeddings.js     # OpenAI embedding utilities
└── package.json
```

## Key Technical Features

### Vector Search with pgvector

Uses PostgreSQL's pgvector extension with HNSW indexing for fast approximate nearest neighbor search:

```sql
SELECT content, 1 - (embedding <=> query_embedding) as similarity
FROM chunks
ORDER BY embedding <=> query_embedding
LIMIT 3
```

### Semantic Chunking

Smart text splitting that:
- Targets 500 tokens per chunk (2000 chars)
- 50-token overlap between chunks (prevents context loss)
- Breaks at natural boundaries (sentences, paragraphs)
- Handles null bytes and special characters

### Optimized for Speed

- 3 chunks retrieved (not 5) - 40% less context overhead
- GPT-4o with 150 max tokens - fast, concise responses
- Temperature 0.3 - focused answers, less rambling
- Session isolation - users only see their own documents

## Cost Estimate

For portfolio/demo use (~100 queries/month):
- **OpenAI Embeddings**: ~$2/month
- **OpenAI GPT-4o**: ~$3-5/month
- **Database**: Free tier available (Neon, Supabase)
- **Hosting**: Free tier (Vercel, Netlify)

**Total**: $5-10/month for personal projects

For production (~1000 queries/month): ~$30-50/month

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Add environment variables in Vercel dashboard:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `SESSION_SECRET`

### Database Hosting Options

- **Neon** - Serverless PostgreSQL with pgvector (free tier available)
- **Supabase** - PostgreSQL with pgvector support
- **DigitalOcean** - Managed PostgreSQL + self-hosted pgvector

## Security Features

- CSRF protection on all state-changing endpoints
- Input validation and sanitization
- Parameterized SQL queries (no SQL injection)
- Session isolation (users can't access others' documents)
- Environment variable protection (.gitignore blocks all .env files)
- Generic error messages (no information leakage)

## Use Cases

- **Customer Support** - Answer questions from product documentation
- **Research** - Query academic papers and research notes
- **Legal/Compliance** - Search contracts and policy documents
- **Education** - Study aids based on textbooks and lectures
- **Personal Knowledge Management** - Your own AI assistant

## Portfolio Project

This RAG chatbot demonstrates:
- **AI/ML Integration** - OpenAI embeddings + GPT-4o
- **Vector Databases** - PostgreSQL pgvector with HNSW indexing
- **Modern Web Stack** - Next.js 16, React 19, Tailwind CSS
- **API Design** - RESTful endpoints for upload, query, document management
- **Security Best Practices** - CSRF protection, input validation, session isolation
- **Performance Optimization** - Fast queries, concise responses

**Ideal for freelance work**: Custom RAG implementations typically bill at $100-150/hr.

## License

MIT License - feel free to use for your own projects!

## Author

**Cameron O'Brien**
[GitHub](https://github.com/cameronobriendev)

---

Built with [Claude Code](https://claude.com/claude-code)
