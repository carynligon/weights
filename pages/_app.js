import { ApolloProvider } from "@apollo/client/react";
import firebase from "firebase";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ThemeProvider } from "@emotion/react";
import { preset } from "@rebass/preset";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex } from "rebass";
import UserContext from "../contexts/user";
import Nav from "../components/Nav";
import styles from "../styles/App.module.scss";
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
  const [uid, setUID] = useState("");
  const { push } = useRouter();

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
        setUID(userStuff.uid);
        setUserAuthed(true);
      } else {
        // No user is signed in.
        push("/login");
        setUserAuthed(false);
      }
    });
  };

  useEffect(() => {
    initFB();
  }, []);

  return (
    <UserContext.Provider value={{ uid }}>
      <Flex flexDirection="column" minHeight="100vh">
        <Nav userAuthed={userAuthed} />
        <div className={styles.container}>
          <ApolloProvider client={client}>
            <Component {...pageProps} />
          </ApolloProvider>
        </div>
      </Flex>
    </UserContext.Provider>
  );
}

export default MyApp;
