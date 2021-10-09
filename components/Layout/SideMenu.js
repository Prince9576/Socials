import React from "react";
import styles from "./SideMenu.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { List, Icon } from "semantic-ui-react";
import { Fragment } from "react";
import { logoutUser } from "../../utils/authUser";

const SideMenu = (props) => {
  let unreadMessage, unreadNotification, email, username;
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  if (props.user) {
    unreadMessage = props.user.unreadMessage;
    unreadNotification = props.user.unreadNotification;
    email = props.user.email;
    username = props.user.username;
  }
  return (
    <Fragment>
      <List size="small" verticalAlign="middle" selection>
        {props.user && (
          <>
            <Link href="/">
              <List.Item className={styles.item} active={isActive("/")}>
                <Icon
                  name="home"
                  size="large"
                  color={isActive("/") && "blue"}
                />
                <List.Content>
                  <List.Header
                    className={styles.header}
                    content="Home"
                  ></List.Header>
                </List.Content>
              </List.Item>
            </Link>
            <Link href="/messages">
              <List.Item className={styles.item} active={isActive("/messages")}>
                <Icon
                  name={unreadMessage ? "hand point right" : "mail outline"}
                  size="large"
                  color={
                    (isActive("/messages") && "blue") ||
                    (unreadMessage && "orange")
                  }
                />
                <List.Content>
                  <List.Header
                    className={styles.header}
                    content="Messages"
                  ></List.Header>
                </List.Content>
              </List.Item>
            </Link>
            <Link href="/notifications">
              <List.Item
                className={styles.item}
                active={isActive("/notifications")}
              >
                <Icon
                  name={unreadNotification ? "bell" : "bell outline"}
                  size="large"
                  color={
                    (isActive("/notifications") && "blue") ||
                    (unreadNotification && "red")
                  }
                />
                <List.Content>
                  <List.Header
                    className={styles.header}
                    content="Notifications"
                  ></List.Header>
                </List.Content>
              </List.Item>
            </Link>
            <Link href={`/${username}`}>
              <List.Item
                className={styles.item}
                active={router.query.username === username}
              >
                <Icon
                  name="user"
                  size="large"
                  color={router.query.username === username && "blue"}
                />
                <List.Content>
                  <List.Header
                    className={styles.header}
                    content="Account"
                  ></List.Header>
                </List.Content>
              </List.Item>
            </Link>
            <List.Item
              onClick={() => {
                logoutUser(email);
              }}
              className={styles.item}
            >
              <Icon name="log out" size="large" />
              <List.Content>
                <List.Header
                  className={styles.header}
                  content="Logout"
                ></List.Header>
              </List.Content>
            </List.Item>{" "}
          </>
        )}

        {!props.user && (
          <>
            <Link href="/signup">
              <List.Item className={styles.item} active={isActive("/signup")}>
                <Icon
                  name="signup"
                  size="large"
                  color={isActive("/signup") && "blue"}
                />
                <List.Content>
                  <List.Header
                    className={styles.header}
                    content="Signup"
                  ></List.Header>
                </List.Content>
              </List.Item>
            </Link>
            <Link href="/login">
              <List.Item className={styles.item} active={isActive("/login")}>
                <Icon
                  name="sign in"
                  size="large"
                  color={isActive("/login") && "blue"}
                />
                <List.Content>
                  <List.Header
                    className={styles.header}
                    content="Login"
                  ></List.Header>
                </List.Content>
              </List.Item>
            </Link>{" "}
          </>
        )}
      </List>
    </Fragment>
  );
};

export default SideMenu;
