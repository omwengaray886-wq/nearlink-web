'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '@/context/AuthContext'; // Ensure this matches your Auth Hook path
import { ArrowLeft, Loader2, UploadCloud, CheckCircle2, ShieldCheck } from 'lucide-react';

const QUOTES = [
  "Trust is the currency of the new economy.",
  "Your safety is our priority."
];

export default function BecomeHostPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // --- STATE ---
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // --- FIREBASE INIT ---
  const db = getFirestore();
  const storage = getStorage();

  // --- HANDLERS ---
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    try {
      // 1. Upload ID Image to Storage
      // Path: host_docs/{uid}/{filename}
      const storageRef = ref(storage, `host_docs/${user.uid}/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(uploadResult.ref);

      // 2. Create Request in Firestore
      // We use the User UID as the document ID for easy lookup
      await setDoc(doc(db, "host_requests", user.uid), {
        uid: user.uid,
        fullName: user.displayName || "NearLink User",
        email: user.email,
        phone: user.phoneNumber || "",
        idDocumentUrl: url,
        status: "pending", // Important: This triggers the 'Pending' screen on the dashboard
        submittedAt: serverTimestamp(),
        serviceFeePercentage: 12, // Default fee
        termsAccepted: true
      });

      // 3. Redirect to the Host Gatekeeper
      // The gatekeeper at /host will see the "pending" status and show the waiting screen
      router.push('/host');
      
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Error submitting document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT SIDE: Visuals & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-black relative flex-col justify-between p-12 text-white overflow-hidden">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=2070" 
                className="w-full h-full object-cover opacity-50"
                alt="Security Background"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
         </div>

         {/* Top Navigation */}
         <div className="relative z-10">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 hover:opacity-80 transition text-sm font-bold tracking-wide uppercase"
            >
                <ArrowLeft size={16}/> Back to Home
            </button>
         </div>

         {/* Quote Content */}
         <div className="relative z-10 max-w-lg">
            <div className="w-12 h-1 bg-green-500 mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-serif italic leading-tight mb-6">
                "{QUOTES[0]}"
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
                Identity verification helps us keep NearLink secure for both Hosts and Guests. Your data is encrypted and handled with the highest security standards.
            </p>
         </div>
         
         {/* Footer Info */}
         <div className="relative z-10 flex items-center gap-4 text-xs text-gray-500 uppercase tracking-widest">
            <ShieldCheck size={14} className="text-green-500"/>
            <span>Secure SSL Encrypted Connection</span>
         </div>
      </div>

      {/* RIGHT SIDE: Interactive Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
         <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 animate-in slide-in-from-right-8 duration-700">
             
             {/* Header */}
             <div className="mb-8 text-center lg:text-left">
                 <div className="inline-flex items-center justify-center w-12 h-12 bg-green-50 text-green-600 rounded-xl mb-4 lg:hidden">
                    <ShieldCheck size={24}/>
                 </div>
                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Identity</h1>
                 <p className="text-gray-500">Please upload a clear photo of your Government ID, Passport, or Driver's License.</p>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6">
                 
                 {/* Smart File Drop Area */}
                 <div className="group">
                    <label className={`
                        relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden bg-gray-50
                        ${file ? 'border-green-500 bg-green-50/30' : 'border-gray-300 hover:border-black hover:bg-gray-100'}
                    `}>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            required 
                        />
                        
                        {/* Empty State */}
                        {!file && (
                            <div className="flex flex-col items-center text-gray-400 group-hover:text-gray-600 transition-colors">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                                    <UploadCloud size={32} />
                                </div>
                                <p className="font-bold text-gray-900">Click or Drag ID Here</p>
                                <p className="text-xs mt-1">PNG, JPG up to 10MB</p>
                            </div>
                        )}

                        {/* Preview State */}
                        {preview && (
                            <div className="absolute inset-0 w-full h-full z-10">
                                <img src={preview} className="w-full h-full object-cover" alt="ID Preview" />
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <CheckCircle2 size={40} className="mb-2 text-green-400"/>
                                    <p className="font-bold">Change Image</p>
                                </div>
                            </div>
                        )}
                    </label>
                    {file && (
                        <div className="flex items-center gap-2 mt-2 text-xs text-green-600 font-bold px-1 animate-in fade-in">
                            <CheckCircle2 size={12}/>
                            {file.name} ready to upload
                        </div>
                    )}
                 </div>

                 {/* Submit Button */}
                 <button 
                    type="submit" 
                    disabled={loading || !file}
                    className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-2"
                 >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            Verifying...
                        </>
                    ) : (
                        'Submit for Verification'
                    )}
                 </button>

                 <p className="text-center text-xs text-gray-400">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                 </p>
             </form>
         </div>
      </div>
    </div>
  );
}