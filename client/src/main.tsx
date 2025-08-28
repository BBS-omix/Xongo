// client/src/main.tsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// 👇 add this import
import { Router } from "wouter";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Make routes work under /Xongo/ on GitHub Pages */}
    <Router base={import.meta.env.BASE_URL}>
      <App />
    </Router>
  </React.StrictMode>
);
