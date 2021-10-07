import App from "next/app";
import Layout from "../components/Layout/Layout";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { redirectUser } from "../utils/authUser";
import { parseCookies, destroyCookie } from "nookies";
import baseUrl from "../utils/baseUrl";

const MyApp = ({ Component, pageProps }) => {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps}></Component>
    </Layout>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};
  const protectedRoutes =
    ctx.pathname === "/" || ctx.pathname === "/[username]";
  console.log("Reached till here", { token, protectedRoutes });
  if (!token) {
    console.log("Token false block", { protectedRoutes, ctx });
    protectedRoutes && redirectUser(ctx, "/login");
  } else {
    console.log("Token true block", {
      component: Component.getInitialProps,
      ctx,
    });
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    try {
      const res = await axios.get(`${baseUrl}/api/login`, {
        headers: {
          authorization: token,
        },
      });
      const { user, followerStats } = res.data;

      if (user && !protectedRoutes) {
        redirectUser(ctx, "/");
      }

      pageProps.user = user;
      pageProps.userFollowStats = followerStats;
    } catch (err) {
      console.log("Error block", err);
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
    return { pageProps };
  }

  return pageProps;
};
export default MyApp;
