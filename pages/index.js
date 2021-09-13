import React, { useState } from "react";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import CardPost from "../components/Posts/CardPost";
import CreatePost from "../components/Posts/CreatePost";
import { Divider, Segment } from "semantic-ui-react";

const Home = ({ user, postData, errorLoading }) => {
  console.log("Post data in Home", postData);
  const [posts, setPosts] = useState(postData);
  const [showToastr, setShowToastr] = useState(false);

  console.log("Posts", posts);
  if (posts.length === 0 || errorLoading) return <h3>No Posts Available</h3>;
  return (
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
