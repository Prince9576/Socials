import { Fragment } from "react";
import { Form, Segment, Divider, Icon, Image, Header } from "semantic-ui-react";
import styles from "./ImageDragger.module.css";
const ImageDragger = ({
  media,
  setMedia,
  mediaPreview,
  setMediaPreview,
  highlighted,
  setHighlighted,
  inputRef,
  fileChangeHandler,
}) => {
  return (
    <Form.Field>
      <input
        type="file"
        style={{ display: "none" }}
        ref={inputRef}
        name="media"
        accept="images/*"
        onChange={fileChangeHandler}
      />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setHighlighted(true);
          console.log("Dragged", e);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setHighlighted(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(true);
          const file = e.dataTransfer.files;
          setMedia(file[0]);
          setMediaPreview(URL.createObjectURL(file[0]));
        }}
      >
        {mediaPreview === null ? (
          <Fragment>
            <Segment
              secondary
              placeholder
              basic
              color={highlighted ? "green" : ""}
            >
              <Header icon>
                <Icon
                  name="file image outline"
                  style={{ cursor: "pointer" }}
                  onClick={() => inputRef.current.click()}
                />
                Drag and drop or click to upload image.
              </Header>
            </Segment>
          </Fragment>
        ) : (
          <Fragment>
            <div
              className={`${styles.imagePreviewBorder} ${
                mediaPreview ? styles.animateImageWrapper : ""
              } `}
            >
              <Image
                src={mediaPreview}
                className={styles.imagePreview}
                centered
                style={{ cursor: "pointer" }}
                onClick={() => inputRef.current.click()}
              />
              <hr className={styles.strikethrough} />
            </div>
          </Fragment>
        )}
      </div>
    </Form.Field>
  );
};

export default ImageDragger;
