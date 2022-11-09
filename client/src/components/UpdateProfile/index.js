import React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const UpdateProfile = () => {
  const [inputDetails, updateInput] = useState({
    name: "",
    mobileNo: "",
    place: "",
  });
  const history = useNavigate();

  const setValue = (e) => {
    const { name, value } = e.target;
    updateInput({ ...inputDetails, [name]: value });
  };
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    history("/login");
  }
  const getUserDetails = async () => {
    const url = "/updateprofile";
    const options = {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(inputDetails),
    };
    const response = await fetch(url, options);
    const data = response.json();
    if (response.status === 200) {
      alert("user details updated successfully");
      history("/");
    } else {
      alert(data);
    }
  };
  const onClickSubmit = (e) => {
    e.preventDefault();
    if (name === "") {
      alert("Please enter Name");
    } else if (mobileNo === "") {
      alert("Please enter Mobile Number");
    } else if (place === "") {
      alert("Please enter Place");
    } else {
      getUserDetails();
    }
  };

  const { name, mobileNo, place } = inputDetails;

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

        <button type="submit" className="input submit-button">
          submit
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
