// src/components/VehicleTable.tsx
import React, { useState } from 'react';
import { Vehicle } from '../model/Vehicle';
import VehicleImageFetchingList from './VehicleImageFetchingList';
import './VehicleTable.css'
import OverrideImage from './OverrideImage';

interface VehicleTableProps {
  vehicles: Vehicle[];
  shouldShowThirdPartyImages: boolean;
  continueWithVehicleURLS: (vehicleUrls: [Vehicle, string][]) => void;
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles, shouldShowThirdPartyImages, continueWithVehicleURLS }) => {  
  const [imageURLsToUse, setImageURLsToUse] = useState<Map<number, string>>(new Map());

  const handleImageChange = (newImage: string | null, vehicleIndex: number) => {
    const newMap = new Map(imageURLsToUse); // Clone the existing map to avoid direct mutation

    if (newImage !== null) {
      newMap.set(vehicleIndex, newImage);
    } else {
      newMap.delete(vehicleIndex);
    }
    setImageURLsToUse(newMap);
  };

  const handleURLSelected = (url: string, vehicleIndex: number) => {
    const newMap = new Map(imageURLsToUse);  
    newMap.set(vehicleIndex, url); 
    setImageURLsToUse(newMap);
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
  
  return ( 
    <div>
      <table className="vehicle-table">       
        <thead>         
          <tr>           
            <th>Brand</th>           
            <th>Model</th>           
            <th>Year</th>   
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
              <td style={{ width:'110px'}}>
                <OverrideImage image={null} onChange={(url: string | null) => handleImageChange(url, index)} />
              </td>              
              <td> 
                {shouldShowThirdPartyImages ? (              
                <VehicleImageFetchingList vehicle={vehicle} setSelectedURL={(url: string) => handleURLSelected(url, index)}/>             
                ) : (
                  null
                )}
              </td>          
            </tr>         
          ))}       
        </tbody>     
      </table>  
      <button onClick={handleContinue} disabled={imageURLsToUse.size == 0}>Continue</button>
    </div> 
  ); 
};

export default VehicleTable;