import { ApolloProvider } from "@apollo/client/react";
import firebase from "firebase";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "@emotion/react";
import { preset } from "@rebass/preset";
import { useEffect, useState } from "react";
import { Box, Flex } from "rebass";
import Nav from "../components/Nav";
import "../styles/globals.scss";

const theme = {
  ...preset,
  colors: {
    ...preset.colors,
    text: "#000",
    background: "#C6CA53",
    primary: "#C6CA53",
    secondary: "#30c",
    muted: "#f6f6f9",
    gray: "#dddddf",
    highlight: "hsla(205, 100%, 40%, 0.125)",
  },
  space: [...preset.space, 2],
};

const client = new ApolloClient({
  uri: "/api/db",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const [userAuthed, setUserAuthed] = useState(false);

  const initFB = async () => {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_API_KEY,
      authDomain: `${process.env.NEXT_PUBLIC_FB_APP_NAME}.firebaseapp.com`,
      databaseURL: `https://${process.env.NEXT_PUBLIC_FB_APP_NAME}-default-rtdb.firebaseio.com`,
      projectId: process.env.FB_APP_NAME,
      storageBucket: `${process.env.NEXT_PUBLIC_FB_APP_NAME}.appspot.com`,
      messagingSenderId: "71747450342",
      appId: process.env.NEXT_PUBLIC_API_ID,
    };
    const storedUID = sessionStorage.getItem("uid");
    const userStuff = {};
    await firebase.initializeApp(firebaseConfig);

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        if (!storedUID || storedUID !== user.uid) {
          sessionStorage.setItem("uid", user.uid);
        }
        userStuff.uid = user.uid;
        setUserAuthed(true);
      } else {
        // No user is signed in.
        setUserAuthed(false);
      }
    });
  };

  useEffect(() => {
    initFB();
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Flex flexDirection="column" minHeight="100vh">
        <Nav userAuthed={userAuthed} />
        <Flex justifyContent="center" flexGrow="1">
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Flex>
      </Flex>
    </ThemeProvider>
  );
}

export default MyApp;
