'use client';
import Link from 'next/link';

export default function HostStatus() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center p-8 max-w-lg">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-6">
          <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Pending</h2>
        <p className="text-gray-600 mb-8">
          Thanks for applying to be a NearLink Host! Our team is currently reviewing your ID. 
          You will receive an email once your account is approved.
        </p>
        <Link href="/">
          <button className="text-green-600 font-medium hover:text-green-500">
            &larr; Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}