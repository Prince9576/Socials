import React from "react";
import SearchComponent from "./Search";
import { Icon, Image } from "semantic-ui-react";
import { useRouter } from "next/router";
const CommonNav = ({ user }) => {
  const router = useRouter();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "9px",
        backgroundColor: "rgb(33,133,208, 0.95)",
        marginBottom: "1.5rem",
        borderRadius: "3px",
      }}
    >
      <div>
        {router.pathname === "/messages" && (
          <Icon
            name="arrow circle left"
            size="large"
            style={{ color: "white", cursor: "pointer" }}
            onClick={() => router.push("/")}
          />
        )}
      </div>
      <div style={{ display: "flex", height: "28px" }}>
        <SearchComponent />
        <Image
          style={{
            marginLeft: "10px",
            border: "1px solid white",
            height: "28px",
            width: "28px",
          }}
          src={user.profilePicUrl}
          circular
          avatar
          as="a"
          href={`/${user.username}`}
        />
      </div>
    </div>
  );
};

export default CommonNav;
