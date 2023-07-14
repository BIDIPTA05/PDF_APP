import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Alert from "./Alert";

const API_URL = "http://localhost:3000";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    try {
      setShowAlert(false);
      const formData = new FormData();
      formData.append("pdfFile", selectedFile);
      formData.append("userId", userId);

      const response = await fetch(`${API_URL}/pdfs/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setShowAlert(true);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }

    setSelectedFile(null);
  };

  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-gray-500 mb-10">
            Please Login to Perform any operation
          </h1>
          <button
            className="px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-500 text-lg"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center p-8">
        <label className="block text-center mb-4 text-gray-700">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          {selectedFile ? (
            <span className="font-semibold">{selectedFile.name}</span>
          ) : (
            <span className="font-semibold text-2xl">Select a PDF file</span>
          )}
        </label>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className={`py-2 px-4 rounded-md text-xl ${
            selectedFile
              ? "bg-blue-500 text-white"
              : "bg-blue-400 text-white cursor-not-allowed"
          }`}
        >
          Upload
        </button>
      </div>
      {showAlert && (
        <Alert
          closeModal={() => setShowAlert(false)}
          popup="Upload Successful"
          desc="Your PDF is Successfully uploaded, view your PDF in Dashboard"
        />
      )}
      <Footer />
    </>
  );
};

export default FileUpload;
