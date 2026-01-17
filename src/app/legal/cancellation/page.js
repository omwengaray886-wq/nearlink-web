import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CancellationPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-nearlink-dark pb-2 shadow-sm"><Navbar /></div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancellation & Refund Policy</h1>
          <p className="text-gray-500 mb-10">Understanding flexibility at NearLink</p>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h3>1. Guest Cancellation</h3>
            <p>Guests can cancel their reservation at any time. The amount refunded depends on when the cancellation is made relative to the check-in date.</p>
            <ul>
                <li><strong>Free Cancellation:</strong> Full refund if cancelled within 48 hours of booking and at least 14 days before check-in.</li>
                <li><strong>50% Refund:</strong> If cancelled up to 7 days before check-in.</li>
                <li><strong>Non-refundable:</strong> If cancelled less than 7 days before check-in.</li>
            </ul>

            <h3>2. Host Cancellation</h3>
            <p>If a Host cancels a confirmed booking, the Guest will receive a full refund. Hosts who cancel frequently may be subject to penalties or removal from the platform.</p>

            <h3>3. NearCover Guarantee</h3>
            <p>If a Host cancels within 24 hours of check-in, or if the accommodation is significantly different from the listing, NearLink will help you find a similar or better home, or refund you 100%.</p>

            <h3>4. Processing Time</h3>
            <p>Refunds to M-Pesa are typically processed within 24-48 hours. Card refunds may take 5-10 business days depending on your bank.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}