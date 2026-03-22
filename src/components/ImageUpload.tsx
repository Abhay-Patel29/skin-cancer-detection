import React, { useState, useRef } from 'react';
import { Upload, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreview(base64);
        onImageSelected(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setPreview(null);
    setError(null);
    onImageSelected('', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!preview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-300 rounded-2xl hover:border-zinc-500 hover:bg-zinc-50 transition-all group w-full"
              >
                <div className="p-4 bg-zinc-100 rounded-full group-hover:bg-zinc-200 transition-colors mb-4">
                  <Upload className="w-8 h-8 text-zinc-600" />
                </div>
                <span className="font-medium text-zinc-900">Upload Image</span>
                <span className="text-sm text-zinc-500 mt-1 text-center">Select a clear photo of the lesion</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {preview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden border border-zinc-200 shadow-xl"
          >
            <img src={preview} alt="Lesion Preview" className="w-full h-auto max-h-[500px] object-contain bg-zinc-100" />
            <button
              onClick={reset}
              className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
