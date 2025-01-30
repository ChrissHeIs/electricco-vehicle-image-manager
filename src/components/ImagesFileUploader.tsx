import React, { useState } from 'react';
import { Vehicle } from '../model/Vehicle';

interface VehicleWithImage extends Vehicle {
    imageUrl: string;
}

interface ImagesFileUploaderProps {
    isDisabled: boolean
    onGetVehicleImages: (vehicleImages: [Vehicle, string][]) => void;
}

const ImagesFileUploader: React.FC<ImagesFileUploaderProps> = ({isDisabled, onGetVehicleImages}) => {
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        
        if (!file) return;
        
        try {
            if (!file.name.endsWith('.json')) {
                throw new Error('Please select a JSON file');
            }

            const text = await file.text();
            const data = JSON.parse(text);

            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('Invalid file format: Expected an array');
            }

            const isValidVehicle = (v: any): v is VehicleWithImage => 
                typeof v.brand === 'string' &&
                typeof v.model === 'string' &&
                typeof v.year === 'string' &&
                typeof v.imageUrl === 'string';

            if (!data.every(isValidVehicle)) {
                throw new Error('Invalid file format: Some vehicles are missing required fields');
            }

            onGetVehicleImages(data.map((vehicleWithImage) => [vehicleWithImage, vehicleWithImage.imageUrl]) )
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load file');
        }

        // Reset file input
        event.target.value = '';
    };

    return (
        <div>
            <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                style={{display:'none'}}
                id="vehicleImageFile"
            />
            <button 
                onClick={() => document.getElementById('vehicleImageFile')?.click()}
                disabled={isDisabled}
            >
                Load Vehicle Images from JSON
            </button>
            {error && (
                <p>{error}</p>
            )}
        </div>
    )
}

export default ImagesFileUploader