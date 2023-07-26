import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignUp from "./components/SignUp";
import App from "./App";
import Game from "./Game";
import Profile from "./Profile";

const Navigation = () => {
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", true.toString());
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route
        path="/home"
        element={
          localStorage.getItem("isLoggedIn") ? (
            <>
              <App />
            </>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/Profile" element={<Profile />}></Route>
      <Route path="/Game/:id" element={<Game from="/App" />} />
      <Route path="/*" element={<Navigate to="/login" />} />{" "}
      {/* Add this route */}
    </Routes>
  );
};

export default Navigation;
