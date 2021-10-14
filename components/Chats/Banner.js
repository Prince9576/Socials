import React from "react";

const Banner = ({ bannerData }) => {
  return (
    <div
      style={{
        backgroundColor: "#f4f4f4",
        height: "3.85rem",
        width: "100%",
        padding: "7px",
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <img className="custom-avatar" src={bannerData.profilePicUrl} />
      <div
        style={{
          fontSize: "1rem",
          fontWeight: "600",
          marginLeft: "7px",
        }}
      >
        {bannerData.name}
      </div>
    </div>
  );
};

export default Banner;
