// src/App.tsx
import React, { useState } from 'react';
import CsvUploader from './components/CsvUploader';
import VehicleTable from './components/VehicleTable';

const App: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Update vehicles after parsing from file
  const handleFileParsed = (newVehicles: any[]) => {
    setVehicles(newVehicles);
  };

  // Update vehicles after parsing from URL
  const handleUrlParsed = (newVehicles: any[]) => {
    setVehicles(newVehicles);
  };

  return (
    <div className="App">
      <h1>Vehicle Image Manager</h1>

      <CsvUploader onFileParsed={handleFileParsed} onUrlParsed={handleUrlParsed} />
      <VehicleTable vehicles={vehicles} />
    </div>
  );
};

export default App;
