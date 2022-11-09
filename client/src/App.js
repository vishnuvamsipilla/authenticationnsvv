import React from "react";
import { Route, Routes } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import UpdateProfile from "./components/UpdateProfile";
import ResetPassword from "./components/ResetPassword";

import "./App.css";
import ForgotPassword from "./components/ForgotPassword";

const App = () => (
  <div className="app-container">
    <Routes>
      <Route exact path="/register" element={<Register />} />
      <Route exact path="/" element={<Home />} />

      <Route exact path="/login" element={<Login />} />
      <Route exact path="/updateprofile" element={<UpdateProfile />} />
      <Route exact path="/reset-password" element={<ResetPassword />} />
      <Route
        exact
        path="/forgot-password/:id/:token"
        element={<ForgotPassword />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default App;
