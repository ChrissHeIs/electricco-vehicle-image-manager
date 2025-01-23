// src/components/VehicleTable.tsx
import React from 'react';
import { Vehicle } from '../model/Vehicle';
import VehicleImageFetchingList from './VehicleImageFetchingList';
import './VehicleTable.css'
import OverrideImage from './OverrideImage';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {  
  const handleImageChange = (newImage: string | null) => {
    // setImage(newImage); // Update image in parent state
  };
  
  return (     
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
              <OverrideImage image={null} onChange={handleImageChange} />
            </td>              
            <td>               
              <VehicleImageFetchingList vehicle={vehicle}/>             
            </td>          
          </tr>         
        ))}       
      </tbody>     
    </table>   
  ); 
};

export default VehicleTable;