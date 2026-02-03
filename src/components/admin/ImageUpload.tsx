'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Allow relative URLs (starting with / but not //)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  // Validate absolute URLs using URL API for robust protocol checking
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
    // Invalid URL format
  }

  return '';
}

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label = 'Image',
  placeholder = '/images/example.jpg',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Upload failed');
      }

      const { url } = await res.json();
      onChange(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleUpload(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function clearImage() {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {/* Preview */}
      {value && sanitizeImageUrl(value) && (
        <div className="relative inline-block">
          <img
            src={sanitizeImageUrl(value)}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={clearImage}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
          dragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
          id={`file-upload-${folder}`}
        />

        {uploading ? (
          <div className="py-4">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Uploading...</p>
          </div>
        ) : (
          <label
            htmlFor={`file-upload-${folder}`}
            className="cursor-pointer block py-4"
          >
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="text-primary-600 font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              JPEG, PNG, WebP, GIF (max 5MB)
            </p>
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Or enter URL */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="flex-1 h-px bg-gray-200" />
        <span>or enter URL</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
