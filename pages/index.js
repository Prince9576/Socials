import React, { Fragment, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import CardPost from "../components/Posts/CardPost";
import CreatePost from "../components/Posts/CreatePost";
import { Divider, Message, Segment, Icon } from "semantic-ui-react";

function addStyles() {
  return {
    position: "fixed",
    bottom: "1rem",
    width: "30rem",
    left: "2rem",
  };
}
const Home = ({ user, postData, errorLoading }) => {
  console.log("Post data in Home", postData);
  const [posts, setPosts] = useState(postData);
  const [showToastr, setShowToastr] = useState({ show: false, type: "" });

  useEffect(() => {
    if (showToastr) {
      setTimeout(() => {
        setShowToastr(false);
      }, 3000);
    }
  }, [showToastr]);

  console.log("Posts", posts);
  if (posts.length === 0 || errorLoading) return <h3>No Posts Available</h3>;
  return (
    <Fragment>
      <Segment>
        <CreatePost setPosts={setPosts} user={user} />
        <Divider />
        {posts.map((post) => (
          <CardPost
            key={post._id}
            post={post}
            setPosts={setPosts}
            user={user}
            setShowToastr={setShowToastr}
          />
        ))}
      </Segment>

      {showToastr.show && showToastr.type === "error" && (
        <Message style={addStyles()} icon error size="small">
          <Icon name="warning" />
          <Message.Content>
            <Message.Header>Delete Unsuccessful</Message.Header>
            The post cannot be deleted right now, Please try again later.
          </Message.Content>
        </Message>
      )}
      {showToastr.show && showToastr.type === "success" && (
        <Message style={addStyles()} icon success size="small">
          <Icon name="check circle" />
          <Message.Content>
            <Message.Header>Post Deleted Successfully</Message.Header>
            The post have been deleted successfully !
          </Message.Content>
        </Message>
      )}
    </Fragment>
  );
};

Home.getInitialProps = async (ctx) => {
  console.log("Home Get Initial", ctx);
  const { token } = parseCookies(ctx);
  try {
    const response = await axios.get(`${baseUrl}/api/posts`, {
      headers: {
        Authorization: token,
      },
    });
    console.log("Inside Get Initial Props", response);
    return { postData: response.data };
  } catch (error) {
    return { errorLoading: true };
  }
};
export default Home;
