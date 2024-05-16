import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function PrivateLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        jwtDecode(token);
        console.log(token);
      } catch (error) {
        console.error("Error decoding token:", error.message);
        navigate("/signin");
      }
    } else {
      navigate("/signin");
    }
  }, []);
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default PrivateLayout;
