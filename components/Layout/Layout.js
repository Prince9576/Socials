import React from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import Router from "next/router";
import nProgress from "nprogress";

function Layout(props) {
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();
  return (
    <>
      <HeadTags />

      <Navbar />

      <div style={{ paddingTop: "2rem", fontSize: "1.2rem" }}>
        {props.children}
      </div>
    </>
  );
}

export default Layout;
