import React, { memo, useRef } from 'react';
import Button from './Button';

/**
 * ImageUpload Compound Component
 * Reusable image upload with preview
 */
const ImageUpload = memo(({
  onUpload,
  preview,
  uploading,
  error,
  label = 'Select Image',
  accept = 'image/*',
}) => {
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current?.click();

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-3">
      {preview && (
        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100">
          <img 
            src={preview} 
            alt="Image preview for upload" 
            width={400}
            height={400}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      )}

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
        <Button
          onClick={handleClick}
          disabled={uploading}
          isLoading={uploading}
          variant={preview ? 'secondary' : 'primary'}
          size="md"
          className="w-full"
        >
          {preview ? 'Change Image' : label}
        </Button>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
