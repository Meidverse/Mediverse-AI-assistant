"use client";

import {
    CheckCircleIcon,
    CloudArrowUpIcon,
    PhotoIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUpload: (file: File, preview: string) => void;
  onRemove?: () => void;
  maxSize?: number;
  accept?: Record<string, string[]>;
}

export function ImageUpload({ 
  onImageUpload, 
  onRemove,
  maxSize = 10 * 1024 * 1024, // 10MB default
  accept = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/dicom': ['.dcm'],
  }
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
        setFileName(file.name);
        onImageUpload(file, result);
        setTimeout(() => setIsUploading(false), 500);
      };
      
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    onRemove?.();
  };

  const rootProps = getRootProps();

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            onClick={rootProps.onClick}
            onKeyDown={rootProps.onKeyDown}
            tabIndex={rootProps.tabIndex}
            className={`
              relative overflow-hidden rounded-3xl border-2 border-dashed 
              transition-all duration-300 cursor-pointer group
              ${isDragActive 
                ? 'border-blue-400 bg-blue-500/10 shadow-glow-lg' 
                : 'border-white/20 bg-slate-900/40 hover:border-blue-400/50 hover:bg-slate-900/60'
              }
            `}
          >
            {/* Liquid glass background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Animated ripple effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-transparent to-transparent"
              initial={{ scale: 0, opacity: 0 }}
              animate={isDragActive ? { scale: 2, opacity: 0.5 } : { scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, repeat: isDragActive ? Infinity : 0 }}
            />

            <input {...getInputProps()} />
            
            <div className="relative p-12 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                animate={isDragActive ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full" />
                <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                  <CloudArrowUpIcon className="h-16 w-16 text-blue-300" />
                </div>
              </motion.div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-white">
                  {isDragActive ? "Drop your medical image here" : "Upload Medical Scan"}
                </p>
                <p className="text-sm text-slate-300/70">
                  Drag & drop or click to upload X-Ray, CT, MRI, or DICOM files
                </p>
                <p className="text-xs text-slate-400/60">
                  Supports JPG, PNG, DICOM • Max 10MB
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="primary flex items-center gap-2 mt-4"
              >
                <PhotoIcon className="h-5 w-5" />
                Browse Files
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-3xl border border-white/20 bg-slate-900/40 backdrop-blur-xl overflow-hidden shadow-glow-md"
          >
            {/* Success indicator */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4 z-10"
            >
              <div className="p-2 rounded-full bg-green-500/20 border border-green-400/30 backdrop-blur-sm">
                <CheckCircleIcon className="h-6 w-6 text-green-300" />
              </div>
            </motion.div>

            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="absolute top-4 left-4 z-10 p-2 rounded-full bg-red-500/20 border border-red-400/30 backdrop-blur-sm hover:bg-red-500/30 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-red-300" />
            </motion.button>

            {/* Image preview */}
            <div className="relative aspect-video">
              <Image
                src={preview}
                alt="Medical scan preview"
                fill
                className="object-contain p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* File info */}
            <div className="p-6 border-t border-white/10 bg-slate-950/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
                    <PhotoIcon className="h-5 w-5 text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{fileName}</p>
                    <p className="text-xs text-slate-400">
                      {isUploading ? "Processing..." : "Ready for analysis"}
                    </p>
                  </div>
                </div>
                
                {isUploading && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-blue-400 border-t-transparent rounded-full"
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
