// src/components/OverrideImage.tsx
import React, { useState, useEffect } from 'react';

interface OverrideImageProps {
  image: string | null; // Nullable image URL passed from outside
  onChange: (image: string | null) => void; // Callback to update the parent state
}

const OverrideImage: React.FC<OverrideImageProps> = ({ image, onChange }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);

  // Handle image upload from file input
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        onChange(reader.result as string); // Notify parent with new image
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image URL paste (from clipboard or text field)
  const handlePasteUrl = async () => {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText && isValidUrl(clipboardText)) {
      setPasteUrl(clipboardText);
      onChange(clipboardText); // Notify parent with the new URL
    } else {
      alert("No valid URL in clipboard");
    }
  };

  // Remove image (set it to null)
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setPasteUrl(null);
    onChange(null); // Notify parent with null image
  };

  // Helper function to check if the URL is valid
  const isValidUrl = (url: string) => {
    try {
      new URL(url); // Try to parse the URL
      return true;
    } catch (err) {
      return false;
    }
  };

  // Determine the image to display
  const currentImage = image || uploadedImage || pasteUrl;

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '110px' }}>
      {/* If no image, show buttons */}
      {!currentImage ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={handlePasteUrl}>Paste URL</button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <img
            src={currentImage}
            alt="Uploaded or Pasted"
            style={{ width: '110px', height: '100px', objectFit: 'cover' }}
          />
          <button
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: 'transparent',
              border: 'none',
              color: 'red',
              fontSize: '20px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default OverrideImage;
