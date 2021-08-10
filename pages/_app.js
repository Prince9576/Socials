import App from "next/app";
import Layout from "../components/Layout/Layout";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import { redirectUser } from "../utils/authUser";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return pageProps;
  }
  render() {
    const { Component } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps}></Component>
      </Layout>
    );
  }
}

export default MyApp;
