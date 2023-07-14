import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Alert from "./Alert";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000";

const Dashboard = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPdfFiles();
  }, []);

  const fetchPdfFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/pdfs/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setPdfFiles(data.pdfs);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching PDF files:", error);
    }
  };

  const handleDeletePdf = async (fileId) => {
    try {
      setShowAlert(false);
      const response = await fetch(`${API_URL}/pdfs/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Remove the deleted PDF file from the state
        setPdfFiles((prevFiles) =>
          prevFiles.filter((file) => file.fileName !== fileId)
        );
        console.log(response);
        console.log(data.message);
        setShowAlert(true);
      } else {
        console.log(data.error);
      }
    } catch (error) {
      console.error("Error deleting PDF file:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${API_URL}/pdfs/search/${userId}?q=${searchQuery}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);

      if (response.ok) {
        setPdfFiles(data.pdfs);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error("Error searching PDF files:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-3xl font-bold text-gray-500 mb-4">
          Dashboard | All PDFs
        </h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search PDFs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3"
            onKeyDown={(event) => {
              console.log(event.key);
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-3 rounded-md ml-2"
          >
            Search
          </button>
        </div>
        {pdfFiles.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4">
            {pdfFiles.map((file) => (
              <li
                key={file.fileName}
                className="p-4 border border-gray-300 rounded-md flex justify-between items-center pdf-list-item"
              >
                <Link to={`/info/${file.fileName}`}>{file.displayName}</Link>
                <button
                  onClick={() => handleDeletePdf(file.fileName)}
                  className="bg-red-500 text-white px-3 py-2 rounded-md"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No PDF files uploaded yet.</p>
        )}
      </div>
      {showAlert && (
        <Alert
          closeModal={() => setShowAlert(false)}
          popup="Deleted Successful"
          desc="PDF deleted Successfully"
        />
      )}

      <Footer />
    </>
  );
};

export default Dashboard;
