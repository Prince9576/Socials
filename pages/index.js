import React, { Fragment, useEffect, useState } from "react";
import { parseCookies } from "nookies";
import baseUrl from "../utils/baseUrl";
import axios from "axios";
import CardPost from "../components/Posts/CardPost";
import CreatePost from "../components/Posts/CreatePost";
import {
  Divider,
  Message,
  Segment,
  Icon,
  Grid,
  Image,
} from "semantic-ui-react";
import InfiniteScroll from "react-infinite-scroll-component";
import cookies from "js-cookie";
import MessageToastr from "../components/Common/MessageToastr";
import { NoPosts } from "../components/Layout/NoData";

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
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(2);

  const fetchDataOnScroll = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/posts`, {
        headers: {
          Authorization: cookies.get("token"),
        },
        params: {
          pageNumber,
        },
      });
      if (response.data.length === 0) setHasMore(false);
      setPosts((prev) => [...prev, ...response.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      console.error("Error getting more posts", error);
    }
  };

  useEffect(() => {
    if (showToastr) {
      setTimeout(() => {
        setShowToastr(false);
      }, 3000);
    }
  }, [showToastr]);

  console.log("Posts", posts);

  return (
    <Fragment>
      <Segment>
        <CreatePost setPosts={setPosts} user={user} />
        <Divider />
        <Fragment>
          {posts.length === 0 || errorLoading ? (
            <div
              style={{
                textAlign: "center",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              <Image
                src="https://st.depositphotos.com/1431107/2884/v/380/depositphotos_28842149-stock-illustration-oops.jpg"
                size="tiny"
                wrapped
                verticalAlign="middle"
              />
              <h4 style={{ margin: "0", display: "inline" }}>
                No Posts are available !
              </h4>
            </div>
          ) : (
            <InfiniteScroll
              hasMore={hasMore}
              loader={
                <div
                  style={{ marginBottom: "2rem" }}
                  class="ui active centered inline loader"
                ></div>
              }
              next={fetchDataOnScroll}
              endMessage={<NoPosts />}
              dataLength={posts.length}
            >
              {posts.map((post) => (
                <CardPost
                  key={post._id}
                  post={post}
                  setPosts={setPosts}
                  user={user}
                  setShowToastr={setShowToastr}
                />
              ))}
            </InfiniteScroll>
          )}
        </Fragment>
      </Segment>

      {showToastr.show && showToastr.type === "error" && (
        <MessageToastr
          type={showToastr.type}
          header="Delete Unsuccessful"
          content="The post cannot be deleted right now, Please try again later."
        />
      )}
      {showToastr.show && showToastr.type === "success" && (
        <MessageToastr
          type={showToastr.type}
          header="Post Deleted Successfully"
          content="The post have been deleted successfully !"
        />
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
      params: {
        pageNumber: 1,
      },
    });
    console.log("Inside Get Initial Props", response);
    return { postData: response.data };
  } catch (error) {
    return { errorLoading: true };
  }
};
export default Home;
