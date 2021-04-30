import { ApolloProvider } from "@apollo/client/react";
import firebase from "firebase";
import "../styles/globals.scss";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import Nav from "../components/Nav";
import { useEffect } from "react";

const client = new ApolloClient({
  uri: "http://localhost:3000/api/db",
  cache: new InMemoryCache(),
});

function MyApp({ Component, pageProps }) {
  const initFB = async () => {
    const firebaseConfig = {
      apiKey: "AIzaSyAvAzC5L6JR_WK0h80xeV8vsmpu_ImWCgo",
      authDomain: "weights-be15c.firebaseapp.com",
      databaseURL: "https://weights-be15c-default-rtdb.firebaseio.com",
      projectId: "weights-be15c",
      storageBucket: "weights-be15c.appspot.com",
      messagingSenderId: "71747450342",
      appId: "1:71747450342:web:c19534d970243294731227",
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
      } else {
        // No user is signed in.
        console.log("no user is signed in");
      }
    });
  };

  useEffect(() => {
    initFB();
  }, []);
  return (
    <>
      <Nav />
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </>
  );
}

export default MyApp;
