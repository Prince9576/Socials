import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";
function Navbar() {
  const router = useRouter();
  const isActive = (route) => {
    return route === router.pathname;
  };
  return (
    <Menu
      className="navbar"
      inverted
      size="huge"
      secondary
      borderless
      color="teal"
    >
      <div className="menu right raleway">
        <Link href="/login">
          <Menu.Item active={isActive("/login")}>
            <Icon size="large" name="sign in"></Icon>
            Login
          </Menu.Item>
        </Link>

        <Link href="/signup">
          <Menu.Item active={isActive("/signup")}>
            <Icon size="large" name="signup"></Icon>
            Signup
          </Menu.Item>
        </Link>
      </div>
    </Menu>
  );
}

export default Navbar;
