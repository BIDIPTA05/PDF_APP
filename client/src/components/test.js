import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Alert from "./Alert";

const API_URL = "http://localhost:3000";

const Dashboard = () => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null); // Added state for selected PDF

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

      if (response.ok) {
        setPdfFiles(data.pdfs);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error searching PDF files:", error);
    }
  };

  // Fetch a single PDF
  const fetchSinglePdf = async (fileName) => {
    try {
      const response = await fetch(`${API_URL}/pdfs/${userId}/${fileName}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setSelectedPdf(`${API_URL}/${data.pdf.fileName}`);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching single PDF:", error);
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
                <a
                  href={`${API_URL}/${file.fileName}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {file.displayName}
                </a>
                <div>
                  <button
                    onClick={() => handleDeletePdf(file.fileName)}
                    className="bg-red-500 text-white px-3 py-2 rounded-md mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => fetchSinglePdf(file.fileName)}
                    className="bg-green-500 text-white px-3 py-2 rounded-md"
                  >
                    View
                  </button>
                </div>
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

      {selectedPdf && (
        <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
          <embed
            src={selectedPdf}
            type="application/pdf"
            width="100%"
            height="600px"
            className="border border-gray-300 rounded-md"
          />
          <button
            className="bg-red-500 text-white px-3 py-2 rounded-md absolute top-4 right-4"
            onClick={() => setSelectedPdf(null)}
          >
            Close
          </button>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Dashboard;








//info.jsx
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_URL = "http://localhost:3000";

const PDFViewer = () => {
  const { fileName } = useParams();
  const userId = localStorage.getItem("userId");
  const pdfUrl = `${API_URL}/pdfs/${userId}/${fileName}`;

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex overflow-auto">
        {pdfUrl ? (
          <embed src={pdfUrl} type="application/pdf" className="flex-grow" />
        ) : (
          <p>Loading PDF...</p>
        )}

        <div className="w-1/4 flex flex-col overflow-auto">
          <div className="m-3 pt-0">
            <input
              type="text"
              placeholder="Enter your Email Address here"
              className="px-3 py-3 placeholder-gray-600 text-gray-600 relative bg-white  rounded text-sm border-10 border-black shadow outline-none focus:outline-none focus:ring w-full"
            />
          </div>
          <div className="flex items-center px-4 py-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ">
              Share
            </button>
          </div>
          <div className="flex mt-10 ml-4 mr-4">
            <h1 className="bg-green-500 text-white px-10 py-3 rounded-3xl font-bold">
              COMMENTS
            </h1>
          </div>
          <div className="flex-grow overflow-auto">
            <div className="h-screen"></div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFViewer;






//info with
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const API_URL = "http://localhost:3000";

const PDFViewer = () => {
  const { fileName } = useParams();
  const userId = localStorage.getItem("userId");
  const pdfUrl = `${API_URL}/pdfs/${userId}/${fileName}`;

  const [email, setEmail] = useState("");
  const [shareLink, setShareLink] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [previousEmail, setPreviousEmail] = useState("");
  const [comment, setComment] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSharePDF = async () => {
    try {
      if (!validateEmail(email)) {
        console.log("Invalid email address");
        setError("Invalid email address");
        return;
      }
      setError("");

      if (email === previousEmail) {
        console.log("Share link already created for this E-Mail:", shareLink);
        setWarning("Share link already created for this E-Mail");
        return;
      }
      setPreviousEmail(email);
      setWarning("");
      const response = await fetch(
        `${API_URL}/pdfs/${fileName}/generate-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const shareLink = data.data.token;

        setShareLink(
          `${window.location.origin}/pdfs/view?token=${shareLink}&email=${email}`
        );
      } else {
        console.error("Error sharing PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(`${API_URL}/pdfs/${fileName}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          message: comment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Optional: Log the response data

        // Reset comment input
        setComment("");
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />

      <div className="flex-grow flex overflow-auto">
        {pdfUrl ? (
          <embed src={pdfUrl} type="application/pdf" className="flex-grow" />
        ) : (
          <p>Loading PDF...</p>
        )}

        <div className="w-1/4 flex flex-col overflow-auto">
          <div className="m-3 pt-0">
            <input
              id="email"
              type="email"
              placeholder="Enter your Email Address here"
              className="px-3 py-3 placeholder-gray-600 text-gray-600 relative bg-white  rounded text-sm border-10 border-black shadow outline-none focus:outline-none focus:ring w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            />
          </div>
          <div className="ml-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <div className="ml-3">
            {warning && <p className="text-yellow-500 text-sm">{warning}</p>}
          </div>

          <div className="flex items-center px-4 py-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSharePDF}
            >
              Generate Share link
            </button>
          </div>
          {shareLink && (
            <div className="mt-4 mx-4">
              <p>Share link:</p>
              <a href={shareLink} target="_blank" rel="noopener noreferrer">
                {shareLink}
              </a>
            </div>
          )}
          <div className="flex mt-10 ml-4 mr-4 justify-center">
            <h1 className="bg-green-500 text-white px-10 py-3 rounded-3xl font-bold">
              COMMENTS
            </h1>
          </div>
          <div className="flex-grow overflow-auto">
            <div className="h-screen">
              {/* Comment input */}
              <div className="mt-4 mx-4">
                <textarea
                  placeholder="Add a comment..."
                  className="w-full px-3 py-2 placeholder-gray-600 text-gray-600 bg-white rounded text-sm border-10 border-black shadow outline-none focus:outline-none focus:ring"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
              </div>
              <div className="flex items-center justify-center mt-2">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handleAddComment}
                >
                  Add Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFViewer;
