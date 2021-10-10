import React, { Fragment } from "react";
import { Modal, Image, Grid, Divider, Icon, Card } from "semantic-ui-react";
import Link from "next/link";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputFields";
import calculateTimeDiff from "../../utils/calculateTimeDiff";
import { likePost } from "../../utils/postActions";
import LikesList from "./LikesList";
import styles from "./CardPost.module.css";
const PostModal = ({
  post,
  user,
  setLikes,
  likes,
  isLiked,
  comments,
  setComments,
  imageAvailable,
}) => {
  return (
    <Fragment>
      <Grid
        style={{
          padding: "1.2rem 1rem",
        }}
        columns={imageAvailable ? 2 : 1}
        stackable
        relaxed
      >
        {imageAvailable && (
          <Grid.Column
            style={{
              paddingRight: "10px",
            }}
          >
            <img src={post.picUrl} className={styles.postPic} />
          </Grid.Column>
        )}

        <Grid.Column
          style={{
            paddingLeft: imageAvailable && "10px",
          }}
        >
          <Card
            fluid
            style={{
              height: "100%",
            }}
          >
            <Card.Content
              style={{
                flexGrow: "0",
                paddingBottom: "1.5rem",
              }}
            >
              <Image floated="left" avatar src={user.profilePicUrl} />

              <Card.Header>
                <Link href={`/${post.user.username}`}>
                  <a className={styles.name}>{post.user.name}</a>
                </Link>
              </Card.Header>

              <Card.Meta className={styles.customMeta}>
                {calculateTimeDiff(post.createdAt)}
              </Card.Meta>
              {post.location && (
                <Card.Meta className={styles.customMeta}>
                  {post.location}
                </Card.Meta>
              )}

              <Card.Description className={styles.customDesc}>
                {post.text}
              </Card.Description>
            </Card.Content>

            <Card.Content>
              <div className={styles.userResponseWrapper}>
                <Icon
                  name={isLiked ? "heart" : "heart outline"}
                  color="red"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    likePost({
                      postId: post._id,
                      userId: user._id,
                      setLikes,
                      like: isLiked ? false : true,
                    })
                  }
                />
                <LikesList
                  postId={post._id}
                  trigger={
                    likes.length > 0 && (
                      <span
                        style={{
                          marginTop: "-2px",
                        }}
                        className={styles.spanLikesList}
                      >
                        {`${likes.length} ${
                          likes.length > 1 ? "likes" : "like"
                        }`}
                      </span>
                    )
                  }
                />
              </div>

              <Divider hidden />
              <div
                style={{
                  overflow: "auto",
                  maxHeight: "12rem",
                  marginBottom: "2rem",
                  scrollbarWidth: "5px",
                }}
              >
                {comments.map(
                  (comment, i) =>
                    i <= 3 && (
                      <PostComments
                        key={post._id}
                        comment={comment}
                        postId={post._id}
                        user={user}
                        lastComment={i === comments.length - 1}
                        setComments={setComments}
                      />
                    )
                )}
              </div>
              <CommentInputField
                user={user}
                postId={post._id}
                setComments={setComments}
                style={{
                  position: "absolute",
                  bottom: "1rem",
                  width: "90%",
                }}
              />
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </Fragment>
  );
};

export default PostModal;
