import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const [user, setUser] = useState({});
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  //get loggedin user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/profile`, {
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

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setLoggedIn(false);
  };

  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1
                className="text-white font-bold text-xl cursor-pointer"
                onClick={() => navigate("/dashboard")}
              >
                My Dashboard
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            {loggedIn ? (
              <>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2  rounded-md text-sm font-medium "
                  onClick={() => navigate("/files")}
                >
                  Upload
                </a>
                <a
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2  rounded-md text-sm font-medium "
                  onClick={() => navigate("/details")}
                >
                  My Account
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium border-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                onClick={() => navigate("/")}
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md border-2 text-sm font-medium"
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
