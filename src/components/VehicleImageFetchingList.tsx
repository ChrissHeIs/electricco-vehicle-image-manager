import React, { useState, useEffect, useRef } from 'react';
import { Vehicle } from '../model/Vehicle';
import './VehicleImageFetchingList.css';
import ZoomOverlayImage from './ZoomOverlayImage';

interface VehicleImageFetcherProps {
  vehicle: Vehicle;
  setSelectedURL: (vehicleURL: string) => void;
}

const VehicleImageFetchingList: React.FC<VehicleImageFetcherProps> = ({ vehicle, setSelectedURL }) => {
  const [imageUrls, setImageUrls] = useState<string[] | undefined>();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
  const [successfulImageIndeces, setSuccessfulImageIndeces] = useState<Set<number>>(new Set());
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchImagesForVehicle = async (vehicle: Vehicle) => {
    const apiKey = process.env.REACT_APP_CARSXE_KEY;
    const proxyUrl = process.env.REACT_APP_PROXY_URL;

    if (!apiKey) {
      console.error("API key is missing");
      return;
    }

    const apiUrl = encodeURIComponent(`https://api.carsxe.com/images?key=${apiKey}&angle=side&make=${vehicle.brand}&model=${vehicle.model}&transparent=true&color=black&format=json`);
    const url = `${proxyUrl}/api/proxy?url=${apiUrl}`;
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

  const handleImageClick = (index: number) => {
    if (successfulImageIndeces.has(index) && Array.isArray(imageUrls)) {
      setSelectedImageIndex(index);
      setSelectedURL(imageUrls[index]);
    }
  };

  const markSuccessfulImageLoad = (index: number) => {
    const indices = new Set(successfulImageIndeces);
    indices.add(index);
    setSuccessfulImageIndeces(indices);
  };

  const handleImageZoom = (url: string) => {
    setOverlayImageUrl(url);
  };

  const closeOverlay = () => {
    setOverlayImageUrl(null);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Silencing the error message
    e.preventDefault();
  };

  // Add intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Only fetch images when component is in view
  useEffect(() => {
    if (isInView) {
      fetchImagesForVehicle(vehicle);
    }
  }, [vehicle, isInView]);

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {isInView && imageUrls ? (
        <div className="image-grid">
          {imageUrls.map((url, i) => (
            <div key={i} className={`image-item ${selectedImageIndex === i ? 'image-item-selected' : ''}`} onClick={() => handleImageClick(i)}>
              {url ? (
                <div className='image-container'>
                  <img
                    src={url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="vehicle-image"
                    onError={handleError}
                    onLoad={() => markSuccessfulImageLoad(i)}
                  />
                </div>
              ) : (
                <div className="image-placeholder">Error</div>
              )}
              {successfulImageIndeces.has(i) ? (
                <div className='zoom-icon-container' onClick={(e) => {
                  e.stopPropagation();
                  handleImageZoom(url);
                }}>
                  <img src='https://cdn-icons-png.flaticon.com/128/71/71403.png' width="20" height="20" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="image-placeholder">Loading...</div>
      )}
      {overlayImageUrl && (
        <ZoomOverlayImage imageURL={overlayImageUrl} onClose={closeOverlay} />
      )}
    </div>
  );
};

export default VehicleImageFetchingList;