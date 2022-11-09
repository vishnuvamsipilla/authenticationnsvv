import "./index.css";
import React from "react";
import { useState } from "react";

// import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [inputDetails, updateInput] = useState({
    email: "",
  });
  // const history = useNavigate();

  const setValue = (e) => {
    const { name, value } = e.target;
    updateInput({ ...inputDetails, [name]: value });
  };

  const { email } = inputDetails;

  const getUserDetailsDb = async () => {
    const url = "/reset-password";
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
    // if (response.status === 200) {
    //   const { jwtToken } = resData;
    //   Cookies.set("jwt_token", jwtToken);
    //   history("/");
    // } else {
    //   const { data } = resData;

    //   alert(data);
    // }
  };

  const onClickSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      alert("Please enter Email");
    } else if (!email.includes("@")) {
      alert("Please enter valid Email");
    } else {
      getUserDetailsDb();
    }
  };

  return (
    <div className="register-container">
      <h1>Enter your email</h1>

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

        <button type="submit" className="input submit-button">
          send
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
