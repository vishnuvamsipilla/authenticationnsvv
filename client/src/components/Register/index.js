import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";
// import axios from "axios";

const Register = () => {
  const [showPassword, toggleShowPassword] = useState(false);

  const [inputDetails, updateInput] = useState({
    name: "",
    email: "",
    mobileNo: "",
    place: "",
    password: "",
  });
  const history = useNavigate();

  const setValue = (e) => {
    const { name, value } = e.target;
    updateInput({ ...inputDetails, [name]: value });
  };
  const getUserDetailsDb = async () => {
    const url = "/register";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputDetails),
    };

    const response = await fetch(url, options);
    const resData = await response.json();
    const { data } = resData;

    if (response.status === 200) {
      alert("user added successfully");
      history("/login");
    } else {
      alert(data);
    }
  };
  const onClickSubmit = (e) => {
    e.preventDefault();
    if (name === "") {
      alert("Please enter Name");
    } else if (email === "") {
      alert("Please enter Email");
    } else if (!email.includes("@")) {
      alert("Please enter valid Email");
    } else if (mobileNo === "") {
      alert("Please enter Mobile Number");
    } else if (place === "") {
      alert("Please enter Place");
    } else if (password === "") {
      alert("Please enter Password");
    } else if (password.length < 8) {
      alert("Password must contain atleast 8 chars");
    } else {
      // const options = {
      //   method: "POST",

      //   body: JSON.stringify(inputDetails),
      // };
      getUserDetailsDb();
    }
  };

  const { name, email, mobileNo, place, password } = inputDetails;

  return (
    <div className="register-container">
      <h1>Sign Up</h1>
      <form onSubmit={onClickSubmit} className="form-container">
        <div className="input-container">
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            id="name"
            onChange={setValue}
            value={name}
            className="input"
          />
        </div>
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
          <label htmlFor="mobileNo" className="label">
            Mobile Number
          </label>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            name="mobileNo"
            onChange={setValue}
            value={mobileNo}
            id="mobileNo"
            className="input"
          />
        </div>
        <div className="input-container">
          <label htmlFor="place" className="label">
            Place
          </label>
          <input
            type="text"
            placeholder="Enter Place"
            name="place"
            onChange={setValue}
            value={place}
            id="place"
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
          submit
        </button>
        <p className="link-eliment">
          Already registered?<Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};
export default Register;
