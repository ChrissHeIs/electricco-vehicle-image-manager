// src/components/VehicleTable.tsx
import React from 'react';

interface Vehicle {
  brand: string;
  model: string;
  year: string;
  images: string[];
}

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
              {vehicle.images.length > 0 ? (
                vehicle.images.map((image, idx) => (
                  <img key={idx} src={image} alt={`${vehicle.brand} ${vehicle.model}`} />
                ))
              ) : (
                <span>Loading...</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default VehicleTable;