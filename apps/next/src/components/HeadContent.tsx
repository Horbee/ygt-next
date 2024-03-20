import Head from "next/head";

type Props = {
  title?: string;
};

export const HeadContent = ({ title }: Props) => {
  return (
    <Head>
      <title>{title ?? "You've got time"}</title>
      <meta name="description" content="Web site created to manage availabilities" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <link rel="icon" type="image/png" href="/logo512.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="theme-color" content="#ffffff" />

      <meta name="twitter:card" content="Web site created to manage availabilities" />
      <meta name="twitter:url" content="https://ygt-next-production.up.railway.app" />
      <meta name="twitter:title" content="You've got time" />
      <meta
        name="twitter:description"
        content="Web site created to manage availabilities"
      />
      <meta
        name="twitter:image"
        content="https://ygt-next-production.up.railway.app/logo192.png"
      />
      <meta name="twitter:creator" content="@nhorgas" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="You've got time" />
      <meta
        property="og:description"
        content="Web site created to manage availabilities"
      />
      <meta property="og:site_name" content="You've got time" />
      <meta property="og:url" content="https://ygt-next-production.up.railway.app" />
      <meta
        property="og:image"
        content="https://ygt-next-production.up.railway.app/apple-touch-icon.png"
      />
    </Head>
  );
};
