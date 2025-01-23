// src/components/CsvUploader.tsx
import React, { useState } from 'react';
import { parseAndFilterCsv } from '../utils/csvParser';

interface CsvUploaderProps {
  onFileParsed: (vehicles: any[]) => void;
  onUrlParsed: (vehicles: any[]) => void;
}

const CsvUploader: React.FC<CsvUploaderProps> = ({ onFileParsed, onUrlParsed }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setCsvFile(file);
  };

  // Parse the uploaded CSV
  const handleFileParse = () => {
    if (!csvFile) return;
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        parseAndFilterCsv(event.target.result as string, (vehicles) => {
          onFileParsed(vehicles); // Return parsed vehicles from file
          setLoading(false);
        });
      }
    };
    reader.readAsText(csvFile);  // Read file content as text
  };

  const handleURLDownloadAndParse = async () => {
    console.log(process.env.REACT_APP_PROXY_URL)
    console.log(process.env.REACT_APP_CSV_URL)
    const url = process.env.REACT_APP_PROXY_URL + process.env.REACT_APP_CSV_URL;  // Use the CORS proxy URL
    setLoading(true);

    try {
      console.log('Fetching CSV from URL:', url);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const text = await response.text();
      console.log('Raw CSV file content:', text);

      parseAndFilterCsv(text, (vehicles) => {
        console.log('CSV parsed and filtered successfully:', vehicles);
        onUrlParsed(vehicles);
        setLoading(false);
      });
    } catch (error) {
      console.error('Error downloading or parsing CSV:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleURLDownloadAndParse} disabled={loading}>
        Download and parse from URL
      </button>

      {loading && <p>Loading...</p>}

      <p>OR</p>

      <input type="file" accept=".csv" onChange={handleFileChange} disabled={loading} />
      <button onClick={handleFileParse} disabled={loading}>
        Upload and Parse CSV
      </button>
    </div>
  );
};

export default CsvUploader;
