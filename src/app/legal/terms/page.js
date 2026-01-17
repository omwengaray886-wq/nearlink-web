import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-nearlink-dark pb-2 shadow-sm"><Navbar /></div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-500 mb-10">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h3>1. Introduction</h3>
            <p>Welcome to NearLink. By accessing our website and mobile application, you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>

            <h3>2. Use License</h3>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on NearLink's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

            <h3>3. User Accounts</h3>
            <p>To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>

            <h3>4. Host Obligations</h3>
            <p>As a Host, you are solely responsible for setting your own price, availability, and rules for your Listing. You represent and warrant that any Listing you post and the booking of, or a Guest's stay at, an Accommodation will not breach any agreements you have entered into with any third parties.</p>

            <h3>5. Payments & M-Pesa</h3>
            <p>NearLink integrates with M-Pesa for payments. By using our payment services, you agree to be bound by the Safaricom M-Pesa Terms and Conditions. NearLink is not a bank and does not offer banking services.</p>

            <h3>6. Liability</h3>
            <p>In no event shall NearLink or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on NearLink's website.</p>

            <h3>7. Governing Law</h3>
            <p>These terms and conditions are governed by and construed in accordance with the laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}