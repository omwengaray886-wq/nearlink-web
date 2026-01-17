import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-nearlink-dark pb-2 shadow-sm"><Navbar /></div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-500 mb-10">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h3>1. Information We Collect</h3>
            <p>We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, profile picture, and payment method.</p>

            <h3>2. How We Use Your Data</h3>
            <ul>
              <li>To provide, maintain, and improve our Services.</li>
              <li>To facilitate payments and payouts via M-Pesa.</li>
              <li>To verify your identity and maintain trust and safety (KYC).</li>
              <li>To send you customer support messages and updates.</li>
            </ul>

            <h3>3. Data Sharing</h3>
            <p>We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including with Hosts to facilitate bookings.</p>

            <h3>4. Security</h3>
            <p>We use Firebase Authentication and secure Firestore rules to protect your data. Payment data is processed securely by Paystack/Safaricom and is never stored on our servers.</p>

            <h3>5. Your Rights</h3>
            <p>You have the right to access, correct, or delete your personal data. You can manage your information in your Account Settings.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}