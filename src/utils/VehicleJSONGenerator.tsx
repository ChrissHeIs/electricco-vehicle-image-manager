import { Vehicle } from "../model/Vehicle";

interface VehicleWithImage extends Vehicle {
    imageUrl: string;
}

export const exportVehicleData = (vehicles: [Vehicle, string][]) => {
    // Convert to the preferred format and pick only needed fields
    const formattedData: VehicleWithImage[] = vehicles.map(([vehicle, imageUrl]) => ({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        imageUrl
    }));

    // Create the JSON blob
    const jsonString = JSON.stringify(formattedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'VehicleImages.json';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};