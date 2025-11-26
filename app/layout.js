import "./globals.css";

export const metadata = {
  title: "RAG Chatbot",
  description: "Retrieval-Augmented Generation chatbot with pgvector and OpenAI",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
