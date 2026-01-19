'use client';

import { useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function ImageUpload({ onImageUploaded, initialImage }) {
  const [image, setImage] = useState(initialImage || '');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a storage reference
    const storageRef = ref(storage, `property-images/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    setUploading(true);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        console.error(error);
        setUploading(false);
        alert("Upload failed. Check your console.");
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImage(downloadURL);
        onImageUploaded(downloadURL); // Send URL back to parent
        setUploading(false);
      }
    );
  };

  const removeImage = () => {
    setImage('');
    onImageUploaded('');
    setProgress(0);
  };

  return (
    <div className="w-full">
      {image ? (
        <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-200 group">
          <img src={image} alt="Property" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
             <button 
               onClick={removeImage}
               className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-50"
             >
               <X size={16}/> Remove Photo
             </button>
          </div>
        </div>
      ) : (
        <label className={`
          border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition
          ${uploading ? 'border-gray-300 bg-gray-50' : 'border-gray-300 hover:border-black hover:bg-gray-50'}
        `}>
          <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          
          {uploading ? (
             <div className="text-center">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400 mx-auto mb-2"/>
                <p className="text-sm font-bold text-gray-500">Uploading... {Math.round(progress)}%</p>
             </div>
          ) : (
             <div className="text-center p-6">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                   <Upload size={24} className="text-gray-600"/>
                </div>
                <h3 className="font-bold text-lg text-gray-900">Click to upload photos</h3>
                <p className="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
             </div>
          )}
        </label>
      )}
    </div>
  );
}