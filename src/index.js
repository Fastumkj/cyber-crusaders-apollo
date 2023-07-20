// index.js file acts as the entry point for your React application's rendering process and
// establishes the connection between your React components and the HTML DOM.
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/App.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import LoginForm from "./components/LoginForm";
import Navigation from "./Navigation";
/*import SignUp from "./components/SignUp";*/
import { HashRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

/*root.render(
  <React.StrictMode>
    <LoginForm />
  </React.StrictMode>
);*/
root.render(
  <React.StrictMode>
    <Router>
      {App}
      <Navigation />
    </Router>
  </React.StrictMode>
);
