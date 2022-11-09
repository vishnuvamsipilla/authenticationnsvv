import "./index.css";
import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [showPassword, toggleShowPassword] = useState(false);
  // const [showCPassword, toggleShowCPassword] = useState(false);
  // const [showError, toggleError] = useState(false);
  const [inputDetails, updateInput] = useState({
    email: "",
    password: "",
  });
  const history = useNavigate();

  const setValue = (e) => {
    const { name, value } = e.target;
    updateInput({ ...inputDetails, [name]: value });
  };

  const { email, password } = inputDetails;

  const getUserDetailsDb = async () => {
    const url = "/login";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputDetails),
    };

    const response = await fetch(url, options);
    const resData = await response.json();
    console.log(resData);
    if (response.status === 200) {
      const { jwtToken } = resData;
      Cookies.set("jwt_token", jwtToken);
      history("/");
    } else {
      const { data } = resData;

      alert(data);
    }
  };

  const onClickSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      alert("Please enter Email");
    } else if (!email.includes("@")) {
      alert("Please enter valid Email");
    } else if (password === "") {
      alert("Please enter Password");
    } else {
      getUserDetailsDb();
    }
  };

  return (
    <div className="register-container">
      <h1>Welcome back,Log in</h1>
      <p>Hi! we are glad you are back.Please log in</p>
      <form onSubmit={onClickSubmit} className="form-container">
        <div className="input-container">
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            type="text"
            placeholder="Enter Email"
            name="email"
            onChange={setValue}
            value={email}
            id="email"
            className="input"
          />
        </div>

        <div className="input-container">
          <label htmlFor="password" className="label">
            password
          </label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              name="password"
              onChange={setValue}
              value={password}
              id="password"
              className="password-input"
            />
            <button
              type="button"
              onClick={() => toggleShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>
        {/* {showError && <p>error </p>} */}
        <button type="submit" className="input submit-button">
          Log in
        </button>
        <p className="link-eliment">
          Dont have ancount?<Link to="/register">Sign Up</Link>
        </p>
        <p className="link-eliment">
          Forgot Password? <Link to="/reset-password">click here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
