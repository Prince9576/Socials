import React, { Fragment, useRef, useState } from "react";
import { Button, Form, Image, Message, Popup } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { submitNewPost } from "../../utils/postActions";
const CreatePost = ({ user, setPosts, mobile = false }) => {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [locationPopupClose, setLocationPopupClose] = useState();
  const inputRef = useRef();

  const [error, setError] = useState(null);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleChnage = (e) => {
    const { name, value, files } = e.target;
    console.log({ name, value });
    if (name === "media") {
      if (files.length > 0) {
        setMedia(files[0]);
        setMediaPreview(URL.createObjectURL(files[0]));
      }
    }

    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    console.log("Handle Submit Triggered", e);
    e.preventDefault();
    setLoading(true);
    let picUrl;
    if (media !== null) {
      picUrl = await uploadPic(media);
      if (!picUrl) {
        setLoading(false);
        return setError("Error Uploading Image");
      }
    }

    await submitNewPost({
      user,
      text: newPost.text,
      location: newPost.location,
      picUrl,
      setPosts,
      setNewPost,
      setError,
    });

    setMedia(null);
    setMediaPreview(null);
    setLoading(false);
  };

  return (
    <Fragment>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops"
        />

        <Form.Group style={{ justifyContent: mobile ? "flex-end" : "normal" }}>
          {!mobile && <Image src={user.profilePicUrl} circular avatar inline />}
          <Form.TextArea
            placeholder="Whats Happening ?"
            name="text"
            value={newPost.text}
            onChange={handleChnage}
            rows={5}
            width={mobile ? 11 : 14}
            style={{ flex: "0 0 87%" }}
          ></Form.TextArea>

          <input
            name="media"
            type="file"
            ref={inputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleChnage}
          />

          <div
            style={{
              display: "flex",
              flexDirection: mobile ? "row" : "column",
              justifyContent: "space-between",
              flex: "0 0 8%",
              alignItems: "end",
              marginTop: mobile ? "1rem" : "0",
            }}
          >
            <Popup
              on="hover"
              position="right center"
              trigger={
                <Button
                  onClick={() => inputRef.current.click()}
                  icon={mediaPreview ? "eye" : "plus"}
                  circular
                  size="small"
                  color="blue"
                  type="button"
                />
              }
            >
              {mediaPreview ? (
                <Image
                  src={mediaPreview}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#F9F9F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#777",
                  }}
                >
                  No Media Selected
                </div>
              )}
            </Popup>

            <Popup
              on="click"
              position="right center"
              open={locationPopupClose}
              trigger={
                <Button
                  icon="map marker alternate"
                  circular
                  size="small"
                  color="orange"
                  type="button"
                  onClick={() => setLocationPopupClose((prev) => !prev)}
                />
              }
            >
              <Form.Group style={{ display: "flex" }}>
                <Form.Input
                  value={newPost.location}
                  name="location"
                  placeholder="Add Location"
                  onChange={handleChnage}
                  icon="map marker alternate"
                  size="mini"
                ></Form.Input>

                <Button
                  style={{ marginLeft: "5px" }}
                  size="mini"
                  icon="arrow right"
                  color="blue"
                  type="button"
                  onClick={() => setLocationPopupClose(false)}
                ></Button>
              </Form.Group>
            </Popup>

            <Button
              loading={loading}
              icon="send"
              type="submit"
              circular
              size="small"
              color="green"
              disabled={newPost.text === "" || loading}
            />
          </div>
        </Form.Group>
      </Form>
    </Fragment>
  );
};

export default CreatePost;
