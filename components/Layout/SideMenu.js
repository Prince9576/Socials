import React from "react";
import styles from "./SideMenu.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { List, Icon } from "semantic-ui-react";
import { Fragment } from "react";
import { logoutUser } from "../../utils/authUser";

const SideMenu = ({
  user: { unreadMessage, unreadNotification, email, username },
}) => {
  const router = useRouter();
  const isActive = (route) => router.pathname === route;
  return (
    <Fragment>
      <List size="big" verticalAlign="middle" selection>
        <Link href="/">
          <List.Item className={styles.item} active={isActive("/")}>
            <Icon name="home" size="large" color={isActive("/") && "teal"} />
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
                (isActive("/messages") && "teal") || (unreadMessage && "orange")
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
              name={unreadNotification ? "hand point right" : "bell outline"}
              size="large"
              color={
                (isActive("/notifications") && "teal") ||
                (unreadNotification && "orange")
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
              color={router.query.username === username && "teal"}
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
        </List.Item>
      </List>
    </Fragment>
  );
};

export default SideMenu;
