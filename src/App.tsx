import React, { useState } from "react";
import CsvUploader from "./components/CsvUploader"; // Handles CSV parsing
import VehicleImageFetchingList from "./components/VehicleImageFetchingList"; // Handles image fetching
import { Vehicle } from "./model/Vehicle"; // Assuming Vehicle type is defined somewhere
import VehicleTable from "./components/VehicleTable";

const App: React.FC = () => {
  const [updatedVehicles, setUpdatedVehicles] = useState<Vehicle[]>([]);
  const [isShowingThirdPartyImages, setIsShowingThirdPartyImages] = useState<boolean>(false);

  // Automatically trigger image fetching in VehicleImageFetcher after CSV is loaded
  const handleCsvLoaded = (vehicles: Vehicle[]) => {
    setUpdatedVehicles(vehicles); // Set the updated list of vehicles
  };

  const showThirdPartyImages = () => {
    setIsShowingThirdPartyImages(true);
  }

  const processNewVehicleImages = (vehicleImages: [Vehicle, string][]) => {
    console.log(vehicleImages);
  }

  return (
    <div>
      <h1>Vehicle Image Manager</h1>

      {/* CSV Upload or URL Parsing */}
      <CsvUploader setUpdatedVehicles={handleCsvLoaded} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={showThirdPartyImages} disabled={updatedVehicles.length == 0}>Load 3rd-party images</button>
        <button disabled={true}>Load images from server</button>
      </div>

      {/* Show the list of vehicles in a table and fetch images */}
      <VehicleTable 
        vehicles={updatedVehicles.slice(0, 3) /* Limit to first 3 vehicles for debuggings*/} 
        shouldShowThirdPartyImages={isShowingThirdPartyImages}
        continueWithVehicleURLS={processNewVehicleImages}
      />
    </div>
  );
};

export default App;