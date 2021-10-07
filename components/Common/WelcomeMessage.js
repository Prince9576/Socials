import { useRouter } from "next/router";
import Link from "next/link";
import { Fragment } from "react";
import { Message, Divider, Icon } from "semantic-ui-react";

export const HeaderMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";
  return (
    <Message
      size="small"
      attached
      header={signupRoute ? "Get Started" : "Welcome Back"}
      icon={signupRoute ? "settings" : "privacy"}
      color="orange"
      content={
        signupRoute ? "Create new account" : "Login with email and password"
      }
    ></Message>
  );
};

export const FooterMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";
  return (
    <Fragment>
      {signupRoute && (
        <Message attached="bottom" warning>
          <Icon name="help" />
          Existing User ? <Link href="/login">Login Here Instead</Link>
        </Message>
      )}
      {!signupRoute && (
        <Fragment>
          <Message attached="bottom" info>
            <Icon name="lock" />
            <Link href="/reset">Forgot Password ?</Link>
          </Message>

          <Message attached="bottom" warning>
            <Icon name="help" />
            New User ? <Link href="/signup">Signup Here Instead</Link>
          </Message>
        </Fragment>
      )}
    </Fragment>
  );
};
