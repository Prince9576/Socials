import React, { createRef, Fragment } from "react";
import HeadTags from "./HeadTags";
import Router, { useRouter } from "next/router";
import nProgress from "nprogress";
import { Visibility, Ref, Grid, Sticky } from "semantic-ui-react";
import SideMenu from "./SideMenu";
import { createMedia } from "@artsy/fresnel";

import CommonNav from "./CommonNav";

function Layout({ children, user }) {
  const router = useRouter();
  Router.onRouteChangeStart = () => nProgress.start();
  Router.onRouteChangeComplete = () => nProgress.done();
  Router.onRouteChangeError = () => nProgress.done();
  const contextRef = createRef();
  const AppMedia = createMedia({
    breakpoints: {
      zero: 0,
      mobile: 549,
      tab: 768,
      dekstop: 1080,
    },
  });

  const mediaStyles = AppMedia.createMediaStyle();
  const { Media, MediaContextProvider, MediaProps } = AppMedia;
  console.log({ MediaContextProvider, Media, b: Media.displayName });
  return (
    <>
      <HeadTags />
      <>
        <style>{mediaStyles}</style>
        <MediaContextProvider>
          <Media greaterThanOrEqual="dekstop">
            <div
              style={{
                padding: "1rem",
                margin: "0 auto",
                width: "70%",
              }}
            >
              <Ref innerRef={contextRef}>
                <>
                  {router.pathname !== "/messages" && (
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
                              <Visibility context={contextRef}>
                                {children}
                              </Visibility>
                            </Grid.Row>
                          </Fragment>
                        )}
                        {!user && (
                          <div style={{ fontSize: "1.2rem" }}>{children}</div>
                        )}
                      </Grid.Column>
                    </Grid>
                  )}

                  {router.pathname === "/messages" && (
                    <div style={{ fontFamily: "Raleway", fontSize: "1.2rem" }}>
                      {children}
                    </div>
                  )}
                </>
              </Ref>
            </div>
          </Media>

          <Media between={["tab", "dekstop"]}>
            <div
              style={{
                padding: "1rem",
                margin: "0 auto",
                width: "95%",
              }}
            >
              <Ref innerRef={contextRef}>
                <>
                  {router.pathname !== "/messages" && (
                    <Grid>
                      <Grid.Column floated="left" width={2}>
                        <Sticky context={contextRef}>
                          <SideMenu user={user} pc={false} />
                        </Sticky>
                      </Grid.Column>

                      <Grid.Column width={14}>
                        {user && (
                          <Fragment>
                            <Grid.Row>
                              <CommonNav user={user} />
                            </Grid.Row>
                            <Grid.Row>
                              <Visibility context={contextRef}>
                                {children}
                              </Visibility>
                            </Grid.Row>
                          </Fragment>
                        )}
                        {!user && (
                          <div style={{ fontSize: "1.2rem" }}>{children}</div>
                        )}
                      </Grid.Column>
                    </Grid>
                  )}

                  {router.pathname === "/messages" && (
                    <div style={{ fontFamily: "Raleway", fontSize: "1.2rem" }}>
                      {children}
                    </div>
                  )}
                </>
              </Ref>
            </div>
          </Media>

          <Media between={["zero", "tab"]}>
            <div
              style={{
                padding: "1rem",
                margin: "0 auto",
                width: "100%",
              }}
            >
              <Ref innerRef={contextRef}>
                <>
                  {router.pathname !== "/messages" && (
                    <Grid>
                      <Grid.Column width={16}>
                        {user && (
                          <Fragment>
                            <Grid.Row>
                              <CommonNav user={user} />
                            </Grid.Row>
                            <Grid.Row>
                              <Visibility context={contextRef}>
                                {children}
                              </Visibility>
                            </Grid.Row>
                          </Fragment>
                        )}
                        {!user && (
                          <div style={{ fontSize: "1.2rem" }}>{children}</div>
                        )}
                      </Grid.Column>
                      <SideMenu mobile={true} pc={false} user={user} />
                    </Grid>
                  )}

                  {router.pathname === "/messages" && (
                    <div
                      style={{
                        width: "100%",
                        fontFamily: "Raleway",
                        fontSize: "1.2rem",
                      }}
                    >
                      {children}
                    </div>
                  )}
                </>
              </Ref>
            </div>
          </Media>
        </MediaContextProvider>
      </>
    </>
  );
}

export default Layout;
