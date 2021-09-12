import React, { Fragment, useRef, useState } from "react";
import { Button, Form, Image, Message, Popup } from "semantic-ui-react";
const CreatePost = ({ user, setPsots }) => {
  const [newPost, setNewPost] = useState({ text: "", location: "" });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const [error, setError] = useState(null);
  const [highlighted, setHighlighted] = useState(false);

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

  const handleSubmit = (e) => e.preventDefault();

  return (
    <Fragment>
      <Form error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Oops"
        />

        <Form.Group>
          <Image src={user.profilePicUrl} circular avatar inline />
          <Form.TextArea
            placeholder="Whats Happening ?"
            name="text"
            value={newPost.text}
            onChange={handleChnage}
            rows={5}
            width={14}
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
              flexDirection: "column",
              justifyContent: "space-between",
              flex: "0 0 8%",
              alignItems: "end",
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
              trigger={
                <Button
                  icon="map marker alternate"
                  circular
                  size="small"
                  color="orange"
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
                ></Button>
              </Form.Group>
            </Popup>

            <Button icon="send" circular size="small" color="green" />
          </div>
        </Form.Group>
      </Form>
    </Fragment>
  );
};

export default CreatePost;
