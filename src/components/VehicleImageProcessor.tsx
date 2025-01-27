import React, { useState } from 'react';
import JSZip from 'jszip';
import { Vehicle } from '../model/Vehicle';

// Maximum iPhone screen width (iPhone 14 Pro Max)
const MAX_WIDTH = 430;

interface VehicleImageProcessorProps {
  vehicleURLs: [Vehicle, string][];
}

const VehicleImageProcessor: React.FC<VehicleImageProcessorProps> = ({ vehicleURLs }) => {
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadAndProcessImage = async (url: string) => {
    console.log(url);
    const encodedURL = encodeURIComponent(url);
    const proxyUrl = process.env.REACT_APP_PROXY_URL;
    const proxiedUrl = `https://corsproxy.io/${encodedURL}`;
    console.log(proxiedUrl);
    const response = await fetch(proxiedUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
    const blob = await response.blob();
    return createImageBitmap(blob);
  };

  const scaleImage = (img: ImageBitmap): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Calculate new dimensions
    let width = img.width;
    let height = img.height;
    
    if (width > MAX_WIDTH) {
      const ratio = MAX_WIDTH / width;
      width = MAX_WIDTH;
      height = Math.round(height * ratio);
    }
    
    canvas.width = width;
    canvas.height = height;
    
    // Draw image with transparency
    ctx.drawImage(img, 0, 0, width, height);
    
    // Convert to PNG blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Could not create blob');
        resolve(blob);
      }, 'image/png');
    });
  };

  const processVehicles = async () => {
    try {
      setIsProcessing(true);
      const zip = new JSZip();

      const vehicleImages = zip.folder("VehicleImages");
      if (!vehicleImages) throw new Error('Could not create top folder');
      
      for (let i = 0; i < vehicleURLs.length; i++) {
        const [vehicle, url] = vehicleURLs[i];
        
        // Create folder structure
        const sanitizedBrand = sanitizeStringForFilename(vehicle.brand)
        const brandFolder = vehicleImages.folder(sanitizedBrand);  // Create brand subfolder
        if (!brandFolder) throw new Error('Could not create brand folder');
        
        // Download and process image
        const img = await downloadAndProcessImage(url);
        const scaledBlob = await scaleImage(img);
        
        // Add to zip with model name
        const sanitizedModel = sanitizeStringForFilename(vehicle.model)
        brandFolder.file(`${sanitizedModel}.png`, scaledBlob)
        
        // Update progress
        setProgress(Math.round(((i + 1) / vehicleURLs.length) * 100));
      }
      
      // Generate and trigger download
      const content = await zip.generateAsync({ type: "blob" });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'vehicle_images.zip';
      a.click();
      URL.revokeObjectURL(downloadUrl);
      
    } catch (error) {
      console.error('Error processing images:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={processVehicles}
        disabled={isProcessing}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
      >
        {isProcessing ? 'Processing...' : 'Download Images'}
      </button>
      
      {isProcessing && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Processing: {progress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default VehicleImageProcessor;

export function sanitizeStringForFilename(stringToSanitize: string): string {
	// WARNING: If yu change this ensure that it is also changed in Vehicle-image-manager project
	// Remove or replace invalid characters
	return stringToSanitize
	  // Replace spaces with underscores
	  .replace(/\s+/g, '_')
	  // Remove non-alphanumeric characters except underscores and hyphens
	  .replace(/[^a-zA-Z0-9_-]/g, '')
	  // Convert to lowercase for consistency
	  .toLowerCase()
	  // Trim leading/trailing periods and spaces
	  .replace(/^[.\s]+|[.\s]+$/g, '')
}