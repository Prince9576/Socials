import React from "react";
import SearchComponent from "./Search";
import { Image } from "semantic-ui-react";
const CommonNav = ({ user }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "9px",
        backgroundColor: "rgb(33,133,208, 0.95)",
        marginBottom: "1.5rem",
        borderRadius: "3px",
      }}
    >
      <SearchComponent />
      <Image
        style={{
          marginLeft: "10px",
          border: "1px solid white",
        }}
        src={user.profilePicUrl}
        circular
        avatar
        as="a"
        href={`/${user.username}`}
      />
    </div>
  );
};

export default CommonNav;
