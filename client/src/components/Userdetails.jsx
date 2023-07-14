import React from "react";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const [user, setUser] = useState({});
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

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

  if (!userId) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center p-8">
          <h1 className="text-5xl font-bold text-gray-500  mb-10">
            Please Login to view your account details
          </h1>
          <button
            className=" px-4 py-3 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-800 focus:outline-none focus:bg-blue-500 text-lg"
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
      <div className="container mx-auto py-8">
        <h1 className="text-5xl font-bold text-gray-500  mb-10">My Account </h1>
        <div className="bg-blue-100 shadow rounded-lg p-8 border-2 border-blue-500">
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              NAME:
            </label>
            <p className="text-lg text-gray-900">{user.name}</p>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-lg font-bold mb-2">
              E-MAIL:
            </label>
            <p className="text-lg text-gray-900">{user.email}</p>
          </div>
          <div className="mb-6"></div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAccount;
