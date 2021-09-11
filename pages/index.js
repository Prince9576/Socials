import React, { useState } from "react";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import CardPost from "../components/Posts/CardPost";
import CreatePost from "../components/Posts/CreatePost";
import { Divider, Segment } from "semantic-ui-react";

const Home = ({ user, postData, errorLoading }) => {
  const [posts, setPosts] = useState(postData);
  const [showToastr, setShowToastr] = useState(false);
  console.log({ user, postData });
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
  const { token } = parseCookies(ctx);
  try {
    const response = await axios.get(`${baseUrl}/api/posts`, {
      headers: {
        Authorization: token,
      },
    });
    return { postData: response.data };
  } catch (error) {
    return { errorLoading: true };
  }
};
export default Home;
