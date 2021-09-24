import React from "react";
import { Label, Menu } from "semantic-ui-react";

const ProfileMenuTabs = ({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats,
}) => {
  console.log({ loggedUserFollowStats, ownAccount });
  const menuItemStyle = {
    marginLeft: "5px !important",
    minHeight: "36px",
  };
  const labelStyle = {
    marginTop: "3px",
    marginLeft: "5px !important",
  };
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
        name="posts"
        icon="file alternate"
        active={activeItem === "posts"}
        onClick={() => handleItemClick("posts")}
        style={menuItemStyle}
      />

      {ownAccount ? (
        <>
          <Menu.Item
            active={activeItem === "followers"}
            onClick={() => handleItemClick("followers")}
            style={menuItemStyle}
          >
            Followers
            <Label size="mini" style={labelStyle}>
              {getFollowers()}
            </Label>
          </Menu.Item>
          <Menu.Item
            active={activeItem === "following"}
            onClick={() => handleItemClick("following")}
            style={menuItemStyle}
          >
            Following
            <Label size="mini" style={labelStyle}>
              {getFollowing()}
            </Label>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item
            active={activeItem === "followers"}
            onClick={() => handleItemClick("followers")}
            style={menuItemStyle}
          >
            Followers
            <Label size="mini" style={labelStyle}>
              {followersLength}
            </Label>
          </Menu.Item>
          <Menu.Item
            active={activeItem === "following"}
            onClick={() => handleItemClick("following")}
            style={menuItemStyle}
          >
            Following
            <Label size="mini" style={labelStyle}>
              {followingLength}
            </Label>
          </Menu.Item>
        </>
      )}

      {ownAccount && (
        <>
          <Menu.Item
            icon="pencil alternate"
            name="Update"
            active={activeItem === "update"}
            onClick={() => handleItemClick("update")}
            style={menuItemStyle}
          />
          <Menu.Item
            icon="setting alternate"
            name="Settings"
            active={activeItem === "settings"}
            onClick={() => handleItemClick("settings")}
            style={menuItemStyle}
          />
        </>
      )}
    </Menu>
  );
};

export default ProfileMenuTabs;
