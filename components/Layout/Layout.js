import React, { createRef, Fragment } from "react";
import HeadTags from "./HeadTags";
import Router from "next/router";
import nProgress from "nprogress";
import {
  Container,
  Divider,
  Visibility,
  Ref,
  Grid,
  Sticky,
  Image,
} from "semantic-ui-react";
import SideMenu from "./SideMenu";
import SearchComponent from "./Search";

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
                  <Grid.Row
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      padding: "9px",
                      backgroundColor: "rgb(33,133,208, 0.95)",
                      marginBottom: "1.5rem",
                      borderRadius: "3px",
                    }}
                  >
                    <SearchComponent />
                    <Image
                      style={{
                        marginLeft: "10px",
                        border: "1px solid white",
                      }}
                      src={user.profilePicUrl}
                      circular
                      avatar
                    />
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
