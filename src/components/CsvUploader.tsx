// src/components/CsvUploader.tsx
import React, { useState } from 'react';
import Papa from 'papaparse';
import { Vehicle } from '../model/Vehicle';

interface CsvUploaderProps {
  setUpdatedVehicles: (vehicles: Vehicle[]) => void; // Prop to set the vehicles in the parent
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ setUpdatedVehicles }) => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCsvLoaded = (result: Papa.ParseResult<any>) => {
    try {
      const filteredData = result.data.filter((vehicle: any) => vehicle.reliability >= 3);
      setUpdatedVehicles(filteredData);
      setVehicles(filteredData);
    } catch (e) {
      setError('Error parsing CSV file');
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          console.log(result);
          handleCsvLoaded(result);
        },
        error: (error) => {
          setError('Error reading CSV file');
          setLoading(false);
        },
      });
    }
  };

  const handleURLDownloadAndParse = async () => {
    setLoading(true);
    setError(null);

    try {
      const proxyForCSV = "https://corsproxy.io/";
      const url = `${proxyForCSV}${process.env.REACT_APP_CSV_URL}`;
      const response = await fetch(url);
      const text = await response.text();
      const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
      console.log(parsed);

      handleCsvLoaded(parsed);
    } catch (error) {
      setError('Error downloading or parsing CSV');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={handleURLDownloadAndParse}>Download and Parse CSV from Enode</button>
        <p>OR</p>
  <     input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default CsvUploader;
