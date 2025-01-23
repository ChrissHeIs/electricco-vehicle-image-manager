// src/components/VehicleImageFetcher.tsx
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../model/Vehicle';
import './VehicleImageFetchingList.css'; 

interface VehicleImageFetcherProps {
  vehicle: Vehicle;
}

const VehicleImageFetchingList: React.FC<VehicleImageFetcherProps> = ({ vehicle }) => {
  const [updatedVehicle, setUpdatedVehicle] = useState<Vehicle>(vehicle);
  const [imageUrls, setImageUrls] = useState<string[] | undefined>();

  const fetchImagesForVehicle = async (vehicle: Vehicle) => {
    const apiKey = process.env.REACT_APP_CARSXE_KEY;

    if (!apiKey) {
      console.error("API key is missing");
      return;
    }

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

  useEffect(() => {
    fetchImagesForVehicle(vehicle);
  }, [vehicle]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      {imageUrls ? (
        <div className="image-grid">
          {imageUrls.map((url, i) => (
            <div key={i} className="image-item">
              {url ? (
                <img
                  src={url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="vehicle-image"
                />
              ) : (
                <div className="image-placeholder">Error</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="image-placeholder">Loading...</div>
      )}
    </div>
  );
};

export default VehicleImageFetchingList;

