import { Inter } from 'next/font/google';
import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'NearLink',
  description: 'Book your next stay or experience.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This creates the blue line at the top when navigating */}
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