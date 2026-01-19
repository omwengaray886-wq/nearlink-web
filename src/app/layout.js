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
        {/* The TopLoader adds the progress bar at the top of the window */}
        <NextTopLoader 
          color="#005871"  // NearLink Brand Blue
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          showSpinner={false} // Keeps it clean (no spinning circle)
          easing="ease"
          speed={200}
          shadow="0 0 10px #005871,0 0 5px #005871"
        />

        {/* The AuthContext must wrap the children so the whole app can access the user */}
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}