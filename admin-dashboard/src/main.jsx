import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; 
import App from "./App.jsx";
import './config/env'; // Import environment variable validation

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
