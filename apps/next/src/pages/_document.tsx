import Document, { Head, Html, Main, NextScript } from "next/document";

import { ColorSchemeScript } from "@mantine/core";

export default class _Document extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <ColorSchemeScript />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
