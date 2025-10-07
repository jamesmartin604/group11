import React, { useState } from "react";
import JSZip from "jszip";

export default function FileUpload() {
  const [textContent, setTextContent] = useState("");
  const [error, setError] = useState("");

  const handleFileUpload = async (event) => {
    setError("");
    setTextContent("");

    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      setError("Please upload a .zip file.");
      return;
    }

    try {
      // Read zip file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();

      // Load with JSZip
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Find the .txt file inside
      const txtFileName = Object.keys(zip.files).find((name) =>
        name.endsWith(".txt")
      );

      if (!txtFileName) {
        setError("No .txt file found inside the ZIP.");
        return;
      }

      // Read the .txt file content
      const txtFile = zip.files[txtFileName];
      const content = await txtFile.async("text");

      setTextContent(content);
    } catch (err) {
      console.error(err);
      setError("Error reading the ZIP file.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Upload a ZIP containing a .txt file</h2>
      <input type="file" accept=".zip" onChange={handleFileUpload} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {textContent && (
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
          <h3>Contents of the .txt file:</h3>
          <p>{textContent}</p>
        </div>
      )}
    </div>
  );
}
