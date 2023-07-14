import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:3000";

const PDFViewer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const fileName = searchParams.get("fileName");
  const pdfUrl = `${API_URL}/fileSharing/pdfs/info/${token}`;
  const viewPdfUrl = `${API_URL}/fileSharing/view/pdf/${token}`;
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");

  //fetch pdf file
  useEffect(() => {
    const fetchPdfFile = async () => {
      try {
        const response = await fetch(pdfUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          console.log(data);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching PDF file:", error);
      }
    };

    fetchPdfFile();
  }, []);
  console.log(fileName);

  // Add comment
  const handleAddComment = async () => {
    try {
      const response = await fetch(`${API_URL}/pdfs/${fileName}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          message: commentInput,
        }),
      });
      console.log(fileName);

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        setCommentInput(""); // Clear the comment input field
      } else {
        console.error("Error adding comment:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Get comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${API_URL}/pdfs/comments/${fileName}`);
        if (response.ok) {
          const data = await response.json();
          console.log("import", data.comments);
          setComments(data.comments);
        } else {
          throw new Error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [fileName]);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex-grow flex overflow-auto">
        {viewPdfUrl ? (
          <embed
            src={viewPdfUrl}
            type="application/pdf"
            className="flex-grow"
          />
        ) : (
          <p>Loading PDF...</p>
        )}

        <div className="w-1/4 flex flex-col overflow-auto">
          <div className="mt-16 mx-4">
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
          <div className="mt-8 ml-4 mr-4">
            <h1 className="bg-green-500 text-white text-l px-10 py-3 rounded-l font-bold text-center">
              COMMENTS
            </h1>
          </div>
          <div className="flex-grow overflow-auto">
            <div className="h-screen">
              <div className="flex-grow overflow-auto mt-2 ml-4 mr-4">
                <div className="flex-grow overflow-auto mt-2">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div
                        key={comment._id}
                        className="px-4 py-2 bg-orange-300 rounded-lg shadow-md mb-4"
                      >
                        <p className="text-gray-800 font-bold mb-1">
                          {comment.email}
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
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
