import React, { useState, useEffect } from "react";
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
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [user, setUser] = useState({});
  const token = localStorage.getItem("token");
  const loggedInUser = user.email ? user.email : "";

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userId,
          }),
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (error) {
        console.error(error);
        // Handle error and show appropriate message to the user
      }
    };
    fetchUser();
  }, []);

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

      setWarning("");
      const response = await fetch(
        `${API_URL}/fileSharing/pdfs/${fileName}/generate-link`,
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
        console.log(data);
        const shareLink = data.data.token;

        setShareLink(
          `${
            window.location.origin
          }/fileSharing/pdfs/view?token=${shareLink}&email=${email}&fileName=${encodeURIComponent(
            fileName
          )}`
        );
      } else {
        console.error("Error sharing PDF:", response.statusText);
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    // const data = {
    //   email: loggedInUser,
    //   message: commentInput,
    // };
    try {
      const response = await fetch(`${API_URL}/pdfs/${fileName}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loggedInUser,
          message: commentInput,
        }),
      });
      console.log(fileName);

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);

        setCommentInput(""); // Clear the comment input field
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  //console.log(comments);

  //Get comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        console.log("COMMENT-> ", API_URL, fileName);
        const response = await fetch(`${API_URL}/pdf/${fileName}/comments`);
        if (response.ok) {
          const data = await response.json();
          //console.log("ERRORRR->>> ", data);
          //console.log("import", data.comments);
          setComments(data.comments);
        } else {
          throw new Error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments->>> ", error);
      }
    };
    fetchComments();
  }, [fileName]);

  console.log(fileName);
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
          <div className="m-3 pt-0 ">
            <h1 className="my-3 text-blue-500">
              Enter the E-Mail address to share this PDF:
            </h1>

            <input
              id="email"
              type="email"
              placeholder="Enter your Email Address here"
              className="px-4 py-3 placeholder-gray-600 text-gray-600 bg-white rounded-lg text-sm border-2 border-gray-400 shadow outline-none focus:outline-none focus:ring w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            />
          </div>
          <div className="ml-3">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {warning && <p className="text-yellow-500 text-sm">{warning}</p>}
          </div>
          <div className="flex items-center px-4 py-2 justify-center mb-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
              onClick={handleSharePDF}
            >
              Generate Share link
            </button>
          </div>
          {shareLink && (
            <div className="mt-4 mx-4">
              <p className="text-xl font-semibold text-gray-500">
                Share link ::
              </p>
              <a href={shareLink} target="_blank" rel="noopener noreferrer">
                {shareLink}
              </a>
            </div>
          )}
          {/* Comment input */}
          <div className="mt-2 mx-4">
            <textarea
              placeholder="Add a comment..."
              className="w-full px-4 py-3 placeholder-gray-600 text-gray-600 bg-white rounded-lg text-sm border-2 border-gray-400 resize-none outline-none focus:outline-none focus:ring"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            ></textarea>
          </div>

          <div className="flex items-center justify-center mt-2">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full "
              onClick={handleAddComment}
            >
              Add Comment
            </button>
          </div>
          <div className="mt-3 ml-4 mr-4">
            <h1 className="bg-green-500 text-white text-l px-10 py-3 rounded-l font-bold text-center">
              COMMENTS
            </h1>
          </div>
          {/* Display comments */}
          <div className="flex-grow overflow-auto mt-2 ml-4 mr-4">
            <div className="flex-grow overflow-auto mt-2">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="px-4 py-2 bg-orange-300 rounded-lg shadow-md mb-4"
                  >
                    <p className="text-gray-800 font-bold mb-1">
                      {comment.email && comment.email}
                    </p>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                ))
              ) : (
                <p>No comments available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PDFViewer;
