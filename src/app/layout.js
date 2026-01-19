import { Inter } from 'next/font/google';
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

// ✅ Updated for professional Google Search appearance
export const metadata = {
  title: 'NearLink | Book Stays, Safaris & Unique Experiences in Kenya',
  description: 'NearLink connects you with verified BnBs, luxury villas, and authentic safari experiences across Kenya. Find your perfect stay and adventure today.',
  // ✅ Ensures browsers and Google use your lightning bolt logo
  icons: {
    icon: '/icon.png',
    apple: '/icon.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Sleek blue progress bar for navigation */}
        <NextTopLoader 
          color="#005871"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          showSpinner={false}
          easing="ease"
          speed={200}
        />

        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}