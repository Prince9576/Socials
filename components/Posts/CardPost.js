import React, { Fragment, useState } from "react";
import { Button, Card, Divider, Icon, Image, Segment } from "semantic-ui-react";
import Link from "next/link";
import styles from "./CardPost.module.css";
import PostComments from "./PostComments";
import CommentInputField from "./CommentInputFields";
import calculateTimeDiff from "../../utils/calculateTimeDiff";

const CardPost = ({ post, user, setPosts, setShowToastr }) => {
  console.log({ post, user, pu: post.user });
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const isLiked =
    likes.length > 0 &&
    likes.filter((like) => like.user === user._id).length > 0;

  const [error, setError] = useState(null);
  return (
    <Fragment>
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
            />
          )}

          <Card.Content>
            <Image src={user.profilePicUrl} floated="left" avatar circular />
            {(user.role === "root" || post.user._id === user._id) && (
              <Image floated="right">
                <Icon
                  color="red"
                  style={{ cursor: "pointer" }}
                  name="trash alternate outline"
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
              />
              {likes.length > 0 && (
                <span className={styles.spanLikesList}>
                  {`${likes.length} ${likes.length > 1 ? "likes" : "like"}`}
                </span>
              )}
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
              <Button content="View More" color="blue" circular basic />
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
