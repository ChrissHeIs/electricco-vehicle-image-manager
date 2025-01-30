import React, { useState } from "react";
import CsvUploader from "./components/CsvUploader"; // Handles CSV parsing
import VehicleImageFetchingList from "./components/VehicleImageFetchingList"; // Handles image fetching
import { Vehicle } from "./model/Vehicle"; // Assuming Vehicle type is defined somewhere
import VehicleTable from "./components/VehicleTable";
import { exportVehicleData } from "./utils/VehicleJSONGenerator";
import ImagesFileUploader from "./components/ImagesFileUploader";

type VehicleImagePair = [Vehicle, string];

function areVehiclesEqual(v1: Vehicle, v2: Vehicle): boolean {
  return (
    v1.brand === v2.brand &&
    v1.model === v2.model &&
    v1.year === v2.year
  );
}

function mergeVehicleImages(
  originalImages: VehicleImagePair[],
  overriddenImages: VehicleImagePair[]
): VehicleImagePair[] {
  const result = [...originalImages];

  overriddenImages.forEach(([overriddenVehicle, overriddenUrl]) => {
    const existingIndex = result.findIndex(([vehicle]) => 
      areVehiclesEqual(vehicle, overriddenVehicle)
    );

    if (existingIndex >= 0) {
      // Replace existing entry
      result[existingIndex] = [overriddenVehicle, overriddenUrl];
    } else {
      // Append new entry
      result.push([overriddenVehicle, overriddenUrl]);
    }
  });

  return result;
}

const App: React.FC = () => {
  const [vehicleImagesFromServer, setVehicleImagesFromServer] = useState<[Vehicle, string][]>([])
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
    const mergedList = mergeVehicleImages(vehicleImagesFromServer, vehicleImages)
    exportVehicleData(mergedList)
  }

  const handleVehicleImagesFromJSONFile = (vehicleImages: [Vehicle, string][]) => {
    setVehicleImagesFromServer(vehicleImages)
  }

  return (
    <div>
      <h1>Vehicle Image Manager</h1>

      {/* CSV Upload or URL Parsing */}

      {/* Show the list of vehicles in a table and fetch images */}
      <div>
        <CsvUploader setUpdatedVehicles={handleCsvLoaded} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={showThirdPartyImages} disabled={updatedVehicles.length == 0}>Load 3rd-party images</button>
          <ImagesFileUploader isDisabled={updatedVehicles.length == 0} onGetVehicleImages={handleVehicleImagesFromJSONFile} />
        </div>
        <VehicleTable 
          vehicles={updatedVehicles/*.slice(0, 3) Limit to first 3 vehicles for debuggings*/} 
          serverImages={vehicleImagesFromServer}
          shouldShowThirdPartyImages={isShowingThirdPartyImages}
          continueWithVehicleURLS={processNewVehicleImages}
        />
      </div>
    </div>
  );
};

export default App;