import React, { createRef, Fragment } from "react";
import HeadTags from "./HeadTags";
import Router from "next/router";
import nProgress from "nprogress";
import { Visibility, Ref, Grid, Sticky } from "semantic-ui-react";
import SideMenu from "./SideMenu";

import CommonNav from "./CommonNav";

function Layout({ children, user }) {
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();
  const contextRef = createRef();

  return (
    <>
      <HeadTags />

      <div style={{ padding: "1rem", margin: "0 auto", width: "70%" }}>
        <Ref innerRef={contextRef}>
          <Grid>
            <Grid.Column floated="left" width={4}>
              <Sticky context={contextRef}>
                <SideMenu user={user} />
              </Sticky>
            </Grid.Column>

            <Grid.Column width={12}>
              {user && (
                <Fragment>
                  <Grid.Row>
                    <CommonNav user={user} />
                  </Grid.Row>
                  <Grid.Row>
                    <Visibility context={contextRef}>{children}</Visibility>
                  </Grid.Row>
                </Fragment>
              )}
              {!user && <div style={{ fontSize: "1.2rem" }}>{children}</div>}
            </Grid.Column>
          </Grid>
        </Ref>
      </div>
    </>
  );
}

export default Layout;
