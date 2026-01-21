import { Inter } from 'next/font/google';
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';
import NextTopLoader from 'nextjs-toploader';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnalyticsTracker from '@/components/AnalyticsTracker'; // <--- The Heartbeat

const inter = Inter({ subsets: ['latin'] });

// ✅ Updated Title for Google Search
export const metadata = {
  title: 'NearLink Booking services',
  description: 'NearLink connects you with verified BnBs, luxury villas, and authentic safari experiences across Kenya. Find your perfect stay and adventure today.',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation Progress Bar */}
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
          {/* 1. The Invisible Tracker (Must be inside AuthContext) */}
          <AnalyticsTracker />
          
          {/* 2. Global Navbar */}
          <Navbar />
          
          {/* 3. Page Content */}
          <main className="min-h-screen">
            {children}
          </main>
          
          {/* 4. Global Footer */}
          <Footer />
        </AuthContextProvider>
      </body>
    </html>
  );
}