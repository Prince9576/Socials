import React, { Fragment, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Icon,
  Image,
  Modal,
  Segment,
} from "semantic-ui-react";
import Link from "next/link";
import styles from "./CardPost.module.css";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputFields";
import calculateTimeDiff from "../../utils/calculateTimeDiff";
import { deletePost, likePost } from "../../utils/postActions";
import LikesList from "./LikesList";
import PostModal from "./PostModal";

const CardPost = ({ post, user, setPosts, setShowToastr }) => {
  console.log("CardPost", { post });
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showModal, setShowModal] = useState(false);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [error, setError] = useState(null);
  return (
    <Fragment>
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        closeIcon
        closeOnDimmerClick
        style={{
          width: !post.picUrl && "35%",
        }}
      >
        <PostModal
          post={post}
          user={user}
          likes={likes}
          setLikes={setLikes}
          isLiked={isLiked}
          comments={comments}
          setComments={setComments}
          imageAvailable={post.picUrl}
        />
      </Modal>
      <Segment basic>
        <Card color="teal" fluid>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{ cursor: "pointer", padding: "5px" }}
              floated="left"
              wrapped
              ui={false}
              alt="PostImage"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content>
            <Image
              src={post.user.profilePicUrl}
              floated="left"
              avatar
              circular
            />
            {(user.role === "root" || post.user._id === user._id) && (
              <Image floated="right">
                <Icon
                  color="red"
                  style={{ cursor: "pointer" }}
                  name="trash alternate outline"
                  onClick={() =>
                    deletePost({
                      postId: post._id,
                      setPosts,
                      setShowToastr,
                    })
                  }
                />{" "}
              </Image>
            )}
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

          <Card.Content extra>
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
                    <span className={styles.spanLikesList}>
                      {`${likes.length} ${likes.length > 1 ? "likes" : "like"}`}
                    </span>
                  )
                }
              />
            </div>

            <Icon
              name="comment outline"
              color="blue"
              style={{ marginLeft: "15px" }}
            />

            {comments.length > 0 &&
              comments.map(
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

            {comments.length > 3 && (
              <Button
                content="View More"
                color="blue"
                circular
                basic
                size="tiny"
                onClick={() => {
                  setShowModal(true);
                }}
              />
            )}

            <Divider hidden />

            <CommentInputField
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </Fragment>
  );
};

export default CardPost;
