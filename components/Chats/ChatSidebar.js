import React from "react";
import { Comment, Icon, Segment } from "semantic-ui-react";
import ChatList from "./ChatList";
import ChatListSearchComponent from "./ChatListSearch";

const ChatSidebar = ({
  isSearching,
  setIsSearching,
  chats,
  setChats,
  deleteChat,
  connectedUsers,
  setSidebarVisible,
}) => {
  return (
    <Comment.Group size="big">
      <Segment raised style={{ overflow: "auto", height: "44.75rem" }}>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f4f4f4",
            display: "flex",
            alignItems: "center",
            borderRadius: ".5em",
            justifyContent: "space-between",
          }}
        >
          {!isSearching && (
            <>
              <h3 style={{ fontFamily: "Raleway", marginBottom: "0px" }}>
                Messages
              </h3>
              <Icon
                name="search"
                color="grey"
                size="large"
                onClick={() => setIsSearching(true)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}

          {isSearching && (
            <>
              <ChatListSearchComponent
                setChats={setChats}
                chats={chats}
                shrinken={true}
              />
              <Icon
                name="close"
                color="grey"
                size="large"
                onClick={() => setIsSearching(false)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}
        </div>
        {chats &&
          chats.length > 0 &&
          chats.map((chat, i) => {
            return (
              <ChatList
                key={i}
                connectedUsers={connectedUsers}
                chat={chat}
                setChats={setChats}
                deleteChat={deleteChat}
                setSidebarVisible={setSidebarVisible}
              />
            );
          })}
      </Segment>
    </Comment.Group>
  );
};

export default ChatSidebar;
