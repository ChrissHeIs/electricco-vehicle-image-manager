// src/components/VehicleImageFetcher.tsx
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../model/Vehicle';

interface VehicleImageFetcherProps {
  vehicle: Vehicle;
}

const VehicleImageFetcher: React.FC<VehicleImageFetcherProps> = ({ vehicle }) => {
  const [updatedVehicle, setUpdatedVehicle] = useState<Vehicle>(vehicle);
  const [imageUrls, setImageUrls] = useState<string[] | undefined>();

  // Fetch images for each vehicle
  const fetchImagesForVehicle = async (vehicle: Vehicle) => {
    const apiKey = process.env.REACT_APP_CARSXE_KEY;
  
    if (!apiKey) {
      console.error("API key is missing");
      return;
    }
  
    // Construct the URL using brand and model directly from vehicle
    const url = `/api/images?key=${apiKey}&angle=side&make=${vehicle.brand}&model=${vehicle.model}&transparent=true&color=black&format=json`;
  
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
  
        // Check if images are available and update the specific vehicle
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
  
  

  // Fetch images for vehicles (limited to first 3 vehicles)
  useEffect(() => {
    fetchImagesForVehicle(vehicle);
  }, [vehicle]);

  // Render placeholders or images
  const getImagePlaceholder = () => {
    return <div style={{ width: '100px', height: '100px', backgroundColor: 'lightgray', textAlign: 'center', lineHeight: '100px' }}>Loading...</div>;
  };

  const getErrorPlaceholder = () => {
    return <div style={{ width: '100px', height: '100px', backgroundColor: 'lightgray', textAlign: 'center', lineHeight: '100px' }}>Error</div>;
  };

  return (
    <div>
        {imageUrls ? (
            <div style={{ display: 'flex', gap: '10px' }}>
            {imageUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative' }}>
                {url ? (
                    <img
                    src={url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    style={{ width: '100px', height: '100px', cursor: 'pointer' }}
                    />
                ) : (
                    getErrorPlaceholder()
                )}
                </div>
            ))}
            </div>
        ) : (
            getImagePlaceholder()
        )}
    </div>
  );
};

export default VehicleImageFetcher;
