// src/utils/csvParser.ts
import Papa from 'papaparse';

export const parseAndFilterCsv = (csvData: string, onSuccess: (vehicles: any[]) => void) => {
  Papa.parse(csvData, {
    complete: (result) => {
      const vehicles = result.data
        .filter((row: any) => row.reliability >= 3)  // Filter by reliability
        .map((row: any) => ({
          brand: row.brand,
          model: row.model,
          year: row.year,
          images: [],
        }));
      onSuccess(vehicles);  // Return the filtered vehicles
    },
    header: true,
  });
};
