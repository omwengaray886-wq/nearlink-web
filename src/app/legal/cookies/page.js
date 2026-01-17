import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-nearlink-dark pb-2 shadow-sm"><Navbar /></div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-gray-500 mb-10">How we use tracking technologies.</p>

          <div className="prose prose-lg max-w-none text-gray-600">
            <h3>1. What are cookies?</h3>
            <p>Cookies are small text files that are used to store small pieces of information. They are stored on your device when the website is loaded on your browser.</p>

            <h3>2. How we use cookies</h3>
            <p>We use cookies for the following purposes:</p>
            <ul>
                <li><strong>Essential Cookies:</strong> Necessary for the website to function (e.g., logging in, booking sessions).</li>
                <li><strong>Analytics Cookies:</strong> To understand how visitors interact with our website (e.g., Google Analytics).</li>
                <li><strong>Functional Cookies:</strong> To remember your preferences like language or currency.</li>
            </ul>

            <h3>3. Managing Cookies</h3>
            <p>You can change your cookie preferences at any time by visiting the Settings in your browser. However, disabling essential cookies may prevent you from using core features of NearLink.</p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}