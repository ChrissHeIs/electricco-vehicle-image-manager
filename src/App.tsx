import React, { useState } from "react";
import CsvUploader from "./components/CsvUploader"; // Handles CSV parsing
import VehicleImageFetcher from "./components/VehicleImageFetcher"; // Handles image fetching
import { Vehicle } from "./model/Vehicle"; // Assuming Vehicle type is defined somewhere
import VehicleTable from "./components/VehicleTable";

const App: React.FC = () => {
  const [updatedVehicles, setUpdatedVehicles] = useState<Vehicle[]>([]);

  // Automatically trigger image fetching in VehicleImageFetcher after CSV is loaded
  const handleCsvLoaded = (vehicles: Vehicle[]) => {
    setUpdatedVehicles(vehicles); // Set the updated list of vehicles
  };

  return (
    <div>
      <h1>Vehicle Image Manager</h1>

      {/* CSV Upload or URL Parsing */}
      <CsvUploader setUpdatedVehicles={handleCsvLoaded} />

      {/* Show the list of vehicles in a table and fetch images */}
      <VehicleTable vehicles={updatedVehicles.slice(0, 3) /* Limit to first 3 vehicles for debuggings*/}/>
      {/*<VehicleImageFetcher vehicles={updatedVehicles} />*/}
    </div>
  );
};

export default App;