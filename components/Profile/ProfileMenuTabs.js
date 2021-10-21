import React from "react";
import { Dropdown, Icon, Label, Menu } from "semantic-ui-react";
import styles from "./Profile.module.css";

const ProfileMenuTabs = ({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats,
  mobile,
}) => {
  console.log({ loggedUserFollowStats, ownAccount });

  const getFollowers = () => {
    return loggedUserFollowStats.followers.length > 0
      ? loggedUserFollowStats.followers.length
      : 0;
  };

  const getFollowing = () => {
    return loggedUserFollowStats.following.length > 0
      ? loggedUserFollowStats.following.length
      : 0;
  };

  return (
    <Menu
      secondary
      size="mini"
      fluid
      widths={6}
      style={{
        marginTop: "1rem",
        padding: "5px",
        border: "1px solid #eee",
        boxShadow: "none",
        justifyContent: "flex-start",
      }}
    >
      <Menu.Item
        name={mobile ? "" : "Posts"}
        icon={{
          name: "file alternate",
          size: mobile ? "large" : "",
        }}
        active={activeItem === "posts"}
        onClick={() => handleItemClick("posts")}
        className={styles["menu-tab-item"]}
        style={{ marginLeft: "5px !important" }}
      />

      {!mobile && (
        <>
          {ownAccount ? (
            <>
              <Menu.Item
                active={activeItem === "followers"}
                onClick={() => handleItemClick("followers")}
                className={styles["menu-tab-item"]}
                style={{ marginLeft: "5px !important" }}
              >
                Followers
                <Label size="mini" className={styles["menu-tab-label"]}>
                  {getFollowers()}
                </Label>
              </Menu.Item>
              <Menu.Item
                active={activeItem === "following"}
                onClick={() => handleItemClick("following")}
                className={styles["menu-tab-item"]}
                style={{ marginLeft: "5px !important" }}
              >
                Following
                <Label size="mini" className={styles["menu-tab-label"]}>
                  {getFollowing()}
                </Label>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item
                active={activeItem === "followers"}
                onClick={() => handleItemClick("followers")}
                className={styles["menu-tab-item"]}
                style={{ marginLeft: "5px !important" }}
              >
                Followers
                <Label size="mini" className={styles["menu-tab-label"]}>
                  {followersLength}
                </Label>
              </Menu.Item>
              <Menu.Item
                active={activeItem === "following"}
                onClick={() => handleItemClick("following")}
                className={styles["menu-tab-item"]}
                style={{ marginLeft: "5px !important" }}
              >
                {!mobile && "Following"}
                <Label size="mini" className={styles["menu-tab-label"]}>
                  {followingLength}
                </Label>
              </Menu.Item>
            </>
          )}
        </>
      )}

      {ownAccount && (
        <>
          <Menu.Item
            icon={{
              name: "pencil alternate",
              size: mobile ? "large" : "",
            }}
            name={mobile ? "" : "Update"}
            active={activeItem === "update"}
            onClick={() => handleItemClick("update")}
            className={styles["menu-tab-item"]}
            style={{ marginLeft: "5px !important" }}
          />
          <Menu.Item
            icon={{
              name: "setting alternate",
              size: mobile ? "large" : "",
            }}
            name={mobile ? "" : "Settings"}
            active={activeItem === "settings"}
            onClick={() => handleItemClick("settings")}
            className={styles["menu-tab-item"]}
            style={{ marginLeft: "5px !important" }}
          />
        </>
      )}

      {mobile && (
        <>
          {ownAccount ? (
            <Menu.Item
              active={activeItem === "followers" || activeItem === "following"}
              className={styles["menu-tab-item"]}
              style={{ marginLeft: "5px !important" }}
            >
              <Icon name="options" size="large" />
              <Dropdown text="" floating labeled button>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleItemClick("followers")}>
                    Followers
                    <Label size="mini" className={styles["menu-tab-label"]}>
                      {getFollowers()}
                    </Label>
                  </Dropdown.Item>

                  <Dropdown.Item onClick={() => handleItemClick("following")}>
                    Following
                    <Label size="mini" className={styles["menu-tab-label"]}>
                      {getFollowing()}
                    </Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          ) : (
            <Menu.Item
              active={activeItem === "followers" || activeItem === "following"}
              className={styles["menu-tab-item"]}
              style={{ marginLeft: "5px !important" }}
            >
              <Icon name="options" size="large" />
              <Dropdown text="" floating labeled button>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleItemClick("followers")}>
                    Followers
                    <Label size="mini" className={styles["menu-tab-label"]}>
                      {followersLength}
                    </Label>
                  </Dropdown.Item>

                  <Dropdown.Item onClick={() => handleItemClick("following")}>
                    Following
                    <Label size="mini" className={styles["menu-tab-label"]}>
                      {followingLength}
                    </Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </>
      )}
    </Menu>
  );
};

export default ProfileMenuTabs;
