'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, AlertCircle, Copy, Check } from 'lucide-react';

interface AdUploadFormProps {
  businessId: string;
  packageId: string;
  packageName: string;
  packagePrice: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function AdUploadForm({
  businessId,
  packageId,
  packageName,
  packagePrice,
  billingCycle,
  onSuccess,
  onError,
}: AdUploadFormProps) {
  const [formData, setFormData] = useState({
    adTitle: '',
    destinationUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB for regular, 15MB for large packages)
    const maxSize = packageId === 'advert5' || packageId === 'promotions' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be under ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form
      if (!formData.adTitle.trim()) {
        throw new Error('Ad title is required');
      }
      if (!formData.destinationUrl.trim()) {
        throw new Error('Destination URL is required');
      }
      if (!imageFile) {
        throw new Error('Please select an image');
      }

      // Validate URL
      try {
        new URL(formData.destinationUrl);
      } catch {
        throw new Error('Please enter a valid URL (e.g., https://example.com)');
      }

      // Upload image to cloud storage (Supabase/AWS S3)
      // For now, we'll use a data URL or upload to a temporary storage
      // In production, this should upload to Supabase/S3
      const imageUrl = await uploadImage(imageFile);

      if (!imageUrl) {
        throw new Error('Failed to upload image');
      }

      // Create advertising subscription via API
      const response = await fetch('/api/advertising/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          packageId,
          adTitle: formData.adTitle,
          adImageUrl: imageUrl,
          destinationUrl: formData.destinationUrl,
          billingCycle,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create ad subscription');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create ad subscription');
      }

      setCheckoutData(result.checkout);
      setSuccess(true);

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      if (onError) {
        onError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('businessId', businessId);

    const response = await fetch('/api/advertising/upload-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to upload image');
    }

    const result = await response.json();
    return result.imageUrl;
  };

  const proceedToPayment = async () => {
    if (!checkoutData) return;

    try {
      setLoading(true);
      console.log('[ProceedToPayment] Starting payment process...');

      // Step 1: Call initiate.trans via server proxy to get PAY_REQUEST_ID
      console.log('[ProceedToPayment] Step 1: Calling /api/advertising/initiate');
      const initiateResponse = await fetch('/api/advertising/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          params: checkoutData.params,
          reference: checkoutData.params.REFERENCE,
        }),
      });

      if (!initiateResponse.ok) {
        const data = await initiateResponse.json();
        throw new Error(data.error || 'Failed to initiate payment');
      }

      const initiateData = await initiateResponse.json();
      const payRequestId = initiateData.payRequestId;
      console.log('[ProceedToPayment] ✅ Got PAY_REQUEST_ID:', payRequestId);

      // Step 2: Get process.trans parameters
      console.log('[ProceedToPayment] Step 2: Calling /api/advertising/process');
      const processResponse = await fetch('/api/advertising/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payRequestId,
          reference: checkoutData.params.REFERENCE,
        }),
      });

      if (!processResponse.ok) {
        const data = await processResponse.json();
        throw new Error(data.error || 'Failed to get process parameters');
      }

      const processData = await processResponse.json();
      console.log('[ProceedToPayment] ✅ Got process parameters');

      // Step 3: Auto-submit form to PayGate's process.trans
      console.log('[ProceedToPayment] Step 3: Submitting to process.trans');
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = processData.processUrl;

      Object.entries(processData.params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      console.log('[ProceedToPayment] Redirecting to PayGate...');
      form.submit();
    } catch (error) {
      console.error('[ProceedToPayment] Error:', error);
      setError(error instanceof Error ? error.message : 'Payment submission failed');
      setLoading(false);
    }
  };

  if (success && checkoutData) {
    return (
      <div className="space-y-4">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
            <Check className="w-5 h-5" />
            Ad Created Successfully!
          </div>
          <p className="text-green-600 text-sm mb-4">
            Your ad "{formData.adTitle}" is ready for payment.
          </p>
        </div>

        {/* Ad Preview */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Ad Preview</h3>
          <div className="bg-white border rounded-lg p-3 mb-3">
            {imagePreview && (
              <div className="relative h-32 w-full mb-2">
                <Image
                  src={imagePreview}
                  alt="Ad preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <h4 className="font-semibold text-sm">{formData.adTitle}</h4>
            <p className="text-xs text-gray-600 truncate">{formData.destinationUrl}</p>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-3">Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Package:</span>
              <span className="font-semibold">{packageName}</span>
            </div>
            <div className="flex justify-between">
              <span>Billing Cycle:</span>
              <span className="font-semibold">{billingCycle}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Total Amount:</span>
              <span className="font-bold text-lg">N${packagePrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Buttons */}
        <div className="flex gap-3">
          <button
            onClick={proceedToPayment}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </button>
          <button
            onClick={() => {
              setSuccess(false);
              setCheckoutData(null);
              setFormData({ adTitle: '', destinationUrl: '' });
              setImageFile(null);
              setImagePreview('');
            }}
            disabled={loading}
            className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
          >
            Create Another
          </button>
        </div>

        {/* Debug Info (dev only) */}
        <details className="text-xs text-gray-600 mt-4">
          <summary className="cursor-pointer">Checkout Info (Debug)</summary>
          <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-32 text-xs">
            {JSON.stringify(checkoutData, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Ad Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Ad Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="adTitle"
          value={formData.adTitle}
          onChange={handleInputChange}
          maxLength={100}
          placeholder="e.g., Sprint Courier Services"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          {formData.adTitle.length}/100 characters
        </p>
      </div>

      {/* Destination URL */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Destination URL <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-600 mb-2">
          Where customers will be directed when they click your ad
        </p>
        <input
          type="text"
          name="destinationUrl"
          value={formData.destinationUrl}
          onChange={handleInputChange}
          placeholder="https://yourbusiness.com/services"
          disabled={loading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          Include https:// or http:// prefix
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Ad Image <span className="text-red-500">*</span>
        </label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-3 relative h-32 border rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* File Input */}
        <label className="relative block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition bg-gray-50">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            className="hidden"
          />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-gray-700">
            {imageFile ? imageFile.name : 'Click to upload image'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, GIF up to 5MB (
            {packageId === 'advert5' || packageId === 'promotions' ? '15MB' : '5MB'}
            )
          </p>
        </label>
      </div>

      {/* Package Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-gray-700">{packageName}</span>
            <span className="font-semibold">N${packagePrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-600">
            {billingCycle === 'MONTHLY' ? 'Per month' : 'Per year'}
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating Ad...
          </>
        ) : (
          'Create Ad & Continue to Payment'
        )}
      </button>
    </form>
  );
}
