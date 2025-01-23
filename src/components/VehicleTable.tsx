// src/components/VehicleTable.tsx
import React from 'react';
import { Vehicle } from '../model/Vehicle';
import VehicleImageFetcher from './VehicleImageFetcher';

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
  return (
    <table>
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
              <VehicleImageFetcher vehicle={vehicle}/>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;