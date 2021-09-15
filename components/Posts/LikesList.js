import axios from "axios";
import React, { Fragment, useState } from "react";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";
import { Image, List, Placeholder, Popup } from "semantic-ui-react";
import Link from "next/link";
const LikesList = ({ postId, trigger }) => {
  const [likesList, setLikesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const placeHolderMarkup = new Array(3).fill(
    <>
      <Placeholder style={{ width: "10rem" }}>
        <Placeholder.Header image>
          <Placeholder.Line></Placeholder.Line>
          <Placeholder.Line></Placeholder.Line>
        </Placeholder.Header>
      </Placeholder>
    </>,
    0,
    3
  );
  console.log(placeHolderMarkup);

  const getLikesList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/posts/like/${postId}`, {
        headers: {
          Authorization: cookie.get("token"),
        },
      });
      console.log("Likes List", res);
      setLikesList(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Likes List Error", error);
      setLoading(false);
    }
  };

  return (
    <Popup
      on="click"
      onClose={() => setLikesList([])}
      onOpen={getLikesList}
      trigger={trigger}
      popperDependencies={[likesList]}
      wide
      position="bottom left"
    >
      {loading && placeHolderMarkup.map((holder) => holder)}
      {!loading && likesList.length > 0 && (
        <>
          <div
            style={{
              overflow: "auto",
              maxHeight: "15rem",
              height: "10rem",
              minWidth: "10rem",
            }}
          >
            <List size="medium" selection>
              {likesList.map((like) => {
                return (
                  <List.Item
                    style={{
                      alignItems: "center",
                      display: "flex",
                    }}
                    key={like._id}
                  >
                    <Image avatar src={like.user.profilePicUrl} />
                    <List.Content>
                      <Link href={`/${like.user.username}`}>
                        <List.Header
                          style={{
                            fontSize: "0.8rem",
                          }}
                          as="a"
                          content={like.user.name}
                        />
                      </Link>
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </div>
        </>
      )}
    </Popup>
  );
};

export default LikesList;
