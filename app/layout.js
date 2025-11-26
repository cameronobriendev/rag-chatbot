import "./globals.css";
import "./theme.css";

export const metadata = {
  title: "RAG Chatbot",
  description: "Retrieval-Augmented Generation chatbot with pgvector and OpenAI",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="w-full">
      <body className="w-full">{children}</body>
    </html>
  );
}
