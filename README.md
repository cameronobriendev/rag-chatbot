# RAG Chatbot

A production-ready **Retrieval-Augmented Generation (RAG)** chatbot built with Next.js, PostgreSQL (pgvector), and OpenAI.

## What is RAG?

RAG combines document retrieval with AI generation to create chatbots that can answer questions based on your own custom knowledge base. Instead of relying solely on the AI's training data, RAG:

1. **Stores** your documents in a vector database
2. **Retrieves** relevant chunks when you ask a question
3. **Generates** accurate answers grounded in your actual data

## Features

- 📚 **Custom Knowledge Base** - Upload PDFs, text files, or web content
- 🔍 **Vector Similarity Search** - pgvector for fast, semantic search
- 🤖 **AI-Powered Responses** - GPT-4 generates contextual answers
- 📊 **Document Management** - Track and manage uploaded documents
- 🎨 **Modern UI** - Clean, responsive interface with Tailwind CSS
- 🔒 **Secure by Default** - Built with security best practices

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend**: Vercel Edge Functions
- **Database**: PostgreSQL with pgvector extension (Neon)
- **AI/ML**: OpenAI Embeddings API + GPT-4
- **Storage**: Vercel Blob (document storage)
- **Text Processing**: LangChain.js, pdf-parse

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database with pgvector extension (or Neon account)
- OpenAI API key
- Vercel account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cameronobriendev/rag-chatbot.git
cd rag-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
- `DATABASE_URL` - PostgreSQL connection string (with pgvector enabled)
- `OPENAI_API_KEY` - Your OpenAI API key
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob token (optional for document storage)

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
rag-chatbot/
├── app/
│   ├── api/              # API routes
│   │   ├── chat/         # Chat endpoint (RAG query)
│   │   ├── upload/       # Document upload & indexing
│   │   ├── documents/    # Document management
│   │   └── auth/         # Authentication utilities
│   ├── layout.js         # Root layout
│   ├── page.js           # Home page (chat interface)
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/                  # Utility functions
├── scripts/              # Helper scripts
└── package.json
```

## How It Works

### 1. Document Upload & Indexing

When you upload a document:
1. Extract text (PDF parsing, HTML scraping, etc.)
2. Split text into chunks (500 tokens with 50-token overlap)
3. Generate embeddings using OpenAI `text-embedding-3-small`
4. Store chunks + embeddings in PostgreSQL (pgvector)

### 2. Querying (RAG Flow)

When you ask a question:
1. Generate embedding for your question
2. Vector similarity search in PostgreSQL (find top 5 relevant chunks)
3. Build prompt: [retrieved chunks] + [your question]
4. GPT-4 generates answer based on context
5. Return response with source citations

## Cost Estimate

For portfolio/demo use (~100 queries/month):
- **OpenAI Embeddings**: ~$2/month
- **OpenAI GPT-4**: ~$5-10/month
- **Neon Database**: Free tier (or $20/month for production)
- **Vercel**: Free tier (or included in Pro plan)

**Total**: ~$10-30/month depending on usage

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy!

```bash
vercel --prod
```

## Portfolio Project

This RAG chatbot is a portfolio project demonstrating:
- **AI/ML Integration** - OpenAI embeddings + GPT-4
- **Vector Databases** - PostgreSQL pgvector for semantic search
- **Modern Web Stack** - Next.js, React, Tailwind CSS
- **API Design** - RESTful endpoints for upload, query, document management
- **Security Best Practices** - Authentication, input validation, CSRF protection

**Ideal for Upwork/freelance work**: Clients pay $100-150/hr for custom RAG implementations.

## License

MIT License - feel free to use for your own projects!

## Author

**Cameron O'Brien**
[GitHub](https://github.com/cameronobriendev) | [Portfolio](https://brasshelm.com)

---

Built with [Claude Code](https://claude.com/claude-code)
