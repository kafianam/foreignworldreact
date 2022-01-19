import React from "react";
import banner from "../asset/images/profile-3.jpg";

export const Banner = () => {
  return (
    <div className="home--banner mb-2 mb-md-4">
      <img src={banner} alt="" className="hero w-100" />
    </div>
  );
};
