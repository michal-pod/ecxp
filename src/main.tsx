import React from "react";
import ReactDOM from "react-dom/client";
import "xp.css/dist/XP.css";
import "./styles/global.css";
import "./styles/xp-overrides.css";
import { App } from "./app/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
