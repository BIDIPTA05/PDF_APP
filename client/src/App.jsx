import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Alert from "./components/Alert";
import Dashboard from "./components/Dashboard";
import Files from "./components/Files";
import Info from "./components/Info";
import Login from "./components/Login";
import Details from "./components/Userdetails";
import Register from "./components/register";
import Share from "./components/Share";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/files" element={<Files />} />
        <Route path="/details" element={<Details />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/alert" element={<Alert />} />
        <Route path="/info/:fileName" element={<Info />} />
        <Route path="/fileSharing/pdfs/view" element={<Share />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
