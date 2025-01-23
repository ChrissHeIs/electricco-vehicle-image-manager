// src/components/VehicleTable.tsx
import React from 'react';
import { Vehicle } from '../model/Vehicle';
import VehicleImageFetchingList from './VehicleImageFetchingList';
import './VehicleTable.css'

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {   
  return (     
    <table className="vehicle-table">       
      <thead>         
        <tr>           
          <th>Brand</th>           
          <th>Model</th>           
          <th>Year</th>           
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
              <VehicleImageFetchingList vehicle={vehicle}/>             
            </td>           
          </tr>         
        ))}       
      </tbody>     
    </table>   
  ); 
};

export default VehicleTable;