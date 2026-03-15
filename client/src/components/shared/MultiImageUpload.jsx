import React, { memo, useRef } from 'react';
import Button from './Button';

/**
 * MultiImageUpload Component
 * Allows selection of multiple product images with one designated as main
 * Main image is used for product thumbnails, others for gallery
 */
const MultiImageUpload = memo(({
  mainImage,
  additionalImages = [],
  onMainImageUpload,
  onAdditionalImageUpload,
  onRemoveAdditionalImage,
  mainUploading,
  additionalUploading,
  error,
  mainImageLabel = 'Select Main Image',
}) => {
  const mainFileInputRef = useRef(null);
  const additionalFileInputRef = useRef(null);

  const handleMainClick = () => mainFileInputRef.current?.click();
  const handleAdditionalClick = () => additionalFileInputRef.current?.click();

  const handleMainChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onMainImageUpload) {
      onMainImageUpload(file);
    }
  };

  const handleAdditionalChange = (e) => {
    const files = e.target.files;
    if (files && onAdditionalImageUpload) {
      // Allow multiple file selection
      Array.from(files).forEach((file) => {
        onAdditionalImageUpload(file);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Image Section */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Main Product Image <span className="text-red-500">*</span>
            <span className="text-xs font-normal text-slate-600 ml-2">(Used for thumbnails)</span>
          </label>
        </div>

        {mainImage && (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-slate-100 border-2 border-slate-900">
            <img 
              src={mainImage} 
              alt="Main product image preview" 
              width={400}
              height={400}
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-2 right-2 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
              Main
            </div>
          </div>
        )}

        <div>
          <input
            ref={mainFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleMainChange}
            className="hidden"
          />
          <Button
            onClick={handleMainClick}
            disabled={mainUploading}
            isLoading={mainUploading}
            variant={mainImage ? 'secondary' : 'primary'}
            size="md"
            className="w-full"
          >
            {mainImage ? 'Change Main Image' : mainImageLabel}
          </Button>
        </div>
      </div>

      {/* Additional Images Section */}
      <div className="space-y-3 pt-4 border-t border-slate-300">
        <div>
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Additional Images <span className="text-xs font-normal text-slate-600 ml-2">(Gallery images)</span>
          </label>
        </div>

        {/* Image Gallery Grid */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {additionalImages.map((imgUrl, idx) => (
              <div key={idx} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-300">
                  <img 
                    src={imgUrl} 
                    alt={`Additional product image ${idx + 1}`}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                </div>
                <button
                  onClick={() => onRemoveAdditionalImage(idx)}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <input
            ref={additionalFileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAdditionalChange}
            className="hidden"
          />
          <Button
            onClick={handleAdditionalClick}
            disabled={additionalUploading}
            isLoading={additionalUploading}
            variant="secondary"
            size="md"
            className="w-full"
          >
            {additionalUploading ? 'Uploading...' : `Add Gallery Images ${additionalImages.length > 0 ? `(${additionalImages.length})` : ''}`}
          </Button>
        </div>

        <p className="text-xs text-slate-600">
          Tip: You can select multiple images at once to add them to the gallery
        </p>
      </div>

      {/* Error Display */}
      {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</p>}
    </div>
  );
});

MultiImageUpload.displayName = 'MultiImageUpload';

export default MultiImageUpload;
