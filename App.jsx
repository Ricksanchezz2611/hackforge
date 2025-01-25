import React, { useState } from 'react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setAnalysisResult('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setAnalysisResult('Please select a file before submitting.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const prediction = data.prediction; // Directly use the value from the backend

        // Check the prediction threshold
        if (prediction < 0.5) {
          setAnalysisResult('The X-ray indicates a healthy state. No pneumonia detected.');
        } else {
          setAnalysisResult('The X-ray suggests pneumonia. Please consult a doctor.');
        }
      } else {
        setAnalysisResult('Failed to analyze the X-ray. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setAnalysisResult('An error occurred while analyzing the X-ray.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dark-theme">
      <header>
        <h1>X-Ray Analysis</h1>
        <p>Upload a chest X-ray to check for signs of pneumonia.</p>
      </header>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Analyze</button>
      </form>

      {loading && <p>Loading... Please wait.</p>}

      {analysisResult && (
        <div className="output">
          <h3>Analysis Result</h3>
          <p>{analysisResult}</p>
        </div>
      )}

      <footer>
        <p>
          Built  by <a href="https://your-portfolio-link">rick sanchez</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
