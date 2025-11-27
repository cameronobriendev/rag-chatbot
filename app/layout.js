import "./globals.css";
import "./theme.css";
import Script from 'next/script';
import CampaignTracker from '../components/CampaignTracker';

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
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="5bf11a98-4716-48e5-87e2-8b939f75894c"
          strategy="afterInteractive"
        />
      </head>
      <body className="w-full">
        <CampaignTracker />
        {children}
      </body>
    </html>
  );
}
