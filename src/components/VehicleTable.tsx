// src/components/VehicleTable.tsx
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../model/Vehicle';
import VehicleImageFetchingList from './VehicleImageFetchingList';
import './VehicleTable.css'
import './VehicleImageFetchingList.css';
import OverrideImage from './OverrideImage';
import LazyImage from './LazyImage';
import ZoomOverlayImage from './ZoomOverlayImage';

interface VehicleTableProps {
  vehicles: Vehicle[];
  serverImages: [Vehicle, string][]
  shouldShowThirdPartyImages: boolean;
  continueWithVehicleURLS: (vehicleUrls: [Vehicle, string][]) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, serverImages, shouldShowThirdPartyImages, continueWithVehicleURLS }) => {  
  const [serverImagesMap, setServerImagesMap] = useState<Record<string, string>>({});
  const [imageURLsToUse, setImageURLsToUse] = useState<Map<number, string>>(new Map());
  const [singleRowsToLoad, setSingleRowsToLoad] = useState<Set<number>>(new Set())
  const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);

  const handleImageChange = (newImage: string | null, vehicleIndex: number) => {
    const newMap = new Map(imageURLsToUse); // Clone the existing map to avoid direct mutation

    if (newImage !== null) {
      newMap.set(vehicleIndex, newImage);
    } else {
      newMap.delete(vehicleIndex);
    }
    setImageURLsToUse(newMap);
  };

  useEffect(() => {
    // Transform serverImages into a Record whenever it changes
    const newImageMap = serverImages.reduce((acc, [vehicle, imageUrl]) => {
        // Create a unique key for each vehicle
        const key = mapKeyForVehicle(vehicle);
        acc[key] = imageUrl;
        return acc;
    }, {} as Record<string, string>);

    setServerImagesMap(newImageMap);
  } , [serverImages]); // Only re-run when serverImages changes

  const mapKeyForVehicle = (vehicle: Vehicle): string => {
    return `${vehicle.brand}|${vehicle.model}`
  }

  const handleURLSelected = (url: string, vehicleIndex: number) => {
    const newMap = new Map(imageURLsToUse);  
    newMap.set(vehicleIndex, url); 
    setImageURLsToUse(newMap);
  }

  const serverImageURL = (vehicle: Vehicle): string => {
    const serverBaseURL = process.env.REACT_APP_BACKEND_BASE_URL
    const encodedBrand = encodeURIComponent(vehicle.brand)
    const encodedModel = encodeURIComponent(vehicle.model)
    return `${serverBaseURL}/vehicles/vehicle-image?brand=${encodedBrand}&model=${encodedModel}`
  }

  const handleContinue = () => {
    const vehicleUrls: [Vehicle, string][] = [];
    vehicles.forEach((vehicle, index) => {
      const newImage = imageURLsToUse.get(index);
      if (newImage !== undefined) {
        vehicleUrls.push([vehicle, newImage]);
      }
    });
    continueWithVehicleURLS(vehicleUrls);
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log("Handling error")
      // Silencing the error message
     e.preventDefault();
     e.currentTarget.src = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpng.pngtree.com%2Fpng-vector%2F20221125%2Fourmid%2Fpngtree-no-image-available-icon-flatvector-illustration-thumbnail-graphic-illustration-vector-png-image_40966590.jpg&f=1&nofb=1&ipt=28abe953bd8ce93c15c0e20cd9cc187634b4c367c0e674386ff9da85aa22ed19&ipo=images"
  };

  const handleLoadSingleRow = (index: number) => {
    const set = new Set(singleRowsToLoad);
    set.add(index)
    setSingleRowsToLoad(set)
    console.log(singleRowsToLoad)
  }

  const handleImageZoom = (url: string) => {
    setOverlayImageUrl(url);
  };

  const closeOverlay = () => {
    setOverlayImageUrl(null);
  };
  
  return ( 
    <div>
      <table className="vehicle-table">       
        <thead>         
          <tr>           
            <th>Brand</th>           
            <th>Model</th>           
            <th>Year</th>
            <th>Current server image</th>   
            <th>Custom</th>          
            <th>Images</th>    
          </tr>       
        </thead>       
        <tbody>         
          {vehicles.map((vehicle, index) => (           
            <tr key={index}>             
              <td>{vehicle.brand}</td>             
              <td>{vehicle.model}</td>             
              <td>{vehicle.year}</td> 
              <td>
                <div className='image-item'>
                  <LazyImage src={serverImagesMap[mapKeyForVehicle(vehicle)]} width="110" onError={handleError}/>
                  <div className='zoom-icon-container' onClick={(e) => {
                    e.stopPropagation();
                    handleImageZoom(serverImageURL(vehicle));
                  }}>
                    <img src='https://cdn-icons-png.flaticon.com/128/71/71403.png' width="20" height="20" />
                  </div>
                </div>
              </td>
              <td style={{ width:'110px'}}>
                <OverrideImage image={null} onChange={(url: string | null) => handleImageChange(url, index)} />
              </td>              
              <td> 
                {(shouldShowThirdPartyImages || singleRowsToLoad.has(index)) ? (              
                  <VehicleImageFetchingList vehicle={vehicle} setSelectedURL={(url: string) => handleURLSelected(url, index)}/>             
                ) : (
                  <button onClick={() => handleLoadSingleRow(index)}>Load only this row</button>
                )}
              </td>          
            </tr>         
          ))}       
        </tbody>     
      </table>  
      <button className='pinned-button' onClick={handleContinue} disabled={imageURLsToUse.size == 0}>Download file</button>
      {overlayImageUrl && (
        <ZoomOverlayImage imageURL={overlayImageUrl} onClose={closeOverlay} />
      )}
    </div> 
  ); 
};

export default VehicleTable;