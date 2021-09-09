import Head from "next/head";

const HeadTags = () => (
  <>
    <Head>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta charSet="UTF-8" />
      <link rel="icon" href="/favicon.png" sizes="16*16" type="image/png" />

      <link rel="stylesheet" type="text/css" href="/listMessages.css" />

      <link rel="stylesheet" type="text/css" href="/styles.css" />
      <link rel="stylesheet" type="text/css" href="/nprogress.css" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,700&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
      />

      <title>Mini Social Media</title>
    </Head>
  </>
);
export default HeadTags;
