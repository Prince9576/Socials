import React, { useState } from "react";
import styles from "./Profile.module.css";
import { Button, Icon, Image, Popup } from "semantic-ui-react";
import { followUser, unFollowUser } from "../../utils/profileActions";

const ProfileHeader = ({
  profile,
  isFollowing,
  loading,
  user,
  setUserFollowStats,
  mobile,
}) => {
  const [followLoading, setFollowLoading] = useState(false);
  return (
    <div className={styles.profile}>
      <div className={styles.cover}>
        <img
          style={{
            width: "100%",
            height: "8rem",
            objectFit: "cover",
            borderTopLeftRadius: "5px",
            borderTopRightRadius: "5px",
          }}
          src="https://newevolutiondesigns.com/images/freebies/rainbow-facebook-cover-1.jpg"
        />
        <div className={styles.dp}>
          <Image
            style={{
              border: "4px solid white",
              height: "130px",
              width: "130px",
            }}
            circular
            src={profile.user.profilePicUrl}
          />
          {profile.user._id !== user._id && (
            <Button
              loading={loading}
              disabled={loading}
              size="mini"
              fluid
              color="blue"
              content={isFollowing ? "Following" : "Follow"}
              icon={isFollowing ? "check circle" : "add user"}
              color={isFollowing ? "instagram" : "twitter"}
              onClick={async () => {
                setFollowLoading(true);
                isFollowing
                  ? await unFollowUser({
                      userIdToUnfollow: profile.user._id,
                      setUserFollowStats: setUserFollowStats,
                    })
                  : await followUser({
                      userIdToFollow: profile.user._id,
                      setUserFollowStats: setUserFollowStats,
                    });
                setFollowLoading(false);
              }}
            />
          )}
        </div>
      </div>
      <div className={styles["info-container"]}>
        <div className={mobile ? styles["flex-mobile"] : styles.flex}>
          <div className={styles.name}>{profile.user.name}</div>
          <div className={mobile ? styles["socials-mobile"] : styles.socials}>
            <Popup
              on="hover"
              inverted
              size="mini"
              trigger={
                <Icon
                  disabled={!(profile.social && profile.social.facebook)}
                  name="facebook"
                  className={styles.icon}
                  style={{ color: "#3b5998" }}
                />
              }
              position="bottom center"
            >
              {profile.social && profile.social.facebook
                ? profile.social.facebook
                : "No data available"}
            </Popup>

            <Popup
              on="hover"
              inverted
              size="mini"
              trigger={
                <Icon
                  disabled={!(profile.social && profile.social.youtube)}
                  name="youtube"
                  className={styles.icon}
                  color="red"
                />
              }
              position="bottom center"
            >
              {profile.social && profile.social.youtube
                ? profile.social.youtube
                : "No data available"}
            </Popup>

            <Popup
              on="hover"
              inverted
              size="mini"
              trigger={
                <Icon
                  disabled={!(profile.social && profile.social.twitter)}
                  name="twitter"
                  className={styles.icon}
                  color="blue"
                />
              }
              position="bottom center"
            >
              {profile.social && profile.social.twitter
                ? profile.social.twitter
                : "No data available"}
            </Popup>

            <Popup
              on="hover"
              inverted
              size="mini"
              trigger={
                <Icon
                  disabled={!(profile.social && profile.social.instagram)}
                  name="instagram"
                  className={styles.icon}
                  style={{ color: "#8a3ab9" }}
                />
              }
              position="bottom center"
            >
              {profile.social && profile.social.instagram
                ? profile.social.instagram
                : "No data available"}
            </Popup>
          </div>
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            marginTop: "5px",
          }}
        >
          {profile.bio}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
