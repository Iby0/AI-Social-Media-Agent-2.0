import React, { useState, useRef } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { UploadCloud, Image as ImageIcon, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { MediaCategory } from '../../database/types';
import { formatBytes, fileToBase64 } from '../../services/media/media.utils';
import { validateMediaFile } from '../../services/media/media.validation';

interface UploadBoxProps {
  onUploadSuccess: (file: File, category: MediaCategory) => Promise<void>;
  onCancel?: () => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({ onUploadSuccess, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<MediaCategory>('Uploaded Image');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    setErrorMessage(null);
    setWarningMessage(null);

    const validation = validateMediaFile(file);

    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Invalid file.');
      return;
    }

    if (validation.isDuplicate && validation.error) {
      setWarningMessage(validation.error);
    }

    setSelectedFile(file);
    try {
      const base64 = await fileToBase64(file);
      setPreviewUrl(base64);
    } catch {
      setErrorMessage('Failed to generate image preview.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(20);

    // Simulated smooth progress updates
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    try {
      await onUploadSuccess(selectedFile, category);
      setUploadProgress(100);
      setTimeout(() => {
        clearInterval(interval);
        setIsUploading(false);
        handleReset();
      }, 300);
    } catch (err: any) {
      clearInterval(interval);
      setIsUploading(false);
      setErrorMessage(err?.message || 'Failed to complete media upload.');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    setWarningMessage(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Card variant="default" className="bg-slate-900 border-slate-800">
      <CardContent className="p-5 space-y-4">
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFileChange(e.target.files[0]);
            }
          }}
        />

        {!selectedFile ? (
          /* Dropzone Area */
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleSelectClick}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 hover:bg-slate-950/80'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <UploadCloud className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  Drag & Drop media files here, or <span className="text-indigo-400 underline">browse</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PNG, JPG, JPEG, WEBP up to 10 MB. Offline IndexedDB storage.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Selected File Preview Mode */
          <div className="space-y-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                    {selectedFile.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {formatBytes(selectedFile.size)} • {selectedFile.type || 'image'}
                  </p>
                </div>
              </div>

              {!isUploading && (
                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
              <label className="text-xs font-medium text-slate-300">
                Media Target Category:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
                disabled={isUploading}
                className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Uploaded Image">Uploaded Image</option>
                <option value="AI Generated">AI Generated</option>
                <option value="Post Image">Post Image</option>
                <option value="Temporary File">Temporary File</option>
              </select>
            </div>

            {/* Upload Progress Bar */}
            {isUploading && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="h-3 w-3 animate-spin text-indigo-400" />
                    Optimizing & Storing Media...
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Warnings or Error Alerts */}
            {warningMessage && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{warningMessage}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleReset();
                  if (onCancel) onCancel();
                }}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirmUpload}
                disabled={isUploading}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                {isUploading ? 'Uploading...' : 'Save to Media Library'}
              </Button>
            </div>
          </div>
        )}

        {/* Global Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
