import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import PhishEyeDashboard from "./pages/PhishEyeDashboard";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhishEyeDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
