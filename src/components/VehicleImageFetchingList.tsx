// src/components/VehicleImageFetcher.tsx
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../model/Vehicle';
import './VehicleImageFetchingList.css'; 

interface VehicleImageFetcherProps {
  vehicle: Vehicle;
  setSelectedURL: (vehicleURL: string) => void;
}

const VehicleImageFetchingList: React.FC<VehicleImageFetcherProps> = ({ vehicle, setSelectedURL }) => {
  const [imageUrls, setImageUrls] = useState<string[] | undefined>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // Track selected image
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null); // Image URL for overlay
  const [successfulImageIndeces, setSuccessfulImageIndeces] = useState<Set<number>>(new Set())

  const fetchImagesForVehicle = async (vehicle: Vehicle) => {
    const apiKey = process.env.REACT_APP_CARSXE_KEY;
    const proxyUrl = process.env.REACT_APP_PROXY_URL;

    if (!apiKey) {
      console.error("API key is missing");
      return;
    }

    const apiUrl = encodeURIComponent(`https://api.carsxe.com/images?key=${apiKey}&angle=side&make=${vehicle.brand}&model=${vehicle.model}&transparent=true&color=black&format=json`);
    const url = `${proxyUrl}?url=${apiUrl}`;
    try {
      const res = await fetch(url);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Error fetching images: ${res.status} - ${errorText}`);
        return;
      }

      const contentType = res.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Response JSON:", data);

        if (data.images && Array.isArray(data.images)) {
            setImageUrls(data.images.map((img: any) => img.link));
        }
      } else {
        const text = await res.text();
        console.error("Expected JSON but got a different response:", text);
      }
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  // Handle image cell click
  const handleImageClick = (index: number) => {
    if (successfulImageIndeces.has(index) &&  Array.isArray(imageUrls))  {
      setSelectedImageIndex(index); // Set the clicked image as selected
      setSelectedURL(imageUrls[index]);
    };
  };

  const markSuccessfulImageLoad = (index: number) => {
    const indices = successfulImageIndeces;
    indices.add(index);
    setSuccessfulImageIndeces(indices);
  };

  // Show the overlay with the larger image
  const handleImageZoom = (url: string) => {
    setOverlayImageUrl(url); // Set the URL for the larger image in the overlay
  };

  // Hide the overlay
  const closeOverlay = () => {
    setOverlayImageUrl(null); // Just clear the URL to close the overlay
  };

  useEffect(() => {
    fetchImagesForVehicle(vehicle);
  }, [vehicle]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {imageUrls ? (
        <div className="image-grid">
          {imageUrls.map((url, i) => (
            <div key={i} className={`image-item ${selectedImageIndex === i ? 'image-item-selected' : ''}` } onClick={() => handleImageClick(i)}>
              {url ? (
                <div className='image-container'>
                  <img
                    src={url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="vehicle-image"
                    onLoad={() => markSuccessfulImageLoad(i)}
                  />
                </div>
              ) : (
                <div className="image-placeholder">Error</div>
              )}
              { successfulImageIndeces.has(i) ? (
                <div className='zoom-icon-container' onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the row click
                  handleImageZoom(url); // Open the larger image in the overlay
                }}>
                  <img src='https://cdn-icons-png.flaticon.com/128/71/71403.png' width="20" height="20"/>
                </div>
              ) : ( 
                null 
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="image-placeholder">Loading...</div>
      )}
      {/* Image Overlay */}
      {overlayImageUrl && (
        <div
          style={{
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
          onClick={closeOverlay} // Close overlay when clicking outside the image
        >
          <div
            style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <img
              src={overlayImageUrl || ''}
              alt="Zoomed Image"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
              }}
            />
            <button
              onClick={closeOverlay}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleImageFetchingList;

