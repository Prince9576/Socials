import React, { createRef, Fragment } from "react";
import HeadTags from "./HeadTags";
import Navbar from "./Navbar";
import Router from "next/router";
import nProgress from "nprogress";
import {
  Container,
  Divider,
  Visibility,
  Ref,
  Grid,
  Sticky,
} from "semantic-ui-react";
import SideMenu from "./SideMenu";

function Layout({ children, user }) {
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();
  const contextRef = createRef();

  return (
    <>
      <HeadTags />
      {user && (
        <div style={{ padding: "1rem", margin: "0 auto", width: "70%" }}>
          <Ref innerRef={contextRef}>
            <Grid>
              <Grid.Column floated="left" width={4}>
                <Sticky context={contextRef}>
                  <SideMenu user={user} />
                </Sticky>
              </Grid.Column>

              <Grid.Column width={12}>
                <Visibility context={contextRef}>{children}</Visibility>
              </Grid.Column>
            </Grid>
          </Ref>
        </div>
      )}
      {!user && (
        <Fragment>
          <Navbar />
          <div style={{ paddingTop: "2rem", fontSize: "1.2rem" }}>
            {children}
          </div>
        </Fragment>
      )}
    </>
  );
}

export default Layout;
