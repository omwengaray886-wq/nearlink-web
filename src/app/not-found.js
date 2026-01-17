// src/app/not-found.js
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      
      <h1 className="text-9xl font-bold text-nearlink mb-4">404</h1>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Oops! We can't seem to find that page.
      </h2>
      
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link href="/">
        <button className="bg-nearlink hover:bg-nearlink-dark text-white font-bold py-4 px-8 rounded-full flex items-center gap-2 transition shadow-lg">
           <Home size={20} /> Back to Home
        </button>
      </Link>

      <div className="mt-12 text-gray-400 text-sm">
        &copy; 2026 NearLink, Inc.
      </div>
    </div>
  );
}