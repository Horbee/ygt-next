import { NextPage } from "next";

import { HeadContent } from "../components/HeadContent";

const Home: NextPage = () => {
  return (
    <>
      <HeadContent />

      <main>
        <p>Redirect</p>
      </main>
    </>
  );
};

export default Home;
