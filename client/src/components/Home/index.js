import React from "react";
import { useState, useEffect } from "react";
import { LineWave } from "react-loader-spinner";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

import "./index.css";
const Home = () => {
  const [isLoading, toggleApiStatus] = useState(true);
  const [userDetails, updateUserDetails] = useState({ email: "", name: "" });

  const history = useNavigate();

  const getUserDetails = async () => {
    const jwtToken = Cookies.get("jwt_token");
    const url = "/users";
    const options = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    const resData = await response.json();
    console.log(resData);
    if (response.status === 200) {
      const { data } = resData;
      toggleApiStatus(false);

      updateUserDetails(data);
    } else {
      history("/login");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);
  const renderLoaderView = () => {
    return (
      <LineWave
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="line-wave"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        firstLineColor=""
        middleLineColor=""
        lastLineColor=""
      />
    );
  };

  const renderHomeView = () => {
    const { email, name } = userDetails;
    const initial = name[0];
    const onClickLogOut = () => {
      Cookies.remove("jwt_token");
      history("/login");
    };
    return (
      <div className="home-container">
        <div className="header">
          <div className="initial-container">
            <h1>{initial}</h1>
          </div>
          <div className="buttons-container">
            <button className="button" onClick={onClickLogOut}>
              Log out
            </button>
            <Link to="/updateProfile">
              <button className="button">Update Profile</button>
            </Link>
          </div>
        </div>
        <div className="description-container">
          <FaUserAlt className="icon" />
          <div className="text-container">
            <p className="name">Hi {name}</p>
            <p className="email">{email}</p>
          </div>
        </div>
      </div>
    );
  };

  return isLoading ? renderLoaderView() : renderHomeView();
};

export default Home;
