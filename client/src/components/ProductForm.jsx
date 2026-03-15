import React, { useMemo } from 'react';
import { useProductForm } from '../hooks';
import { Button, Input, Select, Alert, Card, ImageUpload } from './shared';
import { BRANDS_BY_CATEGORY } from '../constants/navigation';

/**
 * ProductForm Component - Refactored with composition patterns
 * Uses custom hooks and shared components for clean, maintainable code
 * Supports both creating new and editing existing products
 */
const ProductForm = ({ onProductCreated, categories, productToEdit = null }) => {
  const {
    formData,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
    loading,
    uploading,
    message,
    imagePreview,
    uploadError,
    availableBrands,
    isEditing,
  } = useProductForm(onProductCreated, productToEdit);

  // Memoize category options to avoid recreation on every render
  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ label: cat, value: cat })),
    [categories]
  );

  // Memoize brand options to avoid recreation on every render
  const brandOptions = useMemo(
    () => availableBrands.map((brand) => ({ label: brand, value: brand })),
    [availableBrands]
  );

  const handleCategoryChange = (e) => {
    handleInputChange(e);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
      <Card.Header>
        <h2 className="text-2xl font-display font-bold text-slate-900">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h2>
      </Card.Header>

      <Card.Body className="space-y-6">
        <Alert
          type={message.type === 'error' ? 'error' : 'success'}
          message={message.text}
        />

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <Input
            label="Product Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., iPhone 15 Pro Max"
            containerClassName="space-y-2"
          />

          {/* Price */}
          <Input
            label="Price (₹)"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            placeholder="e.g., 149999"
            min="0"
            step="0.01"
            containerClassName="space-y-2"
          />

          {/* Category */}
          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            containerClassName="space-y-2"
          />

          {/* Brand */}
          <Select
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            options={brandOptions}
            containerClassName="space-y-2"
          />

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent placeholder:text-slate-500 transition-all"
              placeholder="Enter product description..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-900">
              Product Image
            </label>
            <ImageUpload
              onUpload={handleImageUpload}
              preview={imagePreview}
              uploading={uploading}
              error={uploadError}
              label="Choose Image"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-slate-100 rounded-lg">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-5 h-5 cursor-pointer accent-slate-900"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-slate-900 cursor-pointer"
            >
              Mark as featured product (appears in hero section)
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={loading}
            disabled={loading || uploading}
            size="lg"
            className="w-full"
          >
            {loading ? (isEditing ? 'Updating Product...' : 'Creating Product...') : (isEditing ? 'Update Product' : 'Create Product')}
          </Button>
        </form>
      </Card.Body>
    </Card>
  );
};

export default ProductForm;
