import React, { useRef, useState } from "react";
import { Button, Divider, Form, Message } from "semantic-ui-react";
import { updateProfile } from "../../utils/profileActions";
import ImageDragger from "../Common/ImageDragger";
import SocialLinks from "../Common/SocialLinks";
import uploadPic from "../../utils/uploadPicToCloudinary";

export const UpdateProfile = ({ Profile }) => {
  const [profile, setProfile] = useState({
    profilePicUrl: Profile.user.profilePicUrl,
    bio: Profile.bio,
    facebook: (Profile.socials && Profile.socials.facebook) || "",
    instagram: (Profile.socials && Profile.socials.instagram) || "",
    twitter: (Profile.socials && Profile.socials.twitter) || "",
    youtube: (Profile.socials && Profile.socials.youtube) || "",
  });

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const inputRef = useRef();

  const handleChange = (event) => {
    console.log("Target", event.target);
    const { name, value, files } = event.target;
    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Form
      loading={loading}
      error={error}
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);
        let profilePicUrl;
        if (media !== null) {
          profilePicUrl = await uploadPic(media);
        }
        if (media !== null && !profilePicUrl) {
          setLoading(false);
          setError(true);
          setErrorMsg("Picture Upload Error");
        }

        try {
          await updateProfile({
            profile,
            setLoading,
            setError,
            setErrorMsg,
            profilePicUrl,
          });
          setLoading(false);
        } catch (err) {
          setError(true);
          setErrorMsg("Profile Not Updated");
          setLoading(false);
        }
      }}
    >
      <Message
        error
        attached
        content={errorMsg}
        header="Oops"
        icon="warning"
        onDismiss={() => setErrorMsg(null)}
      />
      <ImageDragger
        mediaPreview={mediaPreview}
        setMediaPreview={setMediaPreview}
        setMedia={setMedia}
        highlighted={setHighlighted}
        setHighlighted={setHighlighted}
        inputRef={inputRef}
        fileChangeHandler={handleChange}
        profilePicUrl={profile.profilePicUrl}
      />

      <SocialLinks
        user={profile}
        inputChangeHandler={handleChange}
        setSocialLinks={setShowSocialLinks}
        socialLinks={showSocialLinks}
      />

      <Divider />

      <div style={{ overflow: "auto", marginBottom: "2rem" }}>
        <Button
          floated="right"
          size="small"
          content="Submit"
          type="submit"
          icon="pencil alternate"
          disabled={!profile.bio || loading}
          color="blue"
          style={{
            minWidth: "9rem",
          }}
        />

        <Button
          floated="right"
          size="small"
          content="Cancel"
          type="cancel"
          icon="close"
          color="cancel"
          style={{
            minWidth: "9rem",
          }}
        />
      </div>
    </Form>
  );
};
