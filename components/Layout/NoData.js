import { Segment, Icon, Message, Button, Divider } from "semantic-ui-react";

export const NoProfilePosts = () => (
  <>
    <Message
      info
      icon="meh"
      header="Sorry"
      content="User has not posted anything yet!"
    />
    <Button
      icon="long arrow alternate left"
      content="Go Back"
      as="a"
      href="/"
    />
  </>
);

export const NoFollowData = ({ followersComponent, followingComponent }) => (
  <>
    {followersComponent && (
      <Message
        icon="user outline"
        info
        content="User does not have followers"
        size="mini"
      />
    )}

    {followingComponent && (
      <Message
        icon="user outline"
        info
        content="User does not follow any users"
        size="mini"
      />
    )}
  </>
);

export const NoMessages = () => (
  <Message
    info
    icon="telegram plane"
    header="Sorry"
    content="You have not messaged anyone yet.Search above to message someone!"
  />
);

export const NoPosts = () => (
  <>
    <Message icon warning size="small">
      <Icon name="meh" />
      <Message.Content>
        <Message.Header>Oops !</Message.Header>
        No more Posts.
      </Message.Content>
    </Message>
    <Divider hidden />
  </>
);

export const NoProfile = () => (
  <Message info icon="meh" header="Hey!" content="No Profile Found." />
);

export const NoNotifications = () => {
  return (
    <Message
      info
      icon="meh"
      content="You don't have any notifications right now."
    />
  );
};

export const NoChats = () => {
  return (
    <div
      style={{
        width: "40%",
        margin: "8rem auto",
        textAlign: "center",
        color: "grey",
      }}
    >
      <Icon name="comments" color="grey" size="huge" />
      <h3
        style={{
          margin: "0",
        }}
      >
        No Chats Found
      </h3>
      <div style={{ fontSize: "1rem" }}>
        Start conversing to see your messages here.
      </div>
    </div>
  );
};
