import { useRouter } from "next/router";
import React from "react";
import { Comment, Icon, List } from "semantic-ui-react";
import calculateTimeDiff from "../../utils/calculateTimeDiff";

const ChatList = ({ user, chat, setChats }) => {
  console.log("Chat", chat);
  const router = useRouter();
  return (
    <List selection>
      <List.Item
        active={router.query.message === chat.messagesWith}
        onClick={() => {
          router.push(`/messages?message=${chat.messagesWith}`, undefined, {
            shallow: true,
          });
        }}
        style={{ padding: "1rem" }}
      >
        <Comment>
          <Comment.Avatar
            style={{
              height: "38px",
              width: "38px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
            src={chat.profilePicUrl}
          />
          <Comment.Content>
            <Comment.Author as="a">{chat.name}</Comment.Author>
            <Comment.Metadata style={{ fontSize: "10px", fontFamily: "Lato" }}>
              {calculateTimeDiff(chat.date)}
              <div
                style={{
                  position: "absolute",
                  right: "0px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                <Icon name="trash alternate" color="red" />
              </div>
            </Comment.Metadata>
            <Comment.Text>
              {chat.lastMessage.length > 20
                ? `${chat.lastMessage.substring(0, 20)}...`
                : chat.lastMessage}
            </Comment.Text>
          </Comment.Content>
        </Comment>
      </List.Item>
    </List>
  );
};

export default ChatList;
